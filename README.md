# Nextura

A modern, production-ready SaaS starter kit built with Next.js, TypeScript, Prisma, NextAuth.js, and Stripe.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square)
![Stripe](https://img.shields.io/badge/Stripe-integrated-635BFF?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## Features

- **Authentication** — Email/password registration and login with NextAuth.js. JWT sessions, protected routes via middleware.
- **Payments** — Stripe integration with Free and Pro plans. Checkout, webhooks, and customer portal included.
- **Database** — PostgreSQL with Prisma ORM. Type-safe schema with users, sessions, and subscriptions.
- **Dashboard** — Protected user area showing plan status and subscription management.
- **Pricing page** — Clean pricing UI connected to real Stripe checkout.
- **Homepage** — Landing page with hero, features, stack, pricing preview, and CTA.
- **Middleware** — Centralized route protection. Unauthenticated users are redirected to `/login` automatically.
- **Modern stack** — Next.js App Router, Server Components, TypeScript throughout.

## Tech Stack

| Layer      | Technology              |
| ---------- | ----------------------- |
| Framework  | Next.js 14 (App Router) |
| Language   | TypeScript              |
| Styling    | Tailwind CSS            |
| Auth       | NextAuth.js v4          |
| ORM        | Prisma v5               |
| Database   | PostgreSQL (Neon)       |
| Payments   | Stripe                  |
| Deployment | Vercel                  |

## Project Structure

```
nextura-saas/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Registration page
│   │   ├── (dashboard)/
│   │   │   └── dashboard/     # Protected dashboard
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth route handler
│   │   │   ├── register/      # User registration endpoint
│   │   │   └── stripe/        # Stripe checkout, portal, webhook
│   │   ├── pricing/           # Pricing page
│   │   ├── layout.tsx         # Root layout with Navbar and Providers
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── manage-subscription-button.tsx
│   │   └── layout/
│   │       ├── navbar.tsx     # Navigation bar
│   │       └── providers.tsx  # SessionProvider wrapper
│   ├── config/
│   │   └── plans.ts           # Free and Pro plan definitions
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── session.ts         # getCurrentUser helper
│   │   └── stripe.ts          # Stripe client
│   ├── types/
│   │   └── next-auth.d.ts     # NextAuth type extensions
│   └── middleware.ts          # Route protection middleware
├── .env                       # Environment variables (never commit this)
└── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/) — install with `npm install -g pnpm`
- A [Neon](https://neon.tech) account (free) — PostgreSQL database
- A [Stripe](https://stripe.com) account (free) — payments
- A [Vercel](https://vercel.com) account (free) — deployment

## Local Setup (Windows)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/nextura-saas.git
cd nextura-saas
```

### 2. Install dependencies

```bash
pnpm install
```

This installs all packages including:

- `next-auth` + `@auth/prisma-adapter` — authentication and session management
- `prisma` + `@prisma/client` — database ORM and query client
- `stripe` + `@stripe/stripe-js` — server-side and client-side Stripe SDKs
- `bcryptjs` — secure password hashing

### 3. Set up the database (Neon)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project called `nextura`
3. Go to **Dashboard → Connection string** and copy the URI (it starts with `postgresql://`)

### 4. Configure environment variables

Create a `.env` file in the root of the project:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRO_PRICE_ID="price_..."
```

To generate a secure `NEXTAUTH_SECRET`, open PowerShell and run:

```powershell
openssl rand -base64 32
```

If `openssl` is not available on Windows, you can generate a secret online at [generate-secret.vercel.app](https://generate-secret.vercel.app/32).

### 5. Set up Stripe

1. Go to [stripe.com](https://stripe.com) and create a free account
2. Make sure you are in **Test mode** (toggle in the top right)
3. Go to **Developers → API keys** and copy:
   - **Publishable key** (`pk_test_...`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (`sk_test_...`) → `STRIPE_SECRET_KEY`
4. Go to **Product catalog → Add product** and create:
   - **Name**: `Nextura Pro`
   - **Price**: `€9.00` — Recurring — Monthly
5. Copy the **Price ID** (starts with `price_...`, not `prod_...`) → `STRIPE_PRO_PRICE_ID`

### 6. Push the database schema

```bash
pnpm prisma db push
```

This creates all tables (`User`, `Account`, `Session`, `VerificationToken`) in your Neon database.

### 7. Generate the Prisma client

```bash
pnpm prisma generate
```

### 8. Install Stripe CLI (for local webhook testing)

Open PowerShell and run:

```powershell
winget install Stripe.StripeCLI
```

Close and reopen the terminal after installation. Then log in:

```bash
stripe login
```

This opens a browser window — click **Allow access** to authenticate.

### 9. Start the development server

Open two terminals:

**Terminal 1 — Next.js dev server:**

```bash
pnpm dev
```

**Terminal 2 — Stripe webhook listener:**

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI will print a webhook signing secret (`whsec_...`). Copy it into your `.env` as `STRIPE_WEBHOOK_SECRET`, then restart the dev server.

The app is now running at [http://localhost:3000](http://localhost:3000).

## Testing Payments

Use Stripe's test card details to simulate a payment:

| Field          | Value                          |
| -------------- | ------------------------------ |
| Card number    | `4242 4242 4242 4242`          |
| Expiry         | Any future date (e.g. `12/34`) |
| CVC            | Any 3 digits (e.g. `123`)      |
| Name / Address | Any value                      |

After a successful checkout, the webhook updates the user's plan in the database automatically.

## Prisma Commands

```bash
# Push schema changes to the database (no migration files)
pnpm prisma db push

# Open Prisma Studio (visual database browser)
pnpm prisma studio

# Generate Prisma client after schema changes
pnpm prisma generate

# Create a new migration (for production workflows)
pnpm prisma migrate dev --name your-migration-name
```

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "feat: initial nextura setup"
git remote add origin https://github.com/YOUR-USERNAME/nextura-saas.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project** and import `nextura-saas`
3. Vercel detects Next.js automatically — no build config needed
4. Open **Environment Variables** and add all variables from your `.env`:
   - Change `NEXTAUTH_URL` to your Vercel domain (e.g. `https://nextura-saas.vercel.app`)
5. Click **Deploy**

### 3. Set up the production Stripe webhook

After deploy, register a production webhook endpoint with Stripe:

1. Go to **Stripe Dashboard → Developers → Webhooks**
2. Click **Add endpoint**
3. Set the URL to: `https://your-domain.vercel.app/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
5. Copy the **Signing secret** (`whsec_...`) and add it to Vercel's environment variables as `STRIPE_WEBHOOK_SECRET`
6. Redeploy on Vercel for the new variable to take effect

## Environment Variables Reference

| Variable                             | Description                                             |
| ------------------------------------ | ------------------------------------------------------- |
| `DATABASE_URL`                       | PostgreSQL connection string from Neon                  |
| `NEXTAUTH_URL`                       | Full URL of your app (`http://localhost:3000` in dev)   |
| `NEXTAUTH_SECRET`                    | Random secret for signing JWT tokens                    |
| `GOOGLE_CLIENT_ID`                   | Google OAuth client ID (optional)                       |
| `GOOGLE_CLIENT_SECRET`               | Google OAuth client secret (optional)                   |
| `STRIPE_SECRET_KEY`                  | Stripe secret key (`sk_test_...` or `sk_live_...`)      |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook signing secret (`whsec_...`)             |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...` or `pk_live_...`) |
| `STRIPE_PRO_PRICE_ID`                | Stripe Price ID for the Pro plan (`price_...`)          |

## Adding Google OAuth (Optional)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**
4. Set **Authorized redirect URIs** to:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production)
5. Copy the **Client ID** and **Client Secret** into `.env`

## License

MIT — feel free to use this as the foundation for your own SaaS products.
