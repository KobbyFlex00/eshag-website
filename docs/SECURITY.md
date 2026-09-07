# Security

- Replace the development `DJANGO_SECRET_KEY` before deployment.
- Set `DJANGO_DEBUG=False` in production.
- Restrict `DJANGO_ALLOWED_HOSTS` to known hostnames.
- Keep secrets in environment variables and out of source control.
- Add authentication, authorization, CSRF, rate limiting, and audit logging as feature endpoints are introduced.
