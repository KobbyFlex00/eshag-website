# ESHAG Website

A full-stack foundation for the ESHAG website and content platform.

## Structure

- `backend/`: Django API, admin, domain apps, static files, and media.
- `frontend/`: React + TypeScript application powered by Vite.
- `docs/`: architecture, API, database, security, deployment, and project-state notes.

## Local development

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements/local.txt
python manage.py migrate
python manage.py runserver
```

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

The backend health check is available at `http://127.0.0.1:8000/api/health/` and the frontend at `http://localhost:5173/`.
