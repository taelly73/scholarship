
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, GraduationCap, Briefcase, FileText, Database,
  CheckCircle, AlertCircle, Bell, Search, Plus, LogOut,
  UserCog, Clock, Menu, TrendingUp, Users, Download, Upload,
  File as FileIcon, X, Coins, FileSpreadsheet, Filter, MessageSquare, UserCheck, Wifi, WifiOff
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Student, Post, Application, ViewState, ApplicationStatus, UserRole, ScholarshipRecord, WorkloadSummary, Department, PublicNotice } from './types';
import { SqlDocs } from './components/SqlDocs';
import { api } from './services/api';

// --- Components ---

/**
 * TopBar Component
 */
const TopBar = ({ 
  userRole, 
  userName, 
  onMenuClick,
  onLogout,
  onProfileClick
}: { 
  userRole: UserRole, 
  userName: string, 
  onMenuClick: () => void,
  onLogout: () => void,
  onProfileClick: () => void
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-20 sticky top-0">
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

      <div className="flex items-center gap-6">
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
        <button onClick={onLogout} className="text-slate-400 hover:text-slate-600" title="退出登录">
            <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

const StatCard = ({ 
  title, value, subtext, theme = 'blue', icon: Icon, onClick
}: { 
  title: string, value: string | number, subtext?: string, theme?: 'blue' | 'purple' | 'orange' | 'green' | 'indigo', icon: any, onClick?: () => void
}) => {
  const bgStyles = {
    blue: 'bg-sky-50 border-sky-100 hover:border-sky-200',
    purple: 'bg-purple-50 border-purple-100 hover:border-purple-200',
    orange: 'bg-orange-50 border-orange-100 hover:border-orange-200',
    green: 'bg-teal-50 border-teal-100 hover:border-teal-200',
    indigo: 'bg-indigo-50 border-indigo-100 hover:border-indigo-200',
  };
  const textStyles = {
    blue: 'text-sky-600', purple: 'text-purple-600', orange: 'text-orange-600', green: 'text-teal-600', indigo: 'text-indigo-600',
  };
  const iconBg = {
    blue: 'bg-sky-100', purple: 'bg-purple-100', orange: 'bg-orange-100', green: 'bg-teal-100', indigo: 'bg-indigo-100',
  };

  return (
    <div onClick={onClick} className={`${bgStyles[theme]} border rounded-xl p-5 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-sm cursor-pointer group h-full justify-between`}>
      <div className={`p-3 rounded-full ${iconBg[theme]} mb-3 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 ${textStyles[theme]}`} />
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-800 tracking-tight mb-1">{value}</div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{title}</div>
      </div>
      <div className="w-full mt-auto">
         {subtext ? <div className={`text-xs font-medium ${textStyles[theme]} opacity-80`}>{subtext}</div> : <div className="h-4"></div>}
      </div>
    </div>
  );
};

// --- Auth Views ---

const AuthView = ({ onLoginSuccess }: { onLoginSuccess: (user: Student) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    studentNo: '', password: '', name: '', email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notices, setNotices] = useState<PublicNotice[]>([]);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  useEffect(() => {
    // Check Server Status
    api.checkHealth().then(setServerOnline);
    // Fetch public notices
    api.public.getNotices().then(setNotices).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await api.auth.login({ username: formData.studentNo, password: formData.password });
        const profile = await api.auth.profile();
        onLoginSuccess(profile);
      } else {
        await api.auth.register({ 
            student_no: formData.studentNo, 
            password: formData.password,
            name: formData.name,
            email: formData.email
        });
        setIsLogin(true);
        alert('注册成功，请登录');
      }
    } catch (err: any) {
      setError(err.message || '操作失败，请检查网络或凭证');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden relative z-10">
        {/* Left: Branding & Notices */}
        <div className="bg-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-600 rounded-lg"><GraduationCap className="w-6 h-6"/></div>
                    <span className="font-bold text-lg tracking-wide">PHD MANAGER</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">博士岗位与<br/>奖学金管理系统</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Integrated management for TA/RA positions, scholarship distribution, and workload automation.
                </p>
            </div>
            
            <div className="mt-8 relative z-10">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">最新公示 (Public Notices)</h3>
                <div className="space-y-3">
                    {notices.length > 0 ? notices.slice(0, 3).map(n => (
                        <div key={n.id} className="bg-slate-800/50 p-3 rounded border border-slate-700 hover:border-blue-500/50 transition-colors">
                            <p className="text-sm font-medium text-slate-200 truncate">{n.title}</p>
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>{n.publisher}</span>
                                <span>{n.publishTime}</span>
                            </div>
                        </div>
                    )) : <p className="text-slate-600 text-xs italic">暂无公示信息</p>}
                </div>
            </div>

            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* Right: Auth Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-6 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-800">{isLogin ? '欢迎登录' : '创建账户'}</h3>
                {serverOnline === false && (
                  <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded border border-amber-200 flex items-center gap-1">
                    <WifiOff className="w-3 h-3"/> Backend Offline
                  </span>
                )}
            </div>
            
            {error && <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm rounded border border-rose-100 flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">学号 (Student No)</label>
                    <input 
                        required 
                        type="text" 
                        className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="S2023..."
                        value={formData.studentNo}
                        onChange={e => setFormData({...formData, studentNo: e.target.value})}
                    />
                </div>
                {!isLogin && (
                    <>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">姓名 (Full Name)</label>
                            <input 
                                required 
                                type="text" 
                                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                placeholder="张三"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">邮箱 (Email)</label>
                            <input 
                                required 
                                type="email" 
                                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                placeholder="example@univ.edu.cn"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </>
                )}
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">密码 (Password)</label>
                    <input 
                        required 
                        type="password" 
                        className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                </div>
                
                <button disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-slate-900/10 flex justify-center items-center">
                    {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : (isLogin ? '登录系统' : '立即注册')}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button onClick={() => {setIsLogin(!isLogin); setError('');}} className="text-sm text-blue-600 font-semibold hover:underline">
                    {isLogin ? '没有账号？申请注册' : '已有账号？返回登录'}
                </button>
            </div>
            
            {/* Connection Help */}
            {serverOnline === false && (
              <div className="mt-4 text-[10px] text-slate-400 text-center border-t border-slate-100 pt-3">
                <p>提示：请确保后端运行在 http://127.0.0.1:8000</p>
                <p>并已配置 django-cors-headers</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  // --- Auth State ---
  const [user, setUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // --- App Data State ---
  const [view, setView] = useState<ViewState>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scholarshipTab, setScholarshipTab] = useState<'workload' | 'history'>('workload');
  
  // Report Filters
  const [reportYear, setReportYear] = useState<number>(2023);
  const [reportDept, setReportDept] = useState<string>('all');
  
  // Data State
  const [posts, setPosts] = useState<Post[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [workloads, setWorkloads] = useState<WorkloadSummary[]>([]);
  const [scholarships, setScholarships] = useState<ScholarshipRecord[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [students, setStudents] = useState<Student[]>([]); // Admin only
  
  // Modal States
  const [activeModal, setActiveModal] = useState<'apply' | 'review' | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Connection State
  const [isOffline, setIsOffline] = useState(false);

  // --- Initialization ---

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const profile = await api.auth.profile();
      setUser(profile);
    } catch (e) {
      // Not logged in or offline
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (!user) return;

    // Check if we are in mock mode
    if ((window as any).__USING_MOCK_DATA__) {
        setIsOffline(true);
    }

    const fetchData = async () => {
        try {
            // Common Data
            const depts = await api.public.getDepartments();
            setDepartments(depts);

            // Role Based Data
            // We use a simple heuristic: if user can access admin endpoint, they are admin.
            if (user.name === 'Admin' || user.studentNo === 'admin' || user.studentNo.startsWith('ADMIN')) {
                const adminPosts = await api.admin.getPositions();
                setPosts(adminPosts);
                // Admin reports are fetched on demand or initially
                const wReport = await api.admin.getWorkloadReport();
                setWorkloads(wReport.results || []); // adjust based on API response structure
                const sReport = await api.admin.getScholarshipReport();
                setScholarships(sReport.results || []);
            } else {
                // Student Data
                const openPosts = await api.student.getPosts();
                setPosts(openPosts);
                const myApps = await api.student.myApplications();
                setApplications(myApps);
                const myLoads = await api.student.myWorkloads();
                setWorkloads(myLoads);
                const myMoney = await api.student.myScholarships();
                setScholarships(myMoney);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };
    fetchData();
  }, [user]);

  // Derived Role
  const currentRole = (user?.name === 'Admin' || user?.studentNo === 'admin' || user?.studentNo.startsWith('ADMIN')) ? UserRole.ADMIN : UserRole.STUDENT;

  // --- Handlers ---

  const handleLoginSuccess = (profile: Student) => {
    setUser(profile);
    setView('dashboard');
  };

  const handleLogout = async () => {
    try {
        await api.auth.logout();
    } catch(e) {}
    setUser(null);
  };

  const handleOpenApply = (post: Post) => {
    if (user?.hasJob) {
      alert("您当前已有工作岗位，无法申请新岗位 (Limit: 1 Job)");
      return;
    }
    setSelectedItem(post);
    setActiveModal('apply');
  };

  const submitApplication = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reason = formData.get('reason') as string;
    const hasCommunicated = formData.get('hasCommunicated') === 'on';
    
    if (selectedItem) {
      try {
          await api.student.createApplication({
              position_id: selectedItem.id,
              apply_reason: reason,
              has_communicated: hasCommunicated
          });
          alert("申请提交成功！");
          setActiveModal(null);
          // Refresh
          const myApps = await api.student.myApplications();
          setApplications(myApps);
      } catch (err: any) {
          alert(`申请失败: ${err.message}`);
      }
    }
  };

  const handleOpenReview = (app: Application) => {
    setSelectedItem(app);
    setActiveModal('review');
  };

  const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const action = (e.nativeEvent as any).submitter.value; // 'admit' or 'reject'
    const note = (e.currentTarget.elements.namedItem('note') as HTMLInputElement).value;

    try {
        if (action === 'admit') {
             await api.admin.approveApplication(selectedItem.id, { status: 'approved', note });
        } else {
             // If there is a reject endpoint, use it. Otherwise assume generic update.
             // For now using approve endpoint logic or assume separate.
             await api.admin.approveApplication(selectedItem.id, { status: 'rejected', note });
        }
        alert("操作成功");
        setActiveModal(null);
        // Refresh? Admin applications list needs to be refetched. 
        // For now we don't have a specific "getAllApps" in the valid API list in api.ts, 
        // assuming we might have missed it or strictly following the prompt list.
        // We will just close modal.
    } catch (e: any) {
        alert("操作失败: " + e.message);
    }
  };

  const handleExport = (type: string) => {
    // Determine endpoint based on type
    let endpoint = '';
    let filename = `export_${type}_${reportYear}.csv`;

    switch(type) {
        case 'workload': endpoint = '/admin/workload-report/'; break;
        case 'scholarship': endpoint = '/admin/scholarship-report/'; break;
        // The following endpoints might need to be added to backend or matched to existing
        case 'students': endpoint = '/admin/students/'; break; // Hypothetical
        default: endpoint = `/admin/${type}-report/`; 
    }
    
    // Add filters
    const query = `year=${reportYear}&dept=${reportDept}`;
    // Use api download helper
    if (endpoint) {
        api.export.downloadCsv(`${endpoint}?${query}`, filename);
    } else {
        alert("此数据类型的导出接口暂未配置");
    }
  };

  // --- Renderers ---

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-50"><span className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></span></div>;
  if (!user) return <AuthView onLoginSuccess={handleLoginSuccess} />;

  const renderDashboard = () => {
    if (currentRole === UserRole.STUDENT) {
      const pendingCount = applications.filter(a => a.status === ApplicationStatus.PENDING).length;
      const approvedCount = applications.filter(a => a.status === ApplicationStatus.APPROVED).length;
      
      const statusData = [
        { name: '待审核', value: pendingCount },
        { name: '已录用', value: approvedCount },
        { name: '已驳回', value: applications.filter(a => a.status === ApplicationStatus.REJECTED).length },
      ];
      const COLORS = ['#fbbf24', '#34d399', '#f87171'];
      const currentJobWorkload = workloads.length > 0 ? workloads[0] : null;

      return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pt-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">欢迎回来，{user.name}</h2>
              <p className="text-sm text-slate-400 mt-1 font-medium">当前身份：{user.program} {user.enrollmentYear}级博士生</p>
            </div>
            {user.hasJob && (
               <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-xs font-bold border border-emerald-200 flex items-center gap-2">
               <Briefcase className="w-4 h-4" /> 您已在岗 (Has Job: Yes)
             </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="可选岗位" value={posts.filter(p => p.status === 'open').length} theme="blue" icon={Briefcase} onClick={() => setView('posts')} />
            <StatCard title="我的申请" value={applications.length} theme="purple" icon={FileText} onClick={() => setView('applications')} />
            <StatCard title="年度工作量" value={currentJobWorkload ? `${currentJobWorkload.totalHours}h` : '0h'} theme="orange" icon={Clock} onClick={() => setView('scholarships')} />
            <StatCard title="奖学金 (本学年)" value={`¥${scholarships.reduce((sum, s) => sum + s.amount, 0)}`} theme="green" icon={Coins} onClick={() => setView('scholarships')} />
          </div>
          {/* Charts area simplified for real data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-72">
               <h3 className="text-base font-bold text-slate-700 mb-2">申请状态分布</h3>
               <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                       {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                     </Pie>
                     <Tooltip />
                     <Legend />
                   </PieChart>
               </ResponsiveContainer>
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
          <StatCard title="岗位管理" value={posts.length} theme="blue" icon={Briefcase} onClick={() => setView('posts')} />
          <StatCard title="奖学金发放" value={`¥${scholarships.reduce((sum, s) => sum + Number(s.amount), 0)}`} theme="green" icon={Coins} onClick={() => setView('scholarships')} />
          <StatCard title="待核验" value="-" theme="indigo" icon={UserCheck} onClick={() => setView('users')} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="font-bold text-slate-700 mb-4">快捷操作区</h3>
           <div className="flex gap-4">
             <button onClick={() => setView('posts')} className="flex-1 bg-blue-50 p-4 rounded-xl text-blue-700 font-bold">岗位管理</button>
             <button onClick={() => setView('reports')} className="flex-1 bg-emerald-50 p-4 rounded-xl text-emerald-700 font-bold">报表与导出</button>
           </div>
        </div>
      </div>
    );
  };

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
           <div key={post.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all">
              <div className="flex justify-between mb-4">
                <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold border border-blue-100">{post.type}</span>
                <span className="text-xs text-slate-400">{post.year}年度</span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">{post.title}</h3>
              <p className="text-sm text-slate-500 mb-2 line-clamp-2">{post.description}</p>
              <div className="flex gap-2 text-xs mb-4">
                 <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded">定额工时: {post.workload}h</span>
              </div>
              {currentRole === UserRole.STUDENT && post.status === 'open' && (
                <button 
                  onClick={() => handleOpenApply(post)} 
                  disabled={user.hasJob}
                  className={`w-full mt-4 py-2 rounded-lg text-sm font-semibold transition-colors ${user.hasJob ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white'}`}
                >
                  {user.hasJob ? '已在岗 (无法申请)' : '申请岗位'}
                </button>
              )}
           </div>
         ))}
       </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <h2 className="text-2xl font-bold text-slate-800">统计报表与数据导出</h2>
         {/* Filters */}
         <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
           <Filter className="w-4 h-4 text-slate-400" />
           <select value={reportYear} onChange={(e) => setReportYear(Number(e.target.value))} className="text-sm border-none bg-transparent">
             <option value={2023}>2023-2024</option>
             <option value={2024}>2024-2025</option>
           </select>
           <select value={reportDept} onChange={(e) => setReportDept(e.target.value)} className="text-sm border-none bg-transparent">
             <option value="all">所有部门</option>
             {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
           </select>
         </div>
      </div>
      
      {/* CSV Exports */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Download className="w-5 h-5"/> 数据导出中心 (CSV)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { id: 'workload', label: '工作量报表', icon: Clock, color: 'orange' },
             { id: 'scholarship', label: '奖学金报表', icon: Coins, color: 'emerald' },
             { id: 'positions', label: '岗位列表', icon: Briefcase, color: 'blue' },
             { id: 'students', label: '学生名册', icon: Users, color: 'indigo' },
           ].map((item) => (
             <button key={item.id} onClick={() => handleExport(item.id)} className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all">
               <item.icon className={`w-6 h-6 text-${item.color}-500 mb-2`} />
               <span className="font-bold text-slate-700 text-sm">{item.label}</span>
             </button>
           ))}
        </div>
      </div>

      {/* Render Charts if data available */}
      {workloads.length > 0 && (
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96">
            <h3 className="font-bold text-slate-700 mb-4">工作量统计预览</h3>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={workloads.slice(0, 10)}>
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis dataKey="studentName" />
                 <YAxis />
                 <Tooltip />
                 <Bar dataKey="totalHours" fill="#3b82f6" name="工时" />
               </BarChart>
            </ResponsiveContainer>
         </div>
      )}
    </div>
  );

  const renderWorkloadsScholarships = () => (
      <div className="space-y-6 pt-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">工作量与奖学金</h2>
            <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                <button onClick={() => setScholarshipTab('workload')} className={`px-4 py-2 text-xs font-bold rounded ${scholarshipTab === 'workload' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>工作量</button>
                <button onClick={() => setScholarshipTab('history')} className={`px-4 py-2 text-xs font-bold rounded ${scholarshipTab === 'history' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>奖学金</button>
            </div>
          </div>

          {scholarshipTab === 'workload' ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="min-w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500">
                          <tr><th className="px-6 py-4">学生</th><th className="px-6 py-4">岗位</th><th className="px-6 py-4">工时</th><th className="px-6 py-4">状态</th></tr>
                      </thead>
                      <tbody>
                          {workloads.map(w => (
                              <tr key={w.id} className="border-t border-slate-100">
                                  <td className="px-6 py-4 font-bold">{w.studentName}</td>
                                  <td className="px-6 py-4">{w.postTitle || '-'}</td>
                                  <td className="px-6 py-4 font-mono">{w.totalHours} h</td>
                                  <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs">{w.status}</span></td>
                              </tr>
                          ))}
                          {workloads.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">暂无数据</td></tr>}
                      </tbody>
                  </table>
              </div>
          ) : (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="min-w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500">
                          <tr><th className="px-6 py-4">日期</th><th className="px-6 py-4">类型</th><th className="px-6 py-4">金额</th><th className="px-6 py-4">备注</th></tr>
                      </thead>
                      <tbody>
                          {scholarships.map(s => (
                              <tr key={s.id} className="border-t border-slate-100">
                                  <td className="px-6 py-4 font-mono text-slate-500">{s.date}</td>
                                  <td className="px-6 py-4">{s.type}</td>
                                  <td className="px-6 py-4 font-bold text-emerald-600">¥{s.amount}</td>
                                  <td className="px-6 py-4 text-slate-600">{s.reason}</td>
                              </tr>
                          ))}
                          {scholarships.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">暂无数据</td></tr>}
                      </tbody>
                  </table>
             </div>
          )}
      </div>
  );

  const renderApplyModal = () => (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">申请岗位：{selectedItem?.title}</h3>
          <button onClick={() => {setActiveModal(null); setSelectedItem(null);}}><X className="w-5 h-5 text-slate-400"/></button>
        </div>
        <form onSubmit={submitApplication} className="p-6 overflow-y-auto">
           <div className="mb-4">
             <label className="block text-xs font-semibold text-slate-500 mb-1">申请理由</label>
             <textarea name="reason" rows={4} className="w-full border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-blue-500 transition-colors" required></textarea>
           </div>
           <div className="mb-4 flex items-center gap-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
             <input type="checkbox" name="hasCommunicated" id="hasCommunicated" className="w-4 h-4 text-blue-600" />
             <label htmlFor="hasCommunicated" className="text-xs font-semibold text-blue-800 cursor-pointer">我已提前与岗位负责人沟通</label>
           </div>
           <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold shadow-lg shadow-slate-900/10 hover:bg-slate-800">提交申请</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 relative z-30 shadow-xl border-r border-slate-800/50">
        <div className="h-16 flex items-center px-6 border-b border-slate-800/50">
           <span className="font-bold text-white tracking-wider">PHD MANAGER</span>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: '工作台' },
            { id: 'posts', icon: Briefcase, label: currentRole === UserRole.ADMIN ? '岗位管理' : '岗位大厅' },
            ...(currentRole === UserRole.STUDENT ? [
              { id: 'applications', icon: FileText, label: '我的申请' },
              { id: 'scholarships', icon: Coins, label: '工作量与奖学金' }
            ] : [
              { id: 'reports', icon: FileSpreadsheet, label: '报表与导出' },
              { id: 'users', icon: Users, label: '用户核验' },
              { id: 'docs', icon: Database, label: '系统设计' }
            ])
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id as ViewState)} className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === item.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <TopBar userRole={currentRole} userName={user.name} onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} onLogout={handleLogout} onProfileClick={() => setView('profile')} />
        <main className="flex-1 overflow-auto px-4 md:px-8 pb-10 custom-scrollbar">
           {view === 'dashboard' ? renderDashboard() : 
            view === 'posts' ? renderPosts() : 
            view === 'reports' ? renderReports() :
            view === 'scholarships' ? renderWorkloadsScholarships() :
            view === 'docs' ? <div className="pt-6 h-full"><SqlDocs /></div> :
            <div className="pt-10 text-center text-slate-400">Module under construction</div>}
        </main>
        
        {/* Footer Status Bar */}
        <div className="bg-white border-t border-slate-200 px-4 py-1 text-[10px] flex justify-between items-center text-slate-400">
           <span>Ph.D Scholarship System v3.0</span>
           <div className="flex items-center gap-2">
             {isOffline ? (
               <span className="flex items-center gap-1 text-amber-500 font-bold"><WifiOff className="w-3 h-3"/> DEMO MODE (Backend Offline)</span>
             ) : (
               <span className="flex items-center gap-1 text-emerald-500 font-bold"><Wifi className="w-3 h-3"/> CONNECTED: 127.0.0.1:8000</span>
             )}
           </div>
        </div>
      </div>

      {activeModal === 'apply' && renderApplyModal()}
    </div>
  );
};

export default App;
