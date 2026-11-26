// Signs in through the real form and waits until the app has stored the JWT.
Cypress.Commands.add('signInWithForm', (email, password) => {
  cy.visit('/signin');
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password, { log: false });
  cy.contains('button', 'Sign in').click();
  cy.contains(/Welcome back/).should('be.visible');
  cy.window().should((win) => expect(win.localStorage.getItem('portfolio_token')).to.be.a('string'));
});
