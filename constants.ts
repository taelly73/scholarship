
import { Student, Post, Application, PostType, ApplicationStatus, WorkloadSummary, WageStatus, ScholarshipRecord } from './types';

export const MOCK_STUDENTS: Student[] = [
  { 
    id: 1001, 
    studentNo: 'S2023001', 
    name: '李明', 
    gender: 'M',
    enrollmentYear: 2023, 
    program: '管理科学与工程',
    wage: WageStatus.N,
    isFulltime: true,
    status: 'enrolled',
    verified: true,
    hasJob: true, // Has approved application
    gpa: 3.8,
    researchCount: 2,
    phone: '13800138000',
    email: 'liming@univ.edu.cn',
    bankAccount: '62220232023222'
  },
  { 
    id: 1002, 
    studentNo: 'S2022005', 
    name: '王强', 
    gender: 'M',
    enrollmentYear: 2022, 
    program: '图书馆学',
    wage: WageStatus.N,
    isFulltime: true,
    status: 'enrolled',
    verified: true,
    hasJob: false,
    gpa: 3.5,
    researchCount: 1,
    phone: '13900139000',
    email: 'wangqiang@univ.edu.cn'
  },
  { 
    id: 1003, 
    studentNo: 'S2021012', 
    name: '赵雅', 
    gender: 'F',
    enrollmentYear: 2021, 
    program: '情报学',
    wage: WageStatus.N,
    isFulltime: true,
    status: 'enrolled',
    verified: false,
    hasJob: true,
    gpa: 3.9,
    researchCount: 4,
    phone: '13700137000',
    email: 'zhaoya@univ.edu.cn'
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: '《数据库系统原理》助教',
    type: PostType.TA,
    deptId: 1,
    supervisorName: '张教授',
    year: 2023,
    totalSlots: 2,
    salaryMonth: 800,
    description: '负责本科生数据库课程的实验指导、作业批改及答疑工作。需熟悉SQL及数据库设计。',
    workload: 40, // Hours per month or total
    requirements: '1. 熟悉MySQL; 2. 成绩优异者优先',
    deadline: '2023-09-15',
    status: 'open'
  },
  {
    id: 2,
    title: '信息检索课题组 助研',
    type: PostType.RA,
    deptId: 1,
    supervisorName: '李教授',
    year: 2023,
    totalSlots: 1,
    salaryMonth: 1000,
    description: '参与国家自然科学基金项目，负责深度学习模型在文本挖掘中的应用研究。',
    workload: 60,
    requirements: '1. 掌握Python/PyTorch; 2. 有NLP相关项目经验',
    deadline: '2023-09-20',
    status: 'open'
  },
  {
    id: 3,
    title: '《高级统计学》助教',
    type: PostType.TA,
    deptId: 1,
    supervisorName: '张教授',
    year: 2023,
    totalSlots: 1,
    salaryMonth: 800,
    description: '协助研究生统计学课程教学，负责R语言实验课演示。',
    workload: 30,
    requirements: '1. 统计学基础扎实',
    deadline: '2023-09-10',
    status: 'closed'
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 501,
    studentId: 1003,
    studentName: '赵雅',
    postId: 1,
    postTitle: '《数据库系统原理》助教',
    applyTime: '2023-09-01 10:00:00',
    applyType: 'apply',
    applyReason: '专业对口，有相关经验',
    hasCommunicated: true,
    materials: ['grades.pdf', 'resume.pdf'],
    status: ApplicationStatus.APPROVED,
    finalScore: 92.5,
    note: '优先录取'
  },
  {
    id: 502,
    studentId: 1002,
    studentName: '王强',
    postId: 1,
    postTitle: '《数据库系统原理》助教',
    applyTime: '2023-09-02 14:20:00',
    applyType: 'apply',
    applyReason: '希望锻炼能力',
    hasCommunicated: false,
    materials: ['transcript.pdf'],
    status: ApplicationStatus.PENDING,
    finalScore: 0
  },
  {
    id: 503,
    studentId: 1001,
    studentName: '李明',
    postId: 2,
    postTitle: '信息检索课题组 助研',
    applyTime: '2023-09-05 09:15:00',
    applyType: 'apply',
    applyReason: '研究方向一致',
    hasCommunicated: true,
    materials: ['paper_draft.pdf'],
    status: ApplicationStatus.APPROVED, 
    finalScore: 88.0
  }
];

// No Daily Work Logs anymore

export const MOCK_WORKLOAD_SUMMARIES: WorkloadSummary[] = [
  {
    id: 1,
    studentId: 1003,
    studentName: '赵雅',
    postId: 1,
    postTitle: '《数据库系统原理》助教',
    yearStart: '2023-09-01',
    yearEnd: '2024-01-15',
    totalHours: 40, // From Position 1
    status: '正常',
  },
  {
    id: 2,
    studentId: 1001,
    studentName: '李明',
    postId: 2,
    postTitle: '信息检索课题组 助研',
    yearStart: '2023-09-01',
    yearEnd: '2024-06-30',
    totalHours: 60, // From Position 2
    status: '正常',
  }
];

export const MOCK_SCHOLARSHIP_RECORDS: ScholarshipRecord[] = [
  {
    id: 1,
    studentId: 1003,
    studentName: '赵雅',
    amount: 3200, // 4 months * 800
    date: '2024-01-20',
    type: '应发',
    reason: '2023秋季学期助教津贴',
    status: 'issued'
  },
  {
    id: 2,
    studentId: 1001,
    studentName: '李明',
    amount: 5000,
    date: '2024-02-15',
    type: '应发',
    reason: '2023秋季学期助研津贴',
    status: 'issued'
  },
  {
    id: 3,
    studentId: 1002,
    studentName: '王强',
    amount: 500,
    date: '2024-01-20',
    type: '补发',
    reason: '上学年工作量调整补发',
    status: 'issued'
  }
];

export const MOCK_NOTIFICATIONS = [
  { id: 1, text: '您的"助教津贴"已发放：¥3200', time: '2小时前', unread: true },
  { id: 2, text: '2023秋季学期工作量统计已生成', time: '1天前', unread: true },
  { id: 3, text: '《高级统计学》岗位已截止报名', time: '3天前', unread: false },
];
