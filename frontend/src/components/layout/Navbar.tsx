import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowRight, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#4169E1] flex items-center justify-center text-white shadow-sm group-hover:bg-[#3355C4] transition-colors">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-[#172B4D] leading-none">
                BrandPilot
              </span>
              <span className="text-[10px] tracking-wide text-[#526784] font-medium mt-0.5">
                Trust Before Publish
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#526784]">
            <a href="/#features" className="hover:text-[#4169E1] transition-colors">Features</a>
            <a href="/#workflow" className="hover:text-[#4169E1] transition-colors">How It Works</a>
            <a href="/#trust" className="hover:text-[#4169E1] transition-colors">Trust Model</a>
            <a href="/#faq" className="hover:text-[#4169E1] transition-colors">FAQ</a>
            <Link to="/terms" className="hover:text-[#4169E1] transition-colors">Terms</Link>
          </nav>

          {/* User Status / Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/app/dashboard"
                  className="px-3.5 py-1.5 rounded-lg bg-[#EEF3FF] text-[#4169E1] font-semibold text-xs border border-[#4169E1]/20 hover:bg-[#4169E1]/10 transition-colors"
                >
                  Workspace Dashboard
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-[#D7E1EE]">
                  <div className="w-7 h-7 rounded-full bg-[#E7F9F7] text-[#15A99A] font-bold text-xs flex items-center justify-center border border-[#15A99A]/30">
                    {user.full_name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#172B4D] leading-tight">{user.full_name}</span>
                    <span className="text-[10px] text-[#526784] uppercase font-bold">{user.role}</span>
                  </div>
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    title="Log out"
                    className="p-1.5 text-[#526784] hover:text-[#DC2626] rounded-md hover:bg-slate-100 transition-colors ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#172B4D] hover:text-[#4169E1] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4169E1] hover:bg-[#3355C4] text-white text-sm font-semibold shadow-sm transition-all shadow-[#4169E1]/20 hover:shadow-md"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#526784] hover:text-[#172B4D] hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D7E1EE] bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2 text-sm font-medium text-[#526784]">
            <a href="/#features" onClick={() => setMobileMenuOpen(false)} className="py-1">Features</a>
            <a href="/#workflow" onClick={() => setMobileMenuOpen(false)} className="py-1">How It Works</a>
            <a href="/#trust" onClick={() => setMobileMenuOpen(false)} className="py-1">Trust Model</a>
            <a href="/#faq" onClick={() => setMobileMenuOpen(false)} className="py-1">FAQ</a>
            <Link to="/terms" onClick={() => setMobileMenuOpen(false)} className="py-1">Terms & Conditions</Link>
          </div>
          <div className="pt-3 border-t border-[#EBF1F8] flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/app/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg bg-[#4169E1] text-white font-semibold text-sm"
                >
                  Open Workspace
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                  className="w-full text-center py-2 text-sm text-[#DC2626] font-medium"
                >
                  Sign Out ({user.full_name})
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg border border-[#D7E1EE] text-sm font-semibold text-[#172B4D]"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg bg-[#4169E1] text-white text-sm font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
