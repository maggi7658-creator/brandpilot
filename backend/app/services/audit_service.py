import json
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.entities import AuditEvent, Notification

class AuditService:
    @staticmethod
    def log_event(
        db: Session,
        workspace_id: str,
        actor_id: str,
        actor_name: str,
        actor_role: str,
        action: str,
        submission_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ) -> AuditEvent:
        """Create an immutable, append-only audit trail event."""
        details_str = json.dumps(details) if details else None
        event = AuditEvent(
            workspace_id=workspace_id,
            submission_id=submission_id,
            actor_id=actor_id,
            actor_name=actor_name,
            actor_role=actor_role,
            action=action,
            details_json=details_str
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    def notify_user(
        db: Session,
        user_id: str,
        title: str,
        message: str,
        link: Optional[str] = None
    ) -> Notification:
        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            link=link
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification

audit_service = AuditService()
