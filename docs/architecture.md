# BrandPilot Architecture Specification

## 1. System Overview

**BrandPilot — Trust Before Publish** is an enterprise AI brand-governance platform designed to review corporate communications against approved guidelines, verified reference documents, and legal requirements prior to public release.

### Core Architectural Principle
> **AI assists with checking and recommendations; an authorised human makes the required final approval decision.**

BrandPilot never automatically publishes content, nor does it treat model-generated outputs as unquestionable proof.

---

## 2. Technology Stack

* **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, TanStack Query v5, Framer Motion.
* **Backend**: Python 3.14, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic migrations.
* **Database**: PostgreSQL (production) with SQLite zero-friction fallback for development and local testing.
* **AI & RAG Pipeline**:
  * Semantic passage chunking and indexing.
  * Inverted token & passage similarity retrieval.
  * Structured JSON output adhering to validated Pydantic schemas.
  * Google Gemini integration (`google-genai` SDK) with deterministic, policy-grounded fallback.
* **Document Processing**: `pypdf` for PDF parsing, `python-docx` for Word documents, `httpx` + `BeautifulSoup4` for URL parsing with Server-Side Request Forgery (SSRF) protections.

---

## 3. Data Flow & Review Journey

```
Creator Draft (Text/PDF/DOCX/URL)
             │
             ▼
[Document Ingestion & SSRF Check]
             │
             ▼
[RAG Evidence Retrieval Engine] ◄── [Approved Guidelines, SLAs & Terminology Rules]
             │
             ▼
[AI Governance Analysis (Gemini / Deterministic)]
             │
             ▼
[Explainable Findings with Source Passages & Rewrites]
             │
             ▼
[Creator Revision Studio (Creates vN+1)] ──► Invalidates prior approvals
             │
             ▼
[Reviewer / Legal Approval Gate] ──► Enforces no self-approval
             │
             ▼
[Final Authorized Human Sign-Off] ──► Status: Ready to Publish
```

---

## 4. Role-Based Access Control (RBAC)

1. **Content Creator (`CREATOR`)**:
   * Creates submissions, uploads files, triggers reviews, accepts/edits suggestions.
   * **Explicit Restriction**: Cannot approve their own submissions.
2. **Brand Reviewer / Manager (`REVIEWER`)**:
   * Inspects evidence, requests revisions, grants marketing approvals.
3. **Legal & Compliance (`LEGAL`)**:
   * Mandatory approval routing for high-risk claims, SLA discrepancies, and missing disclosures.
4. **Administrator (`ADMIN`)**:
   * Manages approved guidelines, terminology rules, brand assets, and user roles.
