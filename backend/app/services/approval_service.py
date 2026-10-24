from typing import Tuple, List, Optional
from sqlalchemy.orm import Session
from app.core.security import ROLE_CREATOR, ROLE_REVIEWER, ROLE_LEGAL, ROLE_ADMIN
from app.models.entities import Submission, SubmissionVersion, ApprovalDecision, ReviewFinding, User
from app.services.audit_service import audit_service

class ApprovalError(Exception):
    pass

class ApprovalService:
    @staticmethod
    def can_user_approve(actor: User, submission: Submission) -> Tuple[bool, str]:
        """Enforce approval gates and authorization rules."""
        # 1. Prevent Self-Approval
        if actor.id == submission.creator_id:
            return False, "Self-approval is strictly prohibited by brand governance policy. A separate authorized reviewer must approve."

        # 2. Check Role Authority
        if actor.role == ROLE_CREATOR:
            return False, "Creators do not possess approval authority."

        # 3. Check Legal routing requirement
        if submission.sensitivity == "high_risk" and actor.role != ROLE_LEGAL and actor.role != ROLE_ADMIN:
            # Check if legal approval has already occurred
            has_legal_decision = any(
                d.actor_role == ROLE_LEGAL and d.decision in ("APPROVE", "APPROVE_WITH_CONDITIONS")
                for d in submission.decisions
                if d.submission_version_number == submission.current_version_number
            )
            if not has_legal_decision:
                return False, "High-risk submissions require explicit Legal or Compliance review before final manager approval."

        return True, "Authorized"

    @classmethod
    def record_decision(
        cls,
        db: Session,
        submission: Submission,
        actor: User,
        decision: str,  # REQUEST_CHANGES, APPROVE_WITH_CONDITIONS, APPROVE, REJECT
        rationale: str,
        conditions: Optional[str] = None
    ) -> ApprovalDecision:
        """Record human review decision and transition status."""
        can_approve, reason = cls.can_user_approve(actor, submission)
        if not can_approve:
            # For logging attempted bypass
            audit_service.log_event(
                db=db,
                workspace_id=submission.workspace_id,
                actor_id=actor.id,
                actor_name=actor.full_name,
                actor_role=actor.role,
                action="APPROVAL_ATTEMPT_BLOCKED",
                submission_id=submission.id,
                details={"reason": reason, "decision_attempted": decision}
            )
            raise ApprovalError(reason)

        # Create approval record
        approval = ApprovalDecision(
            submission_id=submission.id,
            submission_version_number=submission.current_version_number,
            decision=decision,
            rationale=rationale,
            conditions=conditions,
            actor_id=actor.id,
            actor_name=actor.full_name,
            actor_role=actor.role
        )
        db.add(approval)

        # Update submission status according to state machine
        if decision == "REQUEST_CHANGES":
            submission.status = "NEEDS_REVISION"
            audit_action = "CHANGES_REQUESTED"
        elif decision == "REJECT":
            submission.status = "REJECTED"
            audit_action = "SUBMISSION_REJECTED"
        elif decision == "APPROVE_WITH_CONDITIONS":
            submission.status = "APPROVED_WITH_CONDITIONS"
            audit_action = "APPROVED_WITH_CONDITIONS"
        elif decision == "APPROVE":
            # If high-risk, verify if legal approval is also needed
            if submission.sensitivity == "high_risk" and actor.role != ROLE_LEGAL:
                submission.status = "UNDER_REVIEW"  # Still pending legal
                audit_action = "MANAGER_APPROVED_PENDING_LEGAL"
            else:
                submission.status = "READY_TO_PUBLISH"
                audit_action = "READY_TO_PUBLISH"
        else:
            raise ApprovalError(f"Unknown decision type: {decision}")

        db.commit()
        db.refresh(approval)
        db.refresh(submission)

        # Log to audit trail
        audit_service.log_event(
            db=db,
            workspace_id=submission.workspace_id,
            actor_id=actor.id,
            actor_name=actor.full_name,
            actor_role=actor.role,
            action=audit_action,
            submission_id=submission.id,
            details={
                "version_number": submission.current_version_number,
                "decision": decision,
                "rationale": rationale,
                "conditions": conditions,
                "new_status": submission.status
            }
        )

        # Notify creator
        audit_service.notify_user(
            db=db,
            user_id=submission.creator_id,
            title=f"Review Decision: {submission.title}",
            message=f"{actor.full_name} ({actor.role}) marked submission as {decision.replace('_', ' ')}.",
            link=f"/app/submissions/{submission.id}"
        )

        return approval

    @classmethod
    def mark_ready_to_publish(cls, db: Session, submission: Submission, actor: User) -> Submission:
        """Final transition to Ready to Publish with strict safety gates."""
        if actor.role not in (ROLE_REVIEWER, ROLE_LEGAL, ROLE_ADMIN):
            raise ApprovalError("Only authorized reviewers or administrators can mark content Ready to Publish.")

        # Check if any blocking condition remains
        current_version = next((v for v in submission.versions if v.version_number == submission.current_version_number), None)
        if current_version:
            open_critical = [
                f for f in current_version.findings 
                if f.severity in ("critical", "high") and f.resolution_status == "open"
            ]
            if open_critical:
                raise ApprovalError(f"Cannot publish: {len(open_critical)} high/critical risk findings remain unresolved.")

        # Check if an approval decision is present
        current_approvals = [
            d for d in submission.decisions 
            if d.submission_version_number == submission.current_version_number
            and d.decision in ("APPROVE", "APPROVE_WITH_CONDITIONS")
        ]
        if not current_approvals:
            raise ApprovalError("Cannot publish without a documented approval decision from an authorized human reviewer.")

        submission.status = "READY_TO_PUBLISH"
        db.commit()
        db.refresh(submission)

        audit_service.log_event(
            db=db,
            workspace_id=submission.workspace_id,
            actor_id=actor.id,
            actor_name=actor.full_name,
            actor_role=actor.role,
            action="FINAL_PUBLISH_AUTHORIZATION",
            submission_id=submission.id,
            details={"version_number": submission.current_version_number}
        )

        return submission

approval_service = ApprovalService()
