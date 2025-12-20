# Monetization Plan - Mardi Gras Parade Game

**Status:** Internal Planning Document  
**Last Updated:** 2024-12-20  
**License Note:** This game is currently under Business Source License 1.1, converting to MIT on 2028-12-20.

---

## Executive Summary

This document outlines the monetization strategy for the Mardi Gras Parade Game. The approach is a **Freemium model** with optional cosmetic upgrades and premium features that enhance the experience without creating pay-to-win mechanics.

---

## Business Model: Freemium

### Free Tier
- Full gameplay access
- Basic collectibles (beads, doubloons, cups)
- Standard floats and parade experience
- Local leaderboards
- Basic avatar customization

### Premium Features (Potential Revenue Streams)

#### 1. Cosmetic Upgrades ($0.99 - $4.99)
- **Premium Float Designs**: Historic Krewe floats, celebrity-themed floats
- **Special Effects**: Particle effects for catches, custom throw animations
- **Avatar Customization**: Unique costumes, accessories, emotes
- **Collectible Skins**: Golden beads, jeweled doubloons, custom cup designs

#### 2. Season Pass ($9.99/season)
- Exclusive seasonal collectibles
- Early access to new features
- Bonus XP and progression multipliers
- Exclusive krewe memberships
- Premium leaderboard badges

#### 3. Virtual Krewe Membership ($4.99/month or $39.99/year)
- Ad-free experience (if ads are implemented)
- Access to exclusive krewe-themed events
- Premium chat features and social tools
- Custom krewe badges and titles
- Priority support

#### 4. Special Events & Limited Editions ($2.99 - $9.99)
- Limited-time themed events (e.g., "King Cake Festival")
- Exclusive collectibles available only during events
- Special parade routes or float combinations
- Commemorative digital collectibles for real-world Mardi Gras dates

---

## Product Ideas & Features

### Phase 1: Core Monetization (Q1 2025)
1. **Basic Cosmetics Shop**
   - 10-15 initial cosmetic items
   - Simple in-game currency (Krewe Coins)
   - Purchase with real money or earn through gameplay

2. **Premium Avatar System**
   - Customizable character appearances
   - Unlock premium costumes and accessories
   - Mix-and-match system

### Phase 2: Engagement & Retention (Q2 2025)
1. **Season Pass System**
   - 3-month seasonal content drops
   - Battle pass style progression
   - Free and premium tracks

2. **Social Features**
   - Friend lists and challenges
   - Krewe creation (guild system)
   - Cooperative catch challenges

### Phase 3: Advanced Features (Q3-Q4 2025)
1. **NFT/Digital Collectibles** (Optional, if market viable)
   - Limited edition commemorative throws
   - Verifiable ownership of rare items
   - Trading marketplace

2. **Live Events**
   - Synchronized events during actual Mardi Gras season
   - Real-time competitions with prizes
   - Celebrity or brand partnerships

---

## Pricing Strategy

### Price Points
- **Micro-transactions:** $0.99 - $2.99 (impulse purchases)
- **Standard Items:** $4.99 - $9.99 (cosmetics, bundles)
- **Premium Bundles:** $19.99 - $29.99 (seasonal packs)
- **Subscription:** $4.99/month or $39.99/year (VIP membership)

### Bundle Strategy
- Starter Pack: $4.99 (high-value entry offer)
- Seasonal Bundle: $19.99 (best value per item)
- Collector's Edition: $29.99 (exclusive items + season pass)

### Currency System
- **Krewe Coins** (earned through gameplay)
- **Premium Krewe Coins** (purchased with real money)
- Conversion rate: 100 Premium Coins = $0.99

---

## Technical Implementation

### Payment Integration: Stripe

#### Setup
```typescript
// Example Stripe integration structure
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Product catalog
interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  type: 'cosmetic' | 'subscription' | 'bundle';
  stripePriceId: string;
}
```

#### Payment Flow
1. User selects item in shop
2. Frontend creates checkout session via API
3. Stripe handles payment processing
4. Webhook confirms payment
5. Server updates user inventory/entitlements
6. Client receives confirmation and updates UI

### Database Schema

#### Tables to Add

```sql
-- Users table (extend existing)
ALTER TABLE users ADD COLUMN premium_member BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN subscription_expires_at TIMESTAMP;
ALTER TABLE users ADD COLUMN krewe_coins INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN premium_coins INTEGER DEFAULT 0;

-- Purchases table
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id VARCHAR(255) NOT NULL,
  stripe_payment_id VARCHAR(255) UNIQUE,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  purchased_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- User inventory table
CREATE TABLE user_inventory (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  item_type VARCHAR(50) NOT NULL,
  item_id VARCHAR(255) NOT NULL,
  acquired_at TIMESTAMP DEFAULT NOW(),
  equipped BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  UNIQUE(user_id, item_type, item_id)
);

-- Products catalog table
CREATE TABLE products (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  stripe_price_id VARCHAR(255),
  available_from TIMESTAMP,
  available_until TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Drizzle ORM Schema (TypeScript)

```typescript
// shared/schema.ts additions
import { pgTable, serial, integer, varchar, boolean, timestamp, text, jsonb } from 'drizzle-orm/pg-core';

export const purchases = pgTable('purchases', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  productId: varchar('product_id', { length: 255 }).notNull(),
  stripePaymentId: varchar('stripe_payment_id', { length: 255 }).unique(),
  amountCents: integer('amount_cents').notNull(),
  currency: varchar('currency', { length: 3 }).default('USD'),
  status: varchar('status', { length: 50 }).default('pending'),
  purchasedAt: timestamp('purchased_at').defaultNow(),
  metadata: jsonb('metadata'),
});

export const userInventory = pgTable('user_inventory', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  itemType: varchar('item_type', { length: 50 }).notNull(),
  itemId: varchar('item_id', { length: 255 }).notNull(),
  acquiredAt: timestamp('acquired_at').defaultNow(),
  equipped: boolean('equipped').default(false),
  metadata: jsonb('metadata'),
});

export const products = pgTable('products', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  priceCents: integer('price_cents').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  stripePriceId: varchar('stripe_price_id', { length: 255 }),
  availableFrom: timestamp('available_from'),
  availableUntil: timestamp('available_until'),
  isActive: boolean('is_active').default(true),
  metadata: jsonb('metadata'),
});

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }).unique(),
  status: varchar('status', { length: 50 }).notNull(),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### API Endpoints

```typescript
// server/routes.ts additions

// Shop endpoints
app.get('/api/shop/products', async (req, res) => {
  // Return available products
});

app.post('/api/shop/checkout', async (req, res) => {
  // Create Stripe checkout session
});

app.post('/api/shop/webhook', async (req, res) => {
  // Handle Stripe webhooks
});

// Inventory endpoints
app.get('/api/inventory/:userId', async (req, res) => {
  // Get user's inventory
});

app.post('/api/inventory/equip', async (req, res) => {
  // Equip/unequip items
});

// Subscription endpoints
app.get('/api/subscription/:userId', async (req, res) => {
  // Get subscription status
});

app.post('/api/subscription/cancel', async (req, res) => {
  // Cancel subscription
});
```

---

## Revenue Projections

### Conservative Estimates (Year 1)

**Assumptions:**
- 10,000 monthly active users by end of Year 1
- 2% conversion rate to paying customers
- Average transaction value: $7.50

**Monthly Revenue:**
- Paying users: 200
- Revenue per paying user: $7.50
- **Monthly Revenue: $1,500**

**Annual Revenue: ~$18,000**

### Optimistic Estimates (Year 1)

**Assumptions:**
- 50,000 monthly active users
- 5% conversion rate
- Average transaction value: $12.00

**Monthly Revenue:**
- Paying users: 2,500
- Revenue per paying user: $12.00
- **Monthly Revenue: $30,000**

**Annual Revenue: ~$360,000**

### Year 2-3 Growth
With improved retention, seasonal events, and marketing:
- 15% month-over-month user growth
- Increased conversion rate to 7-10%
- Higher average transaction value through bundles

---

## Key Performance Indicators (KPIs)

### User Metrics
- Monthly Active Users (MAU)
- Daily Active Users (DAU)
- DAU/MAU ratio (target: >0.20)
- Average session length
- Retention rates (D1, D7, D30)

### Monetization Metrics
- Conversion rate (free → paying)
- Average Revenue Per User (ARPU)
- Average Revenue Per Paying User (ARPPU)
- Lifetime Value (LTV)
- Customer Acquisition Cost (CAC)
- LTV:CAC ratio (target: >3:1)

### Product Metrics
- Shop visit rate
- Purchase completion rate
- Cart abandonment rate
- Item popularity rankings
- Subscription churn rate

---

## Roadmap

### Q1 2025: Foundation
- [ ] Integrate Stripe payment system
- [ ] Implement database schema for purchases/inventory
- [ ] Build basic shop UI
- [ ] Create initial cosmetic items (10-15)
- [ ] Set up analytics tracking
- [ ] Launch premium avatar system

### Q2 2025: Expansion
- [ ] Launch Season Pass 1
- [ ] Implement subscription system
- [ ] Add 20+ new cosmetic items
- [ ] Build social features (friends, krewes)
- [ ] Launch first special event
- [ ] A/B test pricing strategies

### Q3 2025: Optimization
- [ ] Analyze first 6 months of data
- [ ] Optimize pricing based on user behavior
- [ ] Launch limited edition collectibles
- [ ] Implement referral rewards program
- [ ] Expand marketing efforts
- [ ] Add bundle offerings

### Q4 2025: Scale
- [ ] Prepare for Mardi Gras 2026 season
- [ ] Launch major update with new features
- [ ] Explore partnership opportunities
- [ ] Consider NFT/blockchain integration (if viable)
- [ ] Plan Year 2 content roadmap

---

## Risks & Mitigation

### Risk 1: Low Conversion Rate
**Mitigation:**
- Offer compelling value in free tier
- Create attractive entry-level offers ($0.99 - $2.99)
- Use limited-time promotions
- Implement referral bonuses

### Risk 2: User Backlash (Pay-to-Win Concerns)
**Mitigation:**
- Keep all monetization cosmetic only
- Ensure free players have full gameplay access
- Be transparent about monetization model
- Listen to community feedback

### Risk 3: Technical Implementation Challenges
**Mitigation:**
- Start with simple Stripe integration
- Use proven payment flows
- Extensive testing before launch
- Gradual rollout with beta testing

### Risk 4: Market Saturation
**Mitigation:**
- Leverage unique Mardi Gras theme
- Focus on authentic New Orleans culture
- Build strong community engagement
- Regular content updates

---

## Next Steps

### Immediate (Next 30 Days)
1. Set up Stripe test account
2. Design initial product catalog
3. Create mockups for shop UI
4. Finalize pricing strategy
5. Begin database schema implementation

### Short-term (Next 90 Days)
1. Implement basic shop functionality
2. Create first 10 cosmetic items
3. Set up payment processing and webhooks
4. Build inventory management system
5. Launch closed beta for premium features

### Mid-term (Next 180 Days)
1. Public launch of premium features
2. Monitor metrics and gather feedback
3. Iterate based on user behavior
4. Plan Season Pass content
5. Build marketing materials

---

## Legal & Compliance

### Requirements
- [ ] Privacy policy update for payment data
- [ ] Terms of service update for purchases
- [ ] GDPR compliance for EU users
- [ ] COPPA compliance (if targeting under 13)
- [ ] Stripe merchant agreement
- [ ] Sales tax collection setup
- [ ] Refund policy documentation

### Consumer Protection
- Clear pricing and value communication
- Easy refund process for eligible purchases
- No deceptive practices
- Age-appropriate content and pricing
- Parental controls for in-app purchases

---

## Contact & Ownership

**Document Owner:** Nola Developer Incubator  
**Review Cycle:** Quarterly  
**Confidentiality:** Internal Use Only

For questions or suggestions regarding this monetization plan, contact the project maintainers.

---

*This document is subject to change as the product evolves and market conditions shift. All projections are estimates and not guarantees.*
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
