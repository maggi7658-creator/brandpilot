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
  UserRole
} from '@/types';

const API_BASE = '/api/v1';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('brandpilot_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    localStorage.removeItem('brandpilot_token');
    localStorage.removeItem('brandpilot_user');
  }

  if (!response.ok) {
    let errorDetail = 'Request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || JSON.stringify(errJson);
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(data: { email: string; password: string; full_name: string; workspace_name?: string }): Promise<{ access_token: string; user: User }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMe(): Promise<User> {
    return request('/auth/me');
  },

  async getDemoPersonas(): Promise<DemoPersona[]> {
    return request('/auth/demo-personas');
  },

  // Submissions
  async listSubmissions(params?: { channel?: string; status?: string }): Promise<Submission[]> {
    const query = new URLSearchParams();
    if (params?.channel) query.append('channel', params.channel);
    if (params?.status) query.append('status', params.status);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/submissions${qs}`);
  },

  async getSubmission(id: string): Promise<Submission> {
    return request(`/submissions/${id}`);
  },

  async createSubmission(payload: {
    title: string;
    channel: string;
    audience: string;
    purpose: string;
    sensitivity?: string;
    content_type?: string;
    raw_content: string;
    source_filename?: string;
    url?: string;
  }): Promise<Submission> {
    return request('/submissions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async uploadFile(file: File): Promise<{ filename: string; file_path: string; content_type: string; extracted_text: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = getAuthHeader();

    const response = await fetch(`${API_BASE}/submissions/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'File upload failed');
    }
    return response.json();
  },

  async triggerAnalysis(submissionId: string): Promise<Submission> {
    return request(`/submissions/${submissionId}/analyze`, {
      method: 'POST',
    });
  },

  async createRevision(submissionId: string, payload: { raw_content: string; change_summary: string }): Promise<Submission> {
    return request(`/submissions/${submissionId}/revisions`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Reviews & Findings
  async updateFindingStatus(findingId: string, resolution_status: string, reviewer_notes?: string): Promise<ReviewFinding> {
    return request(`/reviews/findings/${findingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ resolution_status, reviewer_notes }),
    });
  },

  // Approvals
  async recordDecision(
    submissionId: string,
    payload: { decision: string; rationale: string; conditions?: string }
  ): Promise<ApprovalDecision> {
    return request(`/approvals/submissions/${submissionId}/decision`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async markReadyToPublish(submissionId: string): Promise<Submission> {
    return request(`/approvals/submissions/${submissionId}/publish`, {
      method: 'POST',
    });
  },

  async assignReviewer(submissionId: string, reviewerId: string, roleType = 'REVIEWER'): Promise<{ message: string }> {
    return request(`/approvals/submissions/${submissionId}/assign?reviewer_id=${reviewerId}&role_type=${roleType}`, {
      method: 'POST',
    });
  },

  // Guidelines & Knowledge
  async listGuidelines(category?: string): Promise<Guideline[]> {
    const qs = category ? `?category=${category}` : '';
    return request(`/guidelines${qs}`);
  },

  async createGuideline(payload: {
    title: string;
    category: string;
    version: string;
    authority: string;
    effective_date: string;
    expiry_date?: string;
    content: string;
  }): Promise<Guideline> {
    return request('/guidelines', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async listTerminology(): Promise<TerminologyRule[]> {
    return request('/guidelines/terminology');
  },

  async createTerminology(payload: {
    prohibited_term: string;
    preferred_term: string;
    rationale: string;
    severity?: string;
  }): Promise<TerminologyRule> {
    return request('/guidelines/terminology', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async listAssets(): Promise<BrandAsset[]> {
    return request('/guidelines/assets');
  },

  async createAsset(payload: {
    name: string;
    asset_type: string;
    guidelines_note?: string;
    is_authorized?: boolean;
  }): Promise<BrandAsset> {
    return request('/guidelines/assets', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Analytics & Audit
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return request('/analytics/summary');
  },

  async getAuditTrail(submissionId?: string): Promise<AuditEvent[]> {
    const qs = submissionId ? `?submission_id=${submissionId}` : '';
    return request(`/audit/events${qs}`);
  },

  // Users
  async listUsers(): Promise<User[]> {
    return request('/users');
  },

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    return request(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },
};
