# Brightloop backend

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and a long `JWT_SECRET`.
2. Install dependencies with `npm install`.
3. Generate the Prisma client with `npm run db:generate`.
4. Apply migrations in a coordinated database environment with `npm run db:migrate`.
5. Start development mode with `npm run dev`.

The server exposes `GET /api/health` and `GET /api/health/db`. All business
responses use `{ success, message, data }`; validation failures additionally
include `errors`.

## Main endpoints

- Auth: `POST /api/auth/register`, `/login`, `/forgot-password`, `/reset-password`
- Customers: `GET|POST /api/customers`, `GET|PUT|DELETE /api/customers/:id`
- Products: `GET|POST /api/products`, `PUT|DELETE /api/products/:id`
- Plans: `GET|POST /api/plans`, `PUT|DELETE /api/plans/:id`
- Subscriptions: `GET|POST /api/subscriptions`, `PATCH /api/subscriptions/:id/status`, `POST /api/subscriptions/:id/renew`
- Billing: `POST /api/billing/generate`
- Invoices: `GET /api/invoices`, `POST /api/invoices/:id/confirm`, `/cancel`
- Payments: `GET /api/payments`, `POST /api/payments`, `GET /api/invoices/:id/payments`
- Discounts: `GET|POST /api/discounts`, `PUT|DELETE /api/discounts/:id`
- Analytics: `GET /api/dashboard/stats`
- Odoo: `GET /api/odoo/status`, sync endpoints for configured integrations

Send `Authorization: Bearer <token>` for protected endpoints. Public
registration always creates a `CUSTOMER`; only an `ADMIN` can create staff.
Odoo synchronization is deliberately reported as unavailable until valid
credentials and a reachable instance are configured.
