import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, X, Users, BarChart2, Activity,
  ChevronRight, TrendingUp, CalendarDays, BookOpen
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import {
  STUDENTS, DIVISIONS, STANDARDS, TEACHERS,
  ALL_CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS
} from '@/data/seedData';
import { applyFilters, computeAnalytics, formatTimestamp } from '@/lib/analytics';
import type { FilterState } from '@/types';
import StatCard from '@/components/features/dashboard/StatCard';
import ActivityCard from '@/components/features/dashboard/ActivityCard';

const MONTHS = [
  { value: '1', label: 'January' }, { value: '2', label: 'February' },
  { value: '3', label: 'March' }, { value: '4', label: 'April' },
  { value: '5', label: 'May' }, { value: '6', label: 'June' },
  { value: '7', label: 'July' }, { value: '8', label: 'August' },
  { value: '9', label: 'September' }, { value: '10', label: 'October' },
  { value: '11', label: 'November' }, { value: '12', label: 'December' },
];

const EMPTY_FILTERS: FilterState = {
  studentId: '', teacherId: '', standardId: '', divisionId: '',
  category: '', keyword: '', dateFrom: '', dateTo: '', month: '', year: '',
};

export default function PrincipalDashboard() {
  const activities = useAppStore((s) => s.activities);
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'feed' | 'students'>('overview');

  const filtered = useMemo(() => applyFilters(activities, filters), [activities, filters]);
  const analytics = useMemo(() => computeAnalytics(filtered), [filtered]);
  const allAnalytics = useMemo(() => computeAnalytics(activities), [activities]);

  const hasFilters = Object.values(filters).some((v) => v !== '');
  const updateFilter = (key: keyof FilterState, value: string) =>
    setFilters((f) => ({ ...f, [key]: value }));
  const clearFilters = () => setFilters(EMPTY_FILTERS);

  const visibleStudents = filters.studentId
    ? STUDENTS.filter((s) => s.id === filters.studentId)
    : filters.divisionId
    ? STUDENTS.filter((s) => s.divisionId === filters.divisionId)
    : filters.standardId
    ? STUDENTS.filter((s) => s.standardId === filters.standardId)
    : STUDENTS;

  const filteredDivisions = filters.standardId
    ? DIVISIONS.filter((d) => d.standardId === filters.standardId)
    : DIVISIONS;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-4 h-12 focus-within:border-amber-400 transition-colors">
          <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <input
            value={filters.keyword}
            onChange={(e) => updateFilter('keyword', e.target.value)}
            placeholder="Search student name, activity, keyword..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-500"
          />
          {filters.keyword && (
            <button onClick={() => updateFilter('keyword', '')} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 h-12 rounded-2xl border transition-all text-sm font-medium ${
            showFilters || hasFilters
              ? 'bg-amber-400 text-slate-900 border-amber-400'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-white'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters {hasFilters && <span className="bg-slate-900 text-amber-400 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{Object.values(filters).filter(Boolean).length}</span>}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-semibold text-sm">Filter Activities</p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-amber-400 text-xs hover:underline">Clear all</button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Standard</label>
              <select value={filters.standardId} onChange={(e) => { updateFilter('standardId', e.target.value); updateFilter('divisionId', ''); }}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-400">
                <option value="">All Standards</option>
                {STANDARDS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Division</label>
              <select value={filters.divisionId} onChange={(e) => updateFilter('divisionId', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-400">
                <option value="">All Divisions</option>
                {filteredDivisions.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Teacher</label>
              <select value={filters.teacherId} onChange={(e) => updateFilter('teacherId', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-400">
                <option value="">All Teachers</option>
                {TEACHERS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Student</label>
              <select value={filters.studentId} onChange={(e) => updateFilter('studentId', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-400">
                <option value="">All Students</option>
                {visibleStudents.slice(0, 50).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Category</label>
              <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-400">
                <option value="">All Categories</option>
                {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Month</label>
              <select value={filters.month} onChange={(e) => updateFilter('month', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-400">
                <option value="">All Months</option>
                {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Year</label>
              <select value={filters.year} onChange={(e) => updateFilter('year', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-400">
                <option value="">All Years</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-2xl p-1">
        {(['overview', 'feed', 'students'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              activeTab === tab ? 'bg-amber-400 text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={Activity} label="Total Activities" value={analytics.totalActivities} sub={`${allAnalytics.totalActivities} overall`} color="amber" />
            <StatCard icon={Users} label="Active Students" value={analytics.totalStudents} sub={`of ${STUDENTS.length} total`} color="blue" />
            <StatCard icon={TrendingUp} label="This Month" value={analytics.activitiesThisMonth} sub="activities" color="emerald" />
            <StatCard icon={BookOpen} label="Divisions" value={9} sub="3 standards" color="violet" />
          </div>

          {/* Top Students */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Most Active Students
            </h3>
            <div className="space-y-2">
              {analytics.mostActiveStudents.slice(0, 8).map((entry, i) => {
                const maxCount = analytics.mostActiveStudents[0]?.count ?? 1;
                return (
                  <div key={entry.student.id} className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs w-5 text-right">{i + 1}</span>
                    <div className={`w-7 h-7 ${entry.student.avatarColor} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {entry.student.name.charAt(0)}
                    </div>
                    <button
                      onClick={() => navigate(`/student/${entry.student.id}`)}
                      className="flex-1 min-w-0 text-left hover:text-amber-400 transition-colors"
                    >
                      <p className="text-white text-xs font-medium truncate">{entry.student.name}</p>
                      <p className="text-slate-500 text-xs">{DIVISIONS.find((d) => d.id === entry.student.divisionId)?.label}</p>
                    </button>
                    <div className="flex items-center gap-2 w-32">
                      <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                        <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${(entry.count / maxCount) * 100}%` }} />
                      </div>
                      <span className="text-slate-400 text-xs w-6 text-right">{entry.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-amber-400" />
              Activity Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {analytics.categoryBreakdown.map((entry) => {
                const color = CATEGORY_COLORS[entry.category] ?? '#6b7280';
                return (
                  <div key={entry.category} className="flex items-center gap-2.5 bg-slate-800 rounded-xl p-3">
                    <span className="text-xl">{CATEGORY_ICONS[entry.category]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{entry.category}</p>
                      <p className="text-xs" style={{ color }}>{entry.count} activities</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Division Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-amber-400" />
              Division Activity
            </h3>
            <div className="space-y-2">
              {analytics.divisionSummary.map((entry) => {
                const max = analytics.divisionSummary[0]?.count ?? 1;
                return (
                  <div key={entry.divisionLabel} className="flex items-center gap-3">
                    <span className="text-slate-300 text-xs w-28 truncate">{entry.divisionLabel}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-2">
                      <div className="bg-amber-400/80 h-2 rounded-full transition-all" style={{ width: `${(entry.count / max) * 100}%` }} />
                    </div>
                    <span className="text-slate-400 text-xs w-8 text-right">{entry.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── FEED TAB ─── */}
      {activeTab === 'feed' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-slate-400 text-sm"><span className="text-white font-semibold">{filtered.length}</span> activities found</p>
          </div>
          <div className="space-y-2">
            {filtered.slice(0, 50).map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onStudentClick={(id) => navigate(`/student/${id}`)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-400">No activities match your filters.</p>
                <button onClick={clearFilters} className="text-amber-400 text-sm mt-2 hover:underline">Clear filters</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── STUDENTS TAB ─── */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {STUDENTS.slice(0, 45).map((student) => {
            const count = activities.filter((a) => a.studentId === student.id).length;
            const division = DIVISIONS.find((d) => d.id === student.divisionId);
            return (
              <button
                key={student.id}
                onClick={() => navigate(`/student/${student.id}`)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 hover:border-amber-400/50 transition-all text-left group"
              >
                <div className={`w-10 h-10 ${student.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate group-hover:text-amber-400 transition-colors">{student.name}</p>
                  <p className="text-slate-500 text-xs truncate">{division?.label} · Roll #{student.rollNumber}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-amber-400 text-sm font-bold">{count}</p>
                  <p className="text-slate-600 text-xs">entries</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
