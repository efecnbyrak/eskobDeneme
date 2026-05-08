# AGENTS.md — Multi-Platform API-First Commerce System

## Project Vision
A scalable marketplace platform (Trendyol + Shopify hybrid):
- Businesses manage storefronts, products, services, bookings
- Customers discover, purchase, and interact via web + mobile

**Stack:** Next.js 16 (App Router) · Neon PostgreSQL · Prisma 7 · NextAuth v5  
**Clients:** Web + Mobile (React Native / Expo) consuming same `/api`

---

# 1. CORE ARCHITECTURE PRINCIPLES

## API-First System
- Every feature MUST start with API design
- Business logic NEVER lives in UI
- API is single source of truth

## Platform Agnostic Logic
- No browser APIs in backend logic
- No React/Next imports in services
- Services must be runtime-agnostic

## Separation of Concerns
app/api/ → HTTP only  
lib/services/ → business logic  
lib/db.ts → database layer  
components/ → UI only  

---

# 2. FEATURE FLOW (STRICT)

1. Define API contract
2. Write service logic
3. Implement API route
4. Build Web UI
5. Verify Mobile compatibility

---

# 3. API RULES

Response format:
```ts
{ success: true, data: T }
{ success: false, error: string }