import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useAuth } from '@/hooks/useAuth';
import { Bell, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7FAFF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#4169E1] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-[#526784]">Loading BrandPilot workspace...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#F7FAFF]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-[#D7E1EE] px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E7F9F7] text-[#15A99A] border border-[#15A99A]/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Workspace Active: Acme Global Brand</span>
            </span>
            <span className="text-xs text-[#526784] hidden sm:inline">
              Mode: <strong className="text-[#172B4D]">Pre-Publication Governance</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-[#172B4D]">{user.full_name}</div>
              <div className="text-[10px] text-[#526784]">Role: {user.role}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#EEF3FF] text-[#4169E1] font-bold text-xs flex items-center justify-center border border-[#4169E1]/30">
              {user.full_name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>

        {/* Mandatory Footer Attribution */}
        <Footer />
      </div>
    </div>
  );
};
