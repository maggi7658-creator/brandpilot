from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import User
from app.schemas.all_schemas import AnalyticsSummaryResponse
from app.api.deps import get_current_user
from app.services.analytics_service import analytics_service

router = APIRouter()

@router.get("/summary", response_model=AnalyticsSummaryResponse)
def get_analytics_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    data = analytics_service.get_workspace_summary(db=db, workspace_id=current_user.workspace_id)
    return AnalyticsSummaryResponse(**data)
