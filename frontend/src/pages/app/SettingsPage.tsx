import React from 'react';
import {
  Settings,
  ShieldCheck,
  User,
  Cpu,
  Lock,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-[#D7E1EE]">
        <h1 className="text-2xl font-bold text-[#172B4D]">Workspace Settings &amp; Configuration</h1>
        <p className="text-xs text-[#526784] mt-0.5">
          Profile, AI integration status, and security controls for Acme Global Brand.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#D7E1EE] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#EBF1F8]">
          <User className="w-4 h-4 text-[#4169E1]" />
          <h3 className="text-sm font-bold text-[#172B4D]">User Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-[#526784] block mb-0.5">Full Name</label>
            <div className="p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D7E1EE] font-semibold text-[#172B4D]">
              {user?.full_name}
            </div>
          </div>

          <div>
            <label className="text-[#526784] block mb-0.5">Email Address</label>
            <div className="p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D7E1EE] font-mono text-[#172B4D]">
              {user?.email}
            </div>
          </div>

          <div>
            <label className="text-[#526784] block mb-0.5">Assigned Governance Role</label>
            <div className="p-2.5 rounded-lg bg-[#EEF3FF] border border-[#4169E1]/30 font-bold text-[#4169E1]">
              {user?.role}
            </div>
          </div>

          <div>
            <label className="text-[#526784] block mb-0.5">Active Workspace</label>
            <div className="p-2.5 rounded-lg bg-[#F7FAFF] border border-[#D7E1EE] font-semibold text-[#172B4D]">
              Acme Global Brand
            </div>
          </div>
        </div>
      </div>

      {/* AI Model Integration Status */}
      <div className="bg-white p-6 rounded-2xl border border-[#D7E1EE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EBF1F8]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#15A99A]" />
            <h3 className="text-sm font-bold text-[#172B4D]">AI Model &amp; Retrieval Engine</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E7F9F7] text-[#15A99A] border border-[#15A99A]/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Operational
          </span>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-[#526784]">
          <p>
            BrandPilot uses a provider-independent AI service interface. It connects to <strong>Google Gemini</strong> when an API key is configured, and seamlessly falls back to the deterministic, RAG-grounded policy engine for local offline testing.
          </p>

          <div className="p-3.5 rounded-xl bg-[#F7FAFF] border border-[#D7E1EE] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#172B4D]">Active Engine:</span>
              <span className="font-mono text-[#4169E1] font-bold">Deterministic Policy &amp; RAG Engine (Local)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#172B4D]">Cloud Target:</span>
              <span className="font-mono text-[#526784]">gemini-2.5-flash (Configurable via GEMINI_API_KEY)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#172B4D]">Retrieval Passages:</span>
              <span className="text-[#059669] font-bold">Active SLA v2.4 &amp; Brand Standard v3.1 indexed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Governance Controls */}
      <div className="bg-white p-6 rounded-2xl border border-[#D7E1EE] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#EBF1F8]">
          <Lock className="w-4 h-4 text-[#4169E1]" />
          <h3 className="text-sm font-bold text-[#172B4D]">Security &amp; Compliance Safeguards</h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-lg bg-[#F7FAFF] border border-[#D7E1EE] flex items-center justify-between">
            <div>
              <strong className="text-[#172B4D] block">Self-Approval Gate Enforced</strong>
              <span className="text-[11px] text-[#526784]">Content creators are blocked by the backend from approving their own work.</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          </div>

          <div className="p-3 rounded-lg bg-[#F7FAFF] border border-[#D7E1EE] flex items-center justify-between">
            <div>
              <strong className="text-[#172B4D] block">Server-Side Request Security (SSRF Protection)</strong>
              <span className="text-[11px] text-[#526784]">Restricts internal IPs, localhost, and cloud metadata (169.254.169.254).</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          </div>

          <div className="p-3 rounded-lg bg-[#F7FAFF] border border-[#D7E1EE] flex items-center justify-between">
            <div>
              <strong className="text-[#172B4D] block">Append-Only Audit Trail</strong>
              <span className="text-[11px] text-[#526784]">Every version, AI review, and human sign-off is logged immutably.</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          </div>
        </div>
      </div>
    </div>
  );
};
