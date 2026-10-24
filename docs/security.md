# BrandPilot Security & Privacy Model

## 1. Authentication & Sessions
* Cryptographic password hashing using PBKDF2 HMAC SHA-256 with 100,000 rounds and random salt.
* Stateless JSON Web Tokens (JWT) signed with HS256 and configurable expiration.
* Token validation enforced per request on protected `/api/v1/*` routes.

## 2. Server-Side Request Forgery (SSRF) Protection
* Target URLs submitted for web scraping are strictly checked before connection.
* Blocks internal private IPv4 ranges (RFC 1918): `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.
* Blocks loopback addresses: `127.0.0.1`, `localhost`, `::1`.
* Blocks cloud metadata services: `169.254.169.254`, `metadata.google.internal`.

## 3. Separation of Duties & Anti-Tamper Gates
* Content creators cannot approve their own submissions (`creator_id != actor_id`).
* High-risk sensitivity content mandates explicit Legal or Compliance sign-off.
* Material modifications create version N+1 and invalidate prior approvals.
* Append-only audit logging: review decisions, findings, and publishing actions are persisted immutably.

## 4. Multi-Tenant Workspace Isolation
* All database queries filter on `workspace_id`.
* Cross-workspace resource inspection or mutation is blocked by backend middleware.
