# The Fit Theory — O2O Athletic Wear Catalog & Inventory CRM

A complete, production-ready, **zero-monthly-cost** Online-to-Offline (O2O) web application for a solo-operated athletic wear shop.

- **Storefront** (Nike.com aesthetic) — browse the catalog, filter, and order via WhatsApp.
- **Admin CRM** (Vercel dashboard aesthetic) — mobile-first product, inventory, sales, and analytics management.

Built with Next.js 14 (App Router), MongoDB Atlas (Free M0), Cloudinary (Free), and native WhatsApp deep links. No Stripe, no Twilio, no paid APIs.

---

## ✨ Features

### Storefront (`/`, `/shop`, `/shop/[slug]`)
- Nike-style editorial homepage with featured grid and shop-by-sport tiles
- Full catalog with URL-synced filters (category, sport, fabric, fit, size)
- Desktop filter sidebar + mobile bottom-sheet filters + removable filter pills
- Product detail page with image gallery, size selector, size guide, and a fixed bottom WhatsApp bar on mobile
- WhatsApp ordering with a pre-filled, fully URL-encoded inquiry message
- Real-time stock badges (In Stock / Low Stock / Sold Out)
- SEO metadata per product, custom 404

### Admin CRM (`/admin/*`)
- Password-protected single-operator dashboard (JWT cookie + edge middleware)
- Product management: create/edit/delete, drag-to-reorder images, attribute tag grid
- Image upload to Cloudinary (drag-drop + mobile camera capture, validated client + server)
- Inventory: one-tap restock (+) and sell (−) per size variant, low-stock restock banner
- Sale logging: Walk-in vs WhatsApp channel, quantity, revenue, optional note
  - **A `SaleRecord` is always created before stock is decremented**
- Analytics powered entirely by **MongoDB aggregation pipelines**: revenue trends, channel split, fast movers, dead stock
- Mobile-first with 44px minimum touch targets throughout

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 + TypeScript (strict) |
| Styling | Tailwind CSS v3 |
| Database | MongoDB Atlas (Free M0) via Mongoose 8 |
| Images | Cloudinary (Free tier) |
| Auth | `jose` JWT in an httpOnly cookie + Next middleware |
| Charts | Recharts |
| UI | Radix primitives, Lucide icons, Sonner toasts, Zustand, SWR |
| Ordering | WhatsApp `wa.me` deep links (free, native) |

---

## 🚀 Local Setup

### 1. Prerequisites
- Node.js 18.17+ (or 20+)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A free [Cloudinary](https://cloudinary.com/) account

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
Copy the template and fill in your values:
```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string (`openssl rand -base64 32`) |
| `ADMIN_PASSWORD` | The password for `/admin` login |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | International format, no `+` (e.g. `919876543210`) |
| `NEXT_PUBLIC_SHOP_URL` | Public site URL, no trailing slash |

### 4. Run the dev server
```bash
npm run dev
```
- Storefront: http://localhost:3000
- Admin: http://localhost:3000/admin (you'll be redirected to `/admin/login`)

### 5. Add your first product
Log into `/admin`, go to **Products → New Product**, upload images, set attributes and stock, toggle **Active**, and save. It will appear on the storefront immediately.

---

## ☁️ Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add **all** environment variables from `.env.local.example` in **Project → Settings → Environment Variables**.
   - Set `NEXT_PUBLIC_SHOP_URL` to your production domain (e.g. `https://thefittheory.vercel.app`).
4. In MongoDB Atlas → **Network Access**, allow access from anywhere (`0.0.0.0/0`) so Vercel's serverless functions can connect.
5. Deploy. Vercel auto-detects Next.js — no extra config needed.

> The app is fully serverless-compatible (Cloudflare Pages also works with the Next.js adapter).

---

## 📁 Project Structure

```
app/
  ├─ page.tsx                 # Homepage (Nike hero + featured)
  ├─ shop/                    # Catalog + product detail
  ├─ admin/                   # CRM (layout, dashboard, products, inventory, analytics, login)
  ├─ api/                     # auth, products, inventory, sales, analytics, upload
  └─ not-found.tsx
components/
  ├─ storefront/              # Nike-aesthetic components
  ├─ admin/                   # Vercel-aesthetic components
  └─ ui/                      # Shared primitives
lib/                          # mongodb, cloudinary, auth, whatsapp, utils, data
models/                       # Product, SaleRecord (Mongoose)
hooks/                        # SWR + zustand hooks
types/                        # Shared TypeScript interfaces
middleware.ts                 # /admin route protection
```

---

## 🔒 Security Notes
- All `/admin/*` routes (except `/admin/login`) are protected by edge middleware verifying the JWT cookie. API routes re-check the session as defense-in-depth.
- The session cookie is `httpOnly`, `sameSite=lax`, and `secure` in production.
- This is a single-operator design with no public sign-up. Use a strong `ADMIN_PASSWORD` and rotate `JWT_SECRET` if it leaks.

---

## 🧪 Available Scripts
```bash
npm run dev     # Start dev server
npm run build   # Production build
npm start       # Run the production build
npm run lint    # Lint
```

---

© The Fit Theory. Built as a zero-cost O2O retail platform.
