# ShopLedger Contributor Guide

## Stack
- Node.js CommonJS application using Express 4 and body-parser for JSON request bodies.
- Browser UI is static HTML, CSS, and JavaScript served from `public/`.
- Application records are stored in `data/db.json` through `lib/store.js`.

## Module map
- `routes/customers.js` — lists customer Khata accounts and records settlements.
- `routes/orders.js` — lists, fetches, places, and cancels orders.
- `routes/products.js` — lists products and active coupons.
- `routes/reports.js` — serves dashboard and GST reconciliation data, pricing preview, and admin export.
- `lib/coupons.js` — normalizes, validates, calculates, and lists configured coupons.
- `lib/dates.js` — formats today's date and normalizes date keys for filtering.
- `lib/inventory.js` — finds products, checks sellable stock, reserves/releases stock, and summarizes inventory.
- `lib/invoice.js` — computes invoice figures and renders printable invoice HTML.
- `lib/ledger.js` — looks up customers and manages Khata balances and settlements.
- `lib/orders.js` — adds, finds, cancels, and filters orders.
- `lib/pricing.js` — computes subtotal, discount, per-line GST, and order totals.
- `lib/reports.js` — builds dashboard summaries and compares stored order figures with invoice figures.
- `lib/store.js` — reads and writes `data/db.json` and appends audit entries.
- `lib/tax.js` — resolves item GST rates and splits GST into CGST and SGST.

## Commands
- Start the app: `npm start` (runs `node server.js`).
- Run tests: `node --test`.

## Rules
1. Write characterization tests before changing behaviour.
2. Change only the module(s) the ticket is about.
3. Tests never read or write `data/db.json`; use in-memory data.
4. Add no dependencies.
5. Make the smallest fix that works.

## Current ticket
- Invoice total and GST breakdown do not match what the customer was billed.
- Allowed files: `lib/invoice.js` (`lib/tax.js` only if truly needed).
