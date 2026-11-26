import { defineConfig } from 'cypress';

// E2E tests run against the real React app + Express API + MongoDB.
// Locally: start `npm run dev` in the project root, then `npm run cy:run` (or `cy:open`) in client/.
// Admin credentials come from cypress.env.json (git-ignored) or CYPRESS_ADMIN_EMAIL / CYPRESS_ADMIN_PASSWORD.
export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.js',
    defaultCommandTimeout: 10000,
  },
  video: true,               // records an .mp4 of every spec run in cypress/videos
  screenshotOnRunFailure: true,
  viewportWidth: 1280,
  viewportHeight: 800,
});
