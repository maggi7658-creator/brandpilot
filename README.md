# BrandPilot — Trust Before Publish
### Complete AI-Powered Brand Governance Platform

> **"Every word matters. Every claim needs trust."**  
> AI assists with checking and recommendations; an authorised human makes the required final approval decision.

---

### 🏆 Mandatory Attribution
* **Crafted with care by:** **CH. ANUHYA · Team ALTO**
* **Product Identity:** **BrandPilot — Trust Before Publish**
* **Designed & Developed by:** **CH. ANUHYA | Team ALTO**

---

## 1. Executive Summary & Problem Statement

Organizations publish content across websites, advertising campaigns, social channels, and press releases at high velocity. Even with established brand guidelines and SLAs, manual reviews are frequently delayed, inconsistent, and scattered across fragmented chat and email threads.

Consequently, organizations publish:
* **Unsupported, misleading, or outdated claims** (e.g. absolute uptime promises that conflict with actual SLAs).
* **Restricted or unapproved terminology** that undermines premium market positioning.
* **Inconsistent brand voice and colloquial slang** across sensitive enterprise channels.
* **Missing mandatory legal disclosures** regarding maintenance exceptions and warranties.

**BrandPilot** solves this challenge by establishing an evidence-grounded review process:
1. Ingests content from text copy, documents (PDF/DOCX), or public URLs.
2. Compares statements against approved brand guidelines and SLAs using Retrieval-Augmented Generation (RAG).
3. Produces explainable findings with exact quoted source passages, confidence ratings, and suggested rewrites.
4. Enforces strict human approval gates: Content creators cannot self-approve; new revisions invalidate prior approvals; and high-risk claims require designated legal sign-off.

---

## 2. Technology Stack

* **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, TanStack Query v5, Framer Motion.
  * **Design**: Light mode only (`#F7FAFF` canvas, `#FFFFFF` surfaces, `#4169E1` royal blue, `#15A99A` teal accent, restrained glassmorphism).
* **Backend**: Python 3.14, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic migrations, Pytest.
* **Database**: PostgreSQL (production) with SQLite fallback for zero-friction local development.
* **AI & RAG Engine**:
  * Semantic passage chunking and citation retrieval.
  * Google Gemini API (`google-genai` SDK) with automatic fallback to a local deterministic governance engine.
* **Document Processing**: `pypdf` (PDF), `python-docx` (Word), `httpx` + `BeautifulSoup4` (SSRF-protected web scraper).

---

## 3. Pre-Configured Demo Personas (One-Click Evaluation)

All accounts share the default demonstration password: `Password123!`

| Role | Persona Name | Email | Permissions & Responsibilities |
|---|---|---|---|
| **Content Creator** | Sarah Chen | `creator@brandpilot.local` | Drafts content, uploads files, triggers AI checks, edits revisions. **Cannot self-approve.** |
| **Brand Manager** | Marcus Vance | `reviewer@brandpilot.local` | Inspects claims, reviews brand voice, requests changes, grants marketing sign-off. |
| **Legal & Compliance** | Elena Rostova | `legal@brandpilot.local` | Assesses high-risk claims, SLA discrepancies, and mandatory regulatory disclosures. |
| **Administrator** | David Sterling | `admin@brandpilot.local` | Manages approved guidelines, terminology rules, brand assets, and user roles. |

---

## 4. Section 19 Demonstration Scenario Walkthrough

BrandPilot comes pre-loaded with the exact illustrative campaign scenario specified in the master requirements:

1. **The Grounding Guideline**:
   * *Document*: `Acme Global Service Availability & SLA Policy (v2.4, Effective: 2026-01-01)`
   * *Section 1*: *"We commit to a 99.9% monthly uptime target across standard production regions... Statements describing service availability as '100%' or 'always available' are strictly prohibited."*
   * *Section 2*: Excludes scheduled maintenance windows announced with 48 hours notice.
2. **The Submitted Campaign Copy**:
   > *"Our service is always available. We provide cheap and fast compute with our artificial intelligence bot that gives insane performance without any risk."*
3. **BrandPilot's Grounded Findings**:
   * **Claim Conflict (Critical)**: Flags *"always available"*, quotes Section 1 of the SLA policy, explains the conflict with the 99.9% target, and suggests: *"engineered for 99.9% uptime availability with enterprise redundancy"*.
   * **Restricted Terminology (Medium)**: Flags *"cheap"*, quotes corporate terminology rule, and suggests: *"cost-effective"*.
   * **Unapproved Phrase (Medium)**: Flags *"artificial intelligence bot"*, suggests approved product designation *"AI Assistant"*.
   * **Tone Issue (Medium)**: Flags *"insane"* as colloquial slang for an advertising channel.
   * **Missing Disclosure (High)**: Flags absence of standard SLA maintenance qualifications.
4. **Creator Revision**:
   * Creator applies suggestions in the Revision Studio and clicks **"Save Revision (Creates v2)"**.
   * Prior approvals are automatically invalidated.
5. **Human Approval Gate**:
   * Sarah Chen (Creator) is blocked from self-approving.
   * Marcus Vance (Manager) and Elena Rostova (Legal) record their decisions with rationale.
   * Content is marked **Ready to Publish** only after human sign-off.
   * Full history and audit trail are permanently logged.

---

## 5. Quick Start & Setup

### Prerequisites
* Node.js v18+ (tested on Node v24)
* Python 3.10+ (tested on Python 3.14)

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate   # On Windows
# source venv/bin/activate # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations & seed demo dataset
alembic upgrade head
python -c "from app.db.session import SessionLocal; from seed_data import seed_database; db = SessionLocal(); seed_database(db); db.close()"

# Run automated tests
pytest tests/test_backend.py -v

# Start FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API runs at `http://127.0.0.1:8000` (Swagger docs at `/docs`).

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 6. Architecture & Security Highlights

* **Light Mode Exclusivity**: Adheres strictly to the light palette requirement (`#F7FAFF`, `#FFFFFF`, `#4169E1`, `#15A99A`). No dark theme.
* **SSRF Protection**: URL extraction engine prevents connections to private IP spaces (RFC 1918), loopback interfaces, and cloud metadata (`169.254.169.254`).
* **Self-Approval Prevention**: Enforced at the FastAPI route and database layer. Attempted bypasses are intercepted and logged to the audit trail.
* **Explainability Guarantee**: Every finding includes quoted reference evidence and confidence levels. When supporting evidence cannot be found, BrandPilot explicitly reports the limitation.

---

### Attribution Notice
* **Designed & Developed by:** **CH. ANUHYA | Team ALTO**
* **BrandPilot — Trust Before Publish**
