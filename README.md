# Employee Leave Management System

Employee Leave Management System is a full-stack mini project for managing leave requests across Employee, Manager, and Admin roles. It includes role-based access control, leave application workflows, approvals, analytics, reporting, and optional email notifications.

## Features

- User management with Employee, Manager, Admin roles
- Secure authentication with JWT and password hashing
- Leave application (type, date range, reason, optional document upload)
- Approval workflow with manager/admin decisions and remarks
- Leave tracking (status, history, remaining balance)
- Admin dashboard with filters (status, department, date range)
- Team availability calendar view
- Analytics summary and monthly trends
- Policy management for leave limits
- Report generation with CSV export
- Responsive UI built with React + Tailwind CSS

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Java 17, Spring Boot, Spring Security, JWT
- Database: MongoDB Atlas

## Project Structure

- backend: Spring Boot API
- frontend: React UI

## Setup

### Backend

1. Configure environment variables (IntelliJ Run Configuration or shell):

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=use-a-32+char-secret
JWT_EXPIRES_MINUTES=120
UPLOAD_DIR=uploads
NOTIFICATIONS_MODE=log
NOTIFICATIONS_FROM=no-reply@leave.local

# Gmail SMTP (only if NOTIFICATIONS_MODE=mail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_AUTH=true
SMTP_STARTTLS=true
```

2. Run the backend:

```
cd backend
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`.

### Frontend

1. Install and run:

```
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Notes

- Gmail requires 2-step verification and an App Password for SMTP.
- Manager selection and departments are auto-loaded from `/api/public/registration-meta`.

## Key API Endpoints (overview)

- Auth: `/api/auth/register`, `/api/auth/login`
- Employee: `/api/leaves`, `/api/leaves/my`, `/api/leaves/balance`, `/api/leaves/calendar`
- Manager: `/api/manager/leaves`, `/api/manager/leaves/{id}/approve`, `/api/manager/leaves/{id}/reject`
- Admin: `/api/admin/leaves`, `/api/admin/users`
- Policy: `/api/policy`
- Analytics: `/api/analytics/summary`
- Reports: `/api/reports/monthly`, `/api/reports/monthly.csv`
