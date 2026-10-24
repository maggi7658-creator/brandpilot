from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import User, ReviewFinding, SubmissionVersion, Submission
from app.schemas.all_schemas import ReviewFindingResponse, ReviewFindingStatusUpdate
from app.api.deps import get_current_user
from app.services.audit_service import audit_service

router = APIRouter()

@router.patch("/findings/{finding_id}", response_model=ReviewFindingResponse)
def update_finding_status(
    finding_id: str,
    payload: ReviewFindingStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    finding = db.query(ReviewFinding).filter(ReviewFinding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found.")

    # Validate workspace
    version = db.query(SubmissionVersion).filter(SubmissionVersion.id == finding.submission_version_id).first()
    if not version or not version.submission or version.submission.workspace_id != current_user.workspace_id:
        raise HTTPException(status_code=403, detail="Unauthorized workspace access.")

    finding.resolution_status = payload.resolution_status
    if payload.reviewer_notes:
        finding.reviewer_notes = payload.reviewer_notes

    db.commit()
    db.refresh(finding)

    audit_service.log_event(
        db=db,
        workspace_id=current_user.workspace_id,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        action="FINDING_RESOLUTION_UPDATED",
        submission_id=version.submission.id,
        details={
            "finding_id": finding.id,
            "category": finding.category,
            "status": finding.resolution_status,
            "notes": payload.reviewer_notes
        }
    )

    return ReviewFindingResponse.from_orm(finding)
