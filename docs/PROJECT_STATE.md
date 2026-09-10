# ESHAG BUILDING & CONSTRUCTION — PROJECT STATE

## Current Status
- **Current Phase:** Phase 12 — Notifications, In-App Alerts & Email Dispatch Engine
- **Last Successful Checkpoint:** Checkpoint 12 (Signals & In-App Notification System Live)
- **Overall Status:** Real-time event notifications and email logging operational on PostgreSQL.

## Architecture & Configuration
- **Operating System:** Windows 10/11
- **Backend Framework:** Django 5.0.x / Python 3.12 / Django REST Framework
- **Database:** PostgreSQL (`eshag_db`)
- **Active Endpoints:**
  - `GET /api/health/`
  - `POST /api/v1/auth/login/`
  - `GET /api/v1/dashboard/metrics/`
  - `GET /api/v1/core/settings/`
  - `GET /api/v1/core/faqs/`
  - `GET /api/v1/services/`
  - `GET /api/v1/cms/pages/<slug>/`
  - `GET, POST /api/v1/media/`
  - `GET /api/v1/projects/`
  - `POST /api/v1/leads/contact/` (Triggers notification signal)
  - `POST /api/v1/leads/quote/` (Triggers notification signal)
  - `GET /api/v1/careers/jobs/`
  - `POST /api/v1/careers/apply/` (Triggers notification signal)
  - `GET /api/v1/notifications/` (Authenticated alert feed)
  - `PATCH /api/v1/notifications/<id>/read/`
  - `POST /api/v1/notifications/mark-all-read/`

## Next Recommended Step
- Proceed to **Phase 13: Construction Cost Estimator & AI Assistant Module**.