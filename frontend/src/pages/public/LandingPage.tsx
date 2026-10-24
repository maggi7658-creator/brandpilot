import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Scale,
  Sparkles,
  FileText,
  UserCheck,
  History,
  Lock,
  ChevronDown,
  HelpCircle,
  ExternalLink,
  Layers,
  Search
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Does BrandPilot publish content automatically?",
      a: "No. BrandPilot is strictly a review and governance platform. Its foundational principle is that AI assists with analysis and recommendations, but an authorized human reviewer must always make the final approval decision before content is marked Ready to Publish."
    },
    {
      q: "How does BrandPilot prevent AI hallucinations in brand reviews?",
      a: "BrandPilot employs Retrieval-Augmented Generation (RAG) directly over your organization's approved guidelines, SLAs, and reference documents. Every finding includes the exact quoted source passage, document version, authority, and effective dates. When supporting evidence cannot be found, BrandPilot explicitly labels the claim as 'Unable to verify' rather than inventing false confirmation."
    },
    {
      q: "Can content creators approve their own submissions?",
      a: "No. The backend enforces strict role-based separation of duties. Content Creators cannot approve their own submissions. Approval requires a separate designated Brand Reviewer or Manager, with high-risk claims automatically routed to Legal and Compliance."
    },
    {
      q: "What types of content can be reviewed?",
      a: "BrandPilot supports pasted text copy, documents (PDF, DOCX, TXT), website URLs with built-in SSRF security filtering, and image assets for terminology and visual compliance."
    },
    {
      q: "What happens when a creator updates an existing draft?",
      a: "Any revision that materially updates the content creates a new version record and automatically invalidates prior approvals. The new version must be re-evaluated, maintaining a completely transparent and immutable audit trail."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Soft background ambient gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#EEF3FF] via-[#F7FAFF] to-transparent pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF3FF] text-[#4169E1] text-xs font-semibold border border-[#4169E1]/20">
                <ShieldCheck className="w-4 h-4 text-[#4169E1]" />
                <span>Enterprise AI Brand Governance</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#15A99A]" />
                <span className="text-[#15A99A]">Trust Before Publish</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#172B4D] leading-[1.12]">
                Every word matters. <br />
                <span className="text-[#4169E1]">Every claim needs trust.</span>
              </h1>

              <p className="text-lg text-[#526784] max-w-xl leading-relaxed">
                Review content against your approved brand guidelines, uncover potential risks with explainable AI, and bring every publication closer to confident human approval.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#4169E1] hover:bg-[#3355C4] text-white font-semibold text-base shadow-md shadow-[#4169E1]/25 transition-all hover:scale-[1.02]"
                >
                  <span>Start a Content Review</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <a
                  href="#workflow"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#172B4D] font-semibold text-base border border-[#D7E1EE] shadow-sm transition-all"
                >
                  <span>Explore How It Works</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-[#526784] border-t border-[#EBF1F8]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15A99A]" />
                  <span>Evidence-Grounded RAG</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15A99A]" />
                  <span>Mandatory Human Approval</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#15A99A]" />
                  <span>Immutable Audit Trail</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Animated Glassmorphism Dashboard Preview Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="glass-panel-elevated p-6 rounded-2xl space-y-4 relative">
                {/* Header of review preview */}
                <div className="flex items-center justify-between pb-3 border-b border-[#EBF1F8]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#15A99A] animate-pulse" />
                    <span className="text-xs font-bold text-[#172B4D]">Live Governance Engine</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded-md border border-[#DC2626]/20">
                    Needs Revision
                  </span>
                </div>

                {/* Card 1: Claims Finding */}
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D7E1EE] shadow-xs space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626] bg-[#FEE2E2] px-2 py-0.5 rounded">
                      Critical Claim Conflict
                    </span>
                    <span className="text-[10px] font-medium text-[#526784]">SLA Guideline v2.4</span>
                  </div>
                  <p className="text-xs text-[#172B4D] font-semibold">
                    Statement: <span className="bg-[#FEE2E2] text-[#DC2626] px-1 py-0.5 rounded">"Our service is always available."</span>
                  </p>
                  <p className="text-[11px] text-[#526784] leading-relaxed">
                    Conflicts with approved 99.9% uptime target. SLA excludes scheduled maintenance windows and force majeure.
                  </p>
                  <div className="text-[11px] text-[#15A99A] font-medium bg-[#E7F9F7] p-2 rounded border border-[#15A99A]/20">
                    <strong>Suggested Rewrite:</strong> "engineered for 99.9% uptime availability with enterprise redundancy"
                  </div>
                </div>

                {/* Card 2: Terminology Finding */}
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D7E1EE] shadow-xs space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded">
                      Restricted Terminology
                    </span>
                    <span className="text-[10px] font-medium text-[#526784]">Product Terminology Rule</span>
                  </div>
                  <p className="text-xs text-[#172B4D]">
                    Prohibited Term: <span className="line-through text-[#DC2626]">cheap</span> → Preferred: <strong className="text-[#059669]">cost-effective</strong>
                  </p>
                </div>

                {/* Card 3: Human Approval Status */}
                <div className="p-3 rounded-xl bg-[#EEF3FF] border border-[#4169E1]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#4169E1]" />
                    <span className="text-xs font-semibold text-[#172B4D]">Self-Approval Gate:</span>
                  </div>
                  <span className="text-xs font-bold text-[#4169E1]">
                    Manager &amp; Legal Sign-Off Required
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section id="features" className="py-16 bg-white border-y border-[#D7E1EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4169E1] bg-[#EEF3FF] px-3 py-1 rounded-full border border-[#4169E1]/20">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#172B4D]">
              Engineered for Enterprise Brand Trust
            </h2>
            <p className="text-sm text-[#526784]">
              Moving beyond spell-check and subjective feedback. BrandPilot grounds reviews in your organization's authoritative evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#F7FAFF] border border-[#D7E1EE] space-y-3 text-left hover:border-[#4169E1]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#4169E1] flex items-center justify-center font-bold">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B4D]">Evidence-Backed Claims</h3>
              <p className="text-xs text-[#526784] leading-relaxed">
                Verifies factual statements, SLAs, and performance benchmarks against approved internal sources using semantic RAG.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#F7FAFF] border border-[#D7E1EE] space-y-3 text-left hover:border-[#4169E1]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#E7F9F7] text-[#15A99A] flex items-center justify-center font-bold">
                <BookOpenCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B4D]">Brand Consistency</h3>
              <p className="text-xs text-[#526784] leading-relaxed">
                Enforces approved tone of voice, preferred terminology, and authorized visual asset guidelines across all channels.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#F7FAFF] border border-[#D7E1EE] space-y-3 text-left hover:border-[#4169E1]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#4169E1] flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B4D]">Accessibility &amp; Inclusivity</h3>
              <p className="text-xs text-[#526784] leading-relaxed">
                Audits content against WCAG 2.2 AA readability guidelines, cognitive clarity limits, and identifies exclusionary language.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#F7FAFF] border border-[#D7E1EE] space-y-3 text-left hover:border-[#4169E1]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#E7F9F7] text-[#15A99A] flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B4D]">Mandatory Human Approval</h3>
              <p className="text-xs text-[#526784] leading-relaxed">
                Strict governance gates prevent self-approval. Revisions invalidate prior sign-offs, ensuring total accountability before publishing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Review Workflow Section */}
      <section id="workflow" className="py-16 bg-[#F7FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#15A99A] bg-[#E7F9F7] px-3 py-1 rounded-full border border-[#15A99A]/20">
              The Governance Journey
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#172B4D]">
              From Raw Draft to Confident Publication
            </h2>
            <p className="text-sm text-[#526784]">
              A continuous, auditable 5-step process designed for marketing, communications, and legal teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: "01",
                title: "Content Intake",
                desc: "Paste copy, upload PDF/DOCX files, or analyze public URLs with SSRF protection.",
                icon: FileText
              },
              {
                step: "02",
                title: "RAG Evidence Retrieval",
                desc: "Queries approved guidelines and SLAs, preserving exact passage citations and effective dates.",
                icon: Search
              },
              {
                step: "03",
                title: "Explainable Findings",
                desc: "Identifies claims, tone, and disclosure issues with plain-language explanations and rewrites.",
                icon: Sparkles
              },
              {
                step: "04",
                title: "Creator Revisions",
                desc: "Creators accept or edit suggestions. Each saved revision updates version history.",
                icon: Layers
              },
              {
                step: "05",
                title: "Authorized Sign-Off",
                desc: "Brand managers and legal reviewers record formal decisions. Ready to publish only when cleared.",
                icon: CheckCircle2
              }
            ].map((s, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-[#D7E1EE] shadow-xs text-left space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#4169E1] font-mono">{s.step}</span>
                  <s.icon className="w-4 h-4 text-[#526784]" />
                </div>
                <h4 className="text-sm font-bold text-[#172B4D]">{s.title}</h4>
                <p className="text-xs text-[#526784] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section id="trust" className="py-16 bg-white border-t border-[#D7E1EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 md:p-12 rounded-2xl bg-[#F7FAFF] border border-[#D7E1EE] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-left">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4169E1] bg-[#EEF3FF] px-3 py-1 rounded-full">
                Transparency &amp; Accountability
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#172B4D]">
                Built for compliance. Defensible by design.
              </h3>
              <p className="text-sm text-[#526784] leading-relaxed">
                BrandPilot does not treat AI as an infallible judge. Every finding displays confidence levels, uncertainty warnings, and linkable passages to real internal documents.
              </p>
              <ul className="space-y-2 text-xs text-[#172B4D] font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15A99A]" />
                  <span>No black-box scores: every issue is explained in plain language</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15A99A]" />
                  <span>Never invents citations: reports when suitable evidence is missing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#15A99A]" />
                  <span>Append-only audit trail records all decisions with actor and timestamp</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#D7E1EE] shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#EBF1F8]">
                <ShieldCheck className="w-5 h-5 text-[#4169E1]" />
                <span className="text-sm font-bold text-[#172B4D]">Demonstration Scenario Verified</span>
              </div>
              <p className="text-xs text-[#526784] leading-relaxed">
                Test the illustrative scenario right now with our pre-loaded demo personas:
              </p>
              <div className="p-3 rounded-lg bg-[#EEF3FF] border border-[#4169E1]/20 text-xs text-[#172B4D] space-y-1">
                <div><strong>Draft Claim:</strong> "Our service is always available."</div>
                <div className="text-[#526784]"><strong>Grounding Document:</strong> Acme SLA Policy v2.4 (99.9% target)</div>
                <div className="text-[#15A99A] font-semibold">→ Flagged, explained, rewritten, and routed to human approval!</div>
              </div>
              <Link
                to="/login"
                className="w-full text-center block py-2.5 rounded-lg bg-[#4169E1] hover:bg-[#3355C4] text-white font-semibold text-xs transition-colors"
              >
                Launch Demo Workspace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-[#F7FAFF] border-t border-[#D7E1EE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#526784]">
              Questions &amp; Answers
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#172B4D]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-[#D7E1EE] overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-[#172B4D] hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#526784] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-[#526784] leading-relaxed border-t border-[#EBF1F8]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team ALTO Section from Master PDF */}
      <section id="team" className="py-16 bg-white border-t border-[#D7E1EE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4169E1] bg-[#EEF3FF] px-3 py-1 rounded-full border border-[#4169E1]/20">
              Team ALTO Showcase
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-[#172B4D]">
              Engineered by Team ALTO
            </h2>
            <p className="text-sm text-[#526784] max-w-2xl mx-auto">
              BrandPilot was architected and built to solve pre-publication governance friction by bringing evidence-backed retrieval, explainable checks, and human sign-off into one unified workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Anuhya */}
            <div className="bg-[#F7FAFF] rounded-2xl border border-[#D7E1EE] p-6 space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#4169E1] text-white flex items-center justify-center font-bold text-xl shadow-md">
                  CA
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#172B4D]">CHITHYALA ANUHYA</h3>
                  <div className="text-xs font-semibold text-[#4169E1]">Team Leader · Product, AI &amp; Retrieval Lead</div>
                  <div className="text-xs text-[#526784]">maggi7658@gmail.com</div>
                </div>
              </div>
              <div className="space-y-2 text-xs text-[#526784] border-t border-[#D7E1EE] pt-4">
                <div><strong>Primary Responsibilities:</strong> Problem framing, user journeys, AI &amp; document retrieval, prompt &amp; evaluation design, uncertainty handling, source citations, data security &amp; access policies, QA &amp; pilot targets.</div>
                <div><strong>Key Deliverables:</strong> RAG pipeline architecture, finding schema contracts, risk register, test scenarios, and product governance narrative.</div>
              </div>
            </div>

            {/* Rupesh */}
            <div className="bg-[#F7FAFF] rounded-2xl border border-[#D7E1EE] p-6 space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#15A99A] text-white flex items-center justify-center font-bold text-xl shadow-md">
                  SR
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#172B4D]">SANDA RUPESH</h3>
                  <div className="text-xs font-semibold text-[#15A99A]">UX &amp; Frontend Lead · Backend &amp; Workflow Lead</div>
                  <div className="text-xs text-[#526784]">sandarupesh4@gmail.com</div>
                </div>
              </div>
              <div className="space-y-2 text-xs text-[#526784] border-t border-[#D7E1EE] pt-4">
                <div><strong>Primary Responsibilities:</strong> Information architecture, responsive interface, accessibility auditing, review studio experience, FastAPI services, workflow state machine, role permissions, and immutable audit events.</div>
                <div><strong>Key Deliverables:</strong> React 19 review workspace, human approval gates (separation of duties), API integration, and deployment automation.</div>
              </div>
            </div>
          </div>

          {/* 9 Design Principles from PDF */}
          <div className="mt-10 p-6 rounded-2xl bg-[#EEF3FF]/60 border border-[#4169E1]/20">
            <h4 className="text-sm font-bold text-[#172B4D] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4169E1]" />
              Core Design Principles (from Specification)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-[#172B4D]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15A99A] shrink-0" />
                <span>Human approval before publishing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15A99A] shrink-0" />
                <span>Explainability over opaque scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15A99A] shrink-0" />
                <span>Purpose-preserving suggestions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15A99A] shrink-0" />
                <span>Evidence before assertion</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15A99A] shrink-0" />
                <span>Least-privilege access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15A99A] shrink-0" />
                <span>Confidentiality by default</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15A99A] shrink-0" />
                <span>Uncertainty made visible</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15A99A] shrink-0" />
                <span>Accessible review experiences</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15A99A] shrink-0" />
                <span>Learning from repeated issues</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-[#F7FAFF] border-t border-[#D7E1EE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-[#172B4D]">
            Protect your brand's integrity before anything goes live.
          </h2>
          <p className="text-sm text-[#526784] max-w-xl mx-auto">
            Experience complete pre-publication governance with explainable findings, evidence citations, and human sign-off.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-[#4169E1] hover:bg-[#3355C4] text-white font-semibold text-sm shadow-md shadow-[#4169E1]/20 transition-all hover:scale-105"
            >
              Access BrandPilot Studio
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
