# Architecture Guide — Multi-Platform API-First System

> This project is ~30–40% complete. Existing code must not be broken. All new development follows the rules below.

---

## Primary Goal

Every feature must work for **both**:
- Web (Next.js)
- Mobile (future Flutter / Native)

---

## Mandatory Architecture Rules

### 1. API-First Development
- Every feature starts with an API design — no exceptions.
- Business rules live in the backend/API layer, never in UI components.

### 2. Mobile Compatibility by Default
- Every API must be consumable by web and mobile clients equally.
- No browser-dependent or web-only business logic.

### 3. Backward Compatibility
- The existing system must remain functional.
- New architecture wraps or extends existing code — does not rewrite it.

### 4. Feature Development Flow (strict order)

```
STEP 1 → Define API contract (request + response shape)
STEP 2 → Implement backend / service logic
STEP 3 → Connect web frontend (Next.js)
STEP 4 → Verify mobile readiness (no UI assumptions in API)
```

### 5. Standard API Response Format

```json
{
  "success": boolean,
  "data": any,
  "error": string | null
}
```

All endpoints must return this shape — no exceptions.

### 6. Versioned API Structure

```
/api/v1/...
```

All new endpoints go under `/api/v1/`. Existing non-versioned routes may stay until refactored.

### 7. Separation of Concerns

```
app/api/v1/<resource>/route.ts   ← Controller (HTTP layer only)
lib/services/<resource>.ts       ← Service (business logic)
lib/db.ts                        ← Database layer (Prisma/Neon)
```

No business logic inside frontend components or API route handlers directly.

### 8. Platform-Agnostic Design
- No `window`, `document`, or browser APIs inside core business logic.
- No React/Next.js imports inside service files.
- Services must be callable from any runtime (Node, edge, future NestJS).

### 9. Auth System
- Token-based (JWT or NextAuth session mapped to JWT for mobile).
- Mobile clients use `Authorization: Bearer <token>` header.
- Web clients may use cookies — but the underlying auth logic must be shared.

### 10. Future Scalability Targets
- Services must be extractable into a standalone NestJS backend without rewrite.
- Architecture must support microservices decomposition later.
- Mobile app launch must require zero backend changes.

---

## Critical Rule

> If any new code is not mobile-compatible or violates API-first design, it must be refactored **before** the feature is considered complete.

---

## Directory Layout (target state)

```
app/
  api/
    v1/
      auth/
      esnaf/
      hizmetler/
      randevular/
      yorumlar/
  (public)/       ← web: customer-facing pages
  (dashboard)/    ← web: artisan dashboard pages

lib/
  services/       ← platform-agnostic business logic
  db.ts
  auth.ts
  utils.ts
```
