import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, loginWithPersona } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const demoPersonas = [
    {
      role: 'CREATOR',
      title: 'Content Creator',
      name: 'Sarah Chen',
      email: 'creator@brandpilot.local',
      desc: 'Creates drafts, pastes text or uploads documents, initiates reviews, and edits revisions.'
    },
    {
      role: 'REVIEWER',
      title: 'Brand Manager',
      name: 'Marcus Vance',
      email: 'reviewer@brandpilot.local',
      desc: 'Inspects claims and brand tone, requests changes, and provides marketing approval.'
    },
    {
      role: 'LEGAL',
      title: 'Legal & Compliance',
      name: 'Elena Rostova',
      email: 'legal@brandpilot.local',
      desc: 'Assesses high-risk claims, SLA exclusions, and mandatory regulatory disclosures.'
    },
    {
      role: 'ADMIN',
      title: 'Administrator',
      name: 'David Sterling',
      email: 'admin@brandpilot.local',
      desc: 'Configures approved guidelines, terminology rules, and oversees workspace users.'
    }
  ];

  const handlePersonaClick = async (p: typeof demoPersonas[0]) => {
    setEmail(p.email);
    setPassword('Password123!');
    setLoading(true);
    setError(null);
    try {
      await loginWithPersona({
        role: p.role as any,
        title: p.title,
        email: p.email,
        password: 'Password123!',
        description: p.desc
      });
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.message || 'Persona login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF] flex flex-col justify-between">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12 w-full">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF3FF] text-[#4169E1] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>BrandPilot Workspace Sign-In</span>
          </div>
          <h1 className="text-3xl font-bold text-[#172B4D]">Welcome back to BrandPilot</h1>
          <p className="text-sm text-[#526784]">Sign in to access your enterprise brand governance workspace</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Login Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#D7E1EE] shadow-sm space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-[#FEE2E2] border border-[#DC2626]/30 text-xs text-[#DC2626] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#526784] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF] text-[#172B4D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#526784] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs border border-[#D7E1EE] rounded-lg focus-ring bg-[#F7FAFF] text-[#172B4D]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#526784] hover:text-[#172B4D]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-3 border-t border-[#EBF1F8] text-xs text-[#526784]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#4169E1] font-semibold hover:underline">
                Create one now
              </Link>
            </div>
          </div>

          {/* Fast 1-Click Demo Personas */}
          <div className="lg:col-span-6 space-y-3 text-left">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#15A99A]" />
              <h2 className="text-sm font-bold text-[#172B4D]">Instant Demo Personas</h2>
            </div>
            <p className="text-xs text-[#526784] leading-relaxed">
              Select any pre-configured role below for 1-click evaluation of role permissions and approval gates:
            </p>

            <div className="space-y-2">
              {demoPersonas.map((p) => (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => handlePersonaClick(p)}
                  className="w-full p-3.5 rounded-xl bg-white border border-[#D7E1EE] hover:border-[#4169E1] hover:bg-[#EEF3FF]/40 text-left transition-all shadow-xs group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#172B4D] group-hover:text-[#4169E1]">
                        {p.title}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F7FAFF] border border-[#D7E1EE] text-[#526784]">
                        {p.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#4169E1] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to Test →
                    </span>
                  </div>
                  <p className="text-[11px] text-[#526784] leading-tight">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
