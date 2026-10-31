# Brightloop — Subscription Management System

A full-stack subscription management platform for managing customers, products, recurring plans, subscriptions, invoices, payments, and revenue operations. The backend is built with **Node.js, Express, TypeScript, Prisma, and PostgreSQL**, with a React-based frontend and an optional Odoo integration layer.

> **Project:** Subscription Management System — Odoo × Flux Hackathon  
> **Repository:** `Subscription_Management_System_Odoo`

---

## Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Run Locally](#run-locally)
- [API Reference](#api-reference)
- [Authentication and Roles](#authentication-and-roles)
- [Odoo Integration](#odoo-integration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Brightloop provides a centralized workspace for subscription-based business operations. It brings together the core records and workflows needed to manage recurring customer relationships:

- Maintain a product catalogue and product variants.
- Define subscription plans and billing cycles.
- Manage customer accounts and subscriptions.
- Track subscription lifecycle changes and renewals.
- Create and manage invoices, invoice line items, and payments.
- Configure discounts and tax rules.
- Review dashboard-level business metrics.
- Check Odoo connectivity and prepare for ERP synchronization.

The project includes a React/Vite frontend, a separate React/TypeScript admin interface, an Express API, a Prisma data model, and PostgreSQL database export files. See [Repository Structure](#repository-structure) for which frontend is currently selected by the Vercel configuration.

## Features

### Subscription and revenue operations

- **Products:** create, view, update, and delete products; support service and goods types, pricing, cost, notes, and variants.
- **Plans:** define plan pricing, billing frequency, minimum quantity, availability dates, and pause/renewal options.
- **Customers:** maintain customer details and associate customer records with registered users.
- **Subscriptions:** create subscriptions, track lifecycle states, and renew eligible subscriptions.
- **Invoices:** view invoices, inspect invoice details and line items, and confirm or cancel invoices.
- **Payments:** record payment amounts and methods and retrieve payment history.
- **Discounts:** define fixed or percentage discounts, validity dates, usage limits, and product associations.
- **Dashboard:** retrieve aggregate statistics for an at-a-glance view of subscription operations.
- **Pagination:** list endpoints use pagination utilities where implemented.

### Identity and access

- User registration and login.
- Password hashing with `bcryptjs`.
- JSON Web Token (JWT) authentication.
- Role-based authorization for `ADMIN`, `STAFF`, and `CUSTOMER`.
- Request validation using Zod.
- Password reset token generation and validation endpoints.

### Odoo integration

- Odoo connection status endpoint.
- Optional configuration for Odoo URL, database, version, API key, username, and password.
- Customer and product synchronization routes are present as integration placeholders. They currently return `501 Not Implemented` until synchronization logic and Odoo credentials are configured.

> **Implementation note:** The API capabilities listed here are based on the current source code. The `frontend/` Vite app is a lightweight dashboard prototype using browser local storage; do not assume every screen in it is connected to the API. The `brightloop-web/` directory contains a separate React + TypeScript multi-page admin interface. The checked-in `vercel.json` currently deploys `frontend/`, not `brightloop-web/`.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend prototype | React, Vite, JavaScript |
| Additional admin UI | React, TypeScript, Vite, React Router, Tailwind CSS, Lucide |
| Backend | Node.js, Express 5, TypeScript |
| ORM | Prisma 6 |
| Database | PostgreSQL |
| Authentication | JSON Web Token, bcryptjs |
| Validation | Zod |
| HTTP client / Odoo connectivity | Axios |
| Deployment configuration | Vercel |
| Source control | Git and GitHub |

---

## Repository Structure

```text
Subscription_Management_System_Odoo/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # PostgreSQL data model
│   ├── src/
│   │   ├── config/                # Environment and Prisma client
│   │   ├── integrations/odoo/     # Odoo client/status check
│   │   ├── middleware/            # Auth, roles, validation, errors
│   │   ├── modules/
│   │   │   ├── auth/              # Registration, login, password reset
│   │   │   ├── core.routes.ts     # Main business API routes
│   │   │   └── odoo.routes.ts     # Odoo integration routes
│   │   ├── types/                 # Express request type extensions
│   │   ├── utils/                 # Pagination helpers
│   │   ├── app.ts                 # Express application and API routes
│   │   └── server.ts              # Local HTTP server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      # Vercel-selected React + Vite frontend
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── brightloop-web/                # Separate React + TypeScript admin UI
│   ├── src/
│   │   ├── components/layout/
│   │   └── pages/
│   │       ├── auth/
│   │       ├── dashboard/
│   │       ├── management/
│   │       └── settings/
│   ├── package.json
│   └── vite.config.ts
│
├── database/
│   ├── brightloop.sql             # PostgreSQL SQL export
│   └── brightloop.backup          # PostgreSQL backup file
│
├── src/
│   └── app.ts                     # Root Express export used by Vercel
│
├── package.json                   # Root dependencies / Prisma generation
├── vercel.json                    # Vercel multi-service routing
└── README.md
```

---

## Architecture

The intended request flow is:

```text
Browser
   │
   ▼
React + Vite frontend
   │  API requests under /api/*
   ▼
Vercel rewrite / Express backend
   │
   ├── Authentication and authorization
   ├── Business routes and validation
   ├── Prisma ORM
   │      │
   │      ▼
   │   PostgreSQL (Neon or another hosted PostgreSQL provider)
   │
   └── Odoo integration client (optional)
```

The root `vercel.json` defines two Vercel services:

- `frontend`: serves the Vite application from `frontend/`.
- `backend`: serves the Express application from the repository root.
- Requests matching `/api/*` are routed to the backend service.
- Other requests are routed to the frontend service.

The backend exposes both `/api/health` and `/api/health/db` for service and database checks.

---

## Getting Started

### Prerequisites

Install the following before running the project locally:

- Node.js 20 or a compatible current LTS release.
- npm.
- PostgreSQL 14+ (local PostgreSQL or a hosted provider such as Neon).
- Git.
- An Odoo instance and credentials only if you intend to enable Odoo connectivity.

Check your versions:

```bash
node --version
npm --version
```

### 1. Clone the repository

```bash
git clone https://github.com/tushyan-parsana/Subscription_Management_System_Odoo.git
cd Subscription_Management_System_Odoo
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment variables

Create a file named `.env` inside `backend/`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=5000
FRONTEND_URL="http://localhost:5173"

# Optional Odoo configuration
ODOO_URL=""
ODOO_DB=""
ODOO_VERSION="auto"
ODOO_API_KEY=""
ODOO_USERNAME=""
ODOO_PASSWORD=""
ODOO_INTEGRATION_MODE="auto"
```

Replace the database URL and secret with your own values. Never commit `.env` to Git.

### 4. Generate Prisma Client

From the `backend/` directory:

```bash
npx prisma generate
```

### 5. Prepare the database schema

If this is a new database and the project does not yet contain committed Prisma migration files, create the initial migration locally:

```bash
npx prisma migrate dev --name init
```

This creates a migration from `backend/prisma/schema.prisma` and applies it to the database referenced by `DATABASE_URL`.

Commit the generated `backend/prisma/migrations/` directory to Git so production deployments can apply the same schema changes.

For a database that already has tables or data, inspect and reconcile its schema before running a migration. Do not blindly apply an initial migration to an existing production database.

### 6. Start the backend

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

Health checks:

```text
http://localhost:5000/api/health
http://localhost:5000/api/health/db
```

### 7. Start the frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Vite prints the local frontend URL, normally:

```text
http://localhost:5173
```

> The current `frontend/` app is a prototype and stores its sample workspace state in browser local storage. For API-backed screens, connect the UI to the Express endpoints and configure the development proxy or API base URL.

### Running the separate TypeScript admin UI

To run the additional interface in `brightloop-web/` instead:

```bash
cd brightloop-web
npm install
npm run dev
```

Build it with:

```bash
npm run build
```

This is a separate frontend package. It is not the frontend root selected by the current `vercel.json`.

---

## Environment Variables

Configure these variables in `backend/.env` for local development and in **Vercel → Project → Settings → Environment Variables** for deployment.

| Variable | Required | Description |
|---|---:|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma |
| `JWT_SECRET` | Yes for production | Secret used to sign and verify JWTs |
| `PORT` | No | Local Express port; defaults to `5000` |
| `FRONTEND_URL` | Recommended | Allowed frontend origin for CORS |
| `ODOO_URL` | No | Odoo base URL |
| `ODOO_DB` | No | Odoo database name |
| `ODOO_VERSION` | No | Odoo version hint; defaults to `auto` |
| `ODOO_API_KEY` | No | Odoo API key, if used |
| `ODOO_USERNAME` | No | Odoo username, if used |
| `ODOO_PASSWORD` | No | Odoo password, if used |
| `ODOO_INTEGRATION_MODE` | No | Odoo integration mode; defaults to `auto` |

Example PostgreSQL URL format:

```text
postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

For Neon, copy the connection string from the Neon **Connect** dialog. Use the correct database, role, and pooled or direct connection option for the operation. Keep credentials private.

**Vercel:** Add `DATABASE_URL`, `JWT_SECRET`, and any optional integration variables to the backend service's production environment. Redeploy after changing environment variables.

---

## Database Setup

Prisma schema location:

```text
backend/prisma/schema.prisma
```

The schema defines these principal models:

- `User`
- `Customer`
- `Product`
- `ProductVariant`
- `Plan`
- `QuotationTemplate`
- `Subscription`
- `SubscriptionItem`
- `Discount`
- `DiscountProduct`
- `SubscriptionDiscount`
- `TaxRule`
- `Invoice`
- `InvoiceItem`
- `Payment`
- `IntegrationLog`

Enums include:

- `Role`
- `ProductType`
- `BillingCycle`
- `SubscriptionStatus`
- `DiscountType`
- `InvoiceStatus`
- `PaymentMethod`

Useful Prisma commands (run from `backend/`):

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply a development migration
npx prisma migrate dev --name describe_your_change

# Apply committed migrations in production
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Validate the schema
npx prisma validate
```

### About the SQL export files

The `database/brightloop.sql` and `database/brightloop.backup` files are included as database export artifacts. The SQL export appears to represent a legacy relational schema and should not be assumed to match the current Prisma schema one-to-one. Review table names, column types, relationships, and existing data before importing it into the database used by the current backend. For a fresh deployment, use the Prisma schema and committed migrations as the source of truth.

---

## API Reference

Base URL in local development:

```text
http://localhost:5000
```

When deployed through the configured Vercel rewrite, use the same domain with the `/api` prefix.

### Health

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| `GET` | `/api/health` | Backend health check | No |
| `GET` | `/api/health/db` | Checks database connectivity | No |

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a customer account |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT |
| `POST` | `/api/auth/forgot-password` | Generate a password-reset token |
| `POST` | `/api/auth/reset-password` | Reset password using a valid token |

### Users

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/users` | List users | Admin |
| `POST` | `/api/users/staff` | Create a staff account | Admin |

### Customers

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/customers` | List customers |
| `POST` | `/api/customers` | Create a customer |
| `GET` | `/api/customers/:id` | Get customer details |
| `PUT` | `/api/customers/:id` | Update a customer |
| `DELETE` | `/api/customers/:id` | Delete a customer (admin) |

### Products and plans

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | List products and variants |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product (admin) |
| `GET` | `/api/plans` | List subscription plans |
| `POST` | `/api/plans` | Create a plan |
| `PUT` | `/api/plans/:id` | Update a plan |
| `DELETE` | `/api/plans/:id` | Delete a plan (admin) |

### Subscriptions and billing

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/subscriptions` | List subscriptions |
| `POST` | `/api/subscriptions` | Create a subscription |
| `PATCH` | `/api/subscriptions/:id/status` | Change subscription status |
| `POST` | `/api/subscriptions/:id/renew` | Renew an eligible subscription |
| `POST` | `/api/billing/generate` | Generate invoices for due active subscriptions |

### Invoices and payments

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/invoices` | List invoices |
| `GET` | `/api/invoices/:id` | Get invoice details |
| `POST` | `/api/invoices/:id/confirm` | Confirm an invoice |
| `POST` | `/api/invoices/:id/cancel` | Cancel an invoice |
| `GET` | `/api/invoices/:id/payments` | List payments for an invoice |
| `GET` | `/api/payments` | List payments |
| `POST` | `/api/payments` | Record a payment |

### Discounts and dashboard

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/discounts` | List discounts |
| `POST` | `/api/discounts` | Create a discount |
| `PUT` | `/api/discounts/:id` | Update a discount |
| `DELETE` | `/api/discounts/:id` | Delete a discount |
| `GET` | `/api/dashboard/stats` | Retrieve dashboard statistics |

### Odoo

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/odoo/status` | Check Odoo connectivity |
| `POST` | `/api/odoo/sync/customers` | Customer sync placeholder; currently returns `501` |
| `POST` | `/api/odoo/sync/products` | Product sync placeholder; currently returns `501` |

Protected routes require a bearer token:

```http
Authorization: Bearer <JWT_TOKEN>
```

All API responses use a JSON envelope with fields such as `success`, `message`, and `data`. Validation errors may also include an `errors` array.

---

## Authentication and Roles

The backend defines three roles:

| Role | Intended access |
|---|---|
| `ADMIN` | Administrative management and staff creation |
| `STAFF` | Operational management actions |
| `CUSTOMER` | Customer-scoped access to their own records |

Passwords are hashed with bcrypt before storage. Successful login returns a JWT that expires after one day. Send the token in the `Authorization` header for protected endpoints.

Example registration request:

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "Use-A-Strong-Password1"
}
```

Example login request:

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "alex@example.com",
  "password": "Use-A-Strong-Password1"
}
```

Store tokens securely in a production frontend. Do not expose JWT secrets or database credentials in client-side code.

---

## Odoo Integration

The Odoo client checks the configured Odoo web client version endpoint. Configure the Odoo variables listed in [Environment Variables](#environment-variables) to enable the connectivity check.

The current customer and product sync routes are intentionally placeholders and respond with `501 Not Implemented`. A production Odoo rollout still requires:

1. Confirming the Odoo deployment URL and version.
2. Configuring a dedicated integration account and credentials.
3. Implementing authenticated Odoo API calls.
4. Mapping Brightloop records to Odoo models and external IDs.
5. Adding retry, error handling, idempotency, and synchronization logging.
6. Testing synchronization against a non-production Odoo database.

---

## Deployment

### Deploy with Vercel

The repository includes a root `vercel.json` with two services and path-based rewrites.

1. Push the repository to GitHub.
2. In Vercel, import the repository.
3. Ensure the project uses the repository root (`./`) so Vercel can read the root `vercel.json`.
4. Keep the **Services** configuration if deploying both services using the checked-in configuration. Do not replace it with the Vite preset at the repository root.
5. Add backend environment variables in Vercel, including `DATABASE_URL` and a strong `JWT_SECRET`.
6. Ensure Prisma migrations have been created, reviewed, and committed.
7. Configure production deployment to run migrations with `prisma migrate deploy` as part of a controlled deployment step.
8. Deploy and verify both health endpoints.

The configured routing is:

```text
/          → frontend service (frontend/)
/api/*     → backend service (root Express entry)
```

The backend database health endpoint should return HTTP `200` after `DATABASE_URL` is valid and the database is reachable:

```text
https://YOUR-VERCEL-DOMAIN/api/health/db
```

If you deploy `brightloop-web/` instead of `frontend/`, update the Vercel service root and routing configuration deliberately; the current `vercel.json` does not select that directory.

### Production deployment checklist

- [ ] `DATABASE_URL` is set in Vercel for the backend service.
- [ ] `JWT_SECRET` is a strong production-only secret.
- [ ] Prisma schema validates and client generation succeeds.
- [ ] Database migrations are committed and applied.
- [ ] `/api/health` returns HTTP `200`.
- [ ] `/api/health/db` returns HTTP `200`.
- [ ] CORS allows the deployed frontend origin.
- [ ] Odoo variables are configured only if Odoo connectivity is required.
- [ ] No `.env` file, password, API key, or database URL is committed to Git.

---

## Troubleshooting

### `/api/health/db` returns `503`

- Confirm `DATABASE_URL` exists in the Vercel environment used by the deployment.
- Check that the username, password, host, and database name are correct.
- For hosted PostgreSQL, use the provider's required SSL parameters.
- Confirm the database is active and accepts connections.
- Redeploy after changing environment variables.

### Prisma enums or models are missing during TypeScript build

Generate Prisma Client from the correct schema before compiling:

```bash
cd backend
npx prisma generate
npm run build
```

Check that `backend/prisma/schema.prisma` contains the expected enums and models and that `prisma` and `@prisma/client` versions are compatible.

### Database tables are missing

Apply the committed migrations:

```bash
cd backend
npx prisma migrate deploy
```

Do not use `migrate dev` against a production database.

### Frontend cannot call the API

- Confirm requests use the deployed `/api` path.
- Check the Vercel rewrite rules in `vercel.json`.
- Confirm the backend service is healthy.
- Confirm the frontend origin is allowed by the backend CORS configuration.
- Inspect the browser network panel for the failing request and response.

### Odoo reports disconnected

Check `ODOO_URL` and the configured credentials. The status endpoint can fail if the Odoo instance is unavailable, credentials are missing, or the URL is incorrect.

---

## Security Notes

- Never commit `.env` files or paste live credentials into issues, chat, screenshots, or source code.
- If a database password or API key is exposed, rotate it immediately.
- Use a unique, high-entropy `JWT_SECRET` in production.
- Keep database access restricted to trusted services.
- Use HTTPS for production traffic.
- Review authorization rules before exposing administrative endpoints.
- Configure a real email delivery provider before relying on password-reset flows in production. The current forgot-password handler generates and logs a reset token; it does not send an email.
- Back up the production database and test restore procedures.
- Review and secure any imported SQL dump before using it with production data.

---

## Contributing

Contributions and improvements are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make focused changes and test them locally.
4. Run the backend build:

   ```bash
   cd backend
   npm run build
   ```

5. Run the relevant frontend build:

   ```bash
   cd frontend
   npm run build
   ```

6. Commit and push your branch.
7. Open a pull request with a clear description and testing notes.

---

## License

No license file was present in the supplied repository at the time this README was prepared. Unless a license is added, the project should be treated as **all rights reserved**. Add a `LICENSE` file if you intend to permit reuse, modification, or distribution.

---

<p align="center">
  Built for better subscription operations with <strong>Brightloop</strong>.
</p>
