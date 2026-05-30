import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-white text-6xl font-bold mb-2">404</h1>
        <p className="text-slate-400 text-lg mb-8">This page doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-amber-400 text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-300 transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>
      </div>
    </div>
  );
}
