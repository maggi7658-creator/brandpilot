import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileCheck2,
  Upload,
  Globe,
  FileText,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
  BookOpen,
  History,
  Lock,
  RotateCcw,
  Check,
  ExternalLink,
  Info,
  Calendar,
  Send,
  Edit3
} from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Submission, SubmissionVersion, ReviewFinding } from '@/types';
import { cn } from '@/utils/cn';

export const ReviewWorkspacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const submissionIdParam = searchParams.get('id');

  const { user, canApprove } = useAuth();
  const queryClient = useQueryClient();

  // Mode: 'intake' or 'results'
  const [activeTab, setActiveTab] = useState<'paste' | 'upload' | 'url'>('paste');

  // Intake form state
  const [title, setTitle] = useState('Q4 Global Cloud Campaign');
  const [channel, setChannel] = useState('Advertising');
  const [audience, setAudience] = useState('Enterprise IT');
  const [purpose, setPurpose] = useState('Product Launch');
  const [sensitivity, setSensitivity] = useState<'standard' | 'regulated' | 'high_risk'>('standard');
  const [rawContent, setRawContent] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Revision editor state
  const [revisionContent, setRevisionContent] = useState('');
  const [changeSummary, setChangeSummary] = useState('');

  // Decision Modal state
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'APPROVE' | 'REQUEST_CHANGES' | 'APPROVE_WITH_CONDITIONS' | 'REJECT'>('APPROVE');
  const [rationale, setRationale] = useState('');
  const [conditions, setConditions] = useState('');
  const [decisionError, setDecisionError] = useState<string | null>(null);

  // Active Version view (if reviewing past version)
  const [viewVersionNum, setViewVersionNum] = useState<number | null>(null);

  // Query single submission if id is in query params
  const { data: submission, isLoading: submissionLoading, refetch } = useQuery({
    queryKey: ['submissionDetail', submissionIdParam],
    queryFn: () => (submissionIdParam ? api.getSubmission(submissionIdParam) : null),
    enabled: !!submissionIdParam,
  });

  // When submission loads, initialize revision content to current version raw text
  useEffect(() => {
    if (submission && submission.versions && submission.versions.length > 0) {
      const currentVer = submission.versions.find(
        (v) => v.version_number === (viewVersionNum || submission.current_version_number)
      ) || submission.versions[submission.versions.length - 1];
      setRevisionContent(currentVer.raw_content);
    }
  }, [submission, viewVersionNum]);

  // Load Prompt 19 Demonstration Scenario
  const loadDemoScenario = () => {
    setTitle('Q4 Global Cloud Campaign — High Availability');
    setChannel('Advertising');
    setAudience('Enterprise IT');
    setPurpose('Product Launch');
    setSensitivity('standard');
    setRawContent(
      'Our service is always available. We provide cheap and fast compute with our artificial intelligence bot that gives insane performance without any risk.'
    );
  };

  // Submit Intake Mutation
  const createSubmissionMutation = useMutation({
    mutationFn: async () => {
      let content = rawContent;
      let filename: string | undefined = undefined;

      if (activeTab === 'upload' && selectedFile) {
        const uploadRes = await api.uploadFile(selectedFile);
        content = uploadRes.extracted_text;
        filename = uploadRes.filename;
      }

      const res = await api.createSubmission({
        title,
        channel,
        audience,
        purpose,
        sensitivity,
        content_type: activeTab === 'url' ? 'url' : (activeTab === 'upload' ? 'document' : 'text'),
        raw_content: content,
        source_filename: filename,
        url: activeTab === 'url' ? urlInput : undefined,
      });

      // Automatically trigger initial AI review
      return await api.triggerAnalysis(res.id);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['submissionsList'] });
      queryClient.invalidateQueries({ queryKey: ['analyticsSummary'] });
      setSearchParams({ id: data.id });
    },
  });

  // Save Revision Mutation
  const createRevisionMutation = useMutation({
    mutationFn: async () => {
      if (!submission) return;
      return await api.createRevision(submission.id, {
        raw_content: revisionContent,
        change_summary: changeSummary || 'Applied recommended brand guideline revisions.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissionDetail', submissionIdParam] });
      queryClient.invalidateQueries({ queryKey: ['analyticsSummary'] });
      setChangeSummary('');
      refetch();
    },
  });

  // Record Decision Mutation
  const recordDecisionMutation = useMutation({
    mutationFn: async () => {
      if (!submission) return;
      return await api.recordDecision(submission.id, {
        decision: decisionType,
        rationale,
        conditions: decisionType === 'APPROVE_WITH_CONDITIONS' ? conditions : undefined,
      });
    },
    onSuccess: () => {
      setDecisionModalOpen(false);
      setRationale('');
      setConditions('');
      setDecisionError(null);
      queryClient.invalidateQueries({ queryKey: ['submissionDetail', submissionIdParam] });
      queryClient.invalidateQueries({ queryKey: ['analyticsSummary'] });
      refetch();
    },
    onError: (err: any) => {
      setDecisionError(err.message || 'Failed to record decision');
    },
  });

  // Publish Mutation
  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!submission) return;
      return await api.markReadyToPublish(submission.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissionDetail', submissionIdParam] });
      queryClient.invalidateQueries({ queryKey: ['analyticsSummary'] });
      refetch();
    },
    onError: (err: any) => {
      alert(`Publish Blocked: ${err.message}`);
    },
  });

  // Apply suggested rewrite directly to revision editor
  const applyRewriteToEditor = (originalText: string, suggestedText: string) => {
    if (!suggestedText) return;
    const updated = revisionContent.replace(originalText, suggestedText);
    setRevisionContent(updated);
    setChangeSummary((prev) =>
      prev ? `${prev}; Replaced "${originalText}" with "${suggestedText}"` : `Replaced "${originalText}" with "${suggestedText}"`
    );
  };

  // Resolve active version to display
  const activeVersion: SubmissionVersion | undefined = submission?.versions?.find(
    (v) => v.version_number === (viewVersionNum || submission.current_version_number)
  ) || submission?.versions?.[submission?.versions?.length - 1];

  const isCreatorOfSubmission = submission?.creator_id === user?.id;

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D7E1EE]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#172B4D]">Content Review Studio</h1>
            {submission && (
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#EEF3FF] text-[#4169E1] border border-[#4169E1]/20">
                v{activeVersion?.version_number} of {submission.current_version_number}
              </span>
            )}
          </div>
          <p className="text-xs text-[#526784] mt-0.5">
            Compare statements with approved guidelines, inspect explainable evidence, and obtain human sign-off.
          </p>
        </div>

        {submission && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSearchParams({});
                setTitle('New Brand Submission');
                setRawContent('');
              }}
              className="px-3 py-1.5 rounded-lg border border-[#D7E1EE] bg-white text-xs font-semibold text-[#172B4D] hover:bg-slate-50 transition-colors"
            >
              Start New Review
            </button>
          </div>
        )}
      </div>

      {/* VIEW A: Submission Intake (If no submission selected) */}
      {!submission && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#D7E1EE] shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBF1F8]">
              <span className="text-sm font-bold text-[#172B4D]">1. Submission Intake</span>
              <button
                type="button"
                onClick={loadDemoScenario}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E7F9F7] text-[#15A99A] text-xs font-bold border border-[#15A99A]/30 hover:bg-[#15A99A]/10 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Demo Scenario (Prompt 19)</span>
              </button>
            </div>

            {/* Content Mode Tabs */}
            <div className="flex gap-2 p-1 bg-[#F7FAFF] rounded-lg border border-[#D7E1EE] w-fit">
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5',
                  activeTab === 'paste' ? 'bg-white text-[#4169E1] shadow-xs' : 'text-[#526784]'
                )}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Paste Text</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5',
                  activeTab === 'upload' ? 'bg-white text-[#4169E1] shadow-xs' : 'text-[#526784]'
                )}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Document (PDF/Word)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={cn(
                  'px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5',
                  activeTab === 'url' ? 'bg-white text-[#4169E1] shadow-xs' : 'text-[#526784]'
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Website URL</span>
              </button>
            </div>

            {/* Context Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Campaign / Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
                  placeholder="e.g. Q4 Cloud Infrastructure Campaign"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Communication Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
                >
                  <option value="Advertising">Advertising / Paid Media</option>
                  <option value="Website">Public Website Copy</option>
                  <option value="Social Media">Social Media Campaign</option>
                  <option value="Email">Customer Email / Newsletter</option>
                  <option value="Product">In-Product Experience</option>
                  <option value="Internal">Internal Communications</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Intended Audience</label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
                  placeholder="e.g. Enterprise IT Decision Makers"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Sensitivity Level</label>
                <select
                  value={sensitivity}
                  onChange={(e) => setSensitivity(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
                >
                  <option value="standard">Standard Business Content</option>
                  <option value="regulated">Regulated / Financial / Health</option>
                  <option value="high_risk">High Risk (Mandatory Legal Sign-off)</option>
                </select>
              </div>
            </div>

            {/* Content Input by Tab */}
            {activeTab === 'paste' && (
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Content Copy to Review
                </label>
                <textarea
                  rows={6}
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  placeholder="Paste marketing copy, press release text, or announcement here..."
                  className="w-full p-3 text-xs border border-[#D7E1EE] rounded-xl focus-ring font-sans leading-relaxed"
                />
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="p-8 border-2 border-dashed border-[#D7E1EE] rounded-xl text-center space-y-3 bg-[#F7FAFF]">
                <Upload className="w-8 h-8 text-[#4169E1] mx-auto" />
                <div className="text-xs text-[#172B4D] font-semibold">
                  {selectedFile ? selectedFile.name : 'Upload PDF, DOCX, or text file'}
                </div>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="text-xs text-[#526784] mx-auto block"
                />
                <p className="text-[11px] text-[#526784]">Max file size: 15 MB. Files are stored securely.</p>
              </div>
            )}

            {activeTab === 'url' && (
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Public Web URL</label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/landing-page"
                  className="w-full px-3 py-2 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
                />
                <p className="text-[11px] text-[#526784] mt-1">
                  Validated against internal subnets and metadata endpoints (SSRF protected).
                </p>
              </div>
            )}

            {/* Run Button */}
            <button
              type="button"
              disabled={createSubmissionMutation.isPending || (!rawContent && !selectedFile && !urlInput)}
              onClick={() => createSubmissionMutation.mutate()}
              className="w-full py-3 rounded-xl bg-[#4169E1] hover:bg-[#3355C4] text-white text-xs font-bold shadow-md shadow-[#4169E1]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {createSubmissionMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing against approved guidelines &amp; SLAs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run BrandPilot Governance Review</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Right Column: Demo Helper & Grounding Overview */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-[#D7E1EE] shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#172B4D]">
                <BookOpen className="w-4 h-4 text-[#4169E1]" />
                <span>Active Grounding Guidelines</span>
              </div>
              <p className="text-xs text-[#526784] leading-relaxed">
                BrandPilot automatically queries the following approved company documents during this check:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D7E1EE]">
                  <strong className="text-[#172B4D] block">Acme SLA &amp; Availability Policy</strong>
                  <span className="text-[11px] text-[#526784]">v2.4 · 99.9% target · Maintenance exclusions</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D7E1EE]">
                  <strong className="text-[#172B4D] block">Enterprise Brand Voice Standard</strong>
                  <span className="text-[11px] text-[#526784]">v3.1 · Professional, non-colloquial tone</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D7E1EE]">
                  <strong className="text-[#172B4D] block">Product Terminology Rules</strong>
                  <span className="text-[11px] text-[#526784]">Active dictionary of restricted &amp; preferred terms</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#EEF3FF] border border-[#4169E1]/20 text-xs text-[#172B4D] space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-[#4169E1]">
                <ShieldAlert className="w-4 h-4" />
                <span>Section 19 Demonstration Guide</span>
              </div>
              <p className="text-[11px] text-[#526784] leading-relaxed">
                Click <strong>"Load Demo Scenario"</strong> above to test:
              </p>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] text-[#526784]">
                <li>Absolute claim "always available" flagged vs 99.9% SLA</li>
                <li>Restricted word "cheap" flagged with "cost-effective" replacement</li>
                <li>Colloquial term "insane" flagged for tone</li>
                <li>Missing maintenance disclosure identified</li>
                <li>Authoritative human approval gate enforced</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: Active Submission Review & Revision Studio */}
      {submission && activeVersion && (
        <div className="space-y-6">
          {/* Top Status & Approval Banner */}
          <div className="p-4 rounded-2xl bg-white border border-[#D7E1EE] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-[#172B4D]">{submission.title}</span>
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-xs font-bold border',
                    submission.status === 'READY_TO_PUBLISH'
                      ? 'bg-[#D1FAE5] text-[#059669] border-[#059669]/30'
                      : submission.status === 'NEEDS_REVISION'
                      ? 'bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]/30'
                      : submission.status === 'APPROVED_WITH_CONDITIONS'
                      ? 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]/30'
                      : 'bg-[#EEF3FF] text-[#4169E1] border-[#4169E1]/30'
                  )}
                >
                  Status: {submission.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#526784]">
                <span>Creator: <strong className="text-[#172B4D]">{submission.creator_name}</strong></span>
                <span>Channel: {submission.channel}</span>
                <span>Audience: {submission.audience}</span>
                <span>Sensitivity: {submission.sensitivity}</span>
              </div>
            </div>

            {/* Action Buttons for Review / Publish */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Creator self-approval alert / button state */}
              {isCreatorOfSubmission && (
                <div className="px-3 py-1.5 rounded-lg bg-[#FEF3C7] border border-[#D97706]/30 text-[11px] text-[#D97706] font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Self-Approval Prohibited: A separate reviewer must approve</span>
                </div>
              )}

              {canApprove && !isCreatorOfSubmission && (
                <button
                  type="button"
                  onClick={() => setDecisionModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#4169E1] hover:bg-[#3355C4] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Record Review Decision
                </button>
              )}

              {canApprove && (
                <button
                  type="button"
                  disabled={publishMutation.isPending || submission.status === 'READY_TO_PUBLISH'}
                  onClick={() => publishMutation.mutate()}
                  className="px-4 py-2 rounded-xl bg-[#15A99A] hover:bg-[#10877B] text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
                >
                  {submission.status === 'READY_TO_PUBLISH' ? 'Approved & Ready' : 'Mark Ready to Publish'}
                </button>
              )}
            </div>
          </div>

          {/* Version History Selector Tabs */}
          {submission.versions && submission.versions.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-bold text-[#526784] shrink-0 flex items-center gap-1">
                <History className="w-3.5 h-3.5" />
                Version History:
              </span>
              {submission.versions.map((ver) => {
                const isSelected = (viewVersionNum || submission.current_version_number) === ver.version_number;
                return (
                  <button
                    key={ver.id}
                    type="button"
                    onClick={() => setViewVersionNum(ver.version_number)}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-semibold border transition-all',
                      isSelected
                        ? 'bg-[#4169E1] text-white border-[#4169E1]'
                        : 'bg-white text-[#526784] border-[#D7E1EE] hover:bg-slate-50'
                    )}
                  >
                    v{ver.version_number} {ver.version_number === submission.current_version_number ? '(Latest)' : ''}
                  </button>
                );
              })}
            </div>
          )}

          {/* Two-Column Review Grid: Submitted Text + Explainable Findings */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Content Text & Revision Editor */}
            <div className="lg:col-span-6 space-y-6">
              {/* Submitted Content Display */}
              <div className="bg-white p-6 rounded-2xl border border-[#D7E1EE] shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#EBF1F8]">
                  <span className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
                    Content Version {activeVersion.version_number}
                  </span>
                  <span className="text-[11px] text-[#526784]">
                    {activeVersion.findings?.length || 0} policy findings identified
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#F7FAFF] border border-[#D7E1EE] text-xs leading-relaxed font-sans text-[#172B4D]">
                  {activeVersion.raw_content}
                </div>
              </div>

              {/* Interactive Revision Editor (Allows creator to revise & create vN+1) */}
              <div className="bg-white p-6 rounded-2xl border border-[#D7E1EE] shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#EBF1F8]">
                  <div className="flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-[#4169E1]" />
                    <span className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
                      Author Revision Studio (Creates v{submission.current_version_number + 1})
                    </span>
                  </div>
                  <span className="text-[10px] text-[#526784]">
                    Revisions automatically invalidate prior approvals
                  </span>
                </div>

                <p className="text-xs text-[#526784] leading-relaxed">
                  Edit the content below to resolve findings, or click <strong>"Apply to Revision"</strong> on any suggestion card on the right:
                </p>

                <textarea
                  rows={5}
                  value={revisionContent}
                  onChange={(e) => setRevisionContent(e.target.value)}
                  className="w-full p-3 text-xs border border-[#D7E1EE] rounded-xl focus-ring font-sans leading-relaxed"
                />

                <div>
                  <label className="block text-[11px] font-semibold text-[#172B4D] mb-1">
                    Revision Summary Note (Logged to Audit Trail)
                  </label>
                  <input
                    type="text"
                    value={changeSummary}
                    onChange={(e) => setChangeSummary(e.target.value)}
                    placeholder="e.g. Replaced absolute claim with 99.9% SLA and adjusted terminology."
                    className="w-full px-3 py-2 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
                  />
                </div>

                <button
                  type="button"
                  disabled={createRevisionMutation.isPending || revisionContent === activeVersion.raw_content}
                  onClick={() => createRevisionMutation.mutate()}
                  className="w-full py-2.5 rounded-xl bg-[#4169E1] hover:bg-[#3355C4] text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {createRevisionMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Save Revision &amp; Re-Evaluate (Creates v{submission.current_version_number + 1})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Approval History Log */}
              {submission.decisions && submission.decisions.length > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-[#D7E1EE] shadow-sm space-y-3">
                  <h3 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
                    Recorded Review Decisions
                  </h3>
                  <div className="space-y-2">
                    {submission.decisions.map((dec) => (
                      <div key={dec.id} className="p-3 rounded-xl bg-[#F7FAFF] border border-[#D7E1EE] text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#172B4D]">
                            {dec.actor_name} ({dec.actor_role})
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-[#D7E1EE] text-[#4169E1]">
                            {dec.decision.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[#526784] italic">"{dec.rationale}"</p>
                        {dec.conditions && (
                          <p className="text-[11px] text-[#D97706]"><strong>Conditions:</strong> {dec.conditions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Explainable Findings Cards with Source Citations */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#D7E1EE]">
                <h3 className="text-sm font-bold text-[#172B4D] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#4169E1]" />
                  <span>Explainable Governance Findings ({activeVersion.findings?.length || 0})</span>
                </h3>
                <span className="text-xs text-[#526784]">Grounded via RAG</span>
              </div>

              {activeVersion.findings && activeVersion.findings.length > 0 ? (
                activeVersion.findings.map((f) => {
                  const isCritical = f.severity === 'critical';
                  const isHigh = f.severity === 'high';
                  return (
                    <div
                      key={f.id}
                      className={cn(
                        'p-5 rounded-2xl bg-white border shadow-xs space-y-3 text-left transition-all',
                        isCritical
                          ? 'border-[#DC2626]/40 bg-[#FFFDFD]'
                          : isHigh
                          ? 'border-[#D97706]/40'
                          : 'border-[#D7E1EE]'
                      )}
                    >
                      {/* Finding Header */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider',
                              isCritical
                                ? 'bg-[#FEE2E2] text-[#DC2626]'
                                : isHigh
                                ? 'bg-[#FEF3C7] text-[#D97706]'
                                : 'bg-[#EEF3FF] text-[#4169E1]'
                            )}
                          >
                            {f.severity} {f.category}
                          </span>
                          <span className="text-[10px] text-[#526784]">
                            Confidence: <strong>{f.confidence_level}</strong>
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-[#526784]">{f.location}</span>
                      </div>

                      {/* Affected Text */}
                      <div className="text-xs">
                        <span className="text-[#526784]">Affected Text: </span>
                        <strong className="text-[#DC2626] bg-[#FEE2E2] px-1.5 py-0.5 rounded">
                          "{f.affected_text}"
                        </strong>
                      </div>

                      {/* Plain-Language Explanation */}
                      <p className="text-xs text-[#172B4D] leading-relaxed">
                        {f.explanation}
                      </p>

                      {/* Authoritative Evidence & Source Reference (Section 9 Grounding) */}
                      {f.supporting_evidence && (
                        <div className="p-3 rounded-xl bg-[#F7FAFF] border border-[#D7E1EE] text-[11px] space-y-1">
                          <div className="flex items-center justify-between font-semibold text-[#172B4D]">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-[#4169E1]" />
                              {f.source_document_title || 'Approved Company Guideline'}
                            </span>
                            {f.source_version && (
                              <span className="text-[10px] text-[#526784]">v{f.source_version} · Eff: {f.source_effective_date}</span>
                            )}
                          </div>
                          <p className="text-[#526784] italic leading-relaxed">{f.supporting_evidence}</p>
                        </div>
                      )}

                      {/* Suggested Rewrite with 1-Click Apply */}
                      {f.suggested_rewrite && (
                        <div className="p-3 rounded-xl bg-[#E7F9F7] border border-[#15A99A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-[#15A99A] uppercase tracking-wider block">
                              Suggested Compliant Rewrite:
                            </span>
                            <span className="text-[#172B4D] font-medium">"{f.suggested_rewrite}"</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => applyRewriteToEditor(f.affected_text, f.suggested_rewrite!)}
                            className="px-2.5 py-1 rounded-md bg-[#15A99A] hover:bg-[#10877B] text-white text-[11px] font-semibold shrink-0 transition-colors shadow-2xs"
                          >
                            Apply to Revision
                          </button>
                        </div>
                      )}

                      {/* Actionable Next Step */}
                      <div className="text-[11px] text-[#526784] pt-1 border-t border-[#EBF1F8] flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-[#4169E1] shrink-0" />
                        <span><strong>Action:</strong> {f.recommended_action}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-10 text-center bg-white rounded-2xl border border-[#D7E1EE] space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#059669] mx-auto" />
                  <h4 className="text-sm font-bold text-[#172B4D]">No Brand Violations Detected</h4>
                  <p className="text-xs text-[#526784]">
                    All statements align with approved SLAs, terminology rules, and tone standards.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Human Approval Decision Modal */}
      {decisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D7E1EE] max-w-lg w-full p-6 space-y-5 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBF1F8]">
              <h3 className="text-base font-bold text-[#172B4D]">Record Governance Decision</h3>
              <button
                type="button"
                onClick={() => setDecisionModalOpen(false)}
                className="text-[#526784] hover:text-[#172B4D]"
              >
                ✕
              </button>
            </div>

            {decisionError && (
              <div className="p-3 rounded-lg bg-[#FEE2E2] border border-[#DC2626]/30 text-xs text-[#DC2626]">
                {decisionError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Decision Type</label>
                <select
                  value={decisionType}
                  onChange={(e) => setDecisionType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
                >
                  <option value="APPROVE">Approve Publication</option>
                  <option value="APPROVE_WITH_CONDITIONS">Approve with Conditions</option>
                  <option value="REQUEST_CHANGES">Request Revisions</option>
                  <option value="REJECT">Reject Submission</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Decision Rationale (Mandatory for Audit Trail)
                </label>
                <textarea
                  rows={3}
                  required
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Explain why this content is approved or what revisions are required..."
                  className="w-full p-3 text-xs border border-[#D7E1EE] rounded-lg focus-ring"
                />
              </div>

              {decisionType === 'APPROVE_WITH_CONDITIONS' && (
                <div>
                  <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                    Approval Conditions
                  </label>
                  <input
                    type="text"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="e.g. Ensure link to full MSA is present on the live page."
                    className="w-full px-3 py-2 text-xs border border-[#D7E1EE] rounded-lg focus-ring"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EBF1F8]">
              <button
                type="button"
                onClick={() => setDecisionModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#D7E1EE] text-xs font-semibold text-[#526784]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={recordDecisionMutation.isPending || !rationale}
                onClick={() => recordDecisionMutation.mutate()}
                className="px-4 py-2 rounded-lg bg-[#4169E1] hover:bg-[#3355C4] text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {recordDecisionMutation.isPending ? 'Recording...' : 'Submit Human Decision'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
