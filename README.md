# ESHAG Building & Construction — Web Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Backend-Django%205.0.14-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/API-Django%20REST%20Framework-A30000?logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Render](https://img.shields.io/badge/Deployment-Render-46E3B7?logo=render&logoColor=black)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

Production-grade web portal and content management engine for **ESHAG Building & Construction**, a premier civil engineering and construction contracting firm operating across Greater Accra and Ghana. Built with a decoupled architecture featuring a React (Vite) single-page application and a secure Django 5 REST Framework backend.

---

## Architecture Overview

```
eshag-website/
├── backend/                  # Django 5.0 REST API & CMS
│   ├── apps/
│   │   ├── accounts/         # CustomUser (UUID PK, RBAC permissions)
│   │   ├── ai_assistant/     # Automated inquiries & estimator parsing
│   │   ├── blog/             # Posts, categories, tags, and reading metrics
│   │   ├── careers/          # Job vacancies and resume intake
│   │   ├── cms/              # Dynamic page content blocks & hero sliders
│   │   ├── core/             # Company settings, stats, FAQs, team ledger
│   │   ├── leads/            # Contact desk intake and consultation leads
│   │   ├── notifications/    # Internal alerts & system audit feeds
│   │   ├── projects/         # Engineering project showcase & gallery
│   │   ├── services/         # Core capabilities and inline feature sets
│   │   └── testimonials/     # Approved client reviews and ratings
│   ├── config/               # WSGI, URLs, settings, and logging
│   └── manage.py
├── frontend/                 # React 18 + Vite + Tailwind CSS SPA
│   ├── public/               # Favicons, company logos, static assets
│   ├── src/
│   │   ├── assets/           # Logos, branding graphics
│   │   ├── components/       # Reusable UI cards, navbars, footers, modals
│   │   ├── context/          # Global authentication & theme providers
│   │   ├── pages/            # View routes (Home, Services, Projects, Blog, Estimator)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html            # OpenGraph SEO metadata & favicon directives
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json           # Reverse proxy configuration & SPA routing
├── README.md
└── vercel.json               # Root proxy fallback
```

---

## Core Features

- **Dynamic Services & Portfolio Showcase**: Paginated and featured service listings with nested technical specifications, dynamic image galleries, and project delivery status tags.
- **Engineering Journal & Blog**: Categorized, tag-filtered technical articles complete with reading-time calculations, author assignment, and markdown rendering.
- **Construction Cost Estimator**: Interactive client tool to configure building footprints, project types, and finishing grades to generate instant structural cost baselines.
- **Enterprise Access Control**: Custom user authentication model (`CustomUser`) with UUID primary keys and strict role-based access control (`SUPER_ADMIN`, `ADMIN`, `STAFF`, `CLIENT`, `PROJECT_MANAGER`).
- **Media Asset Pipeline**: Integrated with Cloudinary CDN storage for automated image optimization, responsive web delivery, and transformation of high-resolution site photography.
- **Production Observability**: Full console stdout logging configured for real-time error tracebacks across Render container instances.
- **Search & Social Optimization**: Production OpenGraph tags, Twitter Cards, responsive favicons with cache-busting version headers, and canonical URL schemas.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router DOM |
| **Backend Engine** | Python 3.12, Django 5.0.14, Django REST Framework, Gunicorn |
| **Database** | PostgreSQL with `dj-database-url` connector |
| **Static & Media** | WhiteNoise (Static Assets), Cloudinary (Media Assets) |
| **Deployment** | Vercel (Frontend SPA), Render (Django Web Service & PostgreSQL) |

---

## Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- Git

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your local variables
cp .env.example .env

# Run database migrations
python manage.py migrate

# Create local superuser
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver
```

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will run on `http://localhost:5173` and communicate with the backend at `http://localhost:8000`.

---

## Environment Variables

### Backend (`backend/.env`)
```env
SECRET_KEY=your-secure-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,eshag-website.onrender.com,eshag.construction,www.eshag.construction
DATABASE_URL=postgresql://user:password@hostname:5432/dbname
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ALLOWED_ORIGINS=http://localhost:5173,[https://eshag.construction](https://eshag.construction),[https://www.eshag.construction](https://www.eshag.construction)
CSRF_TRUSTED_ORIGINS=[https://eshag-website.onrender.com](https://eshag-website.onrender.com),[https://eshag.construction](https://eshag.construction),[https://www.eshag.construction](https://www.eshag.construction),http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=[https://eshag-website.onrender.com/api/v1](https://eshag-website.onrender.com/api/v1)
```

---

## Primary API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/cms/pages/home/` | `GET` | Home page layout, hero banners, and metadata |
| `/api/v1/services/` | `GET` | All published construction and civil engineering services |
| `/api/v1/services/?featured=true` | `GET` | Featured services displayed on the homepage grid |
| `/api/v1/projects/` | `GET` | Active and completed structural project portfolios |
| `/api/v1/blog/posts/` | `GET` | Published engineering articles and case studies |
| `/api/v1/blog/categories/` | `GET` | Blog category taxonomy |
| `/api/v1/core/settings/` | `GET` | Global corporate contact information, addresses, and licenses |
| `/api/v1/core/statistics/` | `GET` | Site-wide counter statistics |
| `/api/v1/core/faqs/` | `GET` | Active client inquiries and technical answers |
| `/api/v1/testimonials/` | `GET` | Approved client reviews and ratings |
| `/admin/` | `GET`, `POST` | Django administrative operations portal |

---

## Deployment Configuration

### Vercel (Frontend)
Vercel is configured with rewrites in `vercel.json` to reverse-proxy `/admin`, `/static/admin/`, and `/api/` traffic directly to the Render backend service while routing remaining paths to the React Single Page Application bundle.

### Render (Backend)
The backend runs via Gunicorn with WhiteNoise managing production static asset caching and Cloudinary streaming media assets:
```bash
# Build Command
pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate

# Start Command
gunicorn config.wsgi:application
```

---

## Security Best Practices
- **UUID Primary Keys**: `CustomUser` uses non-sequential `UUID4` identifiers to prevent enumeration attacks across authentication endpoints.
- **CORS & CSRF Isolation**: Explicit allowed-origin lists restricted strictly to production custom domains and local development ports.
- **SSL Enforced**: `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, and `CSRF_COOKIE_SECURE` active under production mode (`DEBUG=False`).
- **Production Traceback Visibility**: Structured Python console logging enabled in `settings.py` for auditability across production web workers.

---

## License
Proprietary software. All rights reserved by **ESHAG Building & Construction**.