# Database

Local development defaults to SQLite at `backend/db.sqlite3`. Production requirements include PostgreSQL support through `psycopg`.

Database models should be owned by the app that owns the corresponding business capability. Run `python manage.py makemigrations` and `python manage.py migrate` from `backend/`.
