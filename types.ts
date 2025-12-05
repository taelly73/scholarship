
export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin'
}

export enum PostType {
  TA = '助教 (TA)',
  RA = '助研 (RA)',
  OTHER = '其他'
}

export enum ApplicationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export enum WageStatus {
  Y = 'Y',
  N = 'N'
}

export interface Department {
  id: number;
  name: string;
}

// 对应表: students
export interface Student {
  id: number; // PK: student_id
  studentNo: string; // student_no
  name: string;
  gender: 'M' | 'F' | 'O';
  enrollmentYear: number;
  program: string;
  wage: WageStatus; // 是否有工资
  phone?: string;
  email?: string;
  bankAccount?: string; // For scholarship
  isFulltime: boolean;
  status: 'enrolled' | 'suspended' | 'graduated' | 'left';
  verified: boolean; // Admin verification status
  hasJob: boolean; // Backend Requirement 1
  gpa?: number; 
  researchCount?: number; 
  departmentId?: number;
  departmentName?: string;
}

// 对应表: positions
export interface Post {
  id: number; // PK
  title: string;
  type: PostType;
  deptId: number;
  deptName?: string;
  supervisorName: string; 
  year: number; // 学年
  totalSlots: number;
  salaryMonth: number;
  description: string;
  workload: number; // Standard workload for this position
  requirements?: string; 
  deadline: string;
  status: 'open' | 'closed' | 'completed';
}

// 对应表: applications
export interface Application {
  id: number; // PK
  studentId: number; // FK
  studentName: string; // Helper
  postId: number; // FK
  postTitle: string; // Helper
  applyTime: string;
  applyType: 'apply' | 'quit';
  applyReason: string;
  hasCommunicated: boolean; 
  materials?: string[]; 
  status: ApplicationStatus;
  finalScore?: number; // 综合评分 (Admin defined)
  note?: string;
}

// 对应表: scholarship_records (New)
export interface ScholarshipRecord {
  id: number;
  studentId: number;
  studentName: string;
  amount: number;
  date: string;
  type: '应发' | '补发' | '扣发';
  reason: string; // e.g., "2023 Fall RA Stipend"
  status: 'issued' | 'pending';
}

// 对应表: workloads (年度汇总 - Generated from Position)
export interface WorkloadSummary {
  id: number; // PK
  studentId: number;
  studentName: string;
  postId?: number;
  postTitle?: string;
  yearStart: string; // 7/1
  yearEnd: string; // 6/30
  totalHours: number; // Derived from Position.workload directly
  status: '正常' | '异常'; 
}

export interface PublicNotice {
  id: number;
  title: string;
  content: string;
  publishTime: string;
  publisher: string;
}

export type ViewState = 'dashboard' | 'posts' | 'applications' | 'scholarships' | 'docs' | 'settings' | 'users' | 'reports' | 'profile';
