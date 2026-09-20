# ZeroHunger — Agent Mode Context

Extends the root AGENTS.md with guidance for code-writing tasks.

## When Writing Code
- Always check `client/src/index.css` for existing CSS classes before adding new ones.
- Shared UI components belong in `client/src/Components/`. Role-specific pages go under `client/src/Pages/<Role>/`.
- All API calls must go through the `api` instance from `client/src/api.js` — never raw `fetch`.
- Server controllers follow the pattern: validate input → interact with Mongoose model → return JSON.
- Never commit secrets — all keys go in `.env` files which are gitignored.

## File Patterns
- New Express routes: add to `server/routes/`, register in `server/server.js`.
- New Mongoose model: add to `server/models/`, import in the corresponding controller.
- New React page: add to `client/src/Pages/<Role>/`, import and register a `<Route>` in `client/src/App.js`.

## Validation Before Done
- Run `npm run build` in `client/` — must compile with zero errors.
- Verify new routes have `requireAuth` middleware if they are protected.
- Verify new client routes are wrapped in `<ProtectedRoute allowedRoles={[...]}>`.
