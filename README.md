# BrandPilot — Trust Before Publish
### Complete AI-Powered Brand Governance Platform
**Every word matters. Every claim needs trust.**

> AI assists with checking and recommendations; an authorised human makes the required final approval decision.

---

### 🏆 Mandatory Attribution & Team Details
* **Project Name:** **BrandPilot — Trust Before Publish**
* **Team Name:** **ALTO** (Team Size: 2)
* **Team Leader:** **CHITHYALA ANUHYA** (`maggi7658@gmail.com`)
* **Team Member:** **SANDA RUPESH** (`sandarupesh4@gmail.com`)
* **Attribution Notice:** **Crafted with care by CHITHYALA ANUHYA & SANDA RUPESH · Team ALTO**

---

## 🌐 Live Deployment & Repository Links

* **Live Interactive Application (GitHub Pages)**: [**https://maggi7658-creator.github.io/brandpilot/**](https://maggi7658-creator.github.io/brandpilot/)
* **GitHub Source Code Repository**: [**https://github.com/maggi7658-creator/brandpilot**](https://github.com/maggi7658-creator/brandpilot)
* **Deployment Infrastructure**: Hosted globally via GitHub Pages with automated CI/CD via GitHub Actions.

---

## 🔑 One-Click Demonstration Personas

All demonstration accounts share the password: `Password123!`

| Role | Persona Name | Email | Primary Responsibilities & Permissions |
|---|---|---|---|
| **Content Creator** | Sarah Chen | `creator@brandpilot.local` | Drafts campaigns, uploads files, triggers AI checks, creates revisions. **Blocked from approving own submissions.** |
| **Brand Manager** | Marcus Vance | `reviewer@brandpilot.local` | Inspects claims, evaluates brand voice and tone, requests revisions, grants marketing sign-off. |
| **Legal & Compliance** | Elena Rostova | `legal@brandpilot.local` | Assesses high-risk claims, SLA discrepancies, and mandatory regulatory disclosures. |
| **Administrator** | David Sterling | `admin@brandpilot.local` | Manages approved guidelines, terminology rules, brand assets, and user access policies. |

---

## 1. Understanding of the Problem Statement

### Where trust begins to drift
Brand and communications teams often have approved guidelines, claims, terminology, source documents, and visual assets. The difficulty is that creators work across websites, campaigns, product experiences, social channels, presentations, and internal communications—often under time pressure and with different review paths. A small change in wording or imagery can introduce risk even when the original source material is accurate.

Manual review is frequently late-stage, inconsistent, and dependent on individual memory. Feedback may arrive as scattered comments across documents, email, chat, and approval tools. By the time an issue is found, the cost of revision is higher and ownership may be unclear.

### What can go wrong
The problem space includes:
* **Drift in tone and terminology** across marketing and sales channels.
* **Unsupported or outdated claims** (e.g. absolute uptime commitments that conflict with actual SLAs).
* **Misuse of visual assets** and inconsistent brand marks.
* **Accessibility gaps** in color contrast, structure, and alternative descriptions.
* **Unclear ownership and scattered approvals** leading to accountability voids.
* **Weak traceability and confidentiality concerns** during pre-publication stages.
* **The learning problem**: If the same issue appears repeatedly, organizations cannot tell whether the content creator is at fault or if the policy itself is ambiguous, contradictory, or difficult to find.

### The Technical Challenge
Technically, the review challenge combines:
1. **Deterministic policy checks** for explicit restricted terminology and regex rules.
2. **Retrieval of authoritative source passages** (RAG) over verified PDFs, DOCXs, and policy standards.
3. **Model-assisted interpretation** for nuanced voice, tone, and contextual alignment.
4. **Document and image analysis** for structure, alternative text, and brand asset verification.
5. **Workflow permissions and a durable audit trail** enforcing separation of duties.
Each layer has different confidence limits and is made explicitly visible rather than collapsed into an opaque score.

---

## 2. Who is Affected

| User Group | Current Friction | What BrandPilot Helps Them Do |
|---|---|---|
| **Content creators and designers** | Unclear feedback, late rework, scattered guidance, and uncertainty about which asset or wording is approved. | Submit work early, understand issues, revise with purpose-preserving suggestions, and see what remains unresolved. |
| **Brand or communications managers** | Inconsistent application of guidelines across channels and limited visibility into review queues. | Set policy boundaries, route reviews, and identify recurring sources of confusion. |
| **Legal, compliance, and subject-matter reviewers** | Repeated checks, weak source traceability, and difficulty distinguishing high-risk claims from style issues. | Review evidence-linked findings, focus attention on material risks, and record decisions with rationale. |
| **Marketing and product teams** | Pressure to move quickly while coordinating multiple owners and content formats. | Make review a visible part of the workflow without turning governance into a late-stage blocker. |
| **Leadership and audit stakeholders** | Limited auditability of who approved what, when, and against which source. | Access a concise history of versions, decisions, sources, unresolved issues, and governance patterns. |
| **End audiences** | Exposure to unclear, inaccurate, inaccessible, or inconsistent communication. | Receive content that is more understandable, inclusive, current, and aligned with the organisation's commitments. |

---

## 3. Proposed Solution & Core Design Principles

BrandPilot is proposed as a practical, explainable, human-in-the-loop platform for pre-publication brand governance. Before publishing, a creator submits a draft and its visual assets. BrandPilot compares the submission with approved brand guidance, verified source material, authorised assets, and relevant accessibility requirements.

Each finding explains why it matters, shows supporting evidence or a source citation where available, communicates uncertainty, and suggests a purpose-preserving next action. In the prototype, **BrandPilot never publishes autonomously. Only an authorised human approval can move an item to ready-to-publish.**

### Core Design Principles
1. **Human approval before publishing**: AI analyzes and recommends; designated humans make final decisions.
2. **Explainability over opaque scoring**: Findings show clear reasons and source citations rather than arbitrary aggregate numbers.
3. **Purpose-preserving suggestions**: Suggested rewrites preserve the creator's original intent.
4. **Evidence before assertion**: Claims must point to verified source documentation.
5. **Least-privilege access**: Content is segregated by workspace, role, and sensitivity level.
6. **Confidentiality by default**: Draft materials and unannounced campaigns are strictly protected.
7. **Uncertainty made visible**: When evidence is missing or ambiguous, BrandPilot explicitly marks it uncertain.
8. **Accessible review experiences**: Built according to accessibility best practices with keyboard navigation and high contrast.
9. **Learning from repeated issues without silently rewriting the rules**: Friction patterns inform governance policy updates transparently.

---

## 4. Complete End-to-End Product Workflow

```
Approved sources → Draft intake → Evidence-based checks → Explainable findings → Creator revision → Human review → Approval gate → Versioned audit trail → Governance insights
```

* **A. Workspace and policy setup**: Administrators add approved brand guidelines, terminology, claim sources, accessibility requirements, and reviewer roles with effective dates and review cycles.
* **B. Source verification and indexing**: Approved PDF, DOCX, and TXT materials are parsed, versioned, tagged by authority and effective date, and indexed for semantic chunk retrieval.
* **C. Draft intake**: Creators submit copy, documents, or URLs, selecting intended purpose, audience, channel, and sensitivity level.
* **D. Automated review**: Evaluates tone, terminology, message alignment, visual consistency, accessibility, unsupported claims, and missing disclosures.
* **E. Explainable findings**: Issue cards display issue type, severity, affected text, explanation, cited source passage, confidence level, and suggested rewrite.
* **F. Creator revision**: Creators accept, modify, or reject suggestions in the Revision Studio. Saving copy creates a new version (`v2`) and invalidates prior approvals.
* **G. Review and approval routing**: Work items route to designated reviewers based on channel and severity.
* **H. Version history and audit trail**: Retains draft versions, findings, decisions, reviewer identity, timestamps, cited sources, and change rationales.
* **I. Publishing handoff**: Explicit gate prevents release until all required approvals are recorded.
* **J. Learning and governance reporting**: Aggregated reports surface recurring friction, turnaround bottlenecks, and ambiguous guidelines.

---

## 5. Main Features Matrix

| Feature | How It Works | Why It Matters |
|---|---|---|
| **Approved-guideline and source library** | Stores approved guidance, terminology, claims, requirements, and metadata. | Creates a clear reference point for review. |
| **Retrieval-augmented checks over approved documents** | Retrieves relevant passages before model-assisted analysis. | Grounds findings in authorised material. |
| **Terminology and tone review** | Checks preferred terms, restricted language, and intended voice. | Reduces avoidable drift across channels. |
| **Message and claim verification** | Compares key messages and claims with approved evidence. | Helps reviewers focus on material statements. |
| **Unsupported-claim and outdated-claim detection** | Flags absolute, uncited, expired, or weakly supported wording. | Reduces preventable trust and compliance risks. |
| **Authorised asset and visual consistency checks** | Matches submitted assets against approved libraries and visual rules. | Helps prevent unauthorised or inconsistent imagery. |
| **Accessibility checks** | Reviews text, contrast, structure, and alternative text. | Builds inclusion into the review rather than adding it late. |
| **Explainable issue cards with source citations** | Shows affected content, reason, evidence, and suggested action. | Lets people understand and challenge a finding. |
| **Uncertainty and confidence handling** | Separates stronger evidence from model-assisted possibilities. | Discourages over-reliance on automated output. |
| **Purpose-preserving revision suggestions** | Offers editable alternatives while keeping intent visible. | Supports creators without silently rewriting their work. |
| **Creator, manager, and authorised reviewer roles** | Provides role-specific views, actions, and permissions. | Keeps responsibility and access understandable. |
| **Approval routing and human approval gate** | Routes work by issue type and sensitivity; blocks self-approval. | Maintains accountable human control. |
| **Version history and audit trail** | Records versions, findings, decisions, sources, and timestamps. | Improves traceability and handoffs. |
| **Confidentiality controls and role-based access** | Limits access by workspace, role, sensitivity, and policy. | Protects drafts and source material. |
| **Repeated-issue and unclear-guideline reporting** | Aggregates patterns without silently changing policy. | Turns recurring friction into governance learning. |
| **Exportable review summary or submission-ready record** | Creates a concise record of findings, sources, decisions, and status. | Supports handoff, audit, and demonstration. |

---

## 6. Planned Technology Stack & Architecture

| Layer | Implementation & Architecture |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, TanStack Query v5, Framer Motion. Light mode enterprise UI (`#F7FAFF` canvas, `#FFFFFF` cards, `#4169E1` blue, `#15A99A` teal). |
| **Backend** | Python 3.14, FastAPI REST APIs, Pydantic v2 schemas, SQLAlchemy 2.0 ORM, Alembic migrations, Pytest. |
| **Database** | PostgreSQL (production) with SQLite compatibility for zero-friction local and standalone execution. |
| **Language Model & RAG** | Retrieval-Augmented Generation over approved guidelines; Google Gemini API with fallback to deterministic policy engine. |
| **Document Parsing** | `pypdf` (PDF), `python-docx` (DOCX), `httpx` + `BeautifulSoup4` with SSRF loopback protections. |
| **Storage & Caching** | Encrypted object storage abstractions with retention and access policies. |
| **Identity & Security** | JWT authentication, RBAC, least privilege, separation of duties, and audit logging. |
| **Delivery & Deployment** | GitHub Pages for high-availability interactive delivery; GitHub Actions CI/CD; FastAPI production services. |

---

## 7. Responsibilities of Each Team Member

| Participant | Proposed Role | Primary Responsibilities | Secondary Responsibilities | Handoff Points |
|---|---|---|---|---|
| **CHITHYALA ANUHYA** | **Product and Problem Lead** | Problem framing, user journeys, scope, and demo narrative. | Interview notes and prioritisation. | Hands off user needs and scope to UX and engineering. |
| **SANDA RUPESH** | **UX and Frontend Lead** | Information architecture, responsive interface, review experience, and accessibility. | Prototype testing and content design. | Hands off interaction flows and UI states to backend and QA. |
| **SANDA RUPESH** | **Backend and Workflow Lead** | FastAPI services, workflow states, permissions, and audit events. | Integration support and deployment checks. | Hands off APIs, state rules, and event contracts. |
| **CHITHYALA ANUHYA** | **AI and Retrieval Lead** | Document ingestion, retrieval, prompt and evaluation design, uncertainty handling, and source citations. | Curated test cases and model-risk notes. | Hands off finding schemas, evidence behaviour, and evaluation notes. |
| **CHITHYALA ANUHYA** | **Data and Security Lead** | PostgreSQL model, object storage, confidentiality controls, access policy, and logging. | Retention decisions and threat review. | Hands off data model, permissions, and security assumptions. |
| **CHITHYALA ANUHYA** | **QA, Research, and Presentation Lead** | Test scenarios, measurable pilot targets, usability checks, documentation, and demo readiness. | Risk register and backup demo path. | Feeds defects, evidence, and narrative improvements back to the team. |

---

## 8. Proposed Three-Round Plan

* **Round 1: Understand and frame**
  * *Goal*: Validate the problem and narrow the prototype taxonomy.
  * *Work plan*: Map users; define review taxonomy; choose approved source set; draft data model; create low-fidelity journey; agree on success measures.
  * *Deliverables*: Problem framing, user journey, initial architecture, sample sources, review rubric.
  * *Checkpoint*: Show a creator submitting a draft and seeing the intended review journey.
* **Round 2: Build and validate the core loop**
  * *Goal*: Demonstrate evidence-based review.
  * *Work plan*: Implement draft intake, source ingestion, retrieval, initial checks, issue cards, citations, role-based states, revision loop, and basic audit trail.
  * *Deliverables*: Working core review loop, sample findings, source-linked explanations, security and data-handling decisions.
  * *Checkpoint*: Show a draft moving from intake through findings, revision, and reviewer decision.
* **Round 3: Harden, measure, and tell the story**
  * *Goal*: Make the prototype credible, usable, and ready to demonstrate.
  * *Work plan*: Improve accessibility and error handling; add governance reporting; test uncertainty and false positives; refine approval gate; document limitations.
  * *Deliverables*: Integrated prototype, final workflow, pilot KPI plan, risk register, demo script, and submission documentation.
  * *Checkpoint*: Show the end-to-end scenario, human approval, version history, citations, and governance insights.

---

## 9. Expected Impact & Human-Centered Value

The expected impact is a set of hypotheses to validate:
* **Faster and earlier review** before expensive production stages.
* **More consistent use** of approved language, claims, and brand assets.
* **Better traceability and clearer accountability** for all approvals.
* **Fewer unsupported claims** reaching public audiences.
* **Improved accessibility habits** embedded in creative workflows.
* **Reduced reviewer repetition** on mechanical compliance checks.
* **Better visibility into unclear or conflicting guidelines**.

The human-centred value is not simply automation. Creators receive actionable feedback while they still have time to improve the work; reviewers spend more attention on strategic context and material risk; and governance owners see systemic patterns without turning every recurring issue into an individual performance problem.

---

## 10. Future Scope After the Event

* Deeper integrations with content management (CMS), collaboration, design (Figma), and approval tools.
* Richer asset matching for layouts, logos, imagery, licensing context, and regional variants.
* Multilingual and regional support for local terminology, claims, accessibility, and market-specific guidance.
* Stronger inclusion checks for accessibility, inclusive language, and audience-specific readability.
* Configurable policy packs for different brands, channels, content types, and risk levels.
* Evaluation harnesses that measure grounding, precision, recall, uncertainty calibration, and reviewer agreement.
* Reviewer feedback loops that improve workflow and guidance without silently changing approved rules.
* Privacy-preserving deployment options for sensitive enterprise environments and stricter retention requirements.
* Analytics by channel and content type to identify where review effort and confusion concentrate.
* Controlled publishing integrations with explicit permissions, approval gates, rollback, and audit requirements.

---

## 11. Section 19 Demonstration Scenario Walkthrough

BrandPilot comes pre-loaded with the exact scenario specified in the prompt:

1. **The Grounding Guideline**:
   * *Document*: `Acme Global Service Availability & SLA Policy (v2.4, Effective: 2026-01-01)`
   * *Section 1*: *"We commit to a 99.9% monthly uptime target across standard production regions... Statements describing service availability as '100%' or 'always available' are strictly prohibited."*
2. **The Submitted Campaign Copy**:
   > *"Our service is always available. We provide cheap and fast compute with our artificial intelligence bot that gives insane performance without any risk."*
3. **BrandPilot's Grounded Findings**:
   * **🚨 Claim Conflict (Critical)**: Flags *"always available"*, quotes Section 1 of the SLA policy, explains conflict with 99.9% target, suggests: *"engineered for 99.9% uptime availability with enterprise redundancy"*.
   * **⚠️ Restricted Terminology (Medium)**: Flags *"cheap"*, quotes corporate terminology rule, suggests: *"cost-effective"*.
   * **⚠️ Unapproved Phrase (Medium)**: Flags *"artificial intelligence bot"*, suggests: *"AI Assistant"*.
   * **⚠️ Tone Issue (Medium)**: Flags *"insane"*, suggests: *"exceptional"*.
   * **⚠️ Missing Disclosure (High)**: Flags absence of standard SLA maintenance qualifications.
4. **Creator Revision Studio**:
   * Creator applies suggestions and clicks **"Save Revision (Creates v2)"**.
   * Prior approvals are automatically invalidated.
5. **Human Approval Gate**:
   * Sarah Chen (Creator) is blocked from approving with an **HTTP 403 Forbidden** alert (Separation of Duties).
   * Marcus Vance (Brand Manager) or Elena Rostova (Legal) records decisions with rationale.
   * Status advances to **Ready to Publish** only after human sign-off.
   * Full history and audit trail are permanently logged.

---

### Attribution Notice
* **Designed & Developed by:** **CHITHYALA ANUHYA (Team Lead) & SANDA RUPESH | Team ALTO**
* **BrandPilot — Trust Before Publish**
