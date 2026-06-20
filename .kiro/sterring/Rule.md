# MASTER PROMPT — ATHLETIC WEAR O2O CATALOG & INVENTORY CRM

# ALWAYS USE SKILLS [ui-ux-pro](file:///c:/Users/dell/Dropbox/PC/Desktop/THE-FIT-THEORY/.kiro/skills/ui-ux-pro),
 [tailwind-4-docs](file:///c:/Users/dell/Dropbox/PC/Desktop/THE-FIT-THEORY/.kiro/skills/tailwind-4-docs),[web-design-guidelines](file:///c:/Users/dell/Dropbox/PC/Desktop/THE-FIT-THEORY/.kiro/skills/web-design-guidelines)

## Complete Full-Stack Build Specification v2.0
### Storefront Design: Nike.com Aesthetic USE [NIKE-DESIGN.md](file:///c:/Users/dell/Dropbox/PC/Desktop/THE-FIT-THEORY/.kiro/sterring/NIKE-DESIGN.md) | CRM Design: Vercel Dashboard Aesthetic USE [VERCEL-DESIGN.md](file:///c:/Users/dell/Dropbox/PC/Desktop/THE-FIT-THEORY/.kiro/sterring/VERCEL-DESIGN.md) 

---

## AGENT DIRECTIVE

You are an expert Senior Full-Stack Engineer and UI/UX Designer. Your singular task is to
build a complete, production-ready, zero-cost O2O (Online-to-Offline) web application for
a solo-operated athletic wear retail shop. You will generate EVERY file with COMPLETE,
WORKING, PRODUCTION-READY code. No placeholder comments. No TODO stubs. No incomplete
implementations. Every component, every API route, every utility function must be fully
built and immediately deployable.

This document is your single source of truth. Follow every specification exactly.

# Project Overview
You are an expert Full-Stack Developer agent. Your task is to build a complete O2O (Online-to-Offline) apparel catalog and inventory CRM web application. The business sells athletic wear (dry-fit clothes, football jerseys, trousers, polos). The business is run by a solo operator. 

# Core Constraints (CRITICAL)
1. **Zero Monthly Cost:** You must strictly use Next.js (App Router), Tailwind CSS, MongoDB (Free Tier), and Cloudinary (Free Tier), and design it to be serverless-compatible for hosting on Cloudflare Pages or Vercel.
2. **No Paid APIs:** Do NOT integrate Stripe, PayPal, Twilio, or any GenAI APIs. 
3. **No Staff Complexity:** This is for a single admin. Use a simple, single password-protected route for the `/admin` dashboard. Do not build complex role-based access control (RBAC).
4. **Mobile-First UX:** The Admin CRM must be highly optimized for mobile devices so the owner can update inventory with one thumb while standing in the stockroom. The customer storefront must also be fully responsive for mobile and laptop.

---

## PART 0: CRITICAL CONSTRAINTS — READ FIRST, VIOLATE NOTHING




---

## PART 1: TECHNOLOGY STACK

### 1.1 Complete Dependency List

```json
{
  "dependencies": {
    "next": "14.2.x",
    "react": "18.x",
    "react-dom": "18.x",
    "mongoose": "8.x",
    "cloudinary": "2.x",
    "jose": "5.x",
    "recharts": "2.x",
    "lucide-react": "0.x",
    "clsx": "2.x",
    "tailwind-merge": "2.x",
    "sharp": "0.x",
    "sonner": "1.x",
    "zustand": "4.x",
    "@radix-ui/react-dialog": "1.x",
    "@radix-ui/react-select": "2.x",
    "@radix-ui/react-switch": "1.x",
    "@radix-ui/react-tabs": "1.x",
    "@radix-ui/react-tooltip": "1.x",
    "framer-motion": "11.x"
  },
  "devDependencies": {
    "typescript": "5.x",
    "@types/node": "20.x",
    "@types/react": "18.x",
    "@types/react-dom": "18.x",
    "tailwindcss": "3.x",
    "autoprefixer": "10.x",
    "postcss": "8.x",
    "eslint": "8.x",
    "eslint-config-next": "14.x"
  }
}

PHASE 1 — FOUNDATION
━━━━━━━━━━━━━━━━━━━━
□ package.json with all dependencies
□ tailwind.config.ts (full custom theme)
□ next.config.ts
□ tsconfig.json
□ app/globals.css (Tailwind directives + CSS custom properties)
□ app/layout.tsx (root layout, Inter font, metadata)
□ types/index.ts (all TypeScript interfaces)
□ .env.local template

PHASE 2 — DATA LAYER
━━━━━━━━━━━━━━━━━━━━
□ lib/mongodb.ts (singleton with caching)
□ lib/cloudinary.ts (SDK config + upload options)
□ lib/auth.ts (JWT sign/verify/cookie helpers)
□ lib/whatsapp.ts (URL generator)
□ lib/utils.ts (cn, formatPrice, slugify, etc.)
□ models/Product.ts (complete schema + virtuals + hooks + indexes)
□ models/SaleRecord.ts (complete schema + indexes)

PHASE 3 — MIDDLEWARE & AUTH API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ middleware.ts (route protection)
□ app/api/auth/login/route.ts
□ app/api/auth/logout/route.ts

PHASE 4 — SHARED UI COMPONENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ components/ui/Button.tsx
□ components/ui/Badge.tsx
□ components/ui/Modal.tsx
□ components/ui/Input.tsx
□ components/ui/Select.tsx
□ components/ui/Toggle.tsx
□ components/ui/Skeleton.tsx
□ components/ui/Toast.tsx
□ components/ui/Tooltip.tsx
□ components/ui/ConfirmDialog.tsx

PHASE 5 — ADMIN SHELL & LAYOUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ components/admin/AdminSidebar.tsx
□ components/admin/AdminHeader.tsx
□ hooks/useMobileMenu.ts
□ app/admin/layout.tsx
□ app/admin/login/page.tsx

PHASE 6 — UPLOAD & PRODUCT API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ app/api/upload/route.ts
□ app/api/products/route.ts
□ app/api/products/[id]/route.ts

PHASE 7 — ADMIN PRODUCT MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ components/admin/ImageUploader.tsx
□ components/admin/ProductUploadForm.tsx
□ components/admin/ProductTable.tsx
□ hooks/useProducts.ts
□ app/admin/products/page.tsx
□ app/admin/products/new/page.tsx
□ app/admin/products/[id]/edit/page.tsx

PHASE 8 — INVENTORY MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ app/api/inventory/route.ts
□ app/api/sales/route.ts
□ components/admin/SaleLogModal.tsx
□ components/admin/InventoryCard.tsx
□ components/admin/RestockBanner.tsx
□ hooks/useInventory.ts
□ app/admin/inventory/page.tsx

PHASE 9 — ANALYTICS
━━━━━━━━━━━━━━━━━━━
□ app/api/analytics/route.ts
□ components/admin/StatsCard.tsx
□ components/admin/SalesChart.tsx
□ components/admin/ChannelPieChart.tsx
□ components/admin/VelocityList.tsx
□ components/admin/ActivityFeed.tsx
□ hooks/useAnalytics.ts
□ app/admin/analytics/page.tsx

PHASE 10 — ADMIN DASHBOARD HOME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ app/admin/page.tsx (stats + activity + quick actions)

PHASE 11 — STOREFRONT COMPONENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ components/storefront/Navbar.tsx
□ components/storefront/Footer.tsx
□ components/storefront/HeroSection.tsx
□ components/storefront/StockBadge.tsx
□ components/storefront/ProductCard.tsx
□ components/storefront/ProductGrid.tsx
□ components/storefront/FilterSidebar.tsx
□ components/storefront/FilterSheet.tsx
□ components/storefront/ActiveFilters.tsx
□ components/storefront/SizeSelector.tsx
□ components/storefront/WhatsAppButton.tsx
□ components/storefront/ImageGallery.tsx
□ components/storefront/SizeGuideModal.tsx

PHASE 12 — STOREFRONT PAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━
□ app/page.tsx (Nike-style homepage)
□ app/shop/page.tsx (catalog with filters)
□ app/shop/[slug]/page.tsx (Nike PDP)
□ app/not-found.tsx (custom 404)

PHASE 13 — FINAL
━━━━━━━━━━━━━━━━
□ README.md (full setup and deployment guide)
□ Final review: ensure ALL files are complete, no stubs

#FINAL AGENT CHECKLIST

□ Every file in the folder structure exists and is 100% complete
□ No TypeScript errors (strict mode)
□ No placeholder comments or TODO stubs anywhere
□ Nike storefront: white background, black text, square buttons, bold typography
□ Vercel admin: black background, #0070F3 blue accent, rounded-md cards
□ All admin buttons meet 44px minimum touch target
□ WhatsApp URL correctly URL-encodes the full message with all product details
□ MongoDB singleton prevents connection pool exhaustion
□ Middleware protects ALL /admin/* routes except /admin/login
□ Inventory decrement shows SaleLogModal before executing
□ SaleRecord is created before stock is decremented
□ Analytics uses MongoDB aggregation pipelines (not JS array methods)
□ Cloudinary upload validates file type and size before uploading
□ All images use next/image (no raw <img> tags for products)
□ Product detail page has fixed bottom WhatsApp bar on mobile
□ Filter state is reflected in URL query parameters
□ Empty states exist for all lists and charts
□ Loading states (Skeleton) exist for all async data
□ Error states handled gracefully (no raw error dumps to UI)
□ Restock banner appears when any variant stock < 3
□ Dead stock correctly identified via MongoDB aggregation
□ README covers complete local setup and Vercel deployment
□ .env.local template has all required variables with instructions


┌─────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 14 APP ROUTER                           │
├───────────────────────────┬─────────────────────────────────────────────┤
│   CUSTOMER STOREFRONT     │         ADMIN CRM                          │
│   Nike.com Aesthetic      │         Vercel Dashboard Aesthetic          │
│   /  /shop  /shop/[slug]  │         /admin/*                           │
├───────────────────────────┴─────────────────────────────────────────────┤
│                    NEXT.JS API ROUTE HANDLERS (Serverless)             │
│         /api/products  /api/inventory  /api/sales  /api/analytics      │
│                    /api/auth  /api/upload                               │
├─────────────────────────────────────────────────────────────────────────┤
│  MongoDB Atlas (Free M0)  │  Cloudinary (Free)  │  wa.me (Free Native) │
└─────────────────────────────────────────────────────────────────────────┘


athletic-store/
│
├── app/
│   ├── globals.css                          ← Tailwind + CSS custom properties
│   ├── layout.tsx                           ← Root layout, fonts, metadata, theme
│   ├── page.tsx                             ← Homepage: Nike-style hero + featured grid
│   ├── not-found.tsx                        ← Custom 404 page
│   │
│   ├── shop/
│   │   ├── page.tsx                         ← Full catalog with Nike-style grid + filters
│   │   └── [slug]/
│   │       └── page.tsx                     ← Product detail: Nike PDP layout
│   │
│   └── admin/
│       ├── layout.tsx                       ← Admin shell: Vercel sidebar layout
│       ├── page.tsx                         ← Admin home: quick stats + activity feed
│       ├── login/
│       │   └── page.tsx                     ← Clean centered password login
│       ├── products/
│       │   ├── page.tsx                     ← Product table/list management
│       │   ├── new/
│       │   │   └── page.tsx                 ← New product upload form
│       │   └── [id]/
│       │       └── edit/
│       │           └── page.tsx             ← Edit product form (pre-populated)
│       ├── inventory/
│       │   └── page.tsx                     ← Quick +/- stock toggle view
│       └── analytics/
│           └── page.tsx                     ← Charts, velocity, dead stock
│
├── api/ (inside app/)
│   ├── auth/
│   │   ├── login/route.ts                   ← POST: validate password → set cookie
│   │   └── logout/route.ts                  ← POST: clear session cookie
│   ├── products/
│   │   ├── route.ts                         ← GET (list) + POST (create)
│   │   └── [id]/route.ts                    ← GET + PUT + DELETE single product
│   ├── inventory/route.ts                   ← PATCH: increment/decrement stock
│   ├── sales/route.ts                       ← POST: log sale + GET: recent sales
│   ├── analytics/route.ts                   ← GET: aggregated analytics data
│   └── upload/route.ts                      ← POST: Cloudinary image upload
│
├── components/
│   │
│   ├── storefront/                          ← All Nike-aesthetic components
│   │   ├── Navbar.tsx                       ← Nike-style top nav, transparent→solid
│   │   ├── Footer.tsx                       ← Minimal dark footer
│   │   ├── HeroSection.tsx                  ← Full-viewport bold Nike hero
│   │   ├── ProductCard.tsx                  ← Nike product card with hover
│   │   ├── ProductGrid.tsx                  ← Responsive grid container
│   │   ├── FilterSidebar.tsx                ← Desktop left filter panel
│   │   ├── FilterSheet.tsx                  ← Mobile bottom sheet filters
│   │   ├── ActiveFilters.tsx                ← Applied filter pills with remove
│   │   ├── SizeSelector.tsx                 ← Interactive size button grid
│   │   ├── WhatsAppButton.tsx               ← Green CTA with URL generator
│   │   ├── StockBadge.tsx                   ← Green/Amber/Red status badge
│   │   ├── ImageGallery.tsx                 ← Swipeable product image viewer
│   │   └── SizeGuideModal.tsx               ← Size chart table modal
│   │
│   ├── admin/                               ← All Vercel-aesthetic components
│   │   ├── AdminSidebar.tsx                 ← Vercel-style left nav sidebar
│   │   ├── AdminHeader.tsx                  ← Mobile top bar + hamburger
│   │   ├── ProductUploadForm.tsx            ← Attribute tag grid form
│   │   ├── ImageUploader.tsx                ← Drag-drop + mobile camera
│   │   ├── InventoryCard.tsx                ← Product card with +/- controls
│   │   ├── SaleLogModal.tsx                 ← Walk-in vs WhatsApp modal
│   │   ├── StatsCard.tsx                    ← Vercel-style metric card
│   │   ├── ActivityFeed.tsx                 ← Recent sales list
│   │   ├── RestockBanner.tsx                ← Low stock alert banner
│   │   ├── SalesChart.tsx                   ← Recharts revenue line chart
│   │   ├── ChannelPieChart.tsx              ← Walk-in vs WhatsApp donut
│   │   ├── VelocityList.tsx                 ← Fast movers + dead stock lists
│   │   └── ProductTable.tsx                 ← Sortable product data table
│   │
│   └── ui/                                  ← Shared primitive components
│       ├── Button.tsx                       ← Multi-variant button system
│       ├── Badge.tsx                        ← Generic pill badge
│       ├── Modal.tsx                        ← Accessible modal wrapper
│       ├── Input.tsx                        ← Styled text input
│       ├── Select.tsx                       ← Styled dropdown (Radix)
│       ├── Toggle.tsx                       ← Switch toggle (Radix)
│       ├── Skeleton.tsx                     ← Shimmer loading placeholder
│       ├── Toast.tsx                        ← Sonner toast configuration
│       ├── Tooltip.tsx                      ← Radix tooltip wrapper
│       └── ConfirmDialog.tsx                ← Delete confirmation dialog
│
├── lib/
│   ├── mongodb.ts                           ← Singleton connection with caching
│   ├── cloudinary.ts                        ← Cloudinary SDK config
│   ├── auth.ts                              ← JWT sign/verify helpers
│   ├── whatsapp.ts                          ← WhatsApp URL constructor
│   └── utils.ts                             ← cn(), slugify(), formatPrice()
│
├── models/
│   ├── Product.ts                           ← Product Mongoose schema + model
│   └── SaleRecord.ts                        ← SaleRecord Mongoose schema + model
│
├── hooks/
│   ├── useInventory.ts                      ← SWR hook for inventory data
│   ├── useProducts.ts                       ← SWR hook for products
│   ├── useAnalytics.ts                      ← SWR hook for analytics
│   └── useMobileMenu.ts                     ← Sidebar open/close state
│
├── types/
│   └── index.ts                             ← All shared TypeScript interfaces
│
├── middleware.ts                             ← Admin route protection
├── tailwind.config.ts                        ← Full custom theme config
├── next.config.ts                            ← Image domains, env validation
├── tsconfig.json                             ← Strict TypeScript config
├── .env.local                                ← Environment variables template
└── README.md                                 ← Complete setup and deploy guide

// COMPLETE MONGOOSE SCHEMA — BUILD THIS EXACTLY

import mongoose, { Schema, Document, Model } from 'mongoose'

// TypeScript Interface
export interface IVariant {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size'
  stock: number
}

export interface IProduct extends Document {
  title: string
  slug: string
  price: number
  images: string[]
  category: 'Jersey' | 'Trousers' | 'T-Shirt' | 'Polo' | 'Shorts' |
            'Compression' | 'Caps' | 'Vest' | 'Others'
  fabric: 'Dry-Fit' | 'Cotton' | 'Mesh' | 'Polyester' |
          'Cotton-Polyester Blend' | 'Nylon'
  fit: 'Compression' | 'Slim' | 'Regular' | 'Oversized' | 'Relaxed'
  sport: 'Football' | 'Running' | 'Gym/Lifting' | 'Cricket' |
         'Basketball' | 'General'
  variants: IVariant[]
  status: 'active' | 'draft'
  featured: boolean
  totalStock: number        // Virtual
  stockStatus: string       // Virtual
  createdAt: Date
  updatedAt: Date
}

// Variant Sub-Schema
const VariantSchema = new Schema<IVariant>({
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, { _id: false })

// Main Product Schema
const ProductSchema = new Schema<IProduct>({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, lowercase: true },
  price: { type: Number, required: true, min: 0 },
  images: [{ type: String, required: true }],
  category: {
    type: String,
    enum: ['Jersey','Trousers','T-Shirt','Polo','Shorts',
           'Compression','Caps','Vest','Others'],
    required: true
  },
  fabric: {
    type: String,
    enum: ['Dry-Fit','Cotton','Mesh','Polyester',
           'Cotton-Polyester Blend','Nylon'],
    required: true
  },
  fit: {
    type: String,
    enum: ['Compression','Slim','Regular','Oversized','Relaxed'],
    required: true
  },
  sport: {
    type: String,
    enum: ['Football','Running','Gym/Lifting','Cricket','Basketball','General'],
    required: true
  },
  variants: { type: [VariantSchema], required: true, validate: {
    validator: (v: IVariant[]) => v.length > 0,
    message: 'At least one size variant is required'
  }},
  status: { type: String, enum: ['active', 'draft'], default: 'draft' },
  featured: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// VIRTUAL: Total stock across all variants
ProductSchema.virtual('totalStock').get(function() {
  return this.variants.reduce((sum, v) => sum + v.stock, 0)
})

// VIRTUAL: Stock status string
ProductSchema.virtual('stockStatus').get(function() {
  const total = this.variants.reduce((sum: number, v: IVariant) => sum + v.stock, 0)
  if (total === 0) return 'out-of-stock'
  if (total < 3) return 'low-stock'
  return 'in-stock'
})

// DATABASE INDEXES (critical for query performance)
ProductSchema.index({ slug: 1 }, { unique: true })
ProductSchema.index({ status: 1 })
ProductSchema.index({ category: 1 })
ProductSchema.index({ fabric: 1 })
ProductSchema.index({ fit: 1 })
ProductSchema.index({ sport: 1 })
ProductSchema.index({ featured: 1 })
ProductSchema.index({ createdAt: -1 })
ProductSchema.index({ status: 1, category: 1, fabric: 1 })  // Compound for filters

// PRE-SAVE: Auto-generate unique slug
ProductSchema.pre('save', async function(next) {
  if (!this.isModified('title') && this.slug) return next()
  
  const base = this.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  
  let slug = base
  let count = 0
  const ProductModel = mongoose.model('Product')
  
  while (await ProductModel.exists({ slug, _id: { $ne: this._id } })) {
    count++
    slug = `${base}-${count}`
  }
  
  this.slug = slug
  next()
})

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product

// COMPLETE MONGOOSE SCHEMA — BUILD THIS EXACTLY

import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISaleRecord extends Document {
  productId: mongoose.Types.ObjectId
  productTitle: string
  sizeSold: string
  channel: 'Walk-in' | 'WhatsApp'
  revenue: number
  quantity: number
  note?: string
  date: Date
}

const SaleRecordSchema = new Schema<ISaleRecord>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productTitle: {
    type: String,
    required: true
    // Denormalized: kept even if product is deleted, preserving history
  },
  sizeSold: { type: String, required: true },
  channel: {
    type: String,
    enum: ['Walk-in', 'WhatsApp'],
    required: true
  },
  revenue: { type: Number, required: true, min: 0 },
  quantity: { type: Number, default: 1, min: 1 },
  note: { type: String, maxlength: 280 },
  date: { type: Date, default: Date.now }
}, { timestamps: false })

// DATABASE INDEXES
SaleRecordSchema.index({ date: -1 })
SaleRecordSchema.index({ productId: 1 })
SaleRecordSchema.index({ channel: 1 })
SaleRecordSchema.index({ date: -1, channel: 1 })  // Compound for analytics

const SaleRecord: Model<ISaleRecord> =
  mongoose.models.SaleRecord ||
  mongoose.model<ISaleRecord>('SaleRecord', SaleRecordSchema)

export default SaleRecord

// CRITICAL: Singleton with connection caching prevents connection
// exhaustion in Next.js serverless environment. Build exactly as shown.

import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI as string

if (!MONGO_URI) {
  throw new Error(
    'MONGO_URI environment variable is not defined. ' +
    'Add it to your .env.local file.'
  )
}

// Global cache type
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Attach to global to survive hot reload in development
declare global {
  var __mongoose_cache: MongooseCache | undefined
}

const cached: MongooseCache = global.__mongoose_cache ?? {
  conn: null,
  promise: null
}

global.__mongoose_cache = cached

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    }

    cached.promise = mongoose.connect(MONGO_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectToDatabase

// JWT session management using jose (zero-dependency, edge-compatible)

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const COOKIE_NAME = 'admin_session'
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-dev-secret-change-in-production'
)

// Sign a new JWT session token
export async function signSessionToken(): Promise<string> {
  return await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET)
}

// Verify a JWT token string
export async function verifySessionToken(
  token: string
): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET)
    return true
  } catch {
    return false
  }
}

// Get session token from request (for middleware)
export function getTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get(COOKIE_NAME)?.value ?? null
}

// Get session token from server component cookies
export async function getSessionFromCookies(): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifySessionToken(token)
}

// Cookie options
export const SESSION_COOKIE_OPTIONS = {
  name: COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24  // 24 hours in seconds
}

// WhatsApp URL constructor — generates pre-filled inquiry messages

interface WhatsAppParams {
  productTitle: string
  selectedSize: string
  price: number
  productSlug: string
  category: string
  fabric: string
}

export function generateWhatsAppURL(params: WhatsAppParams): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const shopURL = process.env.NEXT_PUBLIC_SHOP_URL

  if (!phoneNumber) {
    console.error('NEXT_PUBLIC_WHATSAPP_NUMBER is not defined')
    return '#'
  }

  const productURL = `${shopURL}/shop/${params.productSlug}`

  const message = [
    `Hi! I'm interested in ordering the following item:`,
    ``,
    `🏷️ *Product:* ${params.productTitle}`,
    `📦 *Category:* ${params.category} (${params.fabric})`,
    `📐 *Size:* ${params.selectedSize}`,
    `💰 *Price:* ₹${params.price.toLocaleString('en-IN')}`,
    ``,
    `🔗 *Link:* ${productURL}`,
    ``,
    `Could you please confirm availability? Thank you!`
  ].join('\n')

  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}

// Generate URL for general inquiry (no specific product)
export function generateGeneralWhatsAppURL(): string {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  if (!phoneNumber) return '#'
  const message = encodeURIComponent(
    "Hi! I'd like to know more about your athletic wear collection."
  )
  return `https://wa.me/${phoneNumber}?text=${message}`
}


import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind class merger utility
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// Price formatter for Indian Rupees
export function formatPrice(amount: number): string {
  return `₹ ${amount.toLocaleString('en-IN')}`
}

// Slugify any string to URL-safe format
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Get date N days ago
export function getDaysAgo(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(0, 0, 0, 0)
  return date
}

// Stock status helper
export function getStockStatus(
  totalStock: number
): 'in-stock' | 'low-stock' | 'out-of-stock' {
  if (totalStock === 0) return 'out-of-stock'
  if (totalStock < 3) return 'low-stock'
  return 'in-stock'
}

// Stock status display config (for badges/indicators)
export const STOCK_CONFIG = {
  'in-stock': {
    label: 'In Stock',
    nikeLabel: 'In Stock',
    dotColor: '#117A00',
    // Storefront (Nike light theme):
    storefrontBg: '#E7F5E7',
    storefrontText: '#117A00',
    // Admin (Vercel dark theme):
    adminColor: '#50E3C2',
  },
  'low-stock': {
    label: 'Low Stock',
    nikeLabel: 'Low Stock',
    dotColor: '#CC6600',
    storefrontBg: '#FFF3CD',
    storefrontText: '#CC6600',
    adminColor: '#F5A623',
  },
  'out-of-stock': {
    label: 'Out of Stock',
    nikeLabel: 'Sold Out',
    dotColor: '#CC0000',
    storefrontBg: '#F5F5F5',
    storefrontText: '#757575',
    adminColor: '#FF4444',
  }
}

// Truncate text to N characters
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}


import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

export default cloudinary

// Cloudinary upload options for product images
export const PRODUCT_UPLOAD_OPTIONS = {
  folder: 'athletic-store/products',
  transformation: [
    { quality: 'auto', fetch_format: 'auto' },
    { width: 1200, crop: 'limit' }  // Max width 1200px
  ],
  allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  max_bytes: 5 * 1024 * 1024  // 5MB limit
}

// Next.js middleware runs on the edge before every request
// Protects all /admin/* routes except /admin/login

import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-dev-secret'
)

const PROTECTED_PREFIX = '/admin'
const LOGIN_PATH = '/admin/login'
const COOKIE_NAME = 'admin_session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only process /admin/* paths
  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next()
  }

  // Allow access to login page always
  if (pathname === LOGIN_PATH) {
    // If already authenticated, redirect to dashboard
    const token = request.cookies.get(COOKIE_NAME)?.value
    if (token) {
      try {
        await jwtVerify(token, SECRET)
        return NextResponse.redirect(new URL('/admin', request.url))
      } catch {
        // Token invalid, let them see login page
      }
    }
    return NextResponse.next()
  }

  // Verify session for all other /admin/* paths
  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    const loginURL = new URL(LOGIN_PATH, request.url)
    loginURL.searchParams.set('from', pathname)
    return NextResponse.redirect(loginURL)
  }

  try {
    await jwtVerify(token, SECRET)
    return NextResponse.next()
  } catch {
    const loginURL = new URL(LOGIN_PATH, request.url)
    return NextResponse.redirect(loginURL)
  }
}

export const config = {
  matcher: ['/admin/:path*']
}