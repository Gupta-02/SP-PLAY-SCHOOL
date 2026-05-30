import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { BarChart2, PieChart as PieIcon, TrendingUp, Users } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { computeAnalytics } from '@/lib/analytics';
import { CATEGORY_COLORS, TEACHERS, DIVISIONS } from '@/data/seedData';

const CHART_COLORS = ['#f59e0b','#3b82f6','#22c55e','#ec4899','#8b5cf6','#f97316','#14b8a6','#06b6d4','#ef4444'];

export default function Analytics() {
  const activities = useAppStore((s) => s.activities);
  const analytics = useMemo(() => computeAnalytics(activities), [activities]);

  const pieData = analytics.categoryBreakdown.map((c) => ({
    name: c.category,
    value: c.count,
    fill: CATEGORY_COLORS[c.category] ?? '#6b7280',
  }));

  const teacherData = analytics.teacherActivity.map((t) => ({
    name: t.teacherName.replace('Ms. ', '').split(' ')[0],
    fullName: t.teacherName,
    activities: t.count,
  }));

  const divData = analytics.divisionSummary.map((d) => ({
    name: d.divisionLabel.replace('Standard ', 'S').replace(' - Division', ''),
    count: d.count,
  }));

  // Participation heatmap: students x months
  const monthNames = ['Jan','Feb','Mar','Apr','May'];
  const heatmapStudents = analytics.mostActiveStudents.slice(0, 10);
  const heatmapData = heatmapStudents.map(({ student }) => {
    const row: Record<string, string | number> = { name: student.name.split(' ')[0] };
    monthNames.forEach((m, idx) => {
      const count = activities.filter(
        (a) => a.studentId === student.id && new Date(a.timestamp).getMonth() === idx
      ).length;
      row[m] = count;
    });
    return row;
  });

  function heatColor(val: number) {
    if (val === 0) return 'bg-slate-800 text-slate-700';
    if (val <= 1) return 'bg-amber-900/50 text-amber-600';
    if (val <= 3) return 'bg-amber-700/60 text-amber-400';
    return 'bg-amber-400/90 text-slate-900';
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      <div>
        <h1 className="text-white text-2xl font-bold">Analytics & Insights</h1>
        <p className="text-slate-400 text-sm mt-1">SP Play School — Jan to May 2025 · {analytics.totalActivities} activities recorded</p>
      </div>

      {/* Monthly Trend */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          Monthly Activity Trend
        </h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.monthlyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: 12 }}
                cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 4 }} name="Activities" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Pie */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-amber-400" />
            Activity by Category
          </h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value" nameKey="name">
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2">
            {pieData.slice(0, 6).map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.fill }} />
                <span className="text-slate-400 text-xs truncate">{d.name}</span>
                <span className="text-slate-300 text-xs ml-auto font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            Teacher Logging Activity
          </h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teacherData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: 12 }}
                  formatter={(v, _n, props) => [v, props.payload.fullName]}
                />
                <Bar dataKey="activities" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Activities" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Division Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-amber-400" />
          Activity by Division
        </h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={divData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: 12 }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Activities">
                {divData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Participation Heatmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          Participation Heatmap — Top 10 Students × Month
        </h2>
        <p className="text-slate-500 text-xs mb-4">Darker = more activities that month</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left text-slate-500 font-semibold pb-2 pr-4 min-w-[100px]">Student</th>
                {monthNames.map((m) => (
                  <th key={m} className="text-center text-slate-500 font-semibold pb-2 px-2 min-w-[48px]">{m}</th>
                ))}
                <th className="text-center text-slate-500 font-semibold pb-2 px-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {heatmapData.map((row, i) => {
                const total = monthNames.reduce((sum, m) => sum + (row[m] as number), 0);
                return (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 pr-4 text-slate-300 font-medium">{row.name}</td>
                    {monthNames.map((m) => {
                      const val = row[m] as number;
                      return (
                        <td key={m} className="py-2 px-2 text-center">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold mx-auto ${heatColor(val)}`}>
                            {val > 0 ? val : ''}
                          </div>
                        </td>
                      );
                    })}
                    <td className="py-2 px-2 text-center text-amber-400 font-bold">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
