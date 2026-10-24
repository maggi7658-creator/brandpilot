import {
  User,
  Submission,
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
import { mockStore } from './mockStore';

const API_BASE = '/api/v1';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('brandpilot_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getCurrentUser(): User {
  const userJson = localStorage.getItem('brandpilot_user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch {
      // ignore
    }
  }
  return {
    id: 'user-creator',
    email: 'creator@brandpilot.local',
    full_name: 'Sarah Chen',
    role: 'CREATOR',
    is_active: true,
    created_at: new Date().toISOString(),
  };
}

async function tryNetworkOrMock<T>(
  networkFn: () => Promise<T>,
  mockFn: () => Promise<T>
): Promise<T> {
  // If in browser static deployment (like GitHub Pages) where API is not present, fall back cleanly
  try {
    return await networkFn();
  } catch (err: any) {
    // If it's a 403 authorization error deliberately returned by the server (e.g. self-approval block), rethrow!
    if (err.message && err.message.includes('403')) {
      throw err;
    }
    // Network error or 404 (static hosting) -> fallback to mockStore
    console.info('Operating with embedded BrandPilot engine (GitHub Pages / Standalone Mode)');
    return await mockFn();
  }
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
  async login(email: string, password?: string): Promise<{ access_token: string; user: User }> {
    return tryNetworkOrMock(
      () => request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: password || 'Password123!' }),
      }),
      () => mockStore.login(email)
    );
  },

  async register(data: { email: string; password: string; full_name: string; workspace_name?: string }): Promise<{ access_token: string; user: User }> {
    return tryNetworkOrMock(
      () => request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
      () => mockStore.login(data.email)
    );
  },

  async getMe(): Promise<User> {
    return tryNetworkOrMock(
      () => request('/auth/me'),
      async () => getCurrentUser()
    );
  },

  async getDemoPersonas(): Promise<DemoPersona[]> {
    return tryNetworkOrMock(
      () => request('/auth/demo-personas'),
      () => mockStore.getDemoPersonas()
    );
  },

  // Submissions
  async listSubmissions(params?: { channel?: string; status?: string }): Promise<Submission[]> {
    const query = new URLSearchParams();
    if (params?.channel) query.append('channel', params.channel);
    if (params?.status) query.append('status', params.status);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return tryNetworkOrMock(
      () => request(`/submissions${qs}`),
      () => mockStore.listSubmissions(params)
    );
  },

  async getSubmission(id: string): Promise<Submission> {
    return tryNetworkOrMock(
      () => request(`/submissions/${id}`),
      () => mockStore.getSubmission(id)
    );
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
    const user = getCurrentUser();
    return tryNetworkOrMock(
      () => request('/submissions', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
      () => mockStore.createSubmission(payload, user)
    );
  },

  async uploadFile(file: File): Promise<{ filename: string; file_path: string; content_type: string; extracted_text: string }> {
    return tryNetworkOrMock(
      async () => {
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
      async () => ({
        filename: file.name,
        file_path: `/uploads/${file.name}`,
        content_type: file.type || 'text/plain',
        extracted_text: await file.text().catch(() => 'Document parsed successfully for review.'),
      })
    );
  },

  async triggerAnalysis(submissionId: string): Promise<Submission> {
    return tryNetworkOrMock(
      () => request(`/submissions/${submissionId}/analyze`, { method: 'POST' }),
      () => mockStore.triggerAnalysis(submissionId)
    );
  },

  async createRevision(submissionId: string, payload: { raw_content: string; change_summary: string }): Promise<Submission> {
    const user = getCurrentUser();
    return tryNetworkOrMock(
      () => request(`/submissions/${submissionId}/revisions`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
      () => mockStore.createRevision(submissionId, payload, user)
    );
  },

  // Reviews & Findings
  async updateFindingStatus(findingId: string, resolution_status: string, reviewer_notes?: string): Promise<ReviewFinding> {
    return tryNetworkOrMock(
      () => request(`/reviews/findings/${findingId}`, {
        method: 'PATCH',
        body: JSON.stringify({ resolution_status, reviewer_notes }),
      }),
      () => mockStore.updateFindingStatus(findingId, resolution_status, reviewer_notes)
    );
  },

  // Approvals & Human Gates
  async recordDecision(
    submissionId: string,
    payload: { decision: string; rationale: string; conditions?: string }
  ): Promise<ApprovalDecision> {
    const user = getCurrentUser();
    return tryNetworkOrMock(
      () => request(`/approvals/submissions/${submissionId}/decision`, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
      () => mockStore.recordDecision(submissionId, payload, user)
    );
  },

  async markReadyToPublish(submissionId: string): Promise<Submission> {
    const user = getCurrentUser();
    return tryNetworkOrMock(
      () => request(`/approvals/submissions/${submissionId}/publish`, {
        method: 'POST',
      }),
      () => mockStore.markReadyToPublish(submissionId, user)
    );
  },

  async assignReviewer(submissionId: string, reviewerId: string, roleType = 'REVIEWER'): Promise<{ message: string }> {
    return tryNetworkOrMock(
      () => request(`/approvals/submissions/${submissionId}/assign?reviewer_id=${reviewerId}&role_type=${roleType}`, {
        method: 'POST',
      }),
      async () => ({ message: `Assigned reviewer ${reviewerId}` })
    );
  },

  // Guidelines & Knowledge
  async listGuidelines(category?: string): Promise<Guideline[]> {
    const qs = category ? `?category=${category}` : '';
    return tryNetworkOrMock(
      () => request(`/guidelines${qs}`),
      () => mockStore.listGuidelines()
    );
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
    return tryNetworkOrMock(
      () => request('/guidelines', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
      () => mockStore.createGuideline(payload)
    );
  },

  async listTerminology(): Promise<TerminologyRule[]> {
    return tryNetworkOrMock(
      () => request('/guidelines/terminology'),
      () => mockStore.listTerminology()
    );
  },

  async createTerminology(payload: {
    prohibited_term: string;
    preferred_term: string;
    rationale: string;
    severity?: 'low' | 'medium' | 'high';
  }): Promise<TerminologyRule> {
    return tryNetworkOrMock(
      () => request('/guidelines/terminology', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
      () => mockStore.createTerminology({
        prohibited_term: payload.prohibited_term,
        preferred_term: payload.preferred_term,
        rationale: payload.rationale,
        severity: payload.severity || 'medium',
      })
    );
  },

  async listAssets(): Promise<BrandAsset[]> {
    return tryNetworkOrMock(
      () => request('/guidelines/assets'),
      () => mockStore.listAssets()
    );
  },

  async createAsset(payload: {
    name: string;
    asset_type: string;
    guidelines_note?: string;
    is_authorized?: boolean;
  }): Promise<BrandAsset> {
    return tryNetworkOrMock(
      () => request('/guidelines/assets', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
      async () => ({
        id: `asset-${Date.now()}`,
        workspace_id: 'default',
        name: payload.name,
        asset_type: payload.asset_type,
        guidelines_note: payload.guidelines_note,
        is_authorized: payload.is_authorized ?? true,
        created_at: new Date().toISOString(),
      })
    );
  },

  // Analytics & Audit
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return tryNetworkOrMock(
      () => request('/analytics/summary'),
      () => mockStore.getAnalyticsSummary()
    );
  },

  async getAuditTrail(submissionId?: string): Promise<AuditEvent[]> {
    const qs = submissionId ? `?submission_id=${submissionId}` : '';
    return tryNetworkOrMock(
      () => request(`/audit/events${qs}`),
      () => mockStore.getAuditTrail(submissionId)
    );
  },

  // Users
  async listUsers(): Promise<User[]> {
    return tryNetworkOrMock(
      () => request('/users'),
      () => mockStore.listUsers()
    );
  },

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    return tryNetworkOrMock(
      () => request(`/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }),
      () => mockStore.updateUserRole(userId, role)
    );
  },
};
