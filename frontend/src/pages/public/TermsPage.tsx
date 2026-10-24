import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Scale, AlertTriangle, FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col justify-between text-left">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
        <div className="border-b border-[#D7E1EE] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF3FF] text-[#4169E1] text-xs font-semibold mb-3">
            <Scale className="w-4 h-4" />
            <span>Governance &amp; Terms of Service</span>
          </div>
          <h1 className="text-3xl font-bold text-[#172B4D]">Terms and Conditions</h1>
          <p className="text-xs text-[#526784] mt-1">Last Updated: October 2026 · BrandPilot Governance Platform</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#D7E1EE] shadow-sm space-y-6 text-sm text-[#526784] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#172B4D] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#4169E1]" />
              1. Fundamental Governance Principle: Human-in-the-Loop
            </h2>
            <p>
              BrandPilot is strictly a review and governance assistant platform. By using BrandPilot, you acknowledge and agree that <strong>all AI-generated findings, confidence scores, and rewrite suggestions are advisory only</strong>. BrandPilot must never be configured to automatically publish submitted content. A qualified and designated human reviewer must review, verify, and formally authorize any content prior to public release.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#172B4D] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D97706]" />
              2. Permitted Use and AI Model Limitations
            </h2>
            <p>
              BrandPilot's retrieval pipeline checks content against the guidelines and reference documents configured in your active workspace. If an approved document does not exist for a specific topic, BrandPilot will flag the item as 'Unable to verify' or 'Potentially unsupported'. BrandPilot does not warrant that AI-assisted reviews will catch every grammatical, factual, or regulatory defect. Users remain solely responsible for the legal compliance and accuracy of their publications.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#172B4D]">3. Separation of Duties and Approval Integrity</h2>
            <p>
              To maintain audit compliance, the platform enforces strict role-based separation of duties. Content Creators are barred from self-approving their own submissions. Any revision that materially alters a draft automatically invalidates prior approvals, requiring re-review by an authorized Brand Manager or Legal Officer.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#172B4D]">4. Intellectual Property &amp; Audit Trail</h2>
            <p>
              Organizations retain full ownership of all submitted text, documents, brand assets, and custom guidelines. All review events, reviewer comments, and approval timestamps are recorded in an append-only audit trail to satisfy internal governance and legal discovery requirements.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};
