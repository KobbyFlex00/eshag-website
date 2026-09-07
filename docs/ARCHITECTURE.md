# Architecture

The project is split into two deployable surfaces:

- `backend/`: Django application and API boundary.
- `frontend/`: React and TypeScript client built with Vite.

Django domain code lives under `backend/apps/`, with one app per business capability. Shared runtime configuration lives in `backend/config/`.
