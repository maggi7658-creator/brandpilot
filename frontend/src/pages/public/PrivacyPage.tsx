import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Lock, Database, EyeOff } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col justify-between text-left">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12 w-full space-y-8">
        <div className="border-b border-[#D7E1EE] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7F9F7] text-[#15A99A] text-xs font-semibold mb-3">
            <Lock className="w-4 h-4" />
            <span>Data Protection &amp; AI Privacy</span>
          </div>
          <h1 className="text-3xl font-bold text-[#172B4D]">Privacy Policy</h1>
          <p className="text-xs text-[#526784] mt-1">Last Updated: October 2026 · BrandPilot Platform</p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#D7E1EE] shadow-sm space-y-6 text-sm text-[#526784] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#172B4D] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#4169E1]" />
              1. Enterprise Workspace Isolation
            </h2>
            <p>
              BrandPilot enforces multi-tenant workspace isolation at the database and application levels. Your brand guidelines, internal SLAs, terminology rules, and content submissions are private to your authenticated workspace and cannot be accessed across tenant boundaries.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#172B4D] flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-[#15A99A]" />
              2. AI Provider Data Handling &amp; Non-Training Commitment
            </h2>
            <p>
              When an AI analysis is triggered using external LLM providers (such as Google Gemini Enterprise API), content is transmitted solely over encrypted HTTPS channels for real-time inference. Under enterprise API terms, customer submissions and retrieved internal guidelines are <strong>never used to train or fine-tune public foundation models</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#172B4D] flex items-center gap-2">
              <Database className="w-5 h-5 text-[#4169E1]" />
              3. File Retention, Access Control, and Deletion
            </h2>
            <p>
              Uploaded documents (PDFs, DOCX, TXT) are stored securely in dedicated object directories outside web-executable roots. Access is strictly authenticated via scoped JWT bearer tokens. Workspace administrators possess the authority to archive or permanently delete guideline documents, brand assets, and submissions in compliance with organizational retention policies.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#172B4D]">4. Server-Side Request Security (SSRF Protection)</h2>
            <p>
              When a user submits a public website URL for brand review, the intake engine validates the target destination against private subnets (RFC 1918), loopback interfaces, and cloud metadata endpoints (e.g. AWS 169.254.169.254) to ensure safe content extraction without exposing internal networks.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};
