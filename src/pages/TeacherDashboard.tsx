import { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Tag, ChevronDown, Clock, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { STUDENTS, DIVISIONS, ALL_CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '@/data/seedData';
import type { ActivityLog, ActivityCategory } from '@/types';
import { formatTimestamp } from '@/lib/analytics';
import ActivityBubble from '@/components/features/teacher/ActivityBubble';

export default function TeacherDashboard() {
  const currentUser = useAppStore((s) => s.currentUser);
  const activities = useAppStore((s) => s.activities);
  const addActivity = useAppStore((s) => s.addActivity);
  const deleteActivity = useAppStore((s) => s.deleteActivity);

  const [text, setText] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory>('General');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showStudentPicker, setShowStudentPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [successAnim, setSuccessAnim] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const myDivision = DIVISIONS.find((d) => d.id === currentUser?.divisionId);
  const myStudents = STUDENTS.filter((s) => s.divisionId === currentUser?.divisionId);
  const myActivities = activities
    .filter((a) => a.teacherId === currentUser?.id)
    .slice(0, 60);

  const filteredStudents = myStudents.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const selectedStudent = myStudents.find((s) => s.id === selectedStudentId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!text.trim() && !imagePreview) return;
    const description = text.trim() ||
      (selectedStudent ? `${selectedStudent.name} shared a photo.` : 'Activity recorded.');

    const newActivity: ActivityLog = {
      id: `act_${Date.now()}`,
      studentId: selectedStudentId || myStudents[0]?.id || '',
      studentName: selectedStudent?.name || myStudents[0]?.name || 'Unknown',
      teacherId: currentUser!.id,
      teacherName: currentUser!.name,
      divisionId: currentUser!.divisionId!,
      standardId: currentUser!.standardId!,
      description,
      category: selectedCategory,
      imageUrl: imagePreview ?? undefined,
      timestamp: new Date().toISOString(),
      tags: selectedCategory !== 'General' ? [selectedCategory.toLowerCase()] : [],
    };

    addActivity(newActivity);
    setText('');
    setImagePreview(null);
    setSelectedStudentId('');
    setSelectedCategory('General');
    setSuccessAnim(true);
    setTimeout(() => setSuccessAnim(false), 2000);
    console.log('Activity logged:', newActivity);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [myActivities.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  // Group activities by date
  const groupedActivities: { date: string; items: ActivityLog[] }[] = [];
  myActivities.forEach((act) => {
    const d = new Date(act.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const group = groupedActivities.find((g) => g.date === d);
    if (group) group.items.push(act);
    else groupedActivities.push({ date: d, items: [act] });
  });

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Class Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 bg-amber-400/15 rounded-xl flex items-center justify-center">
          <span className="text-amber-400 font-bold text-sm">{myDivision?.name}</span>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{myDivision?.label ?? 'My Class'}</p>
          <p className="text-slate-400 text-xs">{myStudents.length} students · {myActivities.length} entries logged</p>
        </div>
        {successAnim && (
          <div className="ml-auto flex items-center gap-1.5 text-emerald-400 text-xs font-semibold animate-bounce">
            <CheckCircle className="w-4 h-4" />
            Logged!
          </div>
        )}
      </div>

      {/* Chat Timeline */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {groupedActivities.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400 text-sm">No activities yet.</p>
            <p className="text-slate-600 text-xs mt-1">Type a student moment below to get started.</p>
          </div>
        )}

        {groupedActivities.map((group) => (
          <div key={group.date}>
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-slate-500 text-xs px-3 py-1 bg-slate-900 rounded-full border border-slate-800">{group.date}</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>
            <div className="space-y-3">
              {group.items.map((activity) => (
                <ActivityBubble key={activity.id} activity={activity} onDelete={deleteActivity} />
              ))}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="flex-shrink-0 bg-slate-900 border-t border-slate-800 p-3">
        {/* Selected chips */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {selectedStudent && (
            <span className="flex items-center gap-1.5 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-full">
              <span className={`w-4 h-4 ${selectedStudent.avatarColor} rounded-full`} />
              {selectedStudent.name}
              <button onClick={() => setSelectedStudentId('')}><X className="w-3 h-3 text-slate-400" /></button>
            </span>
          )}
          {selectedCategory !== 'General' && (
            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-800 text-white">
              <span>{CATEGORY_ICONS[selectedCategory]}</span>
              {selectedCategory}
              <button onClick={() => setSelectedCategory('General')}><X className="w-3 h-3 text-slate-400" /></button>
            </span>
          )}
          {imagePreview && (
            <span className="flex items-center gap-1.5 bg-amber-400/10 text-amber-400 text-xs px-2.5 py-1 rounded-full">
              <ImageIcon className="w-3 h-3" />
              Photo attached
              <button onClick={() => setImagePreview(null)}><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>

        {/* Student Picker Dropdown */}
        {showStudentPicker && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 mb-2 overflow-hidden">
            <div className="p-2">
              <input
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search student..."
                className="w-full bg-slate-700 text-white text-xs rounded-lg px-3 py-2 outline-none placeholder-slate-500"
                autoFocus
              />
            </div>
            <div className="max-h-44 overflow-y-auto divide-y divide-slate-700">
              {filteredStudents.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedStudentId(s.id); setShowStudentPicker(false); setStudentSearch(''); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-700 transition-colors text-left"
                >
                  <span className={`w-6 h-6 ${s.avatarColor} rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold`}>
                    {s.name.charAt(0)}
                  </span>
                  <span className="text-white text-xs">{s.name}</span>
                  <span className="text-slate-500 text-xs ml-auto">#{s.rollNumber}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Picker */}
        {showCategoryPicker && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 mb-2 p-2">
            <div className="grid grid-cols-3 gap-1.5">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat as ActivityCategory); setShowCategoryPicker(false); }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all ${
                    selectedCategory === cat ? 'bg-amber-400/20 text-amber-400' : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span className="text-base">{CATEGORY_ICONS[cat]}</span>
                  <span className="text-center leading-tight">{cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Image preview */}
        {imagePreview && (
          <div className="relative mb-2 rounded-xl overflow-hidden w-24 h-20">
            <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
            <button onClick={() => setImagePreview(null)} className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Input Row */}
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => { setShowStudentPicker((v) => !v); setShowCategoryPicker(false); }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${showStudentPicker ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
              title="Pick student"
            >
              <Tag className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setShowCategoryPicker((v) => !v); setShowStudentPicker(false); }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all ${showCategoryPicker ? 'bg-amber-400' : 'bg-slate-800 hover:bg-slate-700'}`}
              title="Category"
            >
              {CATEGORY_ICONS[selectedCategory]}
            </button>
          </div>

          <div className="flex-1 bg-slate-800 rounded-2xl border border-slate-700 focus-within:border-amber-400 transition-colors flex items-end gap-2 px-3 py-2.5">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedStudent ? `What did ${selectedStudent.name} do today?` : 'Log a student moment... (e.g. "Harsh drew a dinosaur")'}
              rows={1}
              className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder-slate-500 leading-relaxed max-h-24"
              style={{ minHeight: '24px' }}
              onInput={(e) => {
                const el = e.target as HTMLTextAreaElement;
                el.style.height = 'auto';
                el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
              }}
            />
            <button onClick={() => fileRef.current?.click()} className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

          <button
            onClick={handleSubmit}
            disabled={!text.trim() && !imagePreview}
            className="w-11 h-11 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 flex items-center justify-center transition-all flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-slate-600 text-xs text-center mt-2">⌘/Ctrl + Enter to submit quickly</p>
      </div>
    </div>
  );
}
