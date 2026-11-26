// Key workflow: an administrator signs in, creates, edits and deletes a project (stored in MongoDB),
// then signs out and the same page becomes read-only.
describe('Admin manages portfolio projects end to end', () => {
  const title = `Cypress Project ${Date.now()}`;

  it('signs in, performs CRUD on a project, and signs out', () => {
    cy.signInWithForm(Cypress.env('ADMIN_EMAIL'), Cypress.env('ADMIN_PASSWORD'));

    // Redirected to Projects with admin rights
    cy.location('pathname').should('eq', '/projects');
    cy.contains('Administrator: you can create, edit and delete records.').should('be.visible');

    // CREATE (POST /api/projects)
    cy.intercept('POST', '**/api/projects').as('createProject');
    cy.get('input[name=title]').type(title);
    cy.get('input[name=completion]').type('2026-11-20');
    cy.get('textarea[name=description]').type('Created by the Cypress end-to-end test.');
    cy.contains('button', 'Create').click();
    cy.wait('@createProject').its('response.statusCode').should('eq', 201);
    cy.contains('Project created.').should('be.visible');
    cy.contains('article.card', title).should('be.visible');

    // UPDATE (PUT /api/projects/:id)
    cy.intercept('PUT', '**/api/projects/*').as('updateProject');
    cy.contains('article.card', title).contains('button', 'Edit').click();
    cy.get('textarea[name=description]').clear().type('Updated by Cypress.');
    cy.contains('button', 'Save changes').click();
    cy.wait('@updateProject').its('response.statusCode').should('eq', 200);
    cy.contains('article.card', title).should('contain', 'Updated by Cypress.');

    // Data survives a full page reload, so it really came back from MongoDB
    cy.reload();
    cy.contains('article.card', title).should('contain', 'Updated by Cypress.');

    // DELETE (DELETE /api/projects/:id) - Cypress accepts the confirm() dialog automatically
    cy.intercept('DELETE', '**/api/projects/*').as('deleteProject');
    cy.contains('article.card', title).contains('button', 'Delete').click();
    cy.wait('@deleteProject').its('response.statusCode').should('eq', 200);
    cy.contains('Project deleted.').should('be.visible');
    cy.contains('article.card', title).should('not.exist');

    // Sign out: token removed, page is read-only again
    cy.contains('button', 'Sign out').click();
    cy.location('pathname').should('eq', '/signin');
    cy.window().should((win) => expect(win.localStorage.getItem('portfolio_token')).to.be.null);
    cy.visit('/projects');
    cy.contains('Read-only view.').should('be.visible');
    cy.contains('button', 'Create').should('not.exist');
  });

  it('blocks an unauthenticated API write with 401', () => {
    cy.request({
      method: 'POST',
      // API_URL is the deployed API; locally the Vite server proxies /api, so baseUrl works.
      url: `${Cypress.env('API_URL') || Cypress.config('baseUrl')}/api/projects`,
      body: { title: 'Hacker', completion: '2026-01-01', description: 'should fail' },
      failOnStatusCode: false,
    }).its('status').should('eq', 401);
  });
});
