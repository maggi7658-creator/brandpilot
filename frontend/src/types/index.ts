export type UserRole = 'CREATOR' | 'REVIEWER' | 'LEGAL' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  workspace_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export type SubmissionStatus =
  | 'DRAFT'
  | 'ANALYZING'
  | 'NEEDS_REVISION'
  | 'UNDER_REVIEW'
  | 'APPROVED_WITH_CONDITIONS'
  | 'REJECTED'
  | 'READY_TO_PUBLISH';

export type FindingCategory =
  | 'claims'
  | 'tone'
  | 'terminology'
  | 'disclosures'
  | 'accessibility'
  | 'assets';

export type FindingSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ReviewFinding {
  id: string;
  submission_version_id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  affected_text: string;
  location?: string;
  explanation: string;
  supporting_evidence?: string;
  source_document_id?: string;
  source_document_title?: string;
  source_passage_id?: string;
  source_passage_text?: string;
  source_version?: string;
  source_effective_date?: string;
  confidence_level: 'high' | 'medium' | 'low' | 'uncertain';
  recommended_action: string;
  suggested_rewrite?: string;
  resolution_status: 'open' | 'accepted' | 'rejected' | 'resolved';
  reviewer_notes?: string;
  is_deterministic: boolean;
  created_at: string;
}

export interface SubmissionVersion {
  id: string;
  submission_id: string;
  version_number: number;
  content_type: 'text' | 'document' | 'url' | 'image';
  raw_content: string;
  source_filename?: string;
  file_url?: string;
  change_summary?: string;
  created_at: string;
  findings: ReviewFinding[];
}

export interface ApprovalDecision {
  id: string;
  submission_id: string;
  submission_version_number: number;
  decision: 'REQUEST_CHANGES' | 'APPROVE_WITH_CONDITIONS' | 'APPROVE' | 'REJECT';
  rationale: string;
  conditions?: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  created_at: string;
}

export interface ReviewerAssignment {
  id: string;
  submission_id: string;
  reviewer_id: string;
  reviewer_name?: string;
  reviewer_email?: string;
  role_type: string;
  assigned_at: string;
  completed_at?: string;
  status: 'PENDING' | 'COMPLETED';
}

export interface Submission {
  id: string;
  workspace_id: string;
  creator_id: string;
  creator_name?: string;
  title: string;
  channel: string;
  audience: string;
  purpose: string;
  sensitivity: 'standard' | 'regulated' | 'high_risk';
  status: SubmissionStatus;
  current_version_number: number;
  created_at: string;
  updated_at: string;
  versions?: SubmissionVersion[];
  decisions?: ApprovalDecision[];
  assignments?: ReviewerAssignment[];
}

export interface GuidelinePassage {
  id: string;
  guideline_id: string;
  section?: string;
  passage_text: string;
  passage_index: number;
}

export interface Guideline {
  id: string;
  workspace_id: string;
  title: string;
  category: string;
  version: string;
  authority: string;
  effective_date: string;
  expiry_date?: string;
  content: string;
  is_active: boolean;
  created_at: string;
  passages?: GuidelinePassage[];
}

export interface TerminologyRule {
  id: string;
  workspace_id: string;
  prohibited_term: string;
  preferred_term: string;
  rationale: string;
  severity: 'low' | 'medium' | 'high';
  is_active: boolean;
  created_at: string;
}

export interface BrandAsset {
  id: string;
  workspace_id: string;
  name: string;
  asset_type: string;
  file_path?: string;
  guidelines_note?: string;
  is_authorized: boolean;
  created_at: string;
}

export interface AuditEvent {
  id: string;
  workspace_id: string;
  submission_id?: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  details_json?: string;
  created_at: string;
}

export interface AnalyticsSummary {
  total_submissions: number;
  draft_count: number;
  under_review_count: number;
  needs_revision_count: number;
  approved_count: number;
  ready_to_publish_count: number;
  rejected_count: number;
  total_findings: number;
  findings_by_category: Record<string, number>;
  findings_by_severity: Record<string, number>;
  avg_turnaround_hours: number;
  common_violations: Array<{ phrase: string; count: number }>;
}

export interface DemoPersona {
  role: UserRole;
  title: string;
  email: string;
  password: string;
  description: string;
}
