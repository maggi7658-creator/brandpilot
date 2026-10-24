import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, Building2, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const SignupPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceName, setWorkspaceName] = useState('Acme Global Brand');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register({
        full_name: fullName,
        email,
        password,
        workspace_name: workspaceName,
      });
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col justify-between">
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-12 w-full">
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF3FF] text-[#4169E1] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>New Organization Account</span>
          </div>
          <h1 className="text-2xl font-bold text-[#172B4D]">Create your BrandPilot Account</h1>
          <p className="text-xs text-[#526784]">
            New accounts default to Content Creator permissions. Administrator privilege must be assigned by workspace policy.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#D7E1EE] shadow-sm space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-[#FEE2E2] border border-[#DC2626]/30 text-xs text-[#DC2626] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#526784] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF] text-[#172B4D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#526784] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF] text-[#172B4D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Organization / Workspace</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#526784] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Acme Global Brand"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF] text-[#172B4D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#526784] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF] text-[#172B4D]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#4169E1] hover:bg-[#3355C4] text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-[#EBF1F8] text-xs text-[#526784]">
            Already registered?{' '}
            <Link to="/login" className="text-[#4169E1] font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
