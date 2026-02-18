# Web Push MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver true background prayer notifications via Web Push so users receive notifications on Android/iOS (installed PWA) even when the app is closed.

**Architecture:** Keep a single Next.js codebase. Use Next API routes as backend endpoints to register/unregister subscriptions in PostgreSQL and send test pushes. Add a worker script (run by Dokploy cron) that checks current Kuala Lumpur minute, resolves due prayer by zone, and sends push payloads through VAPID using stored subscriptions.

**Tech Stack:** Next.js App Router, TypeScript, PostgreSQL (`pg`), Web Push (`web-push`), Bun tests.

---

### Task 1: Shared push domain logic (TDD)

**Files:**
- Create: `app/lib/pushScheduler.ts`
- Create: `app/lib/pushScheduler.test.ts`

Steps:
1. Write failing tests for due-prayer resolution and delivery-key generation.
2. Run `bun test app/lib/pushScheduler.test.ts` and confirm failure.
3. Implement minimal logic.
4. Re-run the same test and confirm pass.

### Task 2: Backend storage + VAPID service (TDD where practical)

**Files:**
- Create: `app/lib/server/database.ts`
- Create: `app/lib/server/pushStore.ts`
- Create: `app/lib/server/webPush.ts`
- Create: `app/lib/server/pushStore.test.ts` (validation-focused unit tests)

Steps:
1. Add failing tests for payload/validation helpers in `pushStore`.
2. Run focused tests and verify failure.
3. Implement DB pool + subscription upsert/list/disable helpers and VAPID sender wrapper.
4. Re-run tests and verify pass.

### Task 3: API routes for subscribe/unsubscribe/test

**Files:**
- Create: `app/api/push/subscribe/route.ts`
- Create: `app/api/push/unsubscribe/route.ts`
- Create: `app/api/push/test/route.ts`

Steps:
1. Implement request validation and DB integration.
2. Add safe error responses (400/500) and node runtime declarations.
3. Verify build/lint passes for route handlers.

### Task 4: Client + service worker push integration

**Files:**
- Update: `public/sw.js`
- Create: `app/lib/webPushClient.ts`
- Update: `app/sections/PrayerNotificationSection.tsx`

Steps:
1. Add SW `push` and `notificationclick` listeners.
2. Implement browser subscribe/unsubscribe helpers using VAPID public key.
3. Wire UI enable/disable to backend subscription APIs.
4. Keep existing on-page notification fallback logic as optional/non-breaking.

### Task 5: Scheduled sender worker for Dokploy

**Files:**
- Create: `scripts/sendPrayerPushes.mts`
- Update: `package.json`

Steps:
1. Build script that fetches due prayer per zone and sends pushes.
2. Add dedupe key handling via DB log table.
3. Add npm script command for Dokploy cron invocation.

### Task 6: Schema + docs + env

**Files:**
- Create: `docs/sql/push_notifications.sql`
- Update: `README.md`

Steps:
1. Add PostgreSQL schema for subscriptions + delivery log.
2. Document required env vars and Dokploy service setup.
3. Add iOS requirement note (PWA install required for push).

### Task 7: Verification

**Files:**
- N/A

Steps:
1. Run focused tests for new modules.
2. Run full test suite: `bun test`.
3. Run lint: `npm run lint`.
4. Run build: `npm run build`.
