import uuid
import pytest
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token, ROLE_CREATOR, ROLE_REVIEWER
from app.db.session import Base, SessionLocal, engine
from app.models.entities import User, Workspace, Submission, SubmissionVersion, ApprovalDecision, ReviewFinding
from app.services.approval_service import approval_service, ApprovalError
from app.services.rag_service import rag_service

@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_password_hashing():
    raw = "SecureP@ss123"
    hashed = hash_password(raw)
    assert verify_password(raw, hashed) is True
    assert verify_password("WrongPass", hashed) is False

def test_jwt_token_flow():
    token = create_access_token(subject="user-123", role="REVIEWER", workspace_id="ws-456")
    payload = decode_access_token(token)
    assert payload is not None
    assert payload["sub"] == "user-123"
    assert payload["role"] == "REVIEWER"
    assert payload["workspace_id"] == "ws-456"

def test_prevent_self_approval(db):
    """MANDATORY RULE: Content Creator CANNOT approve their own submission!"""
    unique_id = uuid.uuid4().hex[:8]
    creator = User(
        email=f"creator_{unique_id}@brandpilot.local",
        hashed_password=hash_password("pass"),
        full_name="Alice Creator",
        role=ROLE_CREATOR,
        is_active=True
    )
    db.add(creator)
    db.commit()

    sub = Submission(
        workspace_id=f"ws-{unique_id}",
        creator_id=creator.id,
        title="Self-Approval Test",
        channel="Social Media",
        audience="General",
        purpose="Announcement",
        status="UNDER_REVIEW",
        current_version_number=1
    )
    db.add(sub)
    db.commit()

    # Attempt self-approval as creator -> MUST RAISE ApprovalError
    can_approve, reason = approval_service.can_user_approve(creator, sub)
    assert can_approve is False
    assert "Self-approval is strictly prohibited" in reason

    with pytest.raises(ApprovalError):
        approval_service.record_decision(
            db=db,
            submission=sub,
            actor=creator,
            decision="APPROVE",
            rationale="Trying to approve myself"
        )

def test_authorized_reviewer_can_record_decision(db):
    unique_id = uuid.uuid4().hex[:8]
    creator = User(
        email=f"creator_{unique_id}@brandpilot.local",
        hashed_password=hash_password("pass"),
        full_name="Alice Creator",
        role=ROLE_CREATOR,
        is_active=True
    )
    reviewer = User(
        email=f"reviewer_{unique_id}@brandpilot.local",
        hashed_password=hash_password("pass"),
        full_name="Bob Manager",
        role=ROLE_REVIEWER,
        is_active=True
    )
    db.add_all([creator, reviewer])
    db.commit()

    sub = Submission(
        workspace_id=f"ws-{unique_id}",
        creator_id=creator.id,
        title="Review Decision Test",
        channel="Website",
        audience="Enterprise",
        purpose="Launch",
        status="UNDER_REVIEW",
        current_version_number=1
    )
    db.add(sub)
    db.commit()

    decision = approval_service.record_decision(
        db=db,
        submission=sub,
        actor=reviewer,
        decision="APPROVE",
        rationale="Complies with brand standards"
    )
    assert decision.decision == "APPROVE"
    assert sub.status == "READY_TO_PUBLISH"

def test_rag_chunking():
    doc = """# Header 1
This is the first paragraph describing enterprise service uptime.

# Header 2
This is the second paragraph specifying exclusions and terms."""
    chunks = rag_service.chunk_document(doc)
    assert len(chunks) == 2
    assert chunks[0]["section"] == "Header 1"
    assert chunks[1]["section"] == "Header 2"
