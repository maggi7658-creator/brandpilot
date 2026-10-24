from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import User, Guideline, GuidelinePassage, TerminologyRule, BrandAsset
from app.schemas.all_schemas import (
    GuidelineCreate,
    GuidelineResponse,
    TerminologyRuleCreate,
    TerminologyRuleResponse,
    BrandAssetCreate,
    BrandAssetResponse
)
from app.api.deps import get_current_user, require_roles
from app.services.rag_service import rag_service
from app.services.audit_service import audit_service
from app.core.security import ROLE_ADMIN, ROLE_REVIEWER

router = APIRouter()

@router.get("", response_model=List[GuidelineResponse])
def list_guidelines(
    category: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Guideline).filter(
        Guideline.workspace_id == current_user.workspace_id,
        Guideline.is_active == True
    )
    if category:
        query = query.filter(Guideline.category == category)
    guidelines = query.order_by(Guideline.created_at.desc()).all()
    return [GuidelineResponse.from_orm(g) for g in guidelines]

@router.post("", response_model=GuidelineResponse)
def create_guideline(
    payload: GuidelineCreate,
    current_user: User = Depends(require_roles([ROLE_ADMIN, ROLE_REVIEWER])),
    db: Session = Depends(get_db)
):
    guideline = Guideline(
        workspace_id=current_user.workspace_id,
        title=payload.title,
        category=payload.category,
        version=payload.version,
        authority=payload.authority,
        effective_date=payload.effective_date,
        expiry_date=payload.expiry_date,
        content=payload.content,
        is_active=True
    )
    db.add(guideline)
    db.commit()
    db.refresh(guideline)

    # Automatically chunk into indexed semantic passages for RAG retrieval
    chunks = rag_service.chunk_document(payload.content)
    for idx, c in enumerate(chunks):
        passage = GuidelinePassage(
            guideline_id=guideline.id,
            section=c.get("section", "General"),
            passage_text=c.get("text", ""),
            passage_index=idx
        )
        db.add(passage)
    db.commit()
    db.refresh(guideline)

    audit_service.log_event(
        db=db,
        workspace_id=current_user.workspace_id,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        action="GUIDELINE_CREATED_AND_INDEXED",
        details={"title": guideline.title, "passages_count": len(chunks)}
    )

    return GuidelineResponse.from_orm(guideline)

@router.get("/terminology", response_model=List[TerminologyRuleResponse])
def list_terminology_rules(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    rules = db.query(TerminologyRule).filter(
        TerminologyRule.workspace_id == current_user.workspace_id,
        TerminologyRule.is_active == True
    ).all()
    return [TerminologyRuleResponse.from_orm(r) for r in rules]

@router.post("/terminology", response_model=TerminologyRuleResponse)
def create_terminology_rule(
    payload: TerminologyRuleCreate,
    current_user: User = Depends(require_roles([ROLE_ADMIN, ROLE_REVIEWER])),
    db: Session = Depends(get_db)
):
    rule = TerminologyRule(
        workspace_id=current_user.workspace_id,
        prohibited_term=payload.prohibited_term,
        preferred_term=payload.preferred_term,
        rationale=payload.rationale,
        severity=payload.severity,
        is_active=True
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)

    audit_service.log_event(
        db=db,
        workspace_id=current_user.workspace_id,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        action="TERMINOLOGY_RULE_CONFIGURED",
        details={"prohibited": rule.prohibited_term, "preferred": rule.preferred_term}
    )

    return TerminologyRuleResponse.from_orm(rule)

@router.get("/assets", response_model=List[BrandAssetResponse])
def list_brand_assets(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    assets = db.query(BrandAsset).filter(
        BrandAsset.workspace_id == current_user.workspace_id
    ).all()
    return [BrandAssetResponse.from_orm(a) for a in assets]

@router.post("/assets", response_model=BrandAssetResponse)
def create_brand_asset(
    payload: BrandAssetCreate,
    current_user: User = Depends(require_roles([ROLE_ADMIN, ROLE_REVIEWER])),
    db: Session = Depends(get_db)
):
    asset = BrandAsset(
        workspace_id=current_user.workspace_id,
        name=payload.name,
        asset_type=payload.asset_type,
        file_path=payload.file_path,
        guidelines_note=payload.guidelines_note,
        is_authorized=payload.is_authorized
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return BrandAssetResponse.from_orm(asset)
