from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import re

from app.core.security import verify_password, hash_password, create_access_token, ROLE_CREATOR, ROLE_REVIEWER, ROLE_LEGAL, ROLE_ADMIN
from app.db.session import get_db
from app.models.entities import User, Workspace
from app.schemas.all_schemas import UserLogin, UserRegister, TokenResponse, UserResponse
from app.api.deps import get_current_user
from app.services.audit_service import audit_service

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email.lower().strip()).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated."
        )

    token = create_access_token(
        subject=user.id,
        role=user.role,
        workspace_id=user.workspace_id
    )

    audit_service.log_event(
        db=db,
        workspace_id=user.workspace_id or "default",
        actor_id=user.id,
        actor_name=user.full_name,
        actor_role=user.role,
        action="USER_LOGGED_IN"
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )

@router.post("/register", response_model=TokenResponse)
def register(data: UserRegister, db: Session = Depends(get_db)):
    email = data.email.lower().strip()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Find or create workspace
    slug = re.sub(r'[^a-z0-9]+', '-', data.workspace_name.lower()).strip('-') or "acme-global"
    workspace = db.query(Workspace).filter(Workspace.slug == slug).first()
    if not workspace:
        workspace = Workspace(name=data.workspace_name, slug=slug)
        db.add(workspace)
        db.commit()
        db.refresh(workspace)

    # Initial registration always defaults strictly to Content Creator for security!
    user = User(
        email=email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        role=ROLE_CREATOR,
        workspace_id=workspace.id,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(
        subject=user.id,
        role=user.role,
        workspace_id=workspace.id
    )

    audit_service.log_event(
        db=db,
        workspace_id=workspace.id,
        actor_id=user.id,
        actor_name=user.full_name,
        actor_role=user.role,
        action="USER_REGISTERED"
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.from_orm(current_user)

@router.get("/demo-personas")
def get_demo_personas():
    """Provides preloaded demo accounts for effortless hackathon evaluation across all 4 roles."""
    return [
        {
            "role": ROLE_CREATOR,
            "title": "Content Creator",
            "email": "creator@brandpilot.local",
            "password": "Password123!",
            "description": "Can draft submissions, paste text/upload files, initiate AI reviews, and create revisions."
        },
        {
            "role": ROLE_REVIEWER,
            "title": "Brand Reviewer / Manager",
            "email": "reviewer@brandpilot.local",
            "password": "Password123!",
            "description": "Reviews brand voice, messaging, and gives final marketing approval."
        },
        {
            "role": ROLE_LEGAL,
            "title": "Legal & Compliance Officer",
            "email": "legal@brandpilot.local",
            "password": "Password123!",
            "description": "Reviews high-risk claims, regulatory disclosures, and validates legal compliance."
        },
        {
            "role": ROLE_ADMIN,
            "title": "Workspace Administrator",
            "email": "admin@brandpilot.local",
            "password": "Password123!",
            "description": "Configures approved guidelines, terminology rules, and user roles."
        }
    ]
