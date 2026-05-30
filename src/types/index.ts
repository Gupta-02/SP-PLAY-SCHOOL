export type UserRole = 'principal' | 'teacher';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarInitials: string;
  divisionId?: string; // teachers only
  standardId?: string; // teachers only
}

export interface Standard {
  id: string;
  name: string;
  label: string;
}

export interface Division {
  id: string;
  standardId: string;
  name: string; // A, B, C
  label: string; // "Standard 1 - Division A"
  teacherId: string;
}

export interface Student {
  id: string;
  name: string;
  divisionId: string;
  standardId: string;
  rollNumber: number;
  avatarColor: string;
}

export interface ActivityLog {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  divisionId: string;
  standardId: string;
  description: string;
  category: ActivityCategory;
  imageUrl?: string;
  timestamp: string; // ISO string
  tags: string[];
  edited?: boolean;
}

export type ActivityCategory =
  | 'Art & Craft'
  | 'Nature & Environment'
  | 'Animals & Pets'
  | 'Sports & Play'
  | 'Reading & Learning'
  | 'Music & Dance'
  | 'Helping & Sharing'
  | 'Science & Explore'
  | 'General';

export interface FilterState {
  studentId: string;
  teacherId: string;
  standardId: string;
  divisionId: string;
  category: string;
  keyword: string;
  dateFrom: string;
  dateTo: string;
  month: string;
  year: string;
}

export interface AnalyticsSummary {
  totalActivities: number;
  totalStudents: number;
  totalTeachers: number;
  activitiesToday: number;
  activitiesThisMonth: number;
  mostActiveStudents: { student: Student; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
  monthlyTrend: { month: string; count: number }[];
  divisionSummary: { divisionLabel: string; count: number }[];
  teacherActivity: { teacherName: string; count: number }[];
}
