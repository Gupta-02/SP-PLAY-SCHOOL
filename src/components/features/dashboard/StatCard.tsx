import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  label: string;
  value: number | string;
  sub?: string;
  color: 'amber' | 'blue' | 'emerald' | 'violet' | 'rose';
}

const colorMap = {
  amber: { bg: 'bg-amber-400/10', text: 'text-amber-400', icon: 'text-amber-400' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: 'text-blue-400' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: 'text-emerald-400' },
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', icon: 'text-violet-400' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', icon: 'text-rose-400' },
};

export default function StatCard({ icon: Icon, label, value, sub, color }: Props) {
  const c = colorMap[color];
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-4 h-4 ${c.icon}`} />
      </div>
      <p className={`text-2xl font-bold ${c.text}`}>{value.toLocaleString()}</p>
      <p className="text-white text-sm font-medium mt-0.5">{label}</p>
      {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}
