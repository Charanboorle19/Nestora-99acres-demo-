# Nestora — Indian real-estate marketplace demo

Frontend-only portal for client presentations. **Original branding, copy, and seed data** — no third-party marketplace assets.

**Brand:** Nestora · *Homes that fit your life*  
**Stack:** React 19 + Vite 6 · React Router · Tailwind CSS v4 · Zustand · Leaflet/OSM · Recharts

## Setup

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build
npm run preview
```

## Demo auth

Login → pick a role → any 10-digit phone → OTP **`123456`**.

| Role | Best for |
|------|----------|
| Buyer / Tenant | Search, shortlist, enquiry, visits, EMI, dashboard |
| Owner / Agent | Post property, seller CRM, promote & verify |
| Builder | Same seller tools + project microsites |

## Folder structure

```
src/
  components/   # UI kit, layout, search, property, seller, project, tools
  pages/        # Route screens
  hooks/        # useDebounce, …
  store/        # Zustand + localStorage persistence
  services/     # Async mock API (swap for a real backend later)
  data/         # Seed listings, localities, projects, builders
  utils/        # formatters, constants, search URL helpers
```

## What’s mocked

| Area | Behaviour |
|------|-----------|
| Listings / search / projects | Seed data + optional `localStorage` listings; artificial latency |
| Auth | Client-only; OTP always `123456` |
| Shortlist, saved searches, enquiries, visits, notifications, drafts | Zustand + `localStorage` |
| Maps | Leaflet + OpenStreetMap (no API key) |
| Payments / plans / promote | Fake checkout UI |
| Document verification | File name mock → auto Verified badge |
| Brochure download | Toast only |
| Alerts | In-app notification bell |

## Features delivered

1. **Home** — hero search (Buy/Rent/PG/Commercial/Plots/Projects), autocomplete, multi-select localities, featured, localities, projects, EMI CTA  
2. **Search** — filters (URL-synced), sort, grid/list/map, clustering, pan-to-filter  
3. **Property detail** — gallery/lightbox, insights chart, nearby map, enquiry, phone reveal, site visit, shortlist/share/report, EMI widget  
4. **Shortlist & saved searches** — compare up to 3; alert frequency + test alerts  
5. **Tools** — EMI amortization + loan eligibility  
6. **Buyer dashboard** — enquiries, visits, shortlist, searches  
7. **Post property** — 7-step wizard, map pin, photos, plans, fake checkout, draft autosave  
8. **Seller dashboard** — analytics, listings, leads CRM (table/kanban), visit calendar, promote & verify  
9. **Builder microsite** — `/project/:slug` inventory grid, price list, RERA, timeline, enquiry; `/builder/:slug` profile  

## Seed data

- **64+** listings across Hyderabad, Bengaluru, Mumbai, Pune, Delhi NCR  
- Localities with ratings & ₹/sq.ft · 8 projects · 5 builders · RERA-style IDs  
- Prices formatted in ₹ lakh/crore  

## Presentation script

See **[DEMO_SCRIPT.md](./DEMO_SCRIPT.md)** for a suggested click-through order.

## Phase status

| Phase | Status |
|-------|--------|
| 1 Setup, design system, data, routing | **Done** |
| 2 Home search + map results | **Done** |
| 3 Detail, shortlist, enquiry | **Done** |
| 4 EMI tools, buyer dashboard | **Done** |
| 5 Post property, seller dashboard | **Done** |
| 6 Builder microsite & polish | **Done** |
