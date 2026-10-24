import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck2,
  BookOpenCheck,
  History,
  BarChart3,
  Users,
  Settings,
  ShieldCheck,
  LogOut,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

export const Sidebar: React.FC = () => {
  const { user, logout, loginWithPersona } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Review Workspace', path: '/app/review', icon: FileCheck2 },
    { name: 'Brand Guidelines', path: '/app/guidelines', icon: BookOpenCheck },
    { name: 'Review History', path: '/app/history', icon: History },
    { name: 'Analytics & Reports', path: '/app/analytics', icon: BarChart3 },
    { name: 'User Management', path: '/app/users', icon: Users },
    { name: 'Settings', path: '/app/settings', icon: Settings },
  ];

  const personas = [
    { role: 'CREATOR', title: 'Creator', email: 'creator@brandpilot.local', name: 'Sarah Chen' },
    { role: 'REVIEWER', title: 'Manager', email: 'reviewer@brandpilot.local', name: 'Marcus Vance' },
    { role: 'LEGAL', title: 'Legal', email: 'legal@brandpilot.local', name: 'Elena Rostova' },
    { role: 'ADMIN', title: 'Admin', email: 'admin@brandpilot.local', name: 'David Sterling' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#D7E1EE] flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#D7E1EE] flex items-center justify-between">
        <NavLink to="/app/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#4169E1] flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#172B4D] leading-tight">BrandPilot</h1>
            <p className="text-[10px] text-[#15A99A] font-semibold tracking-wide uppercase">Trust Before Publish</p>
          </div>
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-[#526784] uppercase tracking-wider">
          Workspace Navigation
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                isActive
                  ? 'bg-[#EEF3FF] text-[#4169E1] font-semibold shadow-xs'
                  : 'text-[#526784] hover:bg-slate-50 hover:text-[#172B4D]'
              )
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}

        {/* Demo Persona Switcher */}
        <div className="pt-5 mt-4 border-t border-[#EBF1F8]">
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[10px] font-bold text-[#526784] uppercase tracking-wider flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-[#4169E1]" />
              Role Switcher (Demo)
            </span>
          </div>
          <p className="px-3 text-[10px] text-[#526784] mb-2 leading-tight">
            Click to test role-based permissions in real time:
          </p>
          <div className="grid grid-cols-2 gap-1.5 px-2">
            {personas.map((p) => {
              const isActive = user?.role === p.role;
              return (
                <button
                  key={p.role}
                  type="button"
                  onClick={() =>
                    loginWithPersona({
                      role: p.role as any,
                      title: p.title,
                      email: p.email,
                      password: 'Password123!',
                      description: '',
                    })
                  }
                  className={cn(
                    'px-2 py-1.5 rounded-md text-[11px] font-semibold text-left transition-all border',
                    isActive
                      ? 'bg-[#4169E1] text-white border-[#4169E1] shadow-xs'
                      : 'bg-[#F7FAFF] text-[#172B4D] border-[#D7E1EE] hover:bg-slate-100'
                  )}
                >
                  <div className="leading-none">{p.title}</div>
                  <div className={cn('text-[9px] mt-0.5 truncate', isActive ? 'text-white/80' : 'text-[#526784]')}>
                    {p.name.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User info & Logout */}
      <div className="p-3 border-t border-[#D7E1EE] bg-[#F7FAFF]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#E7F9F7] text-[#15A99A] font-bold text-xs flex items-center justify-center border border-[#15A99A]/30 shrink-0">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-[#172B4D] truncate">{user?.full_name}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white text-[#4169E1] border border-[#D7E1EE]">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            title="Sign out"
            className="p-1.5 text-[#526784] hover:text-[#DC2626] rounded-md hover:bg-slate-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
