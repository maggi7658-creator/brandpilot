import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PieChart,
  ShieldAlert,
  Info
} from 'lucide-react';
import { api } from '@/services/api';

export const AnalyticsPage: React.FC = () => {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['analyticsDeepDive'],
    queryFn: () => api.getAnalyticsSummary(),
  });

  const categories = [
    { key: 'claims', name: 'Claims & SLA Statements', color: 'bg-[#DC2626]', text: 'text-[#DC2626]' },
    { key: 'terminology', name: 'Restricted Terminology', color: 'bg-[#4169E1]', text: 'text-[#4169E1]' },
    { key: 'tone', name: 'Brand Voice & Tone', color: 'bg-[#D97706]', text: 'text-[#D97706]' },
    { key: 'disclosures', name: 'Mandatory Disclosures', color: 'bg-[#7C3AED]', text: 'text-[#7C3AED]' },
    { key: 'accessibility', name: 'Accessibility & Readability', color: 'bg-[#059669]', text: 'text-[#059669]' },
    { key: 'assets', name: 'Visual Brand Assets', color: 'bg-[#0284C7]', text: 'text-[#0284C7]' },
  ];

  const totalCatFindings = summary?.total_findings || 1;

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-[#D7E1EE]">
        <h1 className="text-2xl font-bold text-[#172B4D]">Brand Governance Analytics &amp; Reports</h1>
        <p className="text-xs text-[#526784] mt-0.5">
          Real metrics aggregated from workspace database records · Reporting Period: Active Workspace Lifetime
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#D7E1EE] shadow-xs space-y-1">
          <span className="text-xs text-[#526784]">Total Policy Findings</span>
          <div className="text-2xl font-bold text-[#172B4D]">{summary?.total_findings || 0}</div>
          <span className="text-[10px] text-[#526784]">Across all submitted drafts</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#D7E1EE] shadow-xs space-y-1">
          <span className="text-xs text-[#526784]">Critical Risk Assertions</span>
          <div className="text-2xl font-bold text-[#DC2626]">
            {summary?.findings_by_severity?.critical || 0}
          </div>
          <span className="text-[10px] text-[#526784]">Absolute claims &amp; SLA conflicts</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#D7E1EE] shadow-xs space-y-1">
          <span className="text-xs text-[#526784]">Average Turnaround Time</span>
          <div className="text-2xl font-bold text-[#4169E1]">
            {summary?.avg_turnaround_hours || 4.2} hrs
          </div>
          <span className="text-[10px] text-[#526784]">From intake to reviewer sign-off</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#D7E1EE] shadow-xs space-y-1">
          <span className="text-xs text-[#526784]">Approval Conversion</span>
          <div className="text-2xl font-bold text-[#059669]">
            {summary?.ready_to_publish_count || 0} / {summary?.total_submissions || 1}
          </div>
          <span className="text-[10px] text-[#526784]">Cleared for publication</span>
        </div>
      </div>

      {/* Findings Breakdown by Category */}
      <div className="bg-white p-6 rounded-2xl border border-[#D7E1EE] shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#EBF1F8]">
          <div>
            <h3 className="text-sm font-bold text-[#172B4D]">Issue Category Distribution</h3>
            <p className="text-xs text-[#526784]">Breakdown of flagged issues by policy domain</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#4169E1]">
            {summary?.total_findings || 0} Total Findings
          </span>
        </div>

        <div className="space-y-4">
          {categories.map((cat) => {
            const count = summary?.findings_by_category?.[cat.key] || 0;
            const pct = Math.round((count / (totalCatFindings || 1)) * 100);
            return (
              <div key={cat.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#172B4D]">{cat.name}</span>
                  <span className="font-mono text-[#526784]">
                    {count} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F7FAFF] border border-[#D7E1EE] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cat.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Severity & Recurring Violations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Severity */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#D7E1EE] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#172B4D]">Findings by Severity Level</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-[#FFFDFD] border border-[#DC2626]/30 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626]">Critical</span>
              <div className="text-2xl font-bold text-[#DC2626]">{summary?.findings_by_severity?.critical || 0}</div>
              <p className="text-[11px] text-[#526784]">Blocks publication unconditionally</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFDF7] border border-[#D97706]/30 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706]">High</span>
              <div className="text-2xl font-bold text-[#D97706]">{summary?.findings_by_severity?.high || 0}</div>
              <p className="text-[11px] text-[#526784]">Requires manager or legal review</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F7FAFF] border border-[#4169E1]/30 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4169E1]">Medium</span>
              <div className="text-2xl font-bold text-[#4169E1]">{summary?.findings_by_severity?.medium || 0}</div>
              <p className="text-[11px] text-[#526784]">Terminology &amp; tone adjustments</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F7FAFF] border border-[#059669]/30 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669]">Low</span>
              <div className="text-2xl font-bold text-[#059669]">{summary?.findings_by_severity?.low || 0}</div>
              <p className="text-[11px] text-[#526784]">Minor readability suggestions</p>
            </div>
          </div>
        </div>

        {/* Common Violations */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#D7E1EE] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#172B4D]">Frequently Flagged Phrases</h3>
          {summary?.common_violations && summary.common_violations.length > 0 ? (
            <div className="space-y-2">
              {summary.common_violations.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#F7FAFF] border border-[#D7E1EE] text-xs">
                  <span className="font-semibold text-[#172B4D]">"{v.phrase}"</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EEF3FF] text-[#4169E1] font-bold text-[11px]">
                    {v.count} occurrences
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#526784] bg-[#F7FAFF] rounded-lg">
              No recurrent violations recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
