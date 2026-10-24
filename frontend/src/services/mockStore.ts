import {
  User,
  Submission,
  SubmissionVersion,
  ReviewFinding,
  ApprovalDecision,
  Guideline,
  TerminologyRule,
  BrandAsset,
  AuditEvent,
  AnalyticsSummary,
  DemoPersona,
  UserRole,
  SubmissionStatus,
  FindingCategory,
  FindingSeverity
} from '@/types';

const INITIAL_PERSONAS: DemoPersona[] = [
  {
    role: 'CREATOR',
    title: 'Sarah Chen · Content Creator',
    email: 'creator@brandpilot.local',
    password: 'Password123!',
    description: 'Drafts content, uploads files, triggers AI checks. Cannot self-approve.',
  },
  {
    role: 'REVIEWER',
    title: 'Marcus Vance · Brand Reviewer',
    email: 'reviewer@brandpilot.local',
    password: 'Password123!',
    description: 'Reviews claims, checks brand tone and voice, requests copy changes, grants sign-off.',
  },
  {
    role: 'LEGAL',
    title: 'Elena Rostova · Legal & Compliance',
    email: 'legal@brandpilot.local',
    password: 'Password123!',
    description: 'Assesses high-risk claims, SLA discrepancies, and mandatory regulatory disclosures.',
  },
  {
    role: 'ADMIN',
    title: 'David Sterling · Administrator',
    email: 'admin@brandpilot.local',
    password: 'Password123!',
    description: 'Manages brand guidelines, terminology rules, brand assets, and user roles.',
  },
];

const INITIAL_USERS: User[] = [
  {
    id: 'user-creator',
    email: 'creator@brandpilot.local',
    full_name: 'Sarah Chen',
    role: 'CREATOR',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'user-reviewer',
    email: 'reviewer@brandpilot.local',
    full_name: 'Marcus Vance',
    role: 'REVIEWER',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: 'user-legal',
    email: 'legal@brandpilot.local',
    full_name: 'Elena Rostova',
    role: 'LEGAL',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
  {
    id: 'user-admin',
    email: 'admin@brandpilot.local',
    full_name: 'David Sterling',
    role: 'ADMIN',
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 90).toISOString(),
  },
];

const INITIAL_GUIDELINES: Guideline[] = [
  {
    id: 'guide-sla',
    workspace_id: 'default',
    title: 'Acme Global Service Availability & SLA Policy',
    category: 'SLA_POLICY',
    version: '2.4',
    authority: 'Infrastructure & Legal Governance Committee',
    effective_date: '2026-01-01',
    is_active: true,
    content: `Section 1: Service Availability Target
We commit to a 99.9% monthly uptime target across standard production regions. Statements describing service availability as "100%" or "always available" are strictly prohibited in public communications as they create unindemnified legal liabilities.

Section 2: Maintenance Windows
Scheduled maintenance announced with at least 48 hours notice is excluded from uptime calculations. Any claim citing uptime availability must link to or reference the standard SLA exclusions page.

Section 3: Geographic Redundancy
Multi-region automated failover is supported only on Enterprise Tier deployments and must not be promised for Standard or Free Tier configurations.`,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'guide-voice',
    workspace_id: 'default',
    title: 'Acme Enterprise Brand Voice & Style Guide',
    category: 'VOICE_AND_TONE',
    version: '3.1',
    authority: 'Chief Marketing Officer',
    effective_date: '2026-01-15',
    is_active: true,
    content: `Tone Pillars:
1. Confident but measured: Avoid exaggerated superlatives like "insane", "miraculous", or "revolutionary".
2. Respectful and professional: We communicate with corporate decision makers. Avoid casual colloquialisms.
3. Transparent: Acknowledge operational parameters rather than making absolute statements without nuance.`,
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'guide-legal',
    workspace_id: 'default',
    title: 'Regulatory & Risk Disclosure Standard',
    category: 'LEGAL_DISCLAIMER',
    version: '1.8',
    authority: 'Corporate Legal & Compliance',
    effective_date: '2026-02-01',
    is_active: true,
    content: `Mandatory Qualifications:
1. Forward-looking capabilities must state: "Forward-looking statements are subject to technical developments."
2. Performance claims must include: "Performance benchmarks reflect controlled lab conditions. Actual customer results may vary."
3. Security guarantees: Never use "risk-free" or "100% secure". Use "engineered according to defense-in-depth security standards."`,
    created_at: '2026-02-01T00:00:00Z',
  },
];

const INITIAL_TERMINOLOGY: TerminologyRule[] = [
  {
    id: 'term-1',
    workspace_id: 'default',
    prohibited_term: 'cheap',
    preferred_term: 'cost-effective',
    rationale: 'Avoid colloquial terminology that degrades premium enterprise positioning.',
    severity: 'medium',
    is_active: true,
    created_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'term-2',
    workspace_id: 'default',
    prohibited_term: 'always available',
    preferred_term: 'designed for 99.9% uptime availability',
    rationale: 'Violates Section 1 of Acme Global SLA Policy v2.4 (maximum commitment is 99.9%).',
    severity: 'high',
    is_active: true,
    created_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'term-3',
    workspace_id: 'default',
    prohibited_term: 'artificial intelligence bot',
    preferred_term: 'AI Assistant',
    rationale: 'Designates official approved product naming architecture.',
    severity: 'medium',
    is_active: true,
    created_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'term-4',
    workspace_id: 'default',
    prohibited_term: 'without any risk',
    preferred_term: 'with enterprise-grade security and risk mitigations',
    rationale: 'Absolute claims of zero risk violate compliance rules.',
    severity: 'high',
    is_active: true,
    created_at: '2026-01-10T00:00:00Z',
  },
];

const INITIAL_ASSETS: BrandAsset[] = [
  {
    id: 'asset-1',
    workspace_id: 'default',
    name: 'BrandPilot Primary Logo (Horizontal / Dark Slate on Light)',
    asset_type: 'LOGO',
    file_path: '/assets/logo-primary.svg',
    guidelines_note: 'Minimum clear space of 24px on all sides. Do not stretch or recolor.',
    is_authorized: true,
    created_at: '2026-01-05T00:00:00Z',
  },
  {
    id: 'asset-2',
    workspace_id: 'default',
    name: 'BrandPilot Monogram Shield Icon (Royal Blue)',
    asset_type: 'ICON',
    file_path: '/assets/icon-shield.svg',
    guidelines_note: 'Approved for app favicons, avatars, and sidebars.',
    is_authorized: true,
    created_at: '2026-01-05T00:00:00Z',
  },
];

const INITIAL_FINDINGS: ReviewFinding[] = [
  {
    id: 'find-1',
    submission_version_id: 'ver-1',
    category: 'claims',
    severity: 'critical',
    affected_text: 'always available',
    explanation: 'Absolute uptime claim directly conflicts with the approved Acme SLA policy target of 99.9%. "Always available" creates uncontrolled breach-of-contract liability.',
    supporting_evidence: 'Acme Global Service Availability & SLA Policy (v2.4), Section 1: "We commit to a 99.9% monthly uptime target across standard production regions... Statements describing service availability as \'100%\' or \'always available\' are strictly prohibited."',
    source_document_title: 'Acme Global Service Availability & SLA Policy (v2.4)',
    suggested_rewrite: 'engineered for 99.9% uptime availability with enterprise redundancy',
    confidence_level: 'high',
    recommended_action: 'Replace absolute uptime wording with approved SLA commitment.',
    is_deterministic: true,
    resolution_status: 'open',
    created_at: new Date(Date.now() - 3600000 * 3.8).toISOString(),
  },
  {
    id: 'find-2',
    submission_version_id: 'ver-1',
    category: 'terminology',
    severity: 'medium',
    affected_text: 'cheap',
    explanation: 'Informal terminology detracts from enterprise market positioning.',
    supporting_evidence: 'Acme Corporate Terminology Rule TR-104: Use "cost-effective" or "efficient" instead of "cheap".',
    source_document_title: 'Acme Terminology Architecture',
    suggested_rewrite: 'cost-effective',
    confidence_level: 'high',
    recommended_action: 'Substitute with approved enterprise term.',
    is_deterministic: true,
    resolution_status: 'open',
    created_at: new Date(Date.now() - 3600000 * 3.8).toISOString(),
  },
  {
    id: 'find-3',
    submission_version_id: 'ver-1',
    category: 'terminology',
    severity: 'medium',
    affected_text: 'artificial intelligence bot',
    explanation: 'Incorrect product name according to the global Product Naming Architecture.',
    supporting_evidence: 'Product Naming Architecture v3.0: Enterprise generative interfaces must be designated as "AI Assistant".',
    source_document_title: 'Product Naming Architecture v3.0',
    suggested_rewrite: 'AI Assistant',
    confidence_level: 'high',
    recommended_action: 'Use official product brand name.',
    is_deterministic: true,
    resolution_status: 'open',
    created_at: new Date(Date.now() - 3600000 * 3.8).toISOString(),
  },
  {
    id: 'find-4',
    submission_version_id: 'ver-1',
    category: 'tone',
    severity: 'medium',
    affected_text: 'insane',
    explanation: 'Colloquial hyperbole inconsistent with enterprise advertising tone standards.',
    supporting_evidence: 'Acme Enterprise Brand Voice Guide (v3.1): "Avoid exaggerated superlatives like \'insane\', \'miraculous\', or \'revolutionary\'."',
    source_document_title: 'Acme Brand Voice Guide',
    suggested_rewrite: 'exceptional',
    confidence_level: 'medium',
    recommended_action: 'Adopt measured enterprise tone.',
    is_deterministic: false,
    resolution_status: 'open',
    created_at: new Date(Date.now() - 3600000 * 3.8).toISOString(),
  },
  {
    id: 'find-5',
    submission_version_id: 'ver-1',
    category: 'disclosures',
    severity: 'high',
    affected_text: 'without any risk',
    explanation: 'Absolute risk-free assertion without standard disclaimer violates Regulatory Standard RS-202.',
    supporting_evidence: 'Regulatory Standard RS-202: "Never use \'risk-free\' or \'100% secure\'. Use \'engineered according to defense-in-depth security standards\'."',
    source_document_title: 'Regulatory & Risk Disclosure Standard',
    suggested_rewrite: 'with enterprise-grade security and comprehensive SLA assurances',
    confidence_level: 'high',
    recommended_action: 'Add qualification disclaimer regarding lab benchmarks and maintenance windows.',
    is_deterministic: true,
    resolution_status: 'open',
    created_at: new Date(Date.now() - 3600000 * 3.8).toISOString(),
  },
];

const INITIAL_SUBMISSION: Submission = {
  id: 'sub-section19',
  workspace_id: 'default',
  title: 'Q1 Global Cloud Launch Campaign Copy (Section 19 SLA Scenario)',
  channel: 'advertising',
  audience: 'Enterprise Decision Makers',
  purpose: 'Global product announcement highlighting platform availability, compute speed, and risk posture.',
  sensitivity: 'standard',
  status: 'NEEDS_REVISION',
  creator_id: 'user-creator',
  creator_name: 'Sarah Chen',
  current_version_number: 1,
  created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  versions: [
    {
      id: 'ver-1',
      submission_id: 'sub-section19',
      version_number: 1,
      content_type: 'text',
      raw_content: 'Our service is always available. We provide cheap and fast compute with our artificial intelligence bot that gives insane performance without any risk.',
      change_summary: 'Initial draft submitted by creator for cross-departmental review.',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      findings: INITIAL_FINDINGS,
    },
  ],
  decisions: [],
};

const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'audit-1',
    workspace_id: 'default',
    submission_id: 'sub-section19',
    actor_id: 'user-creator',
    actor_name: 'Sarah Chen',
    actor_role: 'CREATOR',
    action: 'SUBMISSION_CREATED',
    details_json: JSON.stringify({ message: 'Submitted "Q1 Global Cloud Launch Campaign Copy (Section 19 SLA Scenario)"' }),
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'audit-2',
    workspace_id: 'default',
    submission_id: 'sub-section19',
    actor_id: 'system',
    actor_name: 'BrandPilot RAG Engine',
    actor_role: 'AI_AGENT',
    action: 'ANALYSIS_COMPLETED',
    details_json: JSON.stringify({ message: 'Completed policy & RAG review: 5 findings identified (1 Critical, 1 High, 3 Medium)' }),
    created_at: new Date(Date.now() - 3600000 * 3.8).toISOString(),
  },
];

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`bp_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`bp_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

export class MockStore {
  private users: User[];
  private guidelines: Guideline[];
  private terminology: TerminologyRule[];
  private assets: BrandAsset[];
  private submissions: Submission[];
  private auditEvents: AuditEvent[];

  constructor() {
    this.users = getStored('users', INITIAL_USERS);
    this.guidelines = getStored('guidelines', INITIAL_GUIDELINES);
    this.terminology = getStored('terminology', INITIAL_TERMINOLOGY);
    this.assets = getStored('assets', INITIAL_ASSETS);
    this.submissions = getStored('submissions', [INITIAL_SUBMISSION]);
    this.auditEvents = getStored('audit', INITIAL_AUDIT_EVENTS);
  }

  private persist() {
    setStored('users', this.users);
    setStored('guidelines', this.guidelines);
    setStored('terminology', this.terminology);
    setStored('assets', this.assets);
    setStored('submissions', this.submissions);
    setStored('audit', this.auditEvents);
  }

  async login(email: string): Promise<{ access_token: string; user: User }> {
    const found = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        role: 'CREATOR',
        is_active: true,
        created_at: new Date().toISOString(),
      };
      this.users.push(newUser);
      this.persist();
      return { access_token: `mock-token-${newUser.id}`, user: newUser };
    }
    return { access_token: `mock-token-${found.id}`, user: found };
  }

  async getDemoPersonas(): Promise<DemoPersona[]> {
    return INITIAL_PERSONAS;
  }

  async listSubmissions(params?: { channel?: string; status?: string }): Promise<Submission[]> {
    let list = [...this.submissions];
    if (params?.channel) {
      list = list.filter((s) => s.channel === params.channel);
    }
    if (params?.status) {
      list = list.filter((s) => s.status === params.status);
    }
    return list;
  }

  async getSubmission(id: string): Promise<Submission> {
    const found = this.submissions.find((s) => s.id === id);
    if (!found) throw new Error(`Submission ${id} not found`);
    return found;
  }

  async createSubmission(
    payload: {
      title: string;
      channel: string;
      audience: string;
      purpose: string;
      sensitivity?: string;
      content_type?: string;
      raw_content: string;
      source_filename?: string;
      url?: string;
    },
    currentUser: User
  ): Promise<Submission> {
    const subId = `sub-${Date.now()}`;
    const verId = `ver-${Date.now()}`;
    const findings = this.analyzeContentLocally(payload.raw_content, verId);
    
    const sensitivityVal = (['standard', 'regulated', 'high_risk'].includes(payload.sensitivity || '')
      ? payload.sensitivity
      : 'standard') as 'standard' | 'regulated' | 'high_risk';

    const newSub: Submission = {
      id: subId,
      workspace_id: 'default',
      title: payload.title,
      channel: payload.channel,
      audience: payload.audience,
      purpose: payload.purpose,
      sensitivity: sensitivityVal,
      status: findings.length > 0 ? 'NEEDS_REVISION' : 'UNDER_REVIEW',
      creator_id: currentUser.id,
      creator_name: currentUser.full_name,
      current_version_number: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      versions: [
        {
          id: verId,
          submission_id: subId,
          version_number: 1,
          content_type: 'text',
          raw_content: payload.raw_content,
          change_summary: 'Initial draft submitted',
          created_at: new Date().toISOString(),
          findings,
        },
      ],
      decisions: [],
    };

    this.submissions.unshift(newSub);
    this.auditEvents.unshift({
      id: `audit-${Date.now()}`,
      workspace_id: 'default',
      submission_id: subId,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      actor_role: currentUser.role,
      action: 'SUBMISSION_CREATED',
      details_json: JSON.stringify({ message: `Created submission: "${newSub.title}"` }),
      created_at: new Date().toISOString(),
    });

    this.persist();
    return newSub;
  }

  async triggerAnalysis(submissionId: string): Promise<Submission> {
    const sub = await this.getSubmission(submissionId);
    if (!sub.versions || sub.versions.length === 0) return sub;
    const latestVersion = sub.versions[sub.versions.length - 1];
    const findings = this.analyzeContentLocally(latestVersion.raw_content, latestVersion.id);
    latestVersion.findings = findings;
    sub.status = findings.length > 0 ? 'NEEDS_REVISION' : 'UNDER_REVIEW';

    this.auditEvents.unshift({
      id: `audit-${Date.now()}`,
      workspace_id: 'default',
      submission_id: sub.id,
      actor_id: 'system',
      actor_name: 'BrandPilot RAG Engine',
      actor_role: 'AI_AGENT',
      action: 'ANALYSIS_COMPLETED',
      details_json: JSON.stringify({ message: `Re-analyzed content: ${findings.length} findings detected.` }),
      created_at: new Date().toISOString(),
    });

    this.persist();
    return sub;
  }

  async createRevision(
    submissionId: string,
    payload: { raw_content: string; change_summary: string },
    currentUser: User
  ): Promise<Submission> {
    const sub = await this.getSubmission(submissionId);
    const newVersionNumber = sub.current_version_number + 1;
    const verId = `ver-${Date.now()}`;
    const findings = this.analyzeContentLocally(payload.raw_content, verId);

    const newVer: SubmissionVersion = {
      id: verId,
      submission_id: sub.id,
      version_number: newVersionNumber,
      content_type: 'text',
      raw_content: payload.raw_content,
      change_summary: payload.change_summary || `Created revision v${newVersionNumber}`,
      created_at: new Date().toISOString(),
      findings,
    };

    if (!sub.versions) sub.versions = [];
    sub.decisions = [];
    sub.versions.push(newVer);
    sub.current_version_number = newVersionNumber;
    sub.status = findings.length > 0 ? 'NEEDS_REVISION' : 'UNDER_REVIEW';
    sub.updated_at = new Date().toISOString();

    this.auditEvents.unshift({
      id: `audit-${Date.now()}`,
      workspace_id: 'default',
      submission_id: sub.id,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      actor_role: currentUser.role,
      action: 'REVISION_CREATED',
      details_json: JSON.stringify({ message: `Created revision v${newVersionNumber}: "${payload.change_summary}" (Prior approvals invalidated).` }),
      created_at: new Date().toISOString(),
    });

    this.persist();
    return sub;
  }

  async recordDecision(
    submissionId: string,
    payload: { decision: string; rationale: string; conditions?: string },
    currentUser: User
  ): Promise<ApprovalDecision> {
    const sub = await this.getSubmission(submissionId);

    // ENFORCE SEPARATION OF DUTIES: Creator cannot self-approve
    if (sub.creator_id === currentUser.id && (payload.decision === 'APPROVE' || payload.decision === 'APPROVE_WITH_CONDITIONS')) {
      throw new Error('403 Forbidden: Content creators cannot approve their own submissions. Separation of duties is strictly enforced.');
    }

    const latestVerNumber = sub.versions && sub.versions.length > 0
      ? sub.versions[sub.versions.length - 1].version_number
      : sub.current_version_number;

    const mappedDecision = (['REQUEST_CHANGES', 'APPROVE_WITH_CONDITIONS', 'APPROVE', 'REJECT'].includes(payload.decision)
      ? payload.decision
      : 'APPROVE') as 'REQUEST_CHANGES' | 'APPROVE_WITH_CONDITIONS' | 'APPROVE' | 'REJECT';

    const decision: ApprovalDecision = {
      id: `decision-${Date.now()}`,
      submission_id: sub.id,
      submission_version_number: latestVerNumber,
      decision: mappedDecision,
      rationale: payload.rationale,
      conditions: payload.conditions,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      actor_role: currentUser.role,
      created_at: new Date().toISOString(),
    };

    if (!sub.decisions) sub.decisions = [];
    sub.decisions.push(decision);

    if (payload.decision === 'APPROVE') {
      sub.status = 'READY_TO_PUBLISH';
    } else if (payload.decision === 'REJECT') {
      sub.status = 'REJECTED';
    } else if (payload.decision === 'APPROVE_WITH_CONDITIONS') {
      sub.status = 'APPROVED_WITH_CONDITIONS';
    } else if (payload.decision === 'REQUEST_CHANGES') {
      sub.status = 'NEEDS_REVISION';
    }

    this.auditEvents.unshift({
      id: `audit-${Date.now()}`,
      workspace_id: 'default',
      submission_id: sub.id,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      actor_role: currentUser.role,
      action: 'DECISION_RECORDED',
      details_json: JSON.stringify({ message: `${currentUser.role} decision: ${payload.decision}. Rationale: "${payload.rationale}"` }),
      created_at: new Date().toISOString(),
    });

    this.persist();
    return decision;
  }

  async markReadyToPublish(submissionId: string, currentUser: User): Promise<Submission> {
    const sub = await this.getSubmission(submissionId);

    const hasApproval = sub.decisions && sub.decisions.some((a) => a.decision === 'APPROVE' || a.decision === 'APPROVE_WITH_CONDITIONS');
    if (!hasApproval && sub.status !== 'APPROVED_WITH_CONDITIONS' && sub.status !== 'READY_TO_PUBLISH') {
      throw new Error('Cannot publish without authorized human approval.');
    }

    sub.status = 'READY_TO_PUBLISH';
    sub.updated_at = new Date().toISOString();

    this.auditEvents.unshift({
      id: `audit-${Date.now()}`,
      workspace_id: 'default',
      submission_id: sub.id,
      actor_id: currentUser.id,
      actor_name: currentUser.full_name,
      actor_role: currentUser.role,
      action: 'MARKED_READY_TO_PUBLISH',
      details_json: JSON.stringify({ message: 'Content approved for publication release by human reviewer.' }),
      created_at: new Date().toISOString(),
    });

    this.persist();
    return sub;
  }

  async updateFindingStatus(findingId: string, status: string, notes?: string): Promise<ReviewFinding> {
    const validStatus = (['open', 'accepted', 'rejected', 'resolved'].includes(status) ? status : 'open') as 'open' | 'accepted' | 'rejected' | 'resolved';
    for (const sub of this.submissions) {
      if (sub.versions) {
        for (const ver of sub.versions) {
          const found = ver.findings.find((f) => f.id === findingId);
          if (found) {
            found.resolution_status = validStatus;
            found.reviewer_notes = notes;
            this.persist();
            return found;
          }
        }
      }
    }
    throw new Error('Finding not found');
  }

  async listGuidelines(): Promise<Guideline[]> {
    return this.guidelines;
  }

  async createGuideline(payload: Omit<Guideline, 'id' | 'created_at' | 'is_active' | 'workspace_id'>): Promise<Guideline> {
    const newG: Guideline = {
      ...payload,
      id: `guide-${Date.now()}`,
      workspace_id: 'default',
      is_active: true,
      created_at: new Date().toISOString(),
    };
    this.guidelines.unshift(newG);
    this.persist();
    return newG;
  }

  async listTerminology(): Promise<TerminologyRule[]> {
    return this.terminology;
  }

  async createTerminology(payload: Omit<TerminologyRule, 'id' | 'created_at' | 'workspace_id' | 'is_active'>): Promise<TerminologyRule> {
    const newT: TerminologyRule = {
      ...payload,
      id: `term-${Date.now()}`,
      workspace_id: 'default',
      is_active: true,
      created_at: new Date().toISOString(),
    };
    this.terminology.unshift(newT);
    this.persist();
    return newT;
  }

  async listAssets(): Promise<BrandAsset[]> {
    return this.assets;
  }

  async listUsers(): Promise<User[]> {
    return this.users;
  }

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    const u = this.users.find((user) => user.id === userId);
    if (!u) throw new Error('User not found');
    u.role = role;
    this.persist();
    return u;
  }

  async getAuditTrail(submissionId?: string): Promise<AuditEvent[]> {
    if (submissionId) {
      return this.auditEvents.filter((a) => a.submission_id === submissionId);
    }
    return this.auditEvents;
  }

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    const totalSubs = this.submissions.length;
    const readyCount = this.submissions.filter((s) => s.status === 'READY_TO_PUBLISH').length;
    const underReviewCount = this.submissions.filter((s) => s.status === 'UNDER_REVIEW').length;
    const needsRevCount = this.submissions.filter((s) => s.status === 'NEEDS_REVISION').length;
    const approvedCount = this.submissions.filter((s) => s.status === 'APPROVED_WITH_CONDITIONS' || s.status === 'READY_TO_PUBLISH').length;
    const rejectedCount = this.submissions.filter((s) => s.status === 'REJECTED').length;

    return {
      total_submissions: totalSubs,
      draft_count: 0,
      under_review_count: underReviewCount,
      needs_revision_count: needsRevCount,
      approved_count: approvedCount,
      ready_to_publish_count: readyCount,
      rejected_count: rejectedCount,
      total_findings: 5,
      findings_by_category: {
        claims: 1,
        terminology: 2,
        tone: 1,
        disclosures: 1,
      },
      findings_by_severity: {
        critical: 1,
        high: 1,
        medium: 3,
        low: 0,
      },
      avg_turnaround_hours: 3.2,
      common_violations: [
        { phrase: 'always available (SLA policy breach)', count: 14 },
        { phrase: 'cheap (restricted term)', count: 9 },
        { phrase: 'without any risk (missing disclaimer)', count: 6 },
      ],
    };
  }

  private analyzeContentLocally(text: string, versionId: string): ReviewFinding[] {
    const findings: ReviewFinding[] = [];
    const lower = text.toLowerCase();

    if (lower.includes('always available') || lower.includes('100% uptime') || lower.includes('100% available')) {
      findings.push({
        id: `find-${Date.now()}-1`,
        submission_version_id: versionId,
        category: 'claims',
        severity: 'critical',
        affected_text: lower.includes('always available') ? 'always available' : '100% uptime',
        explanation: 'Absolute uptime commitment directly conflicts with Section 1 of Acme Global SLA Policy v2.4 (maximum commitment is 99.9%).',
        supporting_evidence: 'Acme Global Service Availability & SLA Policy (v2.4), Section 1: "We commit to a 99.9% monthly uptime target across standard production regions... Statements describing service availability as \'100%\' or \'always available\' are strictly prohibited."',
        source_document_title: 'Acme Global Service Availability & SLA Policy (v2.4)',
        suggested_rewrite: 'engineered for 99.9% uptime availability with enterprise redundancy',
        confidence_level: 'high',
        recommended_action: 'Replace absolute uptime wording with approved SLA commitment.',
        is_deterministic: true,
        resolution_status: 'open',
        created_at: new Date().toISOString(),
      });
    }

    if (lower.includes('cheap')) {
      findings.push({
        id: `find-${Date.now()}-2`,
        submission_version_id: versionId,
        category: 'terminology',
        severity: 'medium',
        affected_text: 'cheap',
        explanation: 'Informal terminology that degrades brand positioning. Use approved enterprise phrasing.',
        supporting_evidence: 'Acme Corporate Terminology Rule TR-104: Use "cost-effective" instead of "cheap".',
        source_document_title: 'Acme Corporate Terminology Architecture',
        suggested_rewrite: 'cost-effective',
        confidence_level: 'high',
        recommended_action: 'Substitute with approved enterprise term.',
        is_deterministic: true,
        resolution_status: 'open',
        created_at: new Date().toISOString(),
      });
    }

    if (lower.includes('artificial intelligence bot') || lower.includes('ai bot')) {
      findings.push({
        id: `find-${Date.now()}-3`,
        submission_version_id: versionId,
        category: 'terminology',
        severity: 'medium',
        affected_text: lower.includes('artificial intelligence bot') ? 'artificial intelligence bot' : 'ai bot',
        explanation: 'Unapproved product designation. Follow the official Product Naming Architecture.',
        supporting_evidence: 'Product Naming Architecture v3.0: All generative features must be branded as "AI Assistant".',
        source_document_title: 'Product Naming Architecture v3.0',
        suggested_rewrite: 'AI Assistant',
        confidence_level: 'high',
        recommended_action: 'Use official product brand name.',
        is_deterministic: true,
        resolution_status: 'open',
        created_at: new Date().toISOString(),
      });
    }

    if (lower.includes('insane') || lower.includes('miraculous') || lower.includes('crazy')) {
      findings.push({
        id: `find-${Date.now()}-4`,
        submission_version_id: versionId,
        category: 'tone',
        severity: 'medium',
        affected_text: lower.includes('insane') ? 'insane' : 'miraculous',
        explanation: 'Colloquial hyperbole inconsistent with enterprise tone and voice standards.',
        supporting_evidence: 'Acme Enterprise Brand Voice Guide (v3.1): "Avoid exaggerated superlatives like \'insane\', \'miraculous\', or \'revolutionary\'."',
        source_document_title: 'Acme Enterprise Brand Voice Guide',
        suggested_rewrite: 'exceptional',
        confidence_level: 'medium',
        recommended_action: 'Adopt measured enterprise tone.',
        is_deterministic: false,
        resolution_status: 'open',
        created_at: new Date().toISOString(),
      });
    }

    if (lower.includes('without any risk') || lower.includes('risk-free') || lower.includes('no risk')) {
      findings.push({
        id: `find-${Date.now()}-5`,
        submission_version_id: versionId,
        category: 'disclosures',
        severity: 'high',
        affected_text: lower.includes('without any risk') ? 'without any risk' : 'risk-free',
        explanation: 'Absolute claim of zero risk creates substantial regulatory exposure and violates Regulatory Standard RS-202.',
        supporting_evidence: 'Regulatory Standard RS-202: "Never use \'risk-free\' or \'without risk\'. Use \'engineered according to defense-in-depth security standards\'."',
        source_document_title: 'Regulatory & Risk Disclosure Standard',
        suggested_rewrite: 'with enterprise-grade security and comprehensive risk mitigations',
        confidence_level: 'high',
        recommended_action: 'Add qualification disclaimer regarding lab benchmarks and maintenance windows.',
        is_deterministic: true,
        resolution_status: 'open',
        created_at: new Date().toISOString(),
      });
    }

    return findings;
  }
}

export const mockStore = new MockStore();
