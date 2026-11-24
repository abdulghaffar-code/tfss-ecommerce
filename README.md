# Total Fire & Safety Solution

A production-oriented e-commerce storefront and admin dashboard for a Karachi
industrial safety and PPE supplier. Built with Next.js App Router, TypeScript,
PostgreSQL, Prisma, Tailwind CSS, React Three Fiber and Framer Motion.

The storefront uses a dark, cinematic industrial design; the product catalogue
and admin dashboard are entirely database-driven.

> **Sample data notice:** product names, model numbers, prices, stock levels and
> specifications in the seed catalogue are fictional demonstration data. The
> business details (company history, addresses, phone numbers, email) come from
> the supplied company documents. No certifications, awards, client logos or
> reviews are fabricated on the site.

---

## Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 App Router, React 19, TypeScript (Node runtime) |
| Styling | Tailwind CSS 3.4, Archivo + Inter via `next/font` |
| Database | PostgreSQL + Prisma 6 |
| Auth | Custom database sessions, bcrypt password hashes, SHA-256 token hashes |
| 3D / motion | React Three Fiber, Drei, GSAP ScrollTrigger, Framer Motion |
| Validation | Zod on every server action |
| Images | `next/image` + self-hosted WebP assets; Sharp for uploads |
| Tests | Vitest (pure pricing, validation and utility logic) |

---

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. PostgreSQL

Use any PostgreSQL 14+ database by setting `DATABASE_URL` in `.env`. For a
self-contained development database, this repository can use a project-local
PostgreSQL cluster in `.pgdata` (gitignored, trust auth, port `55432`).

Windows example (adjust the version/path if needed):

```bash
PG_BIN="/c/Program Files/PostgreSQL/18/bin"
"$PG_BIN/initdb" -D .pgdata -U postgres -A trust -E UTF8
export PG_BIN="C:/Program Files/PostgreSQL/18/bin"   # used by npm run db:start
npm run db:start
"$PG_BIN/createdb" -h 127.0.0.1 -p 55432 -U postgres tfss
```

On Linux/macOS, use the equivalent `initdb`/`createdb` binaries. The local
cluster uses **trust authentication** and is intended for development only.

### 3. Environment

Copy `.env.example` to `.env` and fill in the values:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. Use `sslmode=require` for managed production databases. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, no trailing slash (e.g. `https://totalfirensafety.com`). Used for metadata, structured data, sitemap and canonical URLs. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Admin account created by the seed. Change before deploying. |
| `SEED_CUSTOMER_EMAIL` / `SEED_CUSTOMER_PASSWORD` | Demo customer account created by the seed. |

Never commit `.env`. In production, set the variables in your hosting platform
or secret manager.

### 4. Database, assets and seed

```bash
npm run db:migrate     # create/apply migrations in development
npm run setup:assets   # optional: rebuild optimised images from /Assets
npm run db:seed        # categories, brands, products, slides, settings, accounts
```

`setup:assets` requires the original `/Assets` folder. The optimised output is
already in `public/`, so it is not required for a normal install.

### 5. Run

```bash
npm run dev
# http://localhost:3000
```

Demo accounts created by the seed:

- Admin: `admin@totalfirensafety.com` / `Admin!23456`
- Customer: `customer@example.com` / `Customer!23456`

**Change these credentials before exposing the app publicly.** Public
registration only creates `CUSTOMER` accounts; admin access cannot be self-granted.

---

## Production build

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm start
```

Before starting production:

1. Set a strong `DATABASE_URL` and `NEXT_PUBLIC_SITE_URL`.
2. Run `npm run db:deploy` to apply committed migrations (not `migrate dev`).
3. Seed once if the database is empty (`npm run db:seed`), then change the seed
   passwords.
4. Use HTTPS. Session cookies become `secure` automatically when
   `NODE_ENV=production`.
5. Uploaded admin media is written to `public/uploads/` at runtime. On
   containers/serverless platforms, mount persistent storage or switch
   `lib/upload.ts` to an object-storage adapter. Uploaded files are not part of
   the immutable build output.

### Health / verification

- `GET /robots.txt` and `GET /sitemap.xml` are generated from the database.
- Product pages emit JSON-LD `Product` structured data; the layout emits
  `LocalBusiness`.
- Security headers (CSP, frame options, referrer policy, permissions policy,
  nosniff) are configured in `next.config.ts`.
- The 3D hero is a real WebGL scene. When WebGL is unavailable the site shows
  labelled product photography, never a static image pretending to be 3D.

---

## What is included

### Storefront

- Full-screen interactive 3D hero (procedural helmet; mouse parallax and
  scroll response; reduced scene on mobile; honest fallback).
- Six-image field slider driven by the `Banner` table.
- Click-to-play 77-second company film (83 MB, lazy — the video is not fetched
  until play is pressed).
- Category mosaic, featured products, best-seller shelf (ranked by real order
  data with a featured fallback), manufacturer strip.
- Company story, founder image, why-us, industries, inquiry form, contact and
  Google Maps embed.
- Shop with search, category/brand/price/stock filters, sorting and pagination.
- Product detail with image gallery/lightbox, server-validated add to cart,
  wishlist, specs, delivery/payment notes and an optional GLB 3D viewer that
  only appears when a genuine model is uploaded.
- Guest cart with an httpOnly cart cookie; merged into the account cart at login.
- Checkout with COD or bank transfer, server-side price/stock revalidation,
  transactional stock decrement, unique order number and guest access token.
- Accounts: register/login/logout, profile and password, addresses, wishlist,
  order history and order detail with fulfilment timeline.
- Company pages: About, History, Mission, Catalogue, Contact, Privacy, Terms,
  Shipping, Returns and manufacturer index pages.

### Admin (`/admin`, protected)

- Analytics: order value, order/customer/catalogue counts, 14-day order chart,
  pending work, low stock, recent orders, top lines, inventory activity.
- Products: create/edit, publish/archive, guarded delete, image upload, GLB
  upload, SEO fields, pricing, stock threshold.
- Categories and manufacturers: CRUD with product-count guards and image/logo
  uploads.
- Inventory: auditable stock adjustments with movement history.
- Orders: filter/search, status workflow, payment verification (manual only),
  automatic restock on cancellation and stock re-check on reopen.
- Customers and inquiries with status tracking.
- Homepage slider management and company settings (contact details, logo,
  founder image, announcement, map embed).

### Database models

`User`, `Session`, `Address`, `Category`, `Brand`, `Product`, `ProductImage`,
`Cart`, `CartItem`, `Wishlist`, `WishlistItem`, `Order`, `OrderItem`, `Payment`,
`InventoryMovement`, `Banner`, `Inquiry`, `CompanySettings` — with indexes,
uniques, timestamps, referential actions and a committed initial migration.

---

## Security notes

- Passwords: bcrypt, cost 12. Session tokens: 32 random bytes, only SHA-256
  hashes stored in the database.
- Session and guest-cart cookies are `httpOnly`, `sameSite=lax`, `secure` in
  production, 30-day expiry.
- Admin layout calls `requireAdmin()`; every admin server action independently
  re-checks the role rather than trusting the UI.
- Zod validates all form actions; server-side price and stock are authoritative.
- Checkout uses a serializable transaction and conditional stock updates so an
  order cannot oversell stock.
- Order status updates and payment verification are admin-only. Payment is never
  marked paid automatically.
- Uploads are type-checked, size-limited, re-encoded through Sharp (images) and
  validated by GLB magic bytes. Upload folders are allowlisted.
- Login, registration, checkout and inquiry actions are rate-limited in-process.
  For multi-instance deployments, back `lib/rate-limit.ts` with a shared store
  (e.g. Redis).
- Next.js server actions provide built-in Origin checks in addition to the
  SameSite cookie policy.
- Order confirmation pages require either the signed-in owner or the random
  public token issued at checkout; they are `noindex`.

## Project structure

```
app/
  (store)/            storefront routes (home, shop, product, cart, checkout, account, company pages)
  admin/              protected dashboard
  api/                (none — mutations use server actions)
actions/              auth, cart, checkout, account, wishlist, inquiry, admin
components/           layout, home, product, cart, checkout, account, admin, three, ui
lib/                  prisma, auth, cart, catalog, validation, rate-limit, upload, seo
prisma/               schema, migration, seed
scripts/              catalogue data, asset pipeline, local DB helper
public/               optimised images, logo variants, company film, uploads
```

## Known constraints

- The supplied company film is 83 MB. It is lazy-loaded on click; there is no
  transcoding step in this repository (`ffmpeg` was not available). For a public
  deployment, compress/stream it from a media host and keep a poster image.
- Only six slider images were supplied; the homepage slider uses all six.
- Categories without source imagery (fire fighting, welding, hardware, hydraulic,
  electrical, industrial supplies) are intentionally rendered as typographic
  cards and remain available to order rather than using stock photos.
- Category and product photography provided in `/Assets` is AI-generated for the
  demo. It is labelled as sample product photography, not a certification or
  manufacturer claim.
- In-process rate limiting is sufficient for a single Node instance only.
