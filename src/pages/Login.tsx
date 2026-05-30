import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Shield, ChevronRight, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ALL_USERS, TEACHERS, PRINCIPAL } from '@/data/seedData';
import heroImg from '@/assets/hero-school.jpg';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<'principal' | 'teacher' | null>(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const login = useAppStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!selectedUserId) return;
    login(selectedUserId);
    const user = ALL_USERS.find((u) => u.id === selectedUserId);
    navigate(user?.role === 'principal' ? '/principal' : '/teacher');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
      {/* Left Panel – Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={heroImg} alt="SP Play School" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-amber-950/40" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <p className="text-xs text-amber-400 font-semibold tracking-widest uppercase">SP Play School</p>
              <h1 className="text-white font-bold text-xl leading-tight">Activity Logger</h1>
            </div>
          </div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Every moment<br />
            <span className="text-amber-400">captured,</span><br />
            every child<br />
            <span className="text-amber-400">celebrated.</span>
          </h2>
          <p className="text-slate-300 text-sm max-w-sm leading-relaxed">
            A simple, fast way for teachers to log student moments and for the principal to track growth across all 9 divisions.
          </p>
          <div className="flex gap-6 mt-8">
            <div className="text-center">
              <p className="text-amber-400 text-2xl font-bold">135</p>
              <p className="text-slate-400 text-xs">Students</p>
            </div>
            <div className="text-center">
              <p className="text-amber-400 text-2xl font-bold">9</p>
              <p className="text-slate-400 text-xs">Divisions</p>
            </div>
            <div className="text-center">
              <p className="text-amber-400 text-2xl font-bold">9</p>
              <p className="text-slate-400 text-xs">Teachers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel – Auth */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <p className="text-xs text-amber-400 font-semibold tracking-widest uppercase">SP Play School</p>
              <h1 className="text-white font-bold text-lg">Activity Logger</h1>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-xs font-semibold tracking-widest uppercase">Demo Access</span>
            </div>
            <h2 className="text-white text-3xl font-bold mb-2">Welcome back</h2>
            <p className="text-slate-400 text-sm">Choose your role to continue</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => { setSelectedRole('principal'); setSelectedUserId(PRINCIPAL.id); }}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                selectedRole === 'principal'
                  ? 'border-amber-400 bg-amber-400/10'
                  : 'border-slate-700 bg-slate-900 hover:border-slate-600'
              }`}
            >
              <Shield className={`w-6 h-6 mb-2 ${selectedRole === 'principal' ? 'text-amber-400' : 'text-slate-500'}`} />
              <p className={`font-semibold text-sm ${selectedRole === 'principal' ? 'text-amber-400' : 'text-slate-300'}`}>Principal</p>
              <p className="text-slate-500 text-xs">Full analytics access</p>
            </button>
            <button
              onClick={() => { setSelectedRole('teacher'); setSelectedUserId(''); }}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                selectedRole === 'teacher'
                  ? 'border-amber-400 bg-amber-400/10'
                  : 'border-slate-700 bg-slate-900 hover:border-slate-600'
              }`}
            >
              <GraduationCap className={`w-6 h-6 mb-2 ${selectedRole === 'teacher' ? 'text-amber-400' : 'text-slate-500'}`} />
              <p className={`font-semibold text-sm ${selectedRole === 'teacher' ? 'text-amber-400' : 'text-slate-300'}`}>Teacher</p>
              <p className="text-slate-500 text-xs">Log student activities</p>
            </button>
          </div>

          {/* User Picker (teachers only) */}
          {selectedRole === 'teacher' && (
            <div className="mb-6">
              <label className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2 block">Select Your Account</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors"
              >
                <option value="">-- Pick a teacher --</option>
                {TEACHERS.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                ))}
              </select>
            </div>
          )}

          <button
            disabled={!selectedUserId}
            onClick={handleLogin}
            className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            Enter Dashboard
            <ChevronRight className="w-4 h-4" />
          </button>

          <p className="text-slate-600 text-xs text-center mt-4">
            Demo prototype for SP Play School client review. No real login required.
          </p>
        </div>
      </div>
    </div>
  );
}
