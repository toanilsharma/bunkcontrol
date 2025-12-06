
export interface Reminder {
  time: string; // "HH:MM"
  days: number[]; // 0 for Sunday, 1 for Monday...
  enabled: boolean;
}

export interface ClassSchedule {
  day: number; // 0-6
  startTime: string; // "HH:MM"
  endTime?: string;
  room?: string;
}

export interface Assignment {
  id: string;
  title: string;
  dueDate?: string; // YYYY-MM-DD
  completed: boolean;
  type: 'Homework' | 'Exam' | 'Lab' | 'Project' | 'Other';
}

export interface AttendanceRecord {
  id: string;
  date: string; // ISO string
  status: AttendanceStatus;
}

export interface Subject {
  id: string;
  name: string;
  requiredPercentage: number;
  attended: number;
  absent: number;
  cancelled: number;
  icon?: string;
  reminder?: Reminder;
  schedules?: ClassSchedule[];
  assignments?: Assignment[];
  history?: AttendanceRecord[];
}

export enum AttendanceStatus {
  Present,
  Absent,
  Cancelled,
}
