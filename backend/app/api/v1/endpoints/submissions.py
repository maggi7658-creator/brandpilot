import os
import shutil
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.entities import User, Submission, SubmissionVersion, ReviewFinding
from app.schemas.all_schemas import (
    SubmissionCreate,
    SubmissionResponse,
    SubmissionDetailResponse,
    RevisionCreate,
    ReviewFindingResponse
)
from app.api.deps import get_current_user
from app.services.document_service import document_service, DocumentExtractionError
from app.services.ai_service import ai_service
from app.services.audit_service import audit_service

router = APIRouter()

@router.post("", response_model=SubmissionResponse)
def create_submission(
    payload: SubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # If URL provided, extract content
    raw_text = payload.raw_content
    source_filename = payload.source_filename

    if payload.content_type == "url" and payload.url:
        try:
            title, extracted = document_service.extract_text_from_url(payload.url)
            raw_text = extracted
            source_filename = payload.url
            if not payload.title:
                payload.title = title
        except DocumentExtractionError as e:
            raise HTTPException(status_code=400, detail=str(e))

    submission = Submission(
        workspace_id=current_user.workspace_id,
        creator_id=current_user.id,
        title=payload.title,
        channel=payload.channel,
        audience=payload.audience,
        purpose=payload.purpose,
        sensitivity=payload.sensitivity,
        status="DRAFT",
        current_version_number=1
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    version = SubmissionVersion(
        submission_id=submission.id,
        version_number=1,
        content_type=payload.content_type,
        raw_content=raw_text,
        source_filename=source_filename,
        change_summary="Initial intake submission."
    )
    db.add(version)
    db.commit()
    db.refresh(version)

    audit_service.log_event(
        db=db,
        workspace_id=submission.workspace_id,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        action="SUBMISSION_CREATED",
        submission_id=submission.id,
        details={"title": submission.title, "channel": submission.channel}
    )

    resp = SubmissionResponse.from_orm(submission)
    resp.creator_name = current_user.full_name
    return resp

@router.post("/upload")
async def upload_document_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Validate extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{file_ext}'. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    # Save to upload dir
    save_path = settings.UPLOAD_DIR / f"{current_user.id}_{file.filename}"
    try:
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        extracted_text = document_service.extract_content(save_path, file.filename)
        return {
            "filename": file.filename,
            "file_path": str(save_path),
            "content_type": "document" if file_ext in (".pdf", ".docx", ".doc") else ("image" if file_ext in (".png", ".jpg", ".jpeg") else "text"),
            "extracted_text": extracted_text
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process file: {str(e)}")

@router.get("", response_model=List[SubmissionResponse])
def list_submissions(
    channel: Optional[str] = None,
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Submission).filter(Submission.workspace_id == current_user.workspace_id)
    if channel:
        query = query.filter(Submission.channel == channel)
    if status:
        query = query.filter(Submission.status == status)

    submissions = query.order_by(Submission.updated_at.desc()).all()
    results = []
    for s in submissions:
        item = SubmissionResponse.from_orm(s)
        item.creator_name = s.creator.full_name if s.creator else "Unknown"
        results.append(item)
    return results

@router.get("/{submission_id}", response_model=SubmissionDetailResponse)
def get_submission_detail(
    submission_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submission = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.workspace_id == current_user.workspace_id
    ).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found.")

    resp = SubmissionDetailResponse.from_orm(submission)
    resp.creator_name = submission.creator.full_name if submission.creator else "Unknown"
    return resp

@router.post("/{submission_id}/analyze", response_model=SubmissionDetailResponse)
def trigger_analysis(
    submission_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submission = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.workspace_id == current_user.workspace_id
    ).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found.")

    current_ver = next(
        (v for v in submission.versions if v.version_number == submission.current_version_number),
        None
    )
    if not current_ver:
        raise HTTPException(status_code=400, detail="Active version not found.")

    submission.status = "ANALYZING"
    db.commit()

    # Clear existing findings for this version to avoid duplicates on re-analysis
    db.query(ReviewFinding).filter(ReviewFinding.submission_version_id == current_ver.id).delete()
    db.commit()

    # Run AI Review Engine
    generated = ai_service.analyze_content(db=db, submission=submission, version=current_ver)

    has_critical = False
    for gf in generated:
        if gf.severity in ("critical", "high"):
            has_critical = True
        rf = ReviewFinding(
            submission_version_id=current_ver.id,
            category=gf.category,
            severity=gf.severity,
            affected_text=gf.affected_text,
            location=gf.location,
            explanation=gf.explanation,
            supporting_evidence=gf.supporting_evidence,
            source_document_id=gf.source_document_id,
            source_document_title=gf.source_document_title,
            source_passage_id=gf.source_passage_id,
            source_passage_text=gf.source_passage_text,
            source_version=gf.source_version,
            source_effective_date=gf.source_effective_date,
            confidence_level=gf.confidence_level,
            recommended_action=gf.recommended_action,
            suggested_rewrite=gf.suggested_rewrite,
            resolution_status="open",
            is_deterministic=gf.is_deterministic
        )
        db.add(rf)

    # Set new status based on findings
    if has_critical:
        submission.status = "NEEDS_REVISION"
    else:
        submission.status = "UNDER_REVIEW"

    db.commit()
    db.refresh(submission)

    audit_service.log_event(
        db=db,
        workspace_id=submission.workspace_id,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        action="AI_REVIEW_COMPLETED",
        submission_id=submission.id,
        details={"findings_count": len(generated), "status": submission.status}
    )

    resp = SubmissionDetailResponse.from_orm(submission)
    resp.creator_name = submission.creator.full_name if submission.creator else "Unknown"
    return resp

@router.post("/{submission_id}/revisions", response_model=SubmissionDetailResponse)
def create_revision(
    submission_id: str,
    payload: RevisionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    submission = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.workspace_id == current_user.workspace_id
    ).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found.")

    new_version_num = submission.current_version_number + 1
    new_version = SubmissionVersion(
        submission_id=submission.id,
        version_number=new_version_num,
        content_type="text",
        raw_content=payload.raw_content,
        change_summary=payload.change_summary
    )
    db.add(new_version)
    submission.current_version_number = new_version_num
    
    # Crucial BrandPilot governance rule:
    # A new revision that materially changes content invalidates or re-evaluates previous approvals!
    submission.status = "UNDER_REVIEW"
    db.commit()
    db.refresh(submission)
    db.refresh(new_version)

    # Automatically re-run governance check on new version
    generated = ai_service.analyze_content(db=db, submission=submission, version=new_version)
    has_critical = False
    for gf in generated:
        if gf.severity in ("critical", "high"):
            has_critical = True
        rf = ReviewFinding(
            submission_version_id=new_version.id,
            category=gf.category,
            severity=gf.severity,
            affected_text=gf.affected_text,
            location=gf.location,
            explanation=gf.explanation,
            supporting_evidence=gf.supporting_evidence,
            source_document_id=gf.source_document_id,
            source_document_title=gf.source_document_title,
            source_passage_id=gf.source_passage_id,
            source_passage_text=gf.source_passage_text,
            source_version=gf.source_version,
            source_effective_date=gf.source_effective_date,
            confidence_level=gf.confidence_level,
            recommended_action=gf.recommended_action,
            suggested_rewrite=gf.suggested_rewrite,
            resolution_status="open",
            is_deterministic=gf.is_deterministic
        )
        db.add(rf)

    if has_critical:
        submission.status = "NEEDS_REVISION"
    else:
        submission.status = "UNDER_REVIEW"

    db.commit()
    db.refresh(submission)

    audit_service.log_event(
        db=db,
        workspace_id=submission.workspace_id,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        action="REVISION_CREATED_APPROVALS_INVALIDATED",
        submission_id=submission.id,
        details={
            "version_number": new_version_num,
            "change_summary": payload.change_summary,
            "status": submission.status
        }
    )

    resp = SubmissionDetailResponse.from_orm(submission)
    resp.creator_name = submission.creator.full_name if submission.creator else "Unknown"
    return resp
