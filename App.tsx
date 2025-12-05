
import React, { useState, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Database,
  CheckCircle,
  XCircle,
  Clock,
  Menu,
  TrendingUp,
  Users,
  AlertCircle,
  Bell,
  Search,
  Plus,
  ChevronRight,
  LogOut,
  UserCog,
  Calendar,
  Check,
  Settings,
  Download,
  Upload,
  File as FileIcon,
  X,
  ClipboardList,
  UserCheck,
  AlertTriangle,
  MessageSquare,
  Coins,
  FileSpreadsheet,
  Filter,
  PieChart as PieChartIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { MOCK_STUDENTS, MOCK_POSTS, MOCK_APPLICATIONS, MOCK_WORKLOAD_SUMMARIES, MOCK_NOTIFICATIONS, MOCK_SCHOLARSHIP_RECORDS } from './constants';
import { Student, Post, Application, ViewState, ApplicationStatus, UserRole, ScholarshipRecord, WorkloadSummary } from './types';
import { SqlDocs } from './components/SqlDocs';

// --- Components ---

/**
 * TopBar Component
 */
const TopBar = ({ 
  userRole, 
  userName, 
  onMenuClick,
  notifications,
  onProfileClick
}: { 
  userRole: UserRole, 
  userName: string, 
  onMenuClick: () => void,
  notifications: typeof MOCK_NOTIFICATIONS,
  onProfileClick: () => void
}) => {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-20 sticky top-0">
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
           <div className="p-1.5 bg-slate-900 rounded-lg hidden md:block">
             <GraduationCap className="w-5 h-5 text-white" />
           </div>
           <div className="flex flex-col">
             <h1 className="text-sm md:text-base font-bold text-slate-900 leading-none">博士岗位奖学金管理系统</h1>
             <span className="text-[10px] text-slate-400 font-medium tracking-wide hidden md:inline-block mt-0.5">INFORMATION MANAGEMENT DEPT.</span>
           </div>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer group">
           <Bell className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
           {unreadCount > 0 && (
             <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
           )}
           <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 p-2 hidden group-hover:block z-50">
             <div className="text-xs font-bold text-slate-400 px-3 py-2 uppercase">通知中心</div>
             {notifications.slice(0, 5).map(n => (
               <div key={n.id} className="p-3 hover:bg-slate-50 rounded-lg border-b border-slate-50 last:border-0 cursor-pointer">
                 <p className={`text-xs ${n.unread ? 'font-bold text-slate-800' : 'text-slate-500'}`}>{n.text}</p>
                 <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
               </div>
             ))}
           </div>
        </div>
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity" onClick={onProfileClick}>
           <div className="text-right hidden md:block">
             <p className="text-sm font-bold text-slate-800 leading-tight">{userName}</p>
             <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">
               {userRole === UserRole.STUDENT ? '博士生' : '管理员'}
             </p>
           </div>
           <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shadow-sm">
             {userName.charAt(0)}
           </div>
        </div>
      </div>
    </header>
  );
};

/**
 * StatCard (Pastel Style)
 */
const StatCard = ({ 
  title, 
  value, 
  subtext, 
  theme = 'blue', 
  icon: Icon,
  progress,
  statusIcon,
  onClick
}: { 
  title: string, 
  value: string | number, 
  subtext?: string, 
  theme?: 'blue' | 'purple' | 'orange' | 'green' | 'indigo', 
  icon: any,
  progress?: { current: number, max: number },
  statusIcon?: boolean,
  onClick?: () => void
}) => {
  const bgStyles = {
    blue: 'bg-sky-50 border-sky-100 hover:border-sky-200',
    purple: 'bg-purple-50 border-purple-100 hover:border-purple-200',
    orange: 'bg-orange-50 border-orange-100 hover:border-orange-200',
    green: 'bg-teal-50 border-teal-100 hover:border-teal-200',
    indigo: 'bg-indigo-50 border-indigo-100 hover:border-indigo-200',
  };
  const textStyles = {
    blue: 'text-sky-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    green: 'text-teal-600',
    indigo: 'text-indigo-600',
  };
  const iconBg = {
    blue: 'bg-sky-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
    green: 'bg-teal-100',
    indigo: 'bg-indigo-100',
  };

  return (
    <div 
      onClick={onClick}
      className={`${bgStyles[theme]} border rounded-xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-sm cursor-pointer group h-full justify-between`}
    >
      <div className={`p-3 rounded-full ${iconBg[theme]} mb-3 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${textStyles[theme]}`} />
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-800 tracking-tight mb-1">{value}</div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{title}</div>
      </div>
      <div className="w-full mt-auto">
        {progress ? (
          <div className="w-full relative pt-2 group-hover:opacity-100">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>{progress.current} / {progress.max} H</span>
              <span className={progress.current >= progress.max ? 'text-emerald-500' : 'text-amber-500'}>
                {Math.round((progress.current/progress.max)*100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
               <div className={`h-full rounded-full ${progress.current >= progress.max ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${Math.min((progress.current/progress.max)*100, 100)}%` }}></div>
            </div>
          </div>
        ) : statusIcon ? (
          <div className="flex items-center justify-center gap-1.5 text-emerald-600 bg-emerald-100/50 py-1 px-3 rounded-full text-xs font-medium">
             <CheckCircle className="w-3.5 h-3.5" /> 状态正常
          </div>
        ) : subtext ? (
          <div className={`text-xs font-medium ${textStyles[theme]} opacity-80`}>{subtext}</div>
        ) : (<div className="h-4"></div>)}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
  const styles = {
    [ApplicationStatus.APPROVED]: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    [ApplicationStatus.PENDING]: "bg-amber-50 text-amber-700 border border-amber-100",
    [ApplicationStatus.REJECTED]: "bg-rose-50 text-rose-700 border border-rose-100",
    [ApplicationStatus.WITHDRAWN]: "bg-slate-50 text-slate-500 border border-slate-200",
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status]}`}>{status}</span>;
};

// --- Main App ---

const App: React.FC = () => {
  // State
  const [view, setView] = useState<ViewState>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.STUDENT);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scholarshipTab, setScholarshipTab] = useState<'workload' | 'history'>('workload');
  
  // Report Filters
  const [reportYear, setReportYear] = useState<number>(2023);
  const [reportDept, setReportDept] = useState<string>('all');
  
  // Data State
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [workloads, setWorkloads] = useState<WorkloadSummary[]>(MOCK_WORKLOAD_SUMMARIES);
  const [scholarships, setScholarships] = useState<ScholarshipRecord[]>(MOCK_SCHOLARSHIP_RECORDS);
  
  // Modal States
  const [activeModal, setActiveModal] = useState<'apply' | 'review' | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Current User Mock
  const currentStudent = students[0]; // 1001 Li Ming (Has job)
  const currentUserName = currentRole === UserRole.STUDENT ? currentStudent.name : '系统管理员';

  // --- Handlers ---

  const handleOpenApply = (post: Post) => {
    if (currentStudent.hasJob) {
      alert("您当前已有工作岗位，无法申请新岗位 (Limit: 1 Job)");
      return;
    }
    const hasPending = applications.some(a => a.studentId === currentStudent.id && a.status === ApplicationStatus.PENDING);
    if (hasPending) {
      alert("您已有正在审核中的申请，请等待审核结果或撤销后重试。");
      return;
    }

    if (applications.some(a => a.studentId === currentStudent.id && a.postId === post.id)) {
      alert("您已申请过该岗位，请勿重复提交。");
      return;
    }
    setSelectedItem(post);
    setActiveModal('apply');
  };

  const submitApplication = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reason = formData.get('reason') as string;
    const hasCommunicated = formData.get('hasCommunicated') === 'on';
    
    // Mock file upload
    const files: string[] = [];
    if ((document.getElementById('file-upload') as HTMLInputElement)?.value) {
      files.push('application_proof.pdf');
    }

    if (selectedItem) {
      const newApp: Application = {
        id: Date.now(),
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        postId: selectedItem.id,
        postTitle: selectedItem.title,
        applyTime: new Date().toISOString(),
        applyType: 'apply',
        applyReason: reason,
        hasCommunicated: hasCommunicated,
        materials: files,
        status: ApplicationStatus.PENDING,
        finalScore: 0
      };
      setApplications([...applications, newApp]);
      setActiveModal(null);
      setSelectedItem(null);
      alert("申请已提交，请等待管理员审核。");
    }
  };

  const handleOpenReview = (app: Application) => {
    setSelectedItem(app);
    setActiveModal('review');
  };

  const submitReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const action = (e.nativeEvent as any).submitter.value; // 'admit' or 'reject'
    const note = (e.currentTarget.elements.namedItem('note') as HTMLInputElement).value;

    const appId = selectedItem.id;
    const studentId = selectedItem.studentId;
    const postId = selectedItem.postId;
    const post = posts.find(p => p.id === postId);

    if (action === 'admit') {
      setApplications(prev => prev.map(a => 
        a.id === appId ? { ...a, status: ApplicationStatus.APPROVED, note, finalScore: 90 } : a
      ));
      
      setStudents(prev => prev.map(s => 
        s.id === studentId ? { ...s, hasJob: true } : s
      ));

      const newWorkload: WorkloadSummary = {
        id: Date.now(),
        studentId: studentId,
        studentName: selectedItem.studentName,
        postId: postId,
        postTitle: post?.title,
        yearStart: '2023-09-01',
        yearEnd: '2024-06-30',
        totalHours: post?.workload || 0,
        status: '正常'
      };
      setWorkloads(prev => [...prev, newWorkload]);

      alert(`申请已批准。系统已自动为 ${selectedItem.studentName} 分配岗位并记录年度定额工作量 (${post?.workload}小时)。`);
    } else {
      setApplications(prev => prev.map(a => 
        a.id === appId ? { ...a, status: ApplicationStatus.REJECTED, note } : a
      ));
    }
    
    setActiveModal(null);
    setSelectedItem(null);
  };

  const handleVerifyStudent = (studentId: number) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, verified: true } : s));
  };

  const handleSaveProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("个人信息保存成功");
    setView('dashboard');
  };

  const handleExport = (type: string) => {
    // Simulating CSV Export
    const fileName = `${type}_export_${reportYear}_${new Date().toISOString().slice(0,10)}.csv`;
    alert(`正在生成并导出 CSV 文件: ${fileName}\n\n(此功能仅限管理员 is_staff 权限使用)`);
  };

  // --- Derived Data ---

  const myApplications = useMemo(() => applications.filter(a => a.studentId === currentStudent.id), [applications, currentStudent.id]);
  
  const myWorkloads = useMemo(() => workloads.filter(w => w.studentId === currentStudent.id), [workloads, currentStudent.id]);
  const myScholarships = useMemo(() => scholarships.filter(s => s.studentId === currentStudent.id), [scholarships, currentStudent.id]);

  const adminPendingApps = useMemo(() => {
    return applications.filter(a => a.status === ApplicationStatus.PENDING);
  }, [applications]);

  // --- Views ---

  const renderDashboard = () => {
    if (currentRole === UserRole.STUDENT) {
      const statusData = [
        { name: '待审核', value: myApplications.filter(a => a.status === ApplicationStatus.PENDING).length },
        { name: '已录用', value: myApplications.filter(a => a.status === ApplicationStatus.APPROVED).length },
        { name: '已驳回', value: myApplications.filter(a => a.status === ApplicationStatus.REJECTED).length },
      ];
      const COLORS = ['#fbbf24', '#34d399', '#f87171'];

      const currentJobWorkload = myWorkloads.length > 0 ? myWorkloads[0] : null;

      return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pt-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">欢迎回来，{currentStudent.name}</h2>
              <p className="text-sm text-slate-400 mt-1 font-medium">当前身份：{currentStudent.program} {currentStudent.enrollmentYear}级博士生</p>
            </div>
            {!currentStudent.verified && (
              <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-xs font-bold border border-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> 您的学籍档案尚未通过管理员核验
              </div>
            )}
            {currentStudent.hasJob && (
               <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-xs font-bold border border-emerald-200 flex items-center gap-2">
               <Briefcase className="w-4 h-4" /> 您已在岗 (Has Job: Yes)
             </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="可选岗位" value={posts.filter(p => p.status === 'open').length} theme="blue" icon={Briefcase} onClick={() => setView('posts')} />
            <StatCard title="我的申请" value={myApplications.length} theme="purple" icon={FileText} onClick={() => setView('applications')} />
            <StatCard 
              title="年度工作量" 
              value={currentJobWorkload ? `${currentJobWorkload.totalHours}h` : '0h'} 
              subtext={currentJobWorkload ? '岗位定额已分配' : '暂无岗位'}
              theme="orange" 
              icon={Clock} 
              onClick={() => setView('scholarships')} 
            />
            <StatCard 
              title="奖学金 (本学年)" 
              value={`¥${myScholarships.filter(s => s.date.startsWith('2024')).reduce((sum, s) => sum + s.amount, 0)}`} 
              subtext="已发放总额"
              theme="green" 
              icon={Coins} 
              onClick={() => setView('scholarships')}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-72">
               <h3 className="text-base font-bold text-slate-700 mb-2">申请状态分布</h3>
               <div className="flex-1">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                       {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                     </Pie>
                     <Tooltip />
                     <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
                   </PieChart>
                 </ResponsiveContainer>
               </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
               <h3 className="text-base font-bold text-slate-700 mb-4">最近奖学金记录</h3>
               <div className="space-y-3">
                 {myScholarships.slice(0, 3).map(rec => (
                   <div key={rec.id} className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                     <div>
                       <p className="text-xs text-slate-500 font-mono">{rec.date}</p>
                       <p className="text-sm font-medium text-slate-700">{rec.reason}</p>
                     </div>
                     <div className="text-right">
                       <span className="font-bold text-emerald-600">+¥{rec.amount}</span>
                       <div className="text-[10px] text-slate-400 mt-1">{rec.type}</div>
                     </div>
                   </div>
                 ))}
                 {myScholarships.length === 0 && <p className="text-sm text-slate-400">暂无发放记录</p>}
               </div>
            </div>
          </div>
        </div>
      );
    }
    // Admin View
    return (
      <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pt-6">
        <div><h2 className="text-2xl font-bold text-slate-800">系统管理概览</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard title="待审批申请" value={adminPendingApps.length} theme="purple" icon={FileText} onClick={() => setView('applications')} />
          <StatCard title="累计发放金额" value={`¥${scholarships.reduce((sum, s) => sum + s.amount, 0)}`} theme="green" icon={Coins} onClick={() => setView('scholarships')} />
          <StatCard title="待核验新生" value={students.filter(s => !s.verified).length} theme="indigo" icon={UserCheck} onClick={() => setView('users')} />
          <StatCard title="开放岗位" value={posts.filter(p => p.status === 'open').length} theme="blue" icon={Briefcase} onClick={() => setView('posts')} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="font-bold text-slate-700 mb-4">快捷操作区</h3>
           <div className="flex gap-4">
             <button onClick={() => setView('applications')} className="flex-1 bg-purple-50 hover:bg-purple-100 border border-purple-100 p-4 rounded-xl flex items-center justify-center gap-2 text-purple-700 font-bold transition-colors">
               <FileText className="w-5 h-5" /> 审批学生申请
             </button>
             <button onClick={() => setView('users')} className="flex-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 p-4 rounded-xl flex items-center justify-center gap-2 text-indigo-700 font-bold transition-colors">
               <Users className="w-5 h-5" /> 学生身份核验
             </button>
             <button onClick={() => setView('reports')} className="flex-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 p-4 rounded-xl flex items-center justify-center gap-2 text-emerald-700 font-bold transition-colors">
               <FileSpreadsheet className="w-5 h-5" /> 报表与导出
             </button>
           </div>
        </div>
      </div>
    );
  };

  const renderWorkloadAndScholarship = () => (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">工作量与奖学金</h2>
           <p className="text-sm text-slate-500 mt-1">查看年度定额工作量统计及奖学金发放明细</p>
        </div>
        <div className="flex bg-white rounded-lg border border-slate-200 p-1">
          <button onClick={() => setScholarshipTab('workload')} className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${scholarshipTab === 'workload' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>年度工作量</button>
          <button onClick={() => setScholarshipTab('history')} className={`px-4 py-2 text-xs font-medium rounded-md transition-colors ${scholarshipTab === 'history' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>奖学金记录</button>
        </div>
      </div>

      {scholarshipTab === 'workload' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
             <Clock className="w-5 h-5 text-orange-500" />
             {currentRole === UserRole.ADMIN ? '全系学生工作量统计' : '我的年度工作量'}
           </h3>
           <div className="mt-4 overflow-x-auto">
             <table className="min-w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 font-medium">
                 <tr>
                   <th className="px-4 py-3">学生</th>
                   <th className="px-4 py-3">对应岗位</th>
                   <th className="px-4 py-3">统计周期</th>
                   <th className="px-4 py-3">定额工时</th>
                   <th className="px-4 py-3">状态</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {(currentRole === UserRole.STUDENT ? myWorkloads : workloads).map(w => (
                   <tr key={w.id}>
                     <td className="px-4 py-3 font-bold text-slate-700">{w.studentName}</td>
                     <td className="px-4 py-3 text-slate-600">{w.postTitle || '-'}</td>
                     <td className="px-4 py-3 text-slate-500 text-xs font-mono">{w.yearStart} ~ {w.yearEnd}</td>
                     <td className="px-4 py-3 text-slate-700 font-bold">{w.totalHours} 小时</td>
                     <td className="px-4 py-3">
                       <span className={`px-2 py-1 rounded text-xs ${w.status === '正常' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                         {w.status}
                       </span>
                     </td>
                   </tr>
                 ))}
                 {(currentRole === UserRole.STUDENT ? myWorkloads : workloads).length === 0 && (
                   <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">暂无工作量记录</td></tr>
                 )}
               </tbody>
             </table>
           </div>
           {currentRole === UserRole.ADMIN && (
             <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-100 flex items-center justify-between">
                <div className="text-xs text-orange-800">
                   <strong>提示：</strong> 工作量数据基于学生被录取岗位的标准工时自动生成。
                </div>
                <button onClick={() => handleExport('workload')} className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded font-bold hover:bg-orange-700 flex items-center gap-2">
                  <Download className="w-3.5 h-3.5"/> 导出报表
                </button>
             </div>
           )}
        </div>
      )}

      {scholarshipTab === 'history' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-500" />
                奖学金发放明细
              </h3>
              {currentRole === UserRole.ADMIN && (
                <button className="bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-emerald-700 shadow-sm">
                  + 新增发放记录
                </button>
              )}
           </div>
           
           <div className="mt-4 overflow-x-auto">
             <table className="min-w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 font-medium">
                 <tr>
                   <th className="px-4 py-3">学生</th>
                   <th className="px-4 py-3">发放日期</th>
                   <th className="px-4 py-3">类型</th>
                   <th className="px-4 py-3">金额</th>
                   <th className="px-4 py-3">事由/备注</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {(currentRole === UserRole.STUDENT ? myScholarships : scholarships).map(s => (
                   <tr key={s.id}>
                     <td className="px-4 py-3 font-bold text-slate-700">{s.studentName}</td>
                     <td className="px-4 py-3 text-slate-500 text-xs font-mono">{s.date}</td>
                     <td className="px-4 py-3">
                       <span className={`px-2 py-0.5 rounded text-[10px] border ${s.type === '应发' ? 'bg-blue-50 text-blue-600 border-blue-100' : s.type === '补发' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                         {s.type}
                       </span>
                     </td>
                     <td className={`px-4 py-3 font-bold ${s.type === '扣发' ? 'text-rose-600' : 'text-emerald-600'}`}>
                       {s.type === '扣发' ? '-' : '+'}¥{s.amount}
                     </td>
                     <td className="px-4 py-3 text-slate-600">{s.reason}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );

  const renderPosts = () => (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pt-6">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-slate-800">岗位大厅</h2>
         {currentRole === UserRole.ADMIN && (
           <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-700"><Plus className="w-4 h-4"/> 发布岗位</button>
         )}
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {posts.map(post => (
           <div key={post.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all group hover:-translate-y-1">
              <div className="flex justify-between mb-4">
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold border border-blue-100">{post.type}</span>
                <span className="text-xs text-slate-400">{post.year}年度</span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-blue-600">{post.title}</h3>
              <p className="text-sm text-slate-500 mb-2 line-clamp-2">{post.description}</p>
              <div className="flex gap-2 text-xs mb-4">
                 <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">定额工时: {post.workload}h</span>
                 {post.requirements && <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded truncate max-w-[100px]">{post.requirements}</span>}
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-4">
                 <span>{post.supervisorName}</span>
                 <span>名额: {post.totalSlots}</span>
              </div>
              {currentRole === UserRole.STUDENT && post.status === 'open' && (
                <button 
                  onClick={() => handleOpenApply(post)} 
                  disabled={currentStudent.hasJob}
                  className={`w-full mt-4 py-2 rounded-lg text-sm font-semibold transition-colors ${currentStudent.hasJob ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white'}`}
                >
                  {currentStudent.hasJob ? '已在岗 (无法申请)' : '申请岗位'}
                </button>
              )}
           </div>
         ))}
       </div>
    </div>
  );

  const renderApplications = () => (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pt-6">
      <h2 className="text-2xl font-bold text-slate-800">{currentRole === UserRole.ADMIN ? '岗位申请审批' : '我的申请'}</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">学生</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">岗位</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">申请时间</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">状态</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white">
            {(currentRole === UserRole.STUDENT ? myApplications : applications).map(app => (
              <tr key={app.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-bold text-slate-800">
                  {app.studentName}
                  {app.hasCommunicated && <span className="ml-2 inline-flex items-center text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100" title="已与导师沟通"><MessageSquare className="w-3 h-3 mr-0.5"/> 已沟通</span>}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{app.postTitle}</td>
                <td className="px-6 py-4 text-xs text-slate-400">{app.applyTime.split('T')[0]}</td>
                <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                <td className="px-6 py-4">
                  {currentRole === UserRole.ADMIN && app.status === ApplicationStatus.PENDING && (
                    <button onClick={() => handleOpenReview(app)} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-xs font-semibold border border-blue-100">
                      审批
                    </button>
                  )}
                  {currentRole === UserRole.STUDENT && app.status === ApplicationStatus.REJECTED && app.note && (
                    <span className="text-xs text-rose-500" title={app.note}>查看拒绝原因</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pt-6">
      <h2 className="text-2xl font-bold text-slate-800">用户与学籍核验</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">学号</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">姓名</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">类型</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">是否在岗</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">状态</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white">
            {students.map(s => (
              <tr key={s.id}>
                <td className="px-6 py-4 text-sm font-mono text-slate-600">{s.studentNo}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-800">{s.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{s.isFulltime ? '全日制' : '非全日制'}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{s.hasJob ? '是' : '否'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${s.verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {s.verified ? '已核验' : '待核验'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {!s.verified && (
                    <button onClick={() => handleVerifyStudent(s.id)} className="text-emerald-600 hover:bg-emerald-50 px-3 py-1 rounded text-xs font-semibold border border-emerald-100">
                      通过核验
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
               <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">统计报表与数据导出</h2>
              <p className="text-xs text-slate-500">仅限管理员 (Staff Only)</p>
            </div>
         </div>
         {/* Filters */}
         <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
           <div className="flex items-center gap-2 px-3 border-r border-slate-100">
             <Filter className="w-4 h-4 text-slate-400" />
             <span className="text-xs font-bold text-slate-600">筛选条件</span>
           </div>
           <select 
              value={reportYear} 
              onChange={(e) => setReportYear(Number(e.target.value))}
              className="text-sm bg-transparent border-none focus:ring-0 text-slate-600 font-medium cursor-pointer hover:bg-slate-50 rounded px-2"
           >
             <option value={2023}>2023-2024 学年</option>
             <option value={2024}>2024-2025 学年</option>
           </select>
           <select 
              value={reportDept} 
              onChange={(e) => setReportDept(e.target.value)}
              className="text-sm bg-transparent border-none focus:ring-0 text-slate-600 font-medium cursor-pointer hover:bg-slate-50 rounded px-2"
           >
             <option value="all">所有部门</option>
             <option value="dept1">信息管理系</option>
             <option value="dept2">计算机系</option>
           </select>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workload Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" /> 
            {reportYear}年度 工作量分布
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={posts.map(p => ({ 
                 name: p.title.substring(0,4), 
                 workload: p.workload, 
                 students: workloads.filter(w => w.postId === p.id).length 
               }))}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                 <YAxis fontSize={10} tickLine={false} axisLine={false} />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                 <Legend />
                 <Bar dataKey="workload" name="定额工时" fill="#3b82f6" radius={[4,4,0,0]} barSize={20} />
                 <Bar dataKey="students" name="在岗人数" fill="#93c5fd" radius={[4,4,0,0]} barSize={20} />
               </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scholarship Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-500" /> 
            奖学金发放预测趋势
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={[
                 {m:'9月',v:8000}, {m:'10月',v:12000}, {m:'11月',v:11500}, 
                 {m:'12月',v:13000}, {m:'1月',v:10000}, {m:'2月',v:0}
               ]}>
                 <defs>
                   <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="m" fontSize={10} tickLine={false} axisLine={false} />
                 <YAxis fontSize={10} tickLine={false} axisLine={false} />
                 <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                 <Area type="monotone" dataKey="v" stroke="#10b981" fillOpacity={1} fill="url(#colorV)" />
               </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Data Export Center */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-slate-600" />
          数据导出中心 (CSV)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
           {[
             { id: 'students', label: '学生名册', sub: 'Student Roster', icon: Users, color: 'indigo' },
             { id: 'applications', label: '申请记录', sub: 'All Applications', icon: FileText, color: 'purple' },
             { id: 'workload', label: '工作量统计', sub: 'Workload Summary', icon: Clock, color: 'orange' },
             { id: 'scholarship', label: '奖学金明细', sub: 'Scholarship Logs', icon: Coins, color: 'emerald' },
             { id: 'scores', label: '评分数据', sub: 'Evaluation Scores', icon: TrendingUp, color: 'blue' },
           ].map((item) => (
             <button 
               key={item.id}
               onClick={() => handleExport(item.id)}
               className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all group"
             >
               <div className={`p-3 rounded-full bg-${item.color}-50 text-${item.color}-600 mb-3 group-hover:scale-110 transition-transform`}>
                 <item.icon className="w-6 h-6" />
               </div>
               <span className="font-bold text-slate-700 text-sm">{item.label}</span>
               <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">{item.sub}</span>
             </button>
           ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 bg-white p-3 rounded-lg border border-slate-100">
           <AlertCircle className="w-4 h-4" />
           <span>导出文件将包含当前筛选条件下 ({reportYear}年) 的所有相关数据。请妥善保管导出文件。</span>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pt-6">
      <h2 className="text-2xl font-bold text-slate-800">系统配置</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">奖学金参数设置</h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">RA岗位月基础金额 (元)</label>
            <input type="number" defaultValue={1000} className="w-full border border-slate-200 rounded p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">TA岗位月基础金额 (元)</label>
            <input type="number" defaultValue={800} className="w-full border border-slate-200 rounded p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">年度工时合格线 (小时)</label>
            <input type="number" defaultValue={100} className="w-full border border-slate-200 rounded p-2 text-sm" />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-semibold">保存配置</button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto pt-6">
      <h2 className="text-2xl font-bold text-slate-800">个人信息维护</h2>
      <form onSubmit={handleSaveProfile} className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
             <label className="block text-xs font-semibold text-slate-500 mb-1">姓名</label>
             <input type="text" disabled value={currentRole === UserRole.STUDENT ? currentStudent.name : 'Admin'} className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-sm text-slate-500" />
          </div>
          <div>
             <label className="block text-xs font-semibold text-slate-500 mb-1">{currentRole === UserRole.STUDENT ? '学号' : '工号'}</label>
             <input type="text" disabled value={currentRole === UserRole.STUDENT ? currentStudent.studentNo : 'ADMIN-001'} className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-sm text-slate-500" />
          </div>
          {currentRole === UserRole.STUDENT && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">专业/方向</label>
                <input type="text" defaultValue={currentStudent.program} className="w-full border border-slate-200 rounded p-2.5 text-sm focus:ring-2 focus:ring-accent/20 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">银行卡号 (奖学金发放)</label>
                <input type="text" defaultValue={currentStudent.bankAccount} className="w-full border border-slate-200 rounded p-2.5 text-sm focus:ring-2 focus:ring-accent/20 outline-none" />
              </div>
            </>
          )}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">联系电话</label>
            <input type="text" defaultValue="13800138000" className="w-full border border-slate-200 rounded p-2.5 text-sm focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">电子邮箱</label>
            <input type="email" defaultValue={currentRole === UserRole.STUDENT ? currentStudent.email : `admin@univ.edu.cn`} className="w-full border border-slate-200 rounded p-2.5 text-sm focus:ring-2 focus:ring-accent/20 outline-none" />
          </div>
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button type="submit" className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800">保存更改</button>
        </div>
      </form>
    </div>
  );

  // --- Render Modals ---

  const renderApplyModal = () => (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">申请岗位：{selectedItem?.title}</h3>
          <button onClick={() => {setActiveModal(null); setSelectedItem(null);}} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={submitApplication} className="p-6 overflow-y-auto">
           <div className="mb-4">
             <label className="block text-xs font-semibold text-slate-500 mb-1">申请理由 / 个人陈述</label>
             <textarea name="reason" rows={4} className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-accent/20 outline-none" placeholder="请简述您的优势及对该岗位的理解..." required></textarea>
           </div>
           
           {/* Backend Requirement 2 - Communication Check */}
           <div className="mb-4 flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
             <input type="checkbox" name="hasCommunicated" id="hasCommunicated" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
             <label htmlFor="hasCommunicated" className="text-xs font-semibold text-blue-800 cursor-pointer select-none">我已提前与岗位负责人沟通（推荐）</label>
           </div>

           <div className="mb-6">
             <label className="block text-xs font-semibold text-slate-500 mb-2">上传证明材料 (成绩单/简历)</label>
             <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer relative">
               <input id="file-upload" type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
               <Upload className="w-8 h-8 mb-2 text-slate-300" />
               <span className="text-xs">点击上传 PDF 文件</span>
             </div>
           </div>
           <button type="submit" className="w-full bg-accent text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all">确认提交申请</button>
        </form>
      </div>
    </div>
  );

  const renderReviewModal = () => {
    const student = students.find(s => s.id === selectedItem?.studentId);
    const post = posts.find(p => p.id === selectedItem?.postId);

    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-800">申请审核 - {selectedItem?.studentName}</h3>
            <button onClick={() => {setActiveModal(null); setSelectedItem(null);}} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
          </div>
          <form onSubmit={submitReview} className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Left: Student Info */}
            <div className="w-full md:w-1/3 bg-slate-50 p-6 border-r border-slate-100 overflow-y-auto">
               <div className="text-center mb-6">
                 <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center text-2xl font-bold text-slate-400 mx-auto mb-2 shadow-sm">
                   {student?.name.charAt(0)}
                 </div>
                 <h4 className="font-bold text-slate-800">{student?.name}</h4>
                 <p className="text-xs text-slate-500">{student?.studentNo}</p>
               </div>
               <div className="space-y-4 text-sm">
                 <div>
                   <span className="block text-xs text-slate-400 uppercase font-semibold">导师沟通情况</span>
                   <span className={`font-bold ${selectedItem?.hasCommunicated ? 'text-emerald-600' : 'text-slate-500'}`}>
                     {selectedItem?.hasCommunicated ? '已沟通' : '未沟通'}
                   </span>
                 </div>
                 <div>
                   <span className="block text-xs text-slate-400 uppercase font-semibold">GPA</span>
                   <span className="font-bold text-slate-700">{student?.gpa || 'N/A'}</span>
                 </div>
                 <div>
                   <span className="block text-xs text-slate-400 uppercase font-semibold">科研成果</span>
                   <span className="font-bold text-slate-700">{student?.researchCount || 0} 篇论文</span>
                 </div>
                 <div>
                   <span className="block text-xs text-slate-400 uppercase font-semibold">证明材料</span>
                   <div className="flex flex-col gap-2 mt-1">
                     {selectedItem?.materials?.map((f: string, i: number) => (
                       <div key={i} className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200 text-xs text-blue-600 cursor-pointer hover:bg-blue-50">
                         <FileIcon className="w-3 h-3" /> {f}
                       </div>
                     ))}
                     {!selectedItem?.materials?.length && <span className="text-slate-400 italic">无附件</span>}
                   </div>
                 </div>
               </div>
            </div>
            {/* Right: Evaluation */}
            <div className="w-full md:w-2/3 p-6 overflow-y-auto">
               <div className="mb-4 bg-amber-50 p-3 rounded-lg text-xs text-amber-800 border border-amber-100 mb-6">
                 <span className="font-bold block mb-1">申请理由:</span>
                 {selectedItem?.applyReason}
               </div>
               <div className="mb-6">
                 <label className="block text-xs font-semibold text-slate-500 mb-1">审核意见 (Admin Note)</label>
                 <textarea name="note" rows={3} className="w-full border border-slate-200 rounded p-2 text-sm" placeholder="批准或拒绝的原因..."></textarea>
               </div>
               <div className="bg-emerald-50 p-3 rounded mb-4 text-xs text-emerald-800 border border-emerald-100 flex items-start gap-2">
                 <Clock className="w-4 h-4 mt-0.5" />
                 <div>
                   <span className="font-bold block">自动分配工作量:</span>
                   批准后，系统将自动为该学生记录 <strong>{post?.workload || 0}小时</strong> 的年度定额工作量，无需每日打卡。
                 </div>
               </div>
               <div className="flex gap-3 pt-4 border-t border-slate-100">
                 <button type="submit" value="reject" className="flex-1 bg-white border border-rose-200 text-rose-600 py-2.5 rounded-lg font-bold hover:bg-rose-50 transition-colors">拒绝申请</button>
                 <button type="submit" value="admit" className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30">批准并分配</button>
               </div>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // --- Sidebar Logic ---
  
  const menuItems = useMemo(() => {
    const base = [{ id: 'dashboard', icon: LayoutDashboard, label: '工作台首页' }];
    if (currentRole === UserRole.STUDENT) {
      base.push(
        { id: 'posts', icon: Briefcase, label: '岗位大厅' },
        { id: 'applications', icon: FileText, label: '我的申请' },
        { id: 'scholarships', icon: Coins, label: '工作量与奖学金' }
      );
    } else {
      // Admin Menu
      base.push(
        { id: 'users', icon: Users, label: '用户核验' },
        { id: 'posts', icon: Briefcase, label: '岗位管理' },
        { id: 'applications', icon: Search, label: '审批申请' },
        { id: 'scholarships', icon: Coins, label: '资金管理' },
        { id: 'reports', icon: FileSpreadsheet, label: '报表与导出' },
        { id: 'settings', icon: Settings, label: '系统配置' },
        { id: 'docs', icon: Database, label: '系统设计' }
      );
    }
    return base;
  }, [currentRole]);

  return (
    <div className="flex h-screen bg-surface text-slate-900 font-sans overflow-hidden selection:bg-accent/20">
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 relative z-30 shadow-xl border-r border-slate-800/50">
        <div className="h-16 border-b border-slate-800/50 flex items-center px-6">
           <div className="w-full relative group">
             <button className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors w-full">
               <UserCog className="w-3 h-3" />
               <span>角色演示</span>
             </button>
             <div className="absolute top-full left-0 w-full mt-2 bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-1 hidden group-hover:block z-50">
               {[{ r: UserRole.STUDENT, l: '博士生' }, { r: UserRole.ADMIN, l: '管理员' }].map(opt => (
                 <button key={opt.r} onClick={() => { setCurrentRole(opt.r); setView('dashboard'); }} className={`w-full text-left px-3 py-2 text-xs rounded-md ${currentRole === opt.r ? 'bg-accent text-white' : 'hover:bg-slate-700 text-slate-300'}`}>
                   {opt.l}
                 </button>
               ))}
             </div>
           </div>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setView(item.id as ViewState)} className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-lg text-sm font-medium transition-all duration-300 group relative ${view === item.id ? 'bg-gradient-to-r from-slate-800 to-transparent text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
              {view === item.id && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>}
              <item.icon className={`w-5 h-5 transition-colors ${view === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} strokeWidth={1.5} /> 
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800/50"><button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-white transition-colors w-full rounded-lg hover:bg-slate-800/50"><LogOut className="w-4 h-4" /> 退出登录</button></div>
      </aside>

      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-surface">
        <TopBar userRole={currentRole} userName={currentUserName} notifications={MOCK_NOTIFICATIONS} onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} onProfileClick={() => setView('profile')} />
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 absolute top-16 left-0 w-full z-50 shadow-xl">
             <div className="p-4 flex gap-2">{[UserRole.STUDENT, UserRole.ADMIN].map(r => <button key={r} onClick={() => {setCurrentRole(r); setIsMobileMenuOpen(false);}} className="bg-slate-100 px-3 py-1 rounded text-xs">{r}</button>)}</div>
             <nav className="p-4 space-y-1">{menuItems.map(item => <button key={item.id} onClick={() => { setView(item.id as ViewState); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-600">{item.label}</button>)}</nav>
          </div>
        )}
        <main className="flex-1 overflow-auto px-4 md:px-8 pb-10 custom-scrollbar bg-slate-50/30">
          {view === 'docs' ? <div className="h-full w-full animate-fade-in max-w-7xl mx-auto py-6"><SqlDocs /></div> : 
           view === 'dashboard' ? renderDashboard() : 
           view === 'posts' ? renderPosts() : 
           view === 'applications' ? renderApplications() : 
           view === 'scholarships' ? renderWorkloadAndScholarship() : 
           view === 'users' ? renderUsers() :
           view === 'reports' ? renderReports() :
           view === 'settings' ? renderSettings() :
           view === 'profile' ? renderProfile() : null}
        </main>
      </div>

      {/* Modals */}
      {activeModal === 'apply' && renderApplyModal()}
      {activeModal === 'review' && renderReviewModal()}
    </div>
  );
};

export default App;
