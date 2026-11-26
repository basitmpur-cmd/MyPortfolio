# Abdulbasit Mohammadpur - Full-Stack Portfolio (COMP229 Assignments 2 and 3)

MERN portfolio: Express + MongoDB API in the project root (`server.js`, `server/`, `config/`) and the
React (Vite) frontend in `client/`.

## Run locally

```
npm install                    # backend packages (root)
npm install --prefix client    # frontend packages
copy .env.example .env         # macOS/Linux: cp .env.example .env
npm run hash -- "YourAdminPassword"
```
Paste the printed hash into `ADMIN_PASSWORD_HASH='...'` in `.env` and set `MONGODB_URI` and `JWT_SECRET`. Then:
```
npm run dev                    # API on http://localhost:5000, React on http://localhost:5173
```
Vite forwards `/api` to the API, so the frontend contains no server URL or secret.

`.env` (MongoDB URI, JWT secret, admin email and admin password hash) is listed in `.gitignore` and is never
committed. Only `.env.example` with placeholders is in the repository.

## API and access rules

| Resource | GET (list/read) | POST | PUT / DELETE |
|---|---|---|---|
| `/api/auth/signup`, `/api/auth/signin` | | Public | |
| `/api/auth/signout` | Public | | |
| `/api/auth/me` | Valid token | | |
| `/api/projects`, `/api/qualifications` | Public | Admin | Admin |
| `/api/contacts` | Signed-in user | Public (contact form) | Admin |
| `/api/users` | Admin | Public | Owner or admin |

No or invalid token: **401**. Valid token without the admin role: **403**. Validation errors: **400**.
A Postman collection with every request is in `postman/portfolio-api.postman_collection.json`.

## Authentication design

- Passwords are hashed with bcrypt and never returned by the API.
- Sign-up and sign-in return a JWT signed with `JWT_SECRET` (payload `_id`, `name`, `email`, `role`, 1-hour expiry).
  `requireSignin` verifies `Authorization: Bearer <token>`; `isAdmin` checks the role.
- Sign-up always creates a `user`; the role cannot be chosen by the client.
- **Seeded administrator:** on start-up `server/seed.js` creates the admin from `ADMIN_EMAIL` and
  `ADMIN_PASSWORD_HASH` (a bcrypt hash made with `npm run hash`) if it does not exist. No credentials are in code.

### Token storage

The React app stores the JWT in `localStorage` (`portfolio_token`) so a page refresh keeps the session, and
`client/src/api.js` sends it in the `Authorization` header. On load, `AuthContext` calls `/api/auth/me` and
discards an expired token. Hiding admin buttons is only for usability: the server checks the token and role on
every protected route. Trade-off: `localStorage` is readable by injected scripts (XSS), so tokens expire after
one hour and React escapes all rendered content.

### Sign-out

JWTs are stateless, so the server keeps no session it could end. The **Sign out** button calls
`GET /api/auth/signout` (a confirmation only) and then deletes the token and user from `localStorage`; after that,
protected requests are rejected with 401 again. A copied token remains valid until it expires (1 hour).

## Frontend (client/src)

- `pages/SignUp.jsx`, `pages/SignIn.jsx` - forms with validation, loading, success and error states.
- `components/RecordManager.jsx` - shared list/create/edit/delete view used by Projects, Education
  (qualifications) and Messages (contacts). Admins get the form and Edit/Delete buttons; others are read-only.
- `pages/Contact.jsx` - saves submissions to MongoDB with `POST /api/contacts`.
- `auth/ProtectedRoute.jsx` - `/messages` requires sign-in.

## Assignment 4: testing, optimization, deployment and CI/CD

### Tests
| Command | What it runs |
|---|---|
| `npm test` (root) | Backend unit tests for the JWT guards (`server/test`, Node's built-in test runner) |
| `npm test --prefix client` | Frontend unit tests (Vitest + React Testing Library): sign-in, contact form, admin vs read-only CRUD |
| `npm run cy:run --prefix client` | Cypress E2E: admin signs in, creates/edits/deletes a project, signs out; unauthenticated write gets 401. Records a video in `client/cypress/videos` |

For Cypress locally: run `npm run dev` in the root, copy `client/cypress.env.example.json` to `client/cypress.env.json`
(git-ignored) and put the admin email and the plain admin password in it.

### Performance changes
Route-level code splitting (`React.lazy`), a separate cached `vendor` chunk, metadata stripped from the SVG images
(about 8 KB to under 0.5 KB each), sized images with lazy loading (eager + high priority for the LCP image),
non-blocking Google Fonts, and a minimum `main` height so late-loading records no longer shift the footer (CLS 0.089 to 0).

### Deployment (Render + MongoDB Atlas)
`render.yaml` defines the API (Node web service) and the React static site. Secrets (`MONGODB_URI`, `JWT_SECRET`,
`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`) are set only in the Render dashboard. `CLIENT_URL` on the API and
`VITE_API_URL` on the static site point the two services at each other.

### CI/CD
`.github/workflows/ci-cd.yml` runs on pull requests and on pushes to `main`: install, backend and frontend unit tests,
build, then Cypress against a real API and a MongoDB service container (video uploaded as an artifact). On `main`,
only after everything passes, it calls the Render deploy hooks stored as the GitHub secrets
`RENDER_API_DEPLOY_HOOK` and `RENDER_CLIENT_DEPLOY_HOOK`.
