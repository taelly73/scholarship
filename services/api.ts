
import { Student, Post, Application, WorkloadSummary, ScholarshipRecord, Department, PublicNotice } from '../types';
import { 
  MOCK_STUDENTS, 
  MOCK_POSTS, 
  MOCK_APPLICATIONS, 
  MOCK_WORKLOAD_SUMMARIES, 
  MOCK_SCHOLARSHIP_RECORDS,
  MOCK_DEPARTMENTS,
  MOCK_PUBLIC_NOTICES
} from '../constants';

// Update to match the Python server output exactly
const BASE_URL = 'http://127.0.0.1:8000/api';

// Helper to get CSRF token from cookies (Standard Django)
function getCookie(name: string): string | null {
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
  }
  return null;
}

// Helper to find mock data based on endpoint
function getMockResponse(endpoint: string, options: RequestInit): any {
  console.warn(`[MockFallback] Backend unreachable. Serving mock data for: ${endpoint}`);
  
  if (endpoint.includes('/student/login/')) return { success: true };
  if (endpoint.includes('/student/register/')) return { success: true };
  if (endpoint.includes('/student/logout/')) return { success: true };
  
  // Return the first student as the logged-in profile
  if (endpoint.includes('/student/profile/')) return MOCK_STUDENTS[0];
  
  if (endpoint.includes('/publicity/')) return MOCK_PUBLIC_NOTICES;
  if (endpoint.includes('/departments/')) return MOCK_DEPARTMENTS;
  
  if (endpoint.includes('/positions/')) return MOCK_POSTS;
  if (endpoint.includes('/applications/my/')) return MOCK_APPLICATIONS;
  if (endpoint.includes('/workloads/my/')) return MOCK_WORKLOAD_SUMMARIES;
  if (endpoint.includes('/scholarships/my/')) return MOCK_SCHOLARSHIP_RECORDS;
  
  // Admin Routes
  if (endpoint.includes('/admin/departments/')) return MOCK_DEPARTMENTS;
  if (endpoint.includes('/admin/positions/')) return MOCK_POSTS;
  if (endpoint.includes('/admin/workload-report/')) return { results: MOCK_WORKLOAD_SUMMARIES };
  if (endpoint.includes('/admin/scholarship-report/')) return { results: MOCK_SCHOLARSHIP_RECORDS };
  
  return {};
}

// Generic Request Wrapper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers as any,
  };

  // Add CSRF Token for mutation requests
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')) {
    const csrfToken = getCookie('csrftoken');
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Important for Django Session Auth
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API Error: ${response.statusText}`);
    }

    return response.json();
  } catch (error: any) {
    // Check if it's a network error (Failed to fetch) and fallback to mock
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      const mockData = getMockResponse(endpoint, options);
      if (mockData) {
        // Indicate that we are using mock data
        (window as any).__USING_MOCK_DATA__ = true;
        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockData as T;
      }
    }
    throw error;
  }
}

// API Service Object
export const api = {
  // Check if backend is reachable
  checkHealth: async () => {
    try {
      // Try to fetch departments as a lightweight ping
      // We explicitly check fetch status to avoid the mock fallback mechanism here
      const response = await fetch(`${BASE_URL}/departments/`, { method: 'HEAD' }).catch(() => null);
      return response ? true : false; 
    } catch {
      return false;
    }
  },

  auth: {
    login: (data: any) => request<any>('/student/login/', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: any) => request<any>('/student/register/', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => request<any>('/student/logout/', { method: 'POST' }),
    profile: () => request<Student>('/student/profile/'),
  },
  
  public: {
    getNotices: () => request<PublicNotice[]>('/publicity/'),
    getNoticeDetail: (id: number) => request<PublicNotice>(`/publicity/${id}/`),
    getDepartments: () => request<Department[]>('/departments/'),
  },

  student: {
    getPosts: () => request<Post[]>('/positions/'),
    getPostDetail: (id: number) => request<Post>(`/positions/${id}/`),
    createApplication: (data: any) => request<Application>('/applications/create/', { method: 'POST', body: JSON.stringify(data) }),
    myApplications: () => request<Application[]>('/applications/my/'),
    myWorkloads: () => request<WorkloadSummary[]>('/workloads/my/'),
    myScholarships: () => request<ScholarshipRecord[]>('/scholarships/my/'),
  },

  admin: {
    getDepartments: () => request<Department[]>('/admin/departments/'),
    getPositions: () => request<Post[]>('/admin/positions/'),
    getWorkloadReport: (params?: string) => request<any>(`/admin/workload-report/${params ? '?' + params : ''}`),
    getScholarshipReport: (params?: string) => request<any>(`/admin/scholarship-report/${params ? '?' + params : ''}`),
    approveApplication: (id: number, data: any) => request<any>(`/admin/applications/${id}/approve/`, { method: 'POST', body: JSON.stringify(data) }),
    verifyStudent: (id: number) => request<any>(`/admin/students/${id}/verify/`, { method: 'POST' }),
  },
  
  export: {
    downloadCsv: (endpoint: string, filename: string) => {
        try {
            const url = `${BASE_URL}${endpoint}?format=csv`;
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            console.error("Export failed", e);
            alert("Export simulated (Backend unreachable)");
        }
    }
  }
};
