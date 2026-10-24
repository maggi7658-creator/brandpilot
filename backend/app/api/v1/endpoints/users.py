from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import User
from app.schemas.all_schemas import UserResponse, UserRoleUpdate
from app.api.deps import get_current_user, require_roles
from app.core.security import ROLE_ADMIN, ALL_ROLES
from app.services.audit_service import audit_service

router = APIRouter()

@router.get("", response_model=List[UserResponse])
def list_workspace_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    users = db.query(User).filter(User.workspace_id == current_user.workspace_id).all()
    return [UserResponse.from_orm(u) for u in users]

@router.patch("/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: str,
    payload: UserRoleUpdate,
    current_user: User = Depends(require_roles([ROLE_ADMIN])),
    db: Session = Depends(get_db)
):
    if payload.role not in ALL_ROLES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role '{payload.role}'. Must be one of: {', '.join(ALL_ROLES)}"
        )

    user = db.query(User).filter(
        User.id == user_id,
        User.workspace_id == current_user.workspace_id
    ).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    old_role = user.role
    user.role = payload.role
    db.commit()
    db.refresh(user)

    audit_service.log_event(
        db=db,
        workspace_id=current_user.workspace_id,
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        action="USER_ROLE_UPDATED",
        details={"target_user": user.email, "from": old_role, "to": payload.role}
    )

    return UserResponse.from_orm(user)
