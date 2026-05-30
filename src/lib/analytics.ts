import type { ActivityLog, AnalyticsSummary, FilterState } from '@/types';
import { STUDENTS, TEACHERS, DIVISIONS } from '@/data/seedData';

export function applyFilters(activities: ActivityLog[], filters: FilterState): ActivityLog[] {
  return activities.filter((a) => {
    if (filters.studentId && a.studentId !== filters.studentId) return false;
    if (filters.teacherId && a.teacherId !== filters.teacherId) return false;
    if (filters.standardId && a.standardId !== filters.standardId) return false;
    if (filters.divisionId && a.divisionId !== filters.divisionId) return false;
    if (filters.category && a.category !== filters.category) return false;
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      const inDesc = a.description.toLowerCase().includes(kw);
      const inTags = a.tags.some((t) => t.toLowerCase().includes(kw));
      const inStudent = a.studentName.toLowerCase().includes(kw);
      if (!inDesc && !inTags && !inStudent) return false;
    }
    if (filters.dateFrom) {
      if (new Date(a.timestamp) < new Date(filters.dateFrom)) return false;
    }
    if (filters.dateTo) {
      if (new Date(a.timestamp) > new Date(filters.dateTo + 'T23:59:59')) return false;
    }
    if (filters.month) {
      const m = new Date(a.timestamp).getMonth() + 1;
      if (m !== parseInt(filters.month)) return false;
    }
    if (filters.year) {
      const y = new Date(a.timestamp).getFullYear();
      if (y !== parseInt(filters.year)) return false;
    }
    return true;
  });
}

export function computeAnalytics(activities: ActivityLog[]): AnalyticsSummary {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const thisMonth = today.getMonth() + 1;
  const thisYear = today.getFullYear();

  const activitiesToday = activities.filter(
    (a) => a.timestamp.startsWith(todayStr)
  ).length;

  const activitiesThisMonth = activities.filter((a) => {
    const d = new Date(a.timestamp);
    return d.getMonth() + 1 === thisMonth && d.getFullYear() === thisYear;
  }).length;

  // Most active students
  const studentCountMap: Record<string, number> = {};
  activities.forEach((a) => {
    studentCountMap[a.studentId] = (studentCountMap[a.studentId] ?? 0) + 1;
  });
  const mostActiveStudents = Object.entries(studentCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([studentId, count]) => ({
      student: STUDENTS.find((s) => s.id === studentId)!,
      count,
    }))
    .filter((x) => x.student);

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  activities.forEach((a) => {
    categoryMap[a.category] = (categoryMap[a.category] ?? 0) + 1;
  });
  const categoryBreakdown = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));

  // Monthly trend (last 6 months)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthMap: Record<string, number> = {};
  activities.forEach((a) => {
    const d = new Date(a.timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthMap[key] = (monthMap[key] ?? 0) + 1;
  });
  const monthlyTrend = Object.entries(monthMap)
    .sort()
    .map(([key, count]) => {
      const [, monthNum] = key.split('-');
      return { month: monthNames[parseInt(monthNum) - 1], count };
    });

  // Division summary
  const divisionMap: Record<string, number> = {};
  activities.forEach((a) => {
    divisionMap[a.divisionId] = (divisionMap[a.divisionId] ?? 0) + 1;
  });
  const divisionSummary = Object.entries(divisionMap)
    .sort((a, b) => b[1] - a[1])
    .map(([divisionId, count]) => ({
      divisionLabel: DIVISIONS.find((d) => d.id === divisionId)?.label ?? divisionId,
      count,
    }));

  // Teacher activity
  const teacherMap: Record<string, number> = {};
  activities.forEach((a) => {
    teacherMap[a.teacherId] = (teacherMap[a.teacherId] ?? 0) + 1;
  });
  const teacherActivity = Object.entries(teacherMap)
    .sort((a, b) => b[1] - a[1])
    .map(([teacherId, count]) => ({
      teacherName: TEACHERS.find((t) => t.id === teacherId)?.name ?? teacherId,
      count,
    }));

  return {
    totalActivities: activities.length,
    totalStudents: new Set(activities.map((a) => a.studentId)).size,
    totalTeachers: TEACHERS.length,
    activitiesToday,
    activitiesThisMonth,
    mostActiveStudents,
    categoryBreakdown,
    monthlyTrend,
    divisionSummary,
    teacherActivity,
  };
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(iso);
}
