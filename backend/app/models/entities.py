import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, Integer, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class Workspace(Base):
    __tablename__ = "workspaces"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(150), nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime, default=utc_now)

    users = relationship("User", back_populates="workspace", cascade="all, delete-orphan")
    guidelines = relationship("Guideline", back_populates="workspace", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="workspace", cascade="all, delete-orphan")
    brand_assets = relationship("BrandAsset", back_populates="workspace", cascade="all, delete-orphan")
    terminology_rules = relationship("TerminologyRule", back_populates="workspace", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(String(50), nullable=False, default="CREATOR")  # CREATOR, REVIEWER, LEGAL, ADMIN
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    workspace = relationship("Workspace", back_populates="users")
    submissions = relationship("Submission", back_populates="creator", foreign_keys="Submission.creator_id")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


class Guideline(Base):
    __tablename__ = "guidelines"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # claims, tone, terminology, visual, accessibility, disclosures
    version = Column(String(50), nullable=False, default="1.0")
    authority = Column(String(150), nullable=False)  # e.g., "VP of Brand Strategy", "Chief Compliance Officer"
    effective_date = Column(String(50), nullable=False)  # e.g., "2026-01-01"
    expiry_date = Column(String(50), nullable=True)     # e.g., "2027-01-01"
    content = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    workspace = relationship("Workspace", back_populates="guidelines")
    passages = relationship("GuidelinePassage", back_populates="guideline", cascade="all, delete-orphan")


class GuidelinePassage(Base):
    __tablename__ = "guideline_passages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    guideline_id = Column(String(36), ForeignKey("guidelines.id"), nullable=False)
    section = Column(String(200), nullable=True)
    passage_text = Column(Text, nullable=False)
    passage_index = Column(Integer, default=0)
    metadata_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    guideline = relationship("Guideline", back_populates="passages")


class TerminologyRule(Base):
    __tablename__ = "terminology_rules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    prohibited_term = Column(String(150), nullable=False)
    preferred_term = Column(String(150), nullable=False)
    rationale = Column(Text, nullable=False)
    severity = Column(String(50), default="medium")  # low, medium, high
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    workspace = relationship("Workspace", back_populates="terminology_rules")


class BrandAsset(Base):
    __tablename__ = "brand_assets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    name = Column(String(150), nullable=False)
    asset_type = Column(String(50), nullable=False)  # logo, color_palette, font, banner, template
    file_path = Column(String(255), nullable=True)
    guidelines_note = Column(Text, nullable=True)
    is_authorized = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    workspace = relationship("Workspace", back_populates="brand_assets")


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    creator_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    channel = Column(String(100), nullable=False)  # Website, Social Media, Advertising, Email, Product, Internal
    audience = Column(String(150), nullable=False)  # Enterprise IT, Consumers, Investors, Partners, General Public
    purpose = Column(String(150), nullable=False)   # Awareness, Product Launch, Lead Gen, Policy Notice
    sensitivity = Column(String(50), default="standard")  # standard, regulated, high_risk
    status = Column(String(50), default="DRAFT")  # DRAFT, ANALYZING, NEEDS_REVISION, UNDER_REVIEW, APPROVED_WITH_CONDITIONS, REJECTED, READY_TO_PUBLISH
    current_version_number = Column(Integer, default=1)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    workspace = relationship("Workspace", back_populates="submissions")
    creator = relationship("User", back_populates="submissions", foreign_keys=[creator_id])
    versions = relationship("SubmissionVersion", back_populates="submission", cascade="all, delete-orphan", order_by="SubmissionVersion.version_number")
    assignments = relationship("ReviewerAssignment", back_populates="submission", cascade="all, delete-orphan")
    decisions = relationship("ApprovalDecision", back_populates="submission", cascade="all, delete-orphan")
    audit_events = relationship("AuditEvent", back_populates="submission", cascade="all, delete-orphan")


class SubmissionVersion(Base):
    __tablename__ = "submission_versions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False)
    version_number = Column(Integer, nullable=False, default=1)
    content_type = Column(String(50), nullable=False)  # text, document, url, image
    raw_content = Column(Text, nullable=False)
    source_filename = Column(String(255), nullable=True)
    file_url = Column(String(255), nullable=True)
    change_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    submission = relationship("Submission", back_populates="versions")
    findings = relationship("ReviewFinding", back_populates="submission_version", cascade="all, delete-orphan")


class ReviewFinding(Base):
    __tablename__ = "review_findings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    submission_version_id = Column(String(36), ForeignKey("submission_versions.id"), nullable=False)
    category = Column(String(50), nullable=False)  # claims, tone, terminology, visual, accessibility, disclosures
    severity = Column(String(50), nullable=False)  # low, medium, high, critical
    affected_text = Column(Text, nullable=False)
    location = Column(String(100), nullable=True)
    explanation = Column(Text, nullable=False)
    supporting_evidence = Column(Text, nullable=True)
    source_document_id = Column(String(36), nullable=True)
    source_document_title = Column(String(255), nullable=True)
    source_passage_id = Column(String(36), nullable=True)
    source_passage_text = Column(Text, nullable=True)
    source_version = Column(String(50), nullable=True)
    source_effective_date = Column(String(50), nullable=True)
    confidence_level = Column(String(50), default="high")  # high, medium, low, uncertain
    recommended_action = Column(Text, nullable=False)
    suggested_rewrite = Column(Text, nullable=True)
    resolution_status = Column(String(50), default="open")  # open, accepted, rejected, resolved
    reviewer_notes = Column(Text, nullable=True)
    is_deterministic = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    submission_version = relationship("SubmissionVersion", back_populates="findings")


class ReviewerAssignment(Base):
    __tablename__ = "reviewer_assignments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False)
    reviewer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    role_type = Column(String(50), nullable=False)  # REVIEWER, LEGAL
    assigned_at = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, nullable=True)
    status = Column(String(50), default="PENDING")  # PENDING, COMPLETED

    submission = relationship("Submission", back_populates="assignments")
    reviewer = relationship("User")


class ApprovalDecision(Base):
    __tablename__ = "approval_decisions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=False)
    submission_version_number = Column(Integer, nullable=False)
    decision = Column(String(50), nullable=False)  # REQUEST_CHANGES, APPROVE_WITH_CONDITIONS, APPROVE, REJECT
    rationale = Column(Text, nullable=False)
    conditions = Column(Text, nullable=True)
    actor_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    actor_name = Column(String(150), nullable=False)
    actor_role = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=utc_now)

    submission = relationship("Submission", back_populates="decisions")
    actor = relationship("User")


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    submission_id = Column(String(36), ForeignKey("submissions.id"), nullable=True)
    actor_id = Column(String(36), nullable=False)
    actor_name = Column(String(150), nullable=False)
    actor_role = Column(String(50), nullable=False)
    action = Column(String(100), nullable=False)  # SUBMISSION_CREATED, AI_REVIEW_COMPLETED, REVISION_SAVED, REVIEWER_ASSIGNED, CHANGES_REQUESTED, APPROVED, REJECTED, READY_TO_PUBLISH
    details_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    submission = relationship("Submission", back_populates="audit_events")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    link = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="notifications")
