# ZeroHunger Project Rules

## Code Style
- Use functional React components with hooks only — no class components.
- All new components go in `client/src/Components/` (shared) or the relevant `client/src/Pages/<Role>/` folder.
- Follow the existing CSS variable system defined in `client/src/index.css` (e.g. `var(--primary)`, `var(--border)`, `var(--radius-md)`).
- Do not introduce any new CSS-in-JS libraries or UI component libraries — plain CSS only.

## Naming Conventions
- React component files: PascalCase (e.g. `DonorHomePage.js`).
- Server route/controller/model files: camelCase matching their domain (e.g. `provideDonation.js`).
- CSS class names: kebab-case (e.g. `help-fab`, `footer-inner`).

## Architecture Constraints
- The backend is a REST API only — no GraphQL, no WebSockets.
- Every protected route must use the `requireAuth` middleware on the server and `ProtectedRoute` with `allowedRoles` on the client.
- MongoDB models must use Mongoose schemas with `{ timestamps: true }`.
- JWT tokens are stored in `localStorage` and injected via the Axios interceptor in `client/src/api.js`.

## Environment Variables
- Server env vars live in `server/.env` (MONGO_URI, JWT_SECRET, PORT).
- Client env vars must be prefixed with `REACT_APP_` (e.g. `REACT_APP_GEMINI_API_KEY`, `REACT_APP_API_URL`).

## Testing & Build
- Always run `npm run build` in `client/` before considering frontend work done.
- The build must compile with zero errors and zero new warnings.
