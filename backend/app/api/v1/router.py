from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    submissions,
    approvals,
    reviews,
    guidelines,
    analytics,
    audit,
    users
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(submissions.router, prefix="/submissions", tags=["Submissions"])
api_router.include_router(approvals.router, prefix="/approvals", tags=["Approvals"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reviews & Findings"])
api_router.include_router(guidelines.router, prefix="/guidelines", tags=["Guidelines & Knowledge"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(audit.router, prefix="/audit", tags=["Audit & Notifications"])
api_router.include_router(users.router, prefix="/users", tags=["Users & Access"])
