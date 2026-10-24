from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import User, Submission, ReviewerAssignment
from app.schemas.all_schemas import (
    ApprovalDecisionCreate,
    ApprovalDecisionResponse,
    SubmissionDetailResponse
)
from app.api.deps import get_current_user, require_roles
from app.services.approval_service import approval_service, ApprovalError
from app.core.security import ROLE_REVIEWER, ROLE_LEGAL, ROLE_ADMIN

router = APIRouter()

@router.post("/submissions/{submission_id}/decision", response_model=ApprovalDecisionResponse)
def record_approval_decision(
    submission_id: str,
    payload: ApprovalDecisionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submission = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.workspace_id == current_user.workspace_id
    ).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found.")

    try:
        decision = approval_service.record_decision(
            db=db,
            submission=submission,
            actor=current_user,
            decision=payload.decision,
            rationale=payload.rationale,
            conditions=payload.conditions
        )
        return ApprovalDecisionResponse.from_orm(decision)
    except ApprovalError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))

@router.post("/submissions/{submission_id}/publish", response_model=SubmissionDetailResponse)
def mark_ready_to_publish(
    submission_id: str,
    current_user: User = Depends(require_roles([ROLE_REVIEWER, ROLE_LEGAL, ROLE_ADMIN])),
    db: Session = Depends(get_db)
):
    submission = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.workspace_id == current_user.workspace_id
    ).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found.")

    try:
        updated = approval_service.mark_ready_to_publish(db=db, submission=submission, actor=current_user)
        resp = SubmissionDetailResponse.from_orm(updated)
        resp.creator_name = updated.creator.full_name if updated.creator else "Unknown"
        return resp
    except ApprovalError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/submissions/{submission_id}/assign")
def assign_reviewer(
    submission_id: str,
    reviewer_id: str,
    role_type: str = "REVIEWER",
    current_user: User = Depends(require_roles([ROLE_REVIEWER, ROLE_LEGAL, ROLE_ADMIN])),
    db: Session = Depends(get_db)
):
    submission = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.workspace_id == current_user.workspace_id
    ).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found.")

    reviewer = db.query(User).filter(User.id == reviewer_id, User.workspace_id == current_user.workspace_id).first()
    if not reviewer:
        raise HTTPException(status_code=404, detail="Target reviewer not found in workspace.")

    assignment = ReviewerAssignment(
        submission_id=submission.id,
        reviewer_id=reviewer.id,
        role_type=role_type,
        status="PENDING"
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return {"message": f"Successfully assigned {reviewer.full_name} as {role_type}."}
