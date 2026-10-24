from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import User, AuditEvent, Notification
from app.schemas.all_schemas import AuditEventResponse, NotificationResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/events", response_model=List[AuditEventResponse])
def get_audit_trail(
    submission_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(AuditEvent).filter(AuditEvent.workspace_id == current_user.workspace_id)
    if submission_id:
        query = query.filter(AuditEvent.submission_id == submission_id)
    events = query.order_by(AuditEvent.created_at.desc()).limit(100).all()
    return [AuditEventResponse.from_orm(e) for e in events]

@router.get("/notifications", response_model=List[NotificationResponse])
def get_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notifs = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).limit(20).all()
    return [NotificationResponse.from_orm(n) for n in notifs]

@router.patch("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"status": "success"}
