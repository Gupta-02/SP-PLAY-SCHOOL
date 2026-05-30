import type { ActivityLog } from '@/types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/data/seedData';
import { formatTimestamp } from '@/lib/analytics';

interface Props {
  activity: ActivityLog;
  onStudentClick: (id: string) => void;
}

export default function ActivityCard({ activity, onStudentClick }: Props) {
  const color = CATEGORY_COLORS[activity.category] ?? '#6b7280';
  const icon = CATEGORY_ICONS[activity.category] ?? '📝';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: `${color}15`, border: `1.5px solid ${color}30` }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm leading-relaxed">{activity.description}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <button
                  onClick={() => onStudentClick(activity.studentId)}
                  className="text-xs text-amber-400 hover:underline font-medium"
                >
                  {activity.studentName}
                </button>
                <span className="text-slate-600 text-xs">·</span>
                <span className="text-slate-500 text-xs">{activity.teacherName}</span>
                <span className="text-slate-600 text-xs">·</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: `${color}20`, color }}>
                  {activity.category}
                </span>
              </div>
            </div>
            <p className="text-slate-600 text-xs flex-shrink-0 whitespace-nowrap">{formatTimestamp(activity.timestamp)}</p>
          </div>
          {activity.imageUrl && (
            <div className="mt-2 rounded-xl overflow-hidden w-28 h-20">
              <img src={activity.imageUrl} alt="activity" className="w-full h-full object-cover" />
            </div>
          )}
          {activity.tags.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {activity.tags.map((tag) => (
                <span key={tag} className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
