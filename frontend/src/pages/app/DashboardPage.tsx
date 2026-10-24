import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FileCheck2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileText,
  ShieldAlert,
  Search,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['analyticsSummary'],
    queryFn: () => api.getAnalyticsSummary(),
  });

  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ['submissionsList'],
    queryFn: () => api.listSubmissions(),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'READY_TO_PUBLISH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D1FAE5] text-[#059669]">Ready to Publish</span>;
      case 'APPROVED_WITH_CONDITIONS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#D97706]">Approved w/ Conditions</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEF3FF] text-[#4169E1]">Under Review</span>;
      case 'NEEDS_REVISION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEE2E2] text-[#DC2626]">Needs Revision</span>;
      case 'REJECTED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">Draft</span>;
    }
  };

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D7E1EE]">
        <div>
          <h1 className="text-2xl font-bold text-[#172B4D]">Governance Dashboard</h1>
          <p className="text-xs text-[#526784] mt-0.5">
            Welcome, <strong className="text-[#172B4D]">{user?.full_name}</strong> ({user?.role}) · Acme Global Brand Workspace
          </p>
        </div>

        <Link
          to="/app/review"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4169E1] hover:bg-[#3355C4] text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Review New Content</span>
        </Link>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#D7E1EE] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#526784]">
            <span>Total Submissions</span>
            <FileText className="w-4 h-4 text-[#4169E1]" />
          </div>
          <div className="text-2xl font-bold text-[#172B4D]">
            {summaryLoading ? '...' : summary?.total_submissions || 0}
          </div>
          <div className="text-[11px] text-[#526784]">Drafts &amp; versions tracked</div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#D7E1EE] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#526784]">
            <span>Under Active Review</span>
            <Clock className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-2xl font-bold text-[#D97706]">
            {summaryLoading ? '...' : summary?.under_review_count || 0}
          </div>
          <div className="text-[11px] text-[#526784]">Awaiting manager/legal decision</div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#D7E1EE] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#526784]">
            <span>Needs Revision</span>
            <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
          </div>
          <div className="text-2xl font-bold text-[#DC2626]">
            {summaryLoading ? '...' : summary?.needs_revision_count || 0}
          </div>
          <div className="text-[11px] text-[#526784]">Critical claim or term conflicts</div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#D7E1EE] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-[#526784]">
            <span>Ready to Publish</span>
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          </div>
          <div className="text-2xl font-bold text-[#059669]">
            {summaryLoading ? '...' : summary?.ready_to_publish_count || 0}
          </div>
          <div className="text-[11px] text-[#526784]">Fully authorized by human gate</div>
        </div>
      </div>

      {/* Two Column Layout: Issue Categories & Recurring Violations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category breakdown */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#D7E1EE] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172B4D]">Findings by Category</h3>
            <span className="text-xs text-[#526784]">Total issues flagged: {summary?.total_findings || 0}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Claims & SLAs', count: summary?.findings_by_category?.claims || 0, color: 'text-[#DC2626] bg-[#FEE2E2]' },
              { label: 'Terminology', count: summary?.findings_by_category?.terminology || 0, color: 'text-[#4169E1] bg-[#EEF3FF]' },
              { label: 'Tone & Voice', count: summary?.findings_by_category?.tone || 0, color: 'text-[#D97706] bg-[#FEF3C7]' },
              { label: 'Disclosures', count: summary?.findings_by_category?.disclosures || 0, color: 'text-[#7C3AED] bg-[#EDE9FE]' },
              { label: 'Accessibility', count: summary?.findings_by_category?.accessibility || 0, color: 'text-[#059669] bg-[#D1FAE5]' },
              { label: 'Brand Assets', count: summary?.findings_by_category?.assets || 0, color: 'text-[#0284C7] bg-[#E0F2FE]' },
            ].map((cat, idx) => (
              <div key={idx} className="p-3.5 rounded-lg border border-[#D7E1EE] bg-[#F7FAFF] space-y-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cat.color}`}>
                  {cat.label}
                </span>
                <div className="text-xl font-bold text-[#172B4D] pt-1">{cat.count}</div>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#526784] italic pt-2">
            Findings are grounded against active workspace guidelines (SLA Policy v2.4, Tone Standard v3.1).
          </p>
        </div>

        {/* Severity & Recurring issues */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#D7E1EE] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#172B4D]">Most Common Policy Conflicts</h3>
          {summary?.common_violations && summary.common_violations.length > 0 ? (
            <div className="space-y-2.5">
              {summary.common_violations.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D7E1EE] text-xs">
                  <span className="font-semibold text-[#172B4D] truncate max-w-[200px]">"{v.phrase}"</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#EEF3FF] text-[#4169E1] font-bold text-[10px]">
                    {v.count} occurrences
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-[#526784] bg-[#F7FAFF] rounded-lg">
              No recurrent violations recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-xl border border-[#D7E1EE] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#D7E1EE] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172B4D]">Recent Governance Reviews</h3>
            <p className="text-xs text-[#526784]">Click any submission to view explainable findings and version revisions</p>
          </div>
          <Link to="/app/history" className="text-xs font-semibold text-[#4169E1] hover:underline flex items-center gap-1">
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {submissionsLoading ? (
          <div className="p-8 text-center text-xs text-[#526784]">Loading reviews...</div>
        ) : submissions && submissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7FAFF] text-[#526784] font-semibold border-b border-[#D7E1EE]">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Audience</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBF1F8]">
                {submissions.slice(0, 6).map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#172B4D]">
                      <Link to={`/app/review?id=${sub.id}`} className="hover:text-[#4169E1]">
                        {sub.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-[#526784]">{sub.channel}</td>
                    <td className="py-3 px-4 text-[#526784]">{sub.audience}</td>
                    <td className="py-3 px-4 font-mono font-medium text-[#172B4D]">v{sub.current_version_number}</td>
                    <td className="py-3 px-4">{getStatusBadge(sub.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/app/review?id=${sub.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4169E1] hover:underline"
                      >
                        <span>Open Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center space-y-3">
            <p className="text-xs text-[#526784]">No submissions found in this workspace.</p>
            <Link
              to="/app/review"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4169E1] text-white text-xs font-semibold"
            >
              Start First Review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
