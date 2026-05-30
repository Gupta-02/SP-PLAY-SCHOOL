import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, BookOpen, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { STUDENTS, DIVISIONS, CATEGORY_COLORS, CATEGORY_ICONS, TEACHERS } from '@/data/seedData';
import { formatTimestamp } from '@/lib/analytics';

export default function StudentProfile() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const activities = useAppStore((s) => s.activities);

  const student = STUDENTS.find((s) => s.id === studentId);
  const studentActivities = activities
    .filter((a) => a.studentId === studentId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (!student) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-slate-400 text-lg mb-4">Student not found</p>
          <button onClick={() => navigate(-1)} className="text-amber-400 hover:underline">Go back</button>
        </div>
      </div>
    );
  }

  const division = DIVISIONS.find((d) => d.id === student.divisionId);
  const teacher = TEACHERS.find((t) => t.id === division?.teacherId);

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  studentActivities.forEach((a) => {
    categoryMap[a.category] = (categoryMap[a.category] ?? 0) + 1;
  });
  const categoryBreakdown = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  // Month breakdown
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthMap: Record<string, number> = {};
  studentActivities.forEach((a) => {
    const d = new Date(a.timestamp);
    const key = monthNames[d.getMonth()];
    monthMap[key] = (monthMap[key] ?? 0) + 1;
  });

  // Images
  const withImages = studentActivities.filter((a) => a.imageUrl);

  // Group by date
  const groupedActivities: { date: string; items: typeof studentActivities }[] = [];
  studentActivities.forEach((act) => {
    const d = new Date(act.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const group = groupedActivities.find((g) => g.date === d);
    if (group) group.items.push(act);
    else groupedActivities.push({ date: d, items: [act] });
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-start gap-5 flex-wrap">
          <div className={`w-16 h-16 ${student.avatarColor} rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0`}>
            {student.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white text-2xl font-bold">{student.name}</h1>
            <p className="text-slate-400 text-sm mt-1">{division?.label} · Roll #{student.rollNumber}</p>
            <p className="text-slate-500 text-sm">Class Teacher: {teacher?.name}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center bg-slate-800 rounded-xl px-4 py-3">
              <p className="text-amber-400 text-2xl font-bold">{studentActivities.length}</p>
              <p className="text-slate-400 text-xs">Activities</p>
            </div>
            <div className="text-center bg-slate-800 rounded-xl px-4 py-3">
              <p className="text-blue-400 text-2xl font-bold">{categoryBreakdown.length}</p>
              <p className="text-slate-400 text-xs">Categories</p>
            </div>
            <div className="text-center bg-slate-800 rounded-xl px-4 py-3">
              <p className="text-emerald-400 text-2xl font-bold">{withImages.length}</p>
              <p className="text-slate-400 text-xs">Photos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            Activity Timeline
          </h2>
          {groupedActivities.length === 0 ? (
            <p className="text-slate-500 text-sm">No activities recorded yet.</p>
          ) : (
            groupedActivities.map((group) => (
              <div key={group.date}>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-2 pl-2">{group.date}</p>
                <div className="space-y-2">
                  {group.items.map((activity) => {
                    const color = CATEGORY_COLORS[activity.category] ?? '#6b7280';
                    const icon = CATEGORY_ICONS[activity.category] ?? '📝';
                    return (
                      <div key={activity.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-3">
                        <div className="w-8 h-8 rounded-lg text-base flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${color}15` }}>
                          {icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200 text-sm leading-relaxed">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
                              {activity.category}
                            </span>
                            <span className="text-slate-600 text-xs">{formatTimestamp(activity.timestamp)}</span>
                          </div>
                          {activity.imageUrl && (
                            <img src={activity.imageUrl} alt="" className="mt-2 rounded-lg h-24 object-cover" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Category Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" /> Categories
            </h3>
            <div className="space-y-2">
              {categoryBreakdown.map(([cat, count]) => {
                const color = CATEGORY_COLORS[cat] ?? '#6b7280';
                const maxCount = categoryBreakdown[0]?.[1] ?? 1;
                return (
                  <div key={cat} className="flex items-center gap-2">
                    <span>{CATEGORY_ICONS[cat]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-slate-300 text-xs truncate">{cat}</span>
                        <span className="text-xs ml-2 flex-shrink-0" style={{ color }}>{count}</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full">
                        <div className="h-1.5 rounded-full" style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Month Activity */}
          {Object.keys(monthMap).length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" /> Monthly Activity
              </h3>
              <div className="space-y-1.5">
                {Object.entries(monthMap).map(([month, count]) => {
                  const maxCount = Math.max(...Object.values(monthMap));
                  return (
                    <div key={month} className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs w-8">{month}</span>
                      <div className="flex-1 bg-slate-800 rounded-full h-2">
                        <div className="bg-amber-400/80 h-2 rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
                      </div>
                      <span className="text-slate-400 text-xs w-4 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Photos */}
          {withImages.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" /> Photos ({withImages.length})
              </h3>
              <div className="grid grid-cols-3 gap-1.5">
                {withImages.map((a) => (
                  <img key={a.id} src={a.imageUrl} alt="" className="w-full aspect-square object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
