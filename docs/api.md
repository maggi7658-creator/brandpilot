# BrandPilot REST API Reference

Base URL: `/api/v1`
Interactive Swagger Docs: `http://localhost:8000/docs`

## Authentication

* `POST /api/v1/auth/login`: Login with email and password, returns signed JWT.
* `POST /api/v1/auth/register`: Create account (default role: `CREATOR`).
* `GET /api/v1/auth/me`: Fetch authenticated user profile.
* `GET /api/v1/auth/demo-personas`: Retrieve pre-configured evaluation personas.

## Submissions & Content Reviews

* `POST /api/v1/submissions`: Submit copy for review (text, uploaded file, or URL).
* `POST /api/v1/submissions/upload`: Multipart upload for `.pdf`, `.docx`, `.txt`, and images.
* `GET /api/v1/submissions`: List submissions in active workspace.
* `GET /api/v1/submissions/{id}`: Detailed view with versions, findings, and decisions.
* `POST /api/v1/submissions/{id}/analyze`: Trigger AI governance review on current version.
* `POST /api/v1/submissions/{id}/revisions`: Create version N+1 with revised content (invalidates prior approvals).

## Findings & Approvals

* `PATCH /api/v1/reviews/findings/{id}`: Update finding resolution status (`open`, `accepted`, `rejected`, `resolved`).
* `POST /api/v1/approvals/submissions/{id}/decision`: Record human reviewer decision (`APPROVE`, `REQUEST_CHANGES`, `APPROVE_WITH_CONDITIONS`, `REJECT`).
* `POST /api/v1/approvals/submissions/{id}/publish`: Final human authorization marking submission `READY_TO_PUBLISH`.

## Guidelines & Terminology

* `GET /api/v1/guidelines`: List approved guidelines.
* `POST /api/v1/guidelines`: Upload new guideline (auto-chunks into semantic passages).
* `GET /api/v1/guidelines/terminology`: List prohibited/preferred terminology rules.
* `POST /api/v1/guidelines/terminology`: Add terminology rule.
* `GET /api/v1/guidelines/assets`: List authorized brand assets.

## Governance & Analytics

* `GET /api/v1/analytics/summary`: Aggregate metrics, findings by category, and severity breakdown.
* `GET /api/v1/audit/events`: Immutable append-only audit trail.
* `GET /api/v1/users`: List workspace members.
* `PATCH /api/v1/users/{id}/role`: Admin endpoint to update user roles.
