from sqlalchemy.orm import Session
from app.core.security import hash_password, ROLE_CREATOR, ROLE_REVIEWER, ROLE_LEGAL, ROLE_ADMIN
from app.models.entities import (
    Workspace,
    User,
    Guideline,
    GuidelinePassage,
    TerminologyRule,
    BrandAsset,
    Submission,
    SubmissionVersion,
    ReviewFinding,
    AuditEvent
)
from app.services.rag_service import rag_service
from app.services.audit_service import audit_service

def seed_database(db: Session):
    # Check if already seeded
    existing_ws = db.query(Workspace).filter(Workspace.slug == "acme-global").first()
    if existing_ws:
        return

    print("Seeding initial demonstration data for BrandPilot...")

    # 1. Create Workspace
    workspace = Workspace(
        name="Acme Global Brand",
        slug="acme-global"
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)

    # 2. Create Users for all 4 roles
    default_password_hash = hash_password("Password123!")
    
    creator = User(
        email="creator@brandpilot.local",
        hashed_password=default_password_hash,
        full_name="Sarah Chen",
        role=ROLE_CREATOR,
        workspace_id=workspace.id,
        is_active=True
    )
    reviewer = User(
        email="reviewer@brandpilot.local",
        hashed_password=default_password_hash,
        full_name="Marcus Vance",
        role=ROLE_REVIEWER,
        workspace_id=workspace.id,
        is_active=True
    )
    legal = User(
        email="legal@brandpilot.local",
        hashed_password=default_password_hash,
        full_name="Elena Rostova",
        role=ROLE_LEGAL,
        workspace_id=workspace.id,
        is_active=True
    )
    admin = User(
        email="admin@brandpilot.local",
        hashed_password=default_password_hash,
        full_name="David Sterling",
        role=ROLE_ADMIN,
        workspace_id=workspace.id,
        is_active=True
    )

    db.add_all([creator, reviewer, legal, admin])
    db.commit()
    db.refresh(creator)
    db.refresh(reviewer)
    db.refresh(legal)
    db.refresh(admin)

    # 3. Create Approved Guidelines (including Demonstration Scenario SLA)
    sla_content = """# Section 1: Availability and SLA Commitments

We commit to a 99.9% monthly uptime target across standard production regions, supported by multi-zone cloud infrastructure redundancy and automated health failover.

Statements describing service availability as '100% uptime', 'always available', or 'zero downtime' are strictly prohibited in public communications and are factually inconsistent with standard cloud engineering.

# Section 2: Exclusions and Planned Maintenance

The 99.9% availability target explicitly excludes scheduled maintenance windows announced with at least 48 hours notice, emergency security mitigation procedures, and force majeure events.

All customer-facing marketing claims referencing uptime SLA metrics must include standard qualifying notices linking to the comprehensive Master Service Agreement.

# Section 3: Performance Benchmarks

Technical claims regarding latency or response speed must be substantiated by quarterly internal benchmark reports conducted by the Performance Engineering team. Superlatives such as 'fastest on earth' or 'infinitely scalable' must not be published without verified multi-vendor comparative testing."""

    sla_guideline = Guideline(
        workspace_id=workspace.id,
        title="Acme Global Service Availability & SLA Policy",
        category="claims",
        version="2.4",
        authority="VP of Enterprise Infrastructure & Cloud Engineering",
        effective_date="2026-01-01",
        expiry_date="2027-01-01",
        content=sla_content,
        is_active=True
    )
    db.add(sla_guideline)
    db.commit()
    db.refresh(sla_guideline)

    # Chunk SLA guideline into passages
    chunks = rag_service.chunk_document(sla_content)
    for idx, c in enumerate(chunks):
        p = GuidelinePassage(
            guideline_id=sla_guideline.id,
            section=c.get("section", "General"),
            passage_text=c.get("text", ""),
            passage_index=idx
        )
        db.add(p)

    # Tone Guideline
    tone_content = """# Section 1: Enterprise Brand Tone

Acme communicates with authority, clarity, and precision. Our tone is professional and respectful, avoiding colloquial slang, hyperbolic buzzwords, or unsubstantiated claims.

# Section 2: Advertising and Social Media Tone

While marketing copy should remain engaging and concise, writers must not use informal slang such as 'insane', 'crushing it', or 'killer features'. Instead, highlight concrete customer value, measurable productivity gains, and verified enterprise security."""

    tone_guideline = Guideline(
        workspace_id=workspace.id,
        title="Acme Brand Voice & Messaging Standard",
        category="tone",
        version="3.1",
        authority="Chief Brand Officer",
        effective_date="2026-01-15",
        content=tone_content,
        is_active=True
    )
    db.add(tone_guideline)
    db.commit()
    db.refresh(tone_guideline)

    for idx, c in enumerate(rag_service.chunk_document(tone_content)):
        p = GuidelinePassage(
            guideline_id=tone_guideline.id,
            section=c.get("section", "General"),
            passage_text=c.get("text", ""),
            passage_index=idx
        )
        db.add(p)

    # 4. Terminology Rules
    term_rules = [
        TerminologyRule(
            workspace_id=workspace.id,
            prohibited_term="cheap",
            preferred_term="cost-effective",
            rationale="Aligns with enterprise premium value positioning and total cost of ownership benefits.",
            severity="medium",
            is_active=True
        ),
        TerminologyRule(
            workspace_id=workspace.id,
            prohibited_term="artificial intelligence bot",
            preferred_term="AI Assistant",
            rationale="Approved product terminology naming convention across all platform interfaces.",
            severity="medium",
            is_active=True
        ),
        TerminologyRule(
            workspace_id=workspace.id,
            prohibited_term="guarantee",
            preferred_term="commit",
            rationale="Compliance policy: 'Commit' reflects SLA guidelines without establishing uninsurable warranty liabilities.",
            severity="high",
            is_active=True
        )
    ]
    db.add_all(term_rules)

    # 5. Brand Assets
    assets = [
        BrandAsset(
            workspace_id=workspace.id,
            name="Acme Primary Logotype (Light Surface)",
            asset_type="logo",
            file_path="/assets/brand/acme_primary.svg",
            guidelines_note="Must maintain a minimum clear space equal to 50% of the logomark height on all white backgrounds.",
            is_authorized=True
        ),
        BrandAsset(
            workspace_id=workspace.id,
            name="Enterprise Brand Color Palette",
            asset_type="color_palette",
            file_path="/assets/brand/palette.json",
            guidelines_note="Primary Blue (#4169E1) and Teal Accent (#15A99A) with WCAG AA compliance.",
            is_authorized=True
        )
    ]
    db.add_all(assets)
    db.commit()

    # 6. Seed Demo Submission Scenario (Prompt Section 19: Demonstration Scenario)
    demo_submission = Submission(
        workspace_id=workspace.id,
        creator_id=creator.id,
        title="Q4 Global Cloud Campaign — High Availability",
        channel="Advertising",
        audience="Enterprise IT",
        purpose="Product Launch",
        sensitivity="standard",
        status="NEEDS_REVISION",
        current_version_number=1
    )
    db.add(demo_submission)
    db.commit()
    db.refresh(demo_submission)

    demo_text = "Our service is always available. We provide cheap and fast compute with our artificial intelligence bot that gives insane performance without any risk."

    demo_version = SubmissionVersion(
        submission_id=demo_submission.id,
        version_number=1,
        content_type="text",
        raw_content=demo_text,
        change_summary="Initial draft submitted for pre-publication governance review."
    )
    db.add(demo_version)
    db.commit()
    db.refresh(demo_version)

    # Seed Findings matching the demonstration scenario
    findings = [
        ReviewFinding(
            submission_version_id=demo_version.id,
            category="claims",
            severity="critical",
            affected_text="always available",
            location="Sentence 1",
            explanation="The absolute claim 'always available' directly conflicts with approved SLA terms. Our SLA specifies a 99.9% uptime target and explicitly excludes scheduled maintenance.",
            supporting_evidence="\"We commit to a 99.9% monthly uptime target across standard production regions... Statements describing service availability as 'always available' are strictly prohibited.\"",
            source_document_id=sla_guideline.id,
            source_document_title="Acme Global Service Availability & SLA Policy",
            source_version="2.4",
            source_effective_date="2026-01-01",
            confidence_level="high",
            recommended_action="Qualify the availability claim to state our approved 99.9% uptime target and note maintenance conditions.",
            suggested_rewrite="engineered for 99.9% uptime availability with enterprise redundancy",
            resolution_status="open",
            is_deterministic=False
        ),
        ReviewFinding(
            submission_version_id=demo_version.id,
            category="terminology",
            severity="medium",
            affected_text="cheap",
            location="Sentence 2",
            explanation="Use of restricted terminology 'cheap'. Aligns with enterprise premium value positioning.",
            supporting_evidence="Approved Terminology Rule: Replace 'cheap' with 'cost-effective'.",
            confidence_level="high",
            recommended_action="Replace 'cheap' with preferred term 'cost-effective'.",
            suggested_rewrite="cost-effective",
            resolution_status="open",
            is_deterministic=True
        ),
        ReviewFinding(
            submission_version_id=demo_version.id,
            category="terminology",
            severity="medium",
            affected_text="artificial intelligence bot",
            location="Sentence 2",
            explanation="Use of unapproved phrase 'artificial intelligence bot'.",
            supporting_evidence="Approved Terminology Rule: Replace 'artificial intelligence bot' with 'AI Assistant'.",
            confidence_level="high",
            recommended_action="Replace with approved product designation 'AI Assistant'.",
            suggested_rewrite="AI Assistant",
            resolution_status="open",
            is_deterministic=True
        ),
        ReviewFinding(
            submission_version_id=demo_version.id,
            category="disclosures",
            severity="high",
            affected_text="Our service is always available...",
            location="Statement Scope",
            explanation="SLA and availability statements in public advertising require mandatory qualifying disclosures regarding scheduled maintenance.",
            supporting_evidence="Corporate Disclosure Policy: Public SLA statements must include standard qualifying maintenance notice.",
            confidence_level="high",
            recommended_action="Append standard qualification disclosure or link to full Master Service Agreement.",
            suggested_rewrite="*Subject to scheduled maintenance and terms outlined in the Acme Service Level Agreement.",
            resolution_status="open",
            is_deterministic=True
        ),
        ReviewFinding(
            submission_version_id=demo_version.id,
            category="tone",
            severity="medium",
            affected_text="insane",
            location="Sentence 2",
            explanation="Informal colloquialism 'insane' conflicts with our professional enterprise tone for Advertising.",
            supporting_evidence="Brand Voice Manual: Maintain clear, confident, professional language avoiding hyperbolic slang.",
            confidence_level="high",
            recommended_action="Replace colloquialism with professional enterprise terminology.",
            suggested_rewrite="exceptional capability",
            resolution_status="open",
            is_deterministic=False
        )
    ]
    db.add_all(findings)
    db.commit()

    # Log initial audit events
    audit_service.log_event(
        db=db,
        workspace_id=workspace.id,
        actor_id=creator.id,
        actor_name=creator.full_name,
        actor_role=creator.role,
        action="SUBMISSION_CREATED",
        submission_id=demo_submission.id,
        details={"title": demo_submission.title, "channel": demo_submission.channel}
    )
    audit_service.log_event(
        db=db,
        workspace_id=workspace.id,
        actor_id="system-ai",
        actor_name="BrandPilot AI Governance Engine",
        actor_role="SYSTEM",
        action="AI_REVIEW_COMPLETED",
        submission_id=demo_submission.id,
        details={"findings_count": len(findings), "status": "NEEDS_REVISION"}
    )

    print("Demo dataset seeded successfully!")
