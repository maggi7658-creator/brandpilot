import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  ShieldCheck,
  UserCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { cn } from '@/utils/cn';

export const UserManagementPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const [roleChangeSuccess, setRoleChangeSuccess] = useState<string | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['workspaceUsers'],
    queryFn: () => api.listUsers(),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      api.updateUserRole(userId, role),
    onSuccess: (updated) => {
      setRoleChangeSuccess(`Updated ${updated.full_name}'s role to ${updated.role}`);
      queryClient.invalidateQueries({ queryKey: ['workspaceUsers'] });
      setTimeout(() => setRoleChangeSuccess(null), 4000);
    },
  });

  const rolesMatrix = [
    {
      role: 'Content Creator',
      key: 'CREATOR',
      can: [
        'Create and draft submissions',
        'Upload documents (PDF/DOCX) and submit URLs',
        'Initiate AI brand governance reviews',
        'Accept or edit suggestions to create revisions',
      ],
      cannot: [
        'Approve their own submission (strictly prohibited)',
        'Authorize publication',
        'Modify approved company guidelines',
      ],
    },
    {
      role: 'Brand Reviewer / Manager',
      key: 'REVIEWER',
      can: [
        'Inspect findings and RAG source evidence',
        'Request revisions with feedback',
        'Approve submissions within authority',
        'Authorize content for publication',
      ],
      cannot: [
        'Bypass legal review on designated high-risk claims',
        'Self-approve if they are the author',
      ],
    },
    {
      role: 'Legal & Compliance Officer',
      key: 'LEGAL',
      can: [
        'Assess high-risk claims, SLA conditions, and missing disclosures',
        'Inspect quoted passages and uncertainty warnings',
        'Grant required legal sign-off',
        'Configure compliance disclosure requirements',
      ],
      cannot: [
        'Authorize publishing without clearing blocking conditions',
      ],
    },
    {
      role: 'Administrator',
      key: 'ADMIN',
      can: [
        'Configure approved guidelines and SLAs',
        'Manage terminology dictionaries and authorized brand assets',
        'Assign and modify user roles',
        'Inspect full compliance audit trail',
      ],
      cannot: [
        'Bypass human approval requirements',
      ],
    },
  ];

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-[#D7E1EE]">
        <h1 className="text-2xl font-bold text-[#172B4D]">User &amp; Access Management</h1>
        <p className="text-xs text-[#526784] mt-0.5">
          Role-based access control, least-privilege enforcement, and separation of duties for Acme Global Brand.
        </p>
      </div>

      {roleChangeSuccess && (
        <div className="p-3 rounded-lg bg-[#D1FAE5] border border-[#059669]/30 text-xs text-[#059669] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{roleChangeSuccess}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#D7E1EE] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#D7E1EE] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172B4D]">Workspace Members</h3>
            <p className="text-xs text-[#526784]">
              {isAdmin ? 'You have administrative privilege to update roles.' : 'View-only access for current role.'}
            </p>
          </div>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7FAFF] text-[#526784] font-semibold border-b border-[#D7E1EE]">
            <tr>
              <th className="py-3 px-4">Member Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Assigned Role</th>
              <th className="py-3 px-4">Status</th>
              {isAdmin && <th className="py-3 px-4 text-right">Role Management</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBF1F8]">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#526784]">Loading members...</td>
              </tr>
            ) : users && users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#172B4D]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#EEF3FF] text-[#4169E1] font-bold text-[10px] flex items-center justify-center">
                        {u.full_name.charAt(0)}
                      </div>
                      <span>{u.full_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#526784] font-mono text-[11px]">{u.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                        u.role === 'ADMIN'
                          ? 'bg-[#EEF3FF] text-[#4169E1]'
                          : u.role === 'LEGAL'
                          ? 'bg-[#EDE9FE] text-[#7C3AED]'
                          : u.role === 'REVIEWER'
                          ? 'bg-[#E7F9F7] text-[#15A99A]'
                          : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold text-[#059669] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="py-3 px-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          updateRoleMutation.mutate({ userId: u.id, role: e.target.value as UserRole })
                        }
                        className="px-2 py-1 text-xs border border-[#D7E1EE] rounded-md focus-ring bg-[#F7FAFF]"
                      >
                        <option value="CREATOR">CREATOR</option>
                        <option value="REVIEWER">REVIEWER</option>
                        <option value="LEGAL">LEGAL</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Role Permission Matrix Card */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#172B4D]">Role Authority &amp; Separation of Duties Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rolesMatrix.map((m) => (
            <div key={m.key} className="bg-white p-5 rounded-xl border border-[#D7E1EE] shadow-xs space-y-3">
              <div className="border-b border-[#EBF1F8] pb-2">
                <span className="text-xs font-bold text-[#172B4D]">{m.role}</span>
                <span className="text-[10px] font-mono text-[#526784] block mt-0.5">Role Key: {m.key}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669] block mb-1">
                    Permitted Actions:
                  </span>
                  <ul className="space-y-1 text-[#526784]">
                    {m.can.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-tight">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[#EBF1F8]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626] block mb-1">
                    Prohibited / Boundary:
                  </span>
                  <ul className="space-y-1 text-[#526784]">
                    {m.cannot.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-tight">
                        <Lock className="w-3.5 h-3.5 text-[#DC2626] shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
