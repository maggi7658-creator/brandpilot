import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  History,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Calendar,
  FileText,
  User,
  Clock
} from 'lucide-react';
import { api } from '@/services/api';
import { cn } from '@/utils/cn';

export const HistoryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [activeTab, setActiveTab] = useState<'submissions' | 'audit'>('submissions');

  const { data: submissions, isLoading: sLoading } = useQuery({
    queryKey: ['submissionsHistory', selectedChannel, selectedStatus],
    queryFn: () => api.listSubmissions({ channel: selectedChannel || undefined, status: selectedStatus || undefined }),
  });

  const { data: auditEvents, isLoading: aLoading } = useQuery({
    queryKey: ['auditTrailList'],
    queryFn: () => api.getAuditTrail(),
  });

  const filteredSubmissions = submissions?.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D7E1EE]">
        <div>
          <h1 className="text-2xl font-bold text-[#172B4D]">Review History &amp; Audit Trail</h1>
          <p className="text-xs text-[#526784] mt-0.5">
            Traceable version history, reviewer assignments, decisions, and immutable audit logs.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 p-1 bg-white rounded-lg border border-[#D7E1EE]">
          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold rounded-md transition-colors',
              activeTab === 'submissions' ? 'bg-[#EEF3FF] text-[#4169E1]' : 'text-[#526784]'
            )}
          >
            Submissions ({submissions?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold rounded-md transition-colors',
              activeTab === 'audit' ? 'bg-[#EEF3FF] text-[#4169E1]' : 'text-[#526784]'
            )}
          >
            Immutable Audit Events ({auditEvents?.length || 0})
          </button>
        </div>
      </div>

      {/* Submissions View */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="p-4 bg-white rounded-xl border border-[#D7E1EE] shadow-xs flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-[#526784] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search submissions by title..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="px-3 py-1.5 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
              >
                <option value="">All Channels</option>
                <option value="Advertising">Advertising</option>
                <option value="Website">Website</option>
                <option value="Social Media">Social Media</option>
                <option value="Email">Email</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
              >
                <option value="">All Statuses</option>
                <option value="READY_TO_PUBLISH">Ready to Publish</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="NEEDS_REVISION">Needs Revision</option>
                <option value="APPROVED_WITH_CONDITIONS">Approved w/ Conditions</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-[#D7E1EE] shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7FAFF] text-[#526784] font-semibold border-b border-[#D7E1EE]">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Creator</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Latest Version</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBF1F8]">
                {filteredSubmissions && filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#172B4D]">{s.title}</td>
                      <td className="py-3 px-4 text-[#526784]">{s.creator_name || 'Sarah Chen'}</td>
                      <td className="py-3 px-4 text-[#526784]">{s.channel}</td>
                      <td className="py-3 px-4 font-mono font-medium text-[#172B4D]">v{s.current_version_number}</td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                            s.status === 'READY_TO_PUBLISH'
                              ? 'bg-[#D1FAE5] text-[#059669]'
                              : s.status === 'NEEDS_REVISION'
                              ? 'bg-[#FEE2E2] text-[#DC2626]'
                              : s.status === 'APPROVED_WITH_CONDITIONS'
                              ? 'bg-[#FEF3C7] text-[#D97706]'
                              : 'bg-[#EEF3FF] text-[#4169E1]'
                          )}
                        >
                          {s.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/app/review?id=${s.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-[#4169E1] hover:underline"
                        >
                          <span>Open Review</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#526784]">
                      No submissions found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Trail View */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-[#D7E1EE] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#D7E1EE]">
            <h3 className="text-sm font-bold text-[#172B4D]">Immutable Audit Log</h3>
            <p className="text-xs text-[#526784]">Append-only record of all submissions, AI checks, revisions, and human approvals</p>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7FAFF] text-[#526784] font-semibold border-b border-[#D7E1EE]">
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBF1F8]">
              {auditEvents && auditEvents.length > 0 ? (
                auditEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#4169E1]">{evt.action}</td>
                    <td className="py-3 px-4 font-semibold text-[#172B4D]">{evt.actor_name}</td>
                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[#172B4D] text-[10px] font-bold">
                        {evt.actor_role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#526784] max-w-md truncate font-mono text-[11px]">
                      {evt.details_json || '—'}
                    </td>
                    <td className="py-3 px-4 text-right text-[#526784] font-mono text-[11px]">
                      {new Date(evt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#526784]">
                    No audit records logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
