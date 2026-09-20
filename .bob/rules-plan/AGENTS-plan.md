# ZeroHunger — Plan Mode Context

Extends the root AGENTS.md with guidance for planning and design tasks.

## Architecture Constraints to Respect
- The platform is MERN-only. Do not propose switching to Next.js, TypeScript, or other frameworks without explicit user request.
- Authentication is JWT-based; do not propose sessions, OAuth, or cookie auth as alternatives unless asked.
- All four roles (donor, volunteer, organization, admin) share a single `User` collection — do not split them.

## Feature Planning Guidelines
- New features should map to an existing role or extend the donation lifecycle.
- The donation lifecycle states are fixed: `pending → accepted → in-transit → delivered`. New states require model migration planning.
- Any new API endpoint must consider: Does it need `requireAuth`? Does it need role-checking beyond that?

## Scalability Notes
- The `Volunteer` model denormalises org + donor data. For scale, consider a lookup/reference approach instead.
- File uploads (e.g. donation photos) are not yet supported — plan for cloud storage (S3/Cloudinary) if needed.
