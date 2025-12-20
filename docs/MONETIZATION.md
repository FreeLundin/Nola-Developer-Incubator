# Monetization Plan — MardiGrasParadeGame

Status: Draft internal strategy. This document outlines product, technical, legal, go-to-market, and metrics plans for implementing a freemium monetization model with optional organizer SaaS.

Summary / High-level approach
- Primary model: Freemium — keep core parade simulator free to play to drive adoption.
- Monetize with: cosmetic microtransactions, paid float/map packs, season passes, and an optional Organizer SaaS (hosted dashboard for events).
- License: Code is released under a Business Source License (BSL) with a Change Date (see LICENSE). After the Change Date the code will be relicensed to the open-source license chosen in the BSL text.

Monetization product ideas (MVP)
1. Cosmetic Items (low friction)
   - Float skins, character costumes, special bead styles.
   - Price: $0.99–$3.99 per item.

2. Content Packs
   - Themed float packs or route maps.
   - Price: $4.99–$14.99 per pack.

3. Season Pass / Battle Pass
   - Seasonal access to limited-time content and challenges.
   - Price: $9.99–$29.99/year.

4. Organizer SaaS (higher ARPU)
   - Hosted features: branded parades, scheduling, attendee analytics, custom float uploads, and white-label event pages.
   - Price tiers: $29/month starter, $99/month standard, $199/month enterprise (custom).

5. Sponsored Floats & In-game Ads (optional)
   - Partner brands can sponsor floats or event locations.
   - Implement carefully to avoid harming UX.

Payments & Provider
- Use Stripe for web payments:
  - Checkout sessions for one-time purchases.
  - Subscriptions for season passes and SaaS tiers.
  - Webhook handling for asynchronous events (invoice.paid, checkout.session.completed).
- For mobile app versions:
  - Use platform in-app purchases (Apple App Store, Google Play) and adapt revenue split & compliance.

Technical implementation (MVP)
1. Feature gating and entitlements
   - Add server-side entitlements table to track user purchases.
   - Middleware to check entitlements before enabling premium features.

2. DB schema (Drizzle migration skeleton)
   - users(id, email, created_at)
   - products(id, sku, name, price, type)
   - purchases(id, user_id, product_id, stripe_session_id, status, created_at)
   - entitlements(id, user_id, product_id, expires_at)

3. Server endpoints (skeleton)
   - POST /api/checkout/session — create Stripe Checkout session for product
   - POST /api/webhooks/stripe — webhook endpoint to receive checkout sessions and subscription events
   - GET /api/user/entitlements — list active entitlements for the current user

4. Client flow
   - Add Buy buttons for items which call server to create Stripe checkout.
   - After completion, server updates purchases and entitlements; client fetches entitlements to unlock features.

5. Admin panel (skeleton)
   - A protected admin route to manage products, view purchases, and manage refunds.

Operational & security considerations
- Do not store raw payment data; use Stripe's Checkout and webhooks to stay out of PCI scope.
- Use GitHub Secrets for staging/prod STRIPE_SECRET keys and include test keys locally in .env.
- Add logs and monitoring for webhook failures; follow Stripe webhook replay handling.

Metrics / KPIs
- Conversion rate (free -> paid)
- ARPU (average revenue per user)
- Retention / churn (subscriptions)
- CAC (customer acquisition cost) and LTV
- % of active users with entitlements

Roadmap & milestones (first 3 months)
- Week 0–2: Implement entitlement schema & basic server checkout endpoint + webhook skeleton.
- Week 3–4: Add client Buy flow and gating for one cosmetic item.
- Week 5–6: Add Stripe subscription flow for Season Pass (test-only).
- Week 7–8: Add admin UI and dashboard to view purchases.
- Week 9–12: Add marketing landing page, pricing page, and soft-launch.

Pricing suggestions
- Single cosmetic: $0.99
- Premium float/map pack: $4.99–$9.99
- Annual season pass: $9.99–$29.99
- Organizer SaaS: $29–$199/month (tiered)

Legal & licensing
- Repository is released under a Business Source License (BSL). The BSL restricts commercial distribution before the Change Date unless a commercial license is obtained.
- All commercial plans should be reviewed by legal counsel prior to public release.

Testing & QA
- Add Playwright E2E that covers the purchase flow using Stripe test keys (simulate redirect flow).
- Add unit tests for entitlement checks.

Marketing & Growth
- Launch a landing page targeting event organizers.
- Seasonal item drops and limited-time events to boost purchases and retention.
- Partnerships with local New Orleans brands / organizers for sponsored events.

Open questions
- Confirm Change Date for the BSL (I used 2028-12-20 in the draft — change to a different date?).
- Decide on the post-Change license (Apache-2.0 recommended).
- Confirm Stripe account & VAT tax requirements for target markets.

Contacts & next steps
- Engineering: implement the entitlement DB + Stripe integration (server).
- Product: design 3 cosmetic items and 1 pack for the MVP.
- Legal/Finance: confirm license text, tax & Stripe merchant setup.
