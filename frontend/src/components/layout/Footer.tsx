import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-[#D7E1EE] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8">
          {/* Brand Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#4169E1] flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#172B4D]">
                BrandPilot
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#E7F9F7] text-[#15A99A] font-medium border border-[#15A99A]/30">
                Trust Before Publish
              </span>
            </div>
            <p className="text-sm text-[#526784] max-w-sm leading-relaxed">
              AI-assisted brand governance, authoritative claim verification, and mandatory human approval for enterprise communications.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-2 md:items-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#172B4D]">
              Platform Navigation
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#526784] justify-center">
              <Link to="/" className="hover:text-[#4169E1] transition-colors">Product</Link>
              <Link to="/app/review" className="hover:text-[#4169E1] transition-colors">Review Studio</Link>
              <Link to="/app/guidelines" className="hover:text-[#4169E1] transition-colors">Guidelines</Link>
              <Link to="/terms" className="hover:text-[#4169E1] transition-colors">Terms & Conditions</Link>
              <Link to="/privacy" className="hover:text-[#4169E1] transition-colors">Privacy Policy</Link>
            </div>
          </div>

          {/* Core Governance Principle */}
          <div className="space-y-2 md:text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#172B4D]">
              Governance Principle
            </span>
            <p className="text-xs text-[#526784] leading-relaxed">
              AI assists with checking and recommendations; an authorised human makes the required final approval decision. No automated publishing.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#15A99A] font-medium bg-[#E7F9F7] px-2.5 py-1 rounded-md border border-[#15A99A]/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evidence-Grounded RAG</span>
            </div>
          </div>
        </div>

        {/* Mandatory Attribution Bar */}
        <div className="pt-6 border-t border-[#EBF1F8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#526784]">
          <div className="flex items-center gap-1.5 font-medium text-[#172B4D]">
            <span>Crafted with care by</span>
            <span className="font-bold text-[#4169E1]">CHITHYALA ANUHYA</span>
            <span>&amp;</span>
            <span className="font-bold text-[#4169E1]">SANDA RUPESH</span>
            <span>·</span>
            <span className="font-semibold text-[#15A99A]">Team ALTO</span>
          </div>

          <div className="text-center font-medium">
            BrandPilot — Trust Before Publish
          </div>

          <div className="text-right text-[#526784]">
            Designed &amp; Developed by <span className="font-semibold text-[#172B4D]">CHITHYALA ANUHYA</span> (Team Lead) &amp; <span className="font-semibold text-[#172B4D]">SANDA RUPESH</span> | <span className="font-semibold text-[#15A99A]">Team ALTO</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
