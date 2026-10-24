import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BookOpenCheck,
  Plus,
  FileText,
  Calendar,
  Shield,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Tag,
  Palette
} from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Guideline, TerminologyRule } from '@/types';
import { cn } from '@/utils/cn';

export const GuidelinesPage: React.FC = () => {
  const { user, isAdmin, isReviewer } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'guidelines' | 'terminology' | 'assets'>('guidelines');

  // Guideline Creation Modal State
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [gTitle, setGTitle] = useState('');
  const [gCategory, setGCategory] = useState('claims');
  const [gVersion, setGVersion] = useState('1.0');
  const [gAuthority, setGAuthority] = useState('');
  const [gEffectiveDate, setGEffectiveDate] = useState('2026-01-01');
  const [gContent, setGContent] = useState('');

  // Terminology Modal State
  const [termModalOpen, setTermModalOpen] = useState(false);
  const [prohibited, setProhibited] = useState('');
  const [preferred, setPreferred] = useState('');
  const [rationale, setRationale] = useState('');
  const [severity, setSeverity] = useState('medium');

  // Selected Guideline for details
  const [selectedGuideline, setSelectedGuideline] = useState<Guideline | null>(null);

  // Queries
  const { data: guidelines, isLoading: gLoading } = useQuery({
    queryKey: ['guidelinesList'],
    queryFn: () => api.listGuidelines(),
  });

  const { data: terminology, isLoading: tLoading } = useQuery({
    queryKey: ['terminologyList'],
    queryFn: () => api.listTerminology(),
  });

  const { data: assets, isLoading: aLoading } = useQuery({
    queryKey: ['assetsList'],
    queryFn: () => api.listAssets(),
  });

  // Mutations
  const createGuidelineMutation = useMutation({
    mutationFn: () =>
      api.createGuideline({
        title: gTitle,
        category: gCategory,
        version: gVersion,
        authority: gAuthority,
        effective_date: gEffectiveDate,
        content: gContent,
      }),
    onSuccess: () => {
      setGuideModalOpen(false);
      setGTitle('');
      setGContent('');
      queryClient.invalidateQueries({ queryKey: ['guidelinesList'] });
    },
  });

  const createTermMutation = useMutation({
    mutationFn: () =>
      api.createTerminology({
        prohibited_term: prohibited,
        preferred_term: preferred,
        rationale,
        severity,
      }),
    onSuccess: () => {
      setTermModalOpen(false);
      setProhibited('');
      setPreferred('');
      setRationale('');
      queryClient.invalidateQueries({ queryKey: ['terminologyList'] });
    },
  });

  const canManage = isAdmin || isReviewer;

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#D7E1EE]">
        <div>
          <h1 className="text-2xl font-bold text-[#172B4D]">Brand Guidelines &amp; Knowledge Base</h1>
          <p className="text-xs text-[#526784] mt-0.5">
            Approved reference standards, SLAs, terminology dictionaries, and visual assets powering RAG reviews.
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            {activeTab === 'guidelines' && (
              <button
                type="button"
                onClick={() => setGuideModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#4169E1] hover:bg-[#3355C4] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Approved Guideline</span>
              </button>
            )}
            {activeTab === 'terminology' && (
              <button
                type="button"
                onClick={() => setTermModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#4169E1] hover:bg-[#3355C4] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Terminology Rule</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-white rounded-xl border border-[#D7E1EE] w-fit shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('guidelines')}
          className={cn(
            'px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2',
            activeTab === 'guidelines' ? 'bg-[#EEF3FF] text-[#4169E1]' : 'text-[#526784] hover:bg-slate-50'
          )}
        >
          <BookOpenCheck className="w-4 h-4" />
          <span>Approved Guidelines ({guidelines?.length || 0})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('terminology')}
          className={cn(
            'px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2',
            activeTab === 'terminology' ? 'bg-[#EEF3FF] text-[#4169E1]' : 'text-[#526784] hover:bg-slate-50'
          )}
        >
          <Tag className="w-4 h-4" />
          <span>Terminology Rules ({terminology?.length || 0})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('assets')}
          className={cn(
            'px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2',
            activeTab === 'assets' ? 'bg-[#EEF3FF] text-[#4169E1]' : 'text-[#526784] hover:bg-slate-50'
          )}
        >
          <Palette className="w-4 h-4" />
          <span>Authorized Brand Assets ({assets?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: Approved Guidelines */}
      {activeTab === 'guidelines' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 space-y-3">
            {gLoading ? (
              <div className="p-8 text-center text-xs text-[#526784]">Loading guidelines...</div>
            ) : guidelines && guidelines.length > 0 ? (
              guidelines.map((g) => {
                const isSelected = selectedGuideline?.id === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGuideline(g)}
                    className={cn(
                      'p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all space-y-2',
                      isSelected ? 'border-[#4169E1] ring-1 ring-[#4169E1]' : 'border-[#D7E1EE] hover:border-slate-300'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EEF3FF] text-[#4169E1]">
                        {g.category}
                      </span>
                      <span className="text-[11px] font-mono text-[#526784]">v{g.version}</span>
                    </div>

                    <h3 className="text-sm font-bold text-[#172B4D]">{g.title}</h3>

                    <div className="flex items-center gap-4 text-[11px] text-[#526784]">
                      <span>Authority: <strong className="text-[#172B4D]">{g.authority}</strong></span>
                      <span>Effective: {g.effective_date}</span>
                    </div>

                    <div className="text-[11px] text-[#15A99A] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{g.passages?.length || 0} indexed passages for RAG</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-[#526784] bg-white rounded-xl border border-[#D7E1EE]">
                No approved guidelines found.
              </div>
            )}
          </div>

          {/* Guideline Passages Detail Panel */}
          <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-[#D7E1EE] shadow-xs space-y-4">
            {selectedGuideline ? (
              <>
                <div className="pb-3 border-b border-[#EBF1F8] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4169E1]">
                    {selectedGuideline.category} standard
                  </span>
                  <h3 className="text-base font-bold text-[#172B4D]">{selectedGuideline.title}</h3>
                  <div className="text-xs text-[#526784]">
                    Authority: <strong>{selectedGuideline.authority}</strong> · Version {selectedGuideline.version}
                  </div>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider">
                    Indexed Semantic Passages
                  </h4>
                  {selectedGuideline.passages && selectedGuideline.passages.length > 0 ? (
                    selectedGuideline.passages.map((p, i) => (
                      <div key={p.id} className="p-3.5 rounded-lg bg-[#F7FAFF] border border-[#D7E1EE] text-xs space-y-1">
                        <div className="font-semibold text-[#4169E1] text-[11px]">
                          Section: {p.section || `Passage ${i + 1}`}
                        </div>
                        <p className="text-[#172B4D] leading-relaxed">{p.passage_text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-[#526784]">No passages extracted.</div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-xs text-[#526784] space-y-2">
                <BookOpenCheck className="w-8 h-8 text-[#526784] mx-auto opacity-50" />
                <p>Select any guideline on the left to inspect its indexed passages and citation metadata.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Terminology Rules */}
      {activeTab === 'terminology' && (
        <div className="bg-white rounded-xl border border-[#D7E1EE] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#D7E1EE] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#172B4D]">Configured Terminology Dictionary</h3>
              <p className="text-xs text-[#526784]">Deterministic policy rules enforced across all submissions</p>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7FAFF] text-[#526784] font-semibold border-b border-[#D7E1EE]">
              <tr>
                <th className="py-3 px-4">Prohibited Phrase</th>
                <th className="py-3 px-4">Preferred Alternative</th>
                <th className="py-3 px-4">Governance Rationale</th>
                <th className="py-3 px-4">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBF1F8]">
              {terminology && terminology.length > 0 ? (
                terminology.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#DC2626] line-through">"{t.prohibited_term}"</td>
                    <td className="py-3 px-4 font-bold text-[#059669]">"{t.preferred_term}"</td>
                    <td className="py-3 px-4 text-[#526784] max-w-sm">{t.rationale}</td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                          t.severity === 'high' ? 'bg-[#FEE2E2] text-[#DC2626]' : 'bg-[#FEF3C7] text-[#D97706]'
                        )}
                      >
                        {t.severity}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#526784]">
                    No terminology rules configured.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Authorized Brand Assets */}
      {activeTab === 'assets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets && assets.length > 0 ? (
            assets.map((a) => (
              <div key={a.id} className="p-5 rounded-xl bg-white border border-[#D7E1EE] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EEF3FF] text-[#4169E1]">
                    {a.asset_type}
                  </span>
                  <span className="text-[10px] font-bold text-[#059669] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Authorized
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#172B4D]">{a.name}</h3>
                <p className="text-xs text-[#526784] leading-relaxed">{a.guidelines_note}</p>
              </div>
            ))
          ) : (
            <div className="col-span-3 p-12 text-center text-xs text-[#526784] bg-white rounded-xl border border-[#D7E1EE]">
              No brand assets configured.
            </div>
          )}
        </div>
      )}

      {/* Add Guideline Modal */}
      {guideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D7E1EE] max-w-xl w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBF1F8]">
              <h3 className="text-base font-bold text-[#172B4D]">Add Approved Guideline</h3>
              <button onClick={() => setGuideModalOpen(false)} className="text-[#526784]">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#172B4D] mb-1">Guideline Title</label>
                <input
                  type="text"
                  required
                  value={gTitle}
                  onChange={(e) => setGTitle(e.target.value)}
                  placeholder="e.g. Master Service Agreement & SLA Guidelines"
                  className="w-full px-3 py-2 border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#172B4D] mb-1">Category</label>
                  <select
                    value={gCategory}
                    onChange={(e) => setGCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
                  >
                    <option value="claims">Claims &amp; Performance</option>
                    <option value="tone">Tone of Voice</option>
                    <option value="terminology">Terminology</option>
                    <option value="disclosures">Legal Disclosures</option>
                    <option value="accessibility">Accessibility</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#172B4D] mb-1">Issuing Authority</label>
                  <input
                    type="text"
                    required
                    value={gAuthority}
                    onChange={(e) => setGAuthority(e.target.value)}
                    placeholder="e.g. General Counsel / VP Marketing"
                    className="w-full px-3 py-2 border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#172B4D] mb-1">Guideline Document Text</label>
                <textarea
                  rows={6}
                  required
                  value={gContent}
                  onChange={(e) => setGContent(e.target.value)}
                  placeholder="Paste guideline text. Use # Headers to define sections for semantic chunking..."
                  className="w-full p-3 border border-[#D7E1EE] rounded-lg focus-ring font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#EBF1F8]">
              <button
                type="button"
                onClick={() => setGuideModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#D7E1EE] text-xs font-semibold text-[#526784]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={createGuidelineMutation.isPending || !gTitle || !gContent}
                onClick={() => createGuidelineMutation.mutate()}
                className="px-4 py-2 rounded-lg bg-[#4169E1] text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {createGuidelineMutation.isPending ? 'Indexing...' : 'Save & Index for RAG'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Terminology Modal */}
      {termModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D7E1EE] max-w-md w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBF1F8]">
              <h3 className="text-base font-bold text-[#172B4D]">Add Terminology Rule</h3>
              <button onClick={() => setTermModalOpen(false)} className="text-[#526784]">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#172B4D] mb-1">Prohibited Phrase</label>
                <input
                  type="text"
                  required
                  value={prohibited}
                  onChange={(e) => setProhibited(e.target.value)}
                  placeholder="e.g. cheap"
                  className="w-full px-3 py-2 border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#172B4D] mb-1">Preferred Alternative</label>
                <input
                  type="text"
                  required
                  value={preferred}
                  onChange={(e) => setPreferred(e.target.value)}
                  placeholder="e.g. cost-effective"
                  className="w-full px-3 py-2 border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#172B4D] mb-1">Governance Rationale</label>
                <textarea
                  rows={3}
                  required
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Explain why this change is mandated..."
                  className="w-full p-3 border border-[#D7E1EE] rounded-lg focus-ring"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#EBF1F8]">
              <button
                type="button"
                onClick={() => setTermModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#D7E1EE] text-xs font-semibold text-[#526784]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={createTermMutation.isPending || !prohibited || !preferred}
                onClick={() => createTermMutation.mutate()}
                className="px-4 py-2 rounded-lg bg-[#4169E1] text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {createTermMutation.isPending ? 'Saving...' : 'Add Rule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
