from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field

# --- Auth & User ---
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    workspace_name: Optional[str] = "Acme Global Brand"

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    workspace_id: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UserRoleUpdate(BaseModel):
    role: str

# --- Workspace ---
class WorkspaceResponse(BaseModel):
    id: str
    name: str
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Guideline & Knowledge ---
class GuidelinePassageResponse(BaseModel):
    id: str
    guideline_id: str
    section: Optional[str]
    passage_text: str
    passage_index: int

    class Config:
        from_attributes = True

class GuidelineCreate(BaseModel):
    title: str
    category: str
    version: str = "1.0"
    authority: str
    effective_date: str
    expiry_date: Optional[str] = None
    content: str

class GuidelineResponse(BaseModel):
    id: str
    workspace_id: str
    title: str
    category: str
    version: str
    authority: str
    effective_date: str
    expiry_date: Optional[str]
    content: str
    is_active: bool
    created_at: datetime
    passages: List[GuidelinePassageResponse] = []

    class Config:
        from_attributes = True

class TerminologyRuleCreate(BaseModel):
    prohibited_term: str
    preferred_term: str
    rationale: str
    severity: str = "medium"

class TerminologyRuleResponse(BaseModel):
    id: str
    workspace_id: str
    prohibited_term: str
    preferred_term: str
    rationale: str
    severity: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class BrandAssetCreate(BaseModel):
    name: str
    asset_type: str
    file_path: Optional[str] = None
    guidelines_note: Optional[str] = None
    is_authorized: bool = True

class BrandAssetResponse(BaseModel):
    id: str
    workspace_id: str
    name: str
    asset_type: str
    file_path: Optional[str]
    guidelines_note: Optional[str]
    is_authorized: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Findings ---
class ReviewFindingResponse(BaseModel):
    id: str
    submission_version_id: str
    category: str
    severity: str
    affected_text: str
    location: Optional[str]
    explanation: str
    supporting_evidence: Optional[str]
    source_document_id: Optional[str]
    source_document_title: Optional[str]
    source_passage_id: Optional[str]
    source_passage_text: Optional[str]
    source_version: Optional[str]
    source_effective_date: Optional[str]
    confidence_level: str
    recommended_action: str
    suggested_rewrite: Optional[str]
    resolution_status: str
    reviewer_notes: Optional[str]
    is_deterministic: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ReviewFindingStatusUpdate(BaseModel):
    resolution_status: str  # open, accepted, rejected, resolved
    reviewer_notes: Optional[str] = None

# --- Submissions & Versions ---
class SubmissionCreate(BaseModel):
    title: str
    channel: str
    audience: str
    purpose: str
    sensitivity: str = "standard"
    content_type: str = "text"  # text, document, url
    raw_content: str
    source_filename: Optional[str] = None
    url: Optional[str] = None

class RevisionCreate(BaseModel):
    raw_content: str
    change_summary: str

class SubmissionVersionResponse(BaseModel):
    id: str
    submission_id: str
    version_number: int
    content_type: str
    raw_content: str
    source_filename: Optional[str]
    file_url: Optional[str]
    change_summary: Optional[str]
    created_at: datetime
    findings: List[ReviewFindingResponse] = []

    class Config:
        from_attributes = True

class ReviewerAssignmentResponse(BaseModel):
    id: str
    submission_id: str
    reviewer_id: str
    reviewer_name: Optional[str] = None
    reviewer_email: Optional[str] = None
    role_type: str
    assigned_at: datetime
    completed_at: Optional[datetime]
    status: str

    class Config:
        from_attributes = True

class ApprovalDecisionCreate(BaseModel):
    decision: str  # REQUEST_CHANGES, APPROVE_WITH_CONDITIONS, APPROVE, REJECT
    rationale: str
    conditions: Optional[str] = None

class ApprovalDecisionResponse(BaseModel):
    id: str
    submission_id: str
    submission_version_number: int
    decision: str
    rationale: str
    conditions: Optional[str]
    actor_id: str
    actor_name: str
    actor_role: str
    created_at: datetime

    class Config:
        from_attributes = True

class SubmissionResponse(BaseModel):
    id: str
    workspace_id: str
    creator_id: str
    creator_name: Optional[str] = None
    title: str
    channel: str
    audience: str
    purpose: str
    sensitivity: str
    status: str
    current_version_number: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SubmissionDetailResponse(SubmissionResponse):
    versions: List[SubmissionVersionResponse] = []
    assignments: List[ReviewerAssignmentResponse] = []
    decisions: List[ApprovalDecisionResponse] = []

# --- Audit & Analytics ---
class AuditEventResponse(BaseModel):
    id: str
    workspace_id: str
    submission_id: Optional[str]
    actor_id: str
    actor_name: str
    actor_role: str
    action: str
    details_json: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    link: Optional[str]
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AnalyticsSummaryResponse(BaseModel):
    total_submissions: int
    draft_count: int
    under_review_count: int
    needs_revision_count: int
    approved_count: int
    ready_to_publish_count: int
    rejected_count: int
    total_findings: int
    findings_by_category: Dict[str, int]
    findings_by_severity: Dict[str, int]
    avg_turnaround_hours: float
    common_violations: List[Dict[str, Any]]
