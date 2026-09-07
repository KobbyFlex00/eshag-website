# Deployment

Build the frontend with `npm run build` from `frontend/`. Run the backend with Gunicorn using `config.wsgi:application` from `backend/`.

Collect static files with `python manage.py collectstatic --noinput` and apply migrations before serving traffic.
