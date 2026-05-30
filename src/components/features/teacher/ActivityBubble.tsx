import { useState } from 'react';
import { Pencil, Trash2, ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import type { ActivityLog } from '@/types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/data/seedData';
import { formatTimestamp } from '@/lib/analytics';
import { useAppStore } from '@/lib/store';

interface Props {
  activity: ActivityLog;
  onDelete: (id: string) => void;
}

export default function ActivityBubble({ activity, onDelete }: Props) {
  const updateActivity = useAppStore((s) => s.updateActivity);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(activity.description);
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const color = CATEGORY_COLORS[activity.category] ?? '#6b7280';
  const icon = CATEGORY_ICONS[activity.category] ?? '📝';

  const saveEdit = () => {
    if (editText.trim()) {
      updateActivity(activity.id, { description: editText.trim() });
    }
    setEditing(false);
  };

  return (
    <div className="flex gap-3 group">
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm mt-0.5"
        style={{ backgroundColor: `${color}22`, border: `1.5px solid ${color}55` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 relative">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-white text-xs font-semibold">{activity.studentName}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${color}22`, color }}>
              {activity.category}
            </span>
            {activity.edited && <span className="text-slate-500 text-xs italic">edited</span>}
          </div>

          {/* Content */}
          {editing ? (
            <div className="mt-1">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full bg-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none resize-none border border-slate-600 focus:border-amber-400"
                rows={2}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <button onClick={saveEdit} className="text-xs bg-amber-400 text-slate-900 px-3 py-1 rounded-lg font-semibold">Save</button>
                <button onClick={() => setEditing(false)} className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-lg">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-slate-200 text-sm leading-relaxed">{activity.description}</p>
          )}

          {/* Tags */}
          {activity.tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {activity.tags.map((tag) => (
                <span key={tag} className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded-full">#{tag}</span>
              ))}
            </div>
          )}

          {/* Image */}
          {activity.imageUrl && (
            <div className="mt-2 rounded-xl overflow-hidden max-w-xs">
              <img src={activity.imageUrl} alt="activity" className="w-full object-cover max-h-40" />
            </div>
          )}

          {/* Menu button */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="relative">
              <button onClick={() => setShowMenu((v) => !v)} className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-white rounded">
                <MoreVertical className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-6 bg-slate-700 border border-slate-600 rounded-xl shadow-xl z-10 py-1 min-w-[120px]">
                  <button
                    onClick={() => { setEditing(true); setShowMenu(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-white hover:bg-slate-600 transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => { onDelete(activity.id); setShowMenu(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-slate-600 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-slate-600 text-xs mt-1 px-1">{formatTimestamp(activity.timestamp)}</p>
      </div>
    </div>
  );
}
