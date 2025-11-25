export * from './types';


/**
 * Centralized API client for Resume Tailor frontend.
 * Handles JWT Bearer authentication and provides helper methods.
 */

class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    });

    if (!response.ok) {
      let errorBody: any = {};
      try {
        errorBody = await response.json();
      } catch {}
      throw new ApiError(response.status, errorBody.detail || response.statusText, errorBody);
    }

    return response.json();
  }

  private async authRequest<T>(endpoint: string, token: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Auth
  async login(username: string, password: string) {
    return this.request<{ access_token: string; token_type: string; username: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async signup(username: string, password: string) {
    return this.request<{ access_token: string; token_type: string; username: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // Protected endpoints
  async getResume(token: string) {
    return this.authRequest<any>('/users/me/resume', token);
  }

  async updateResume(token: string, resume: any) {
    return this.authRequest<any>('/users/me/resume', token, {
      method: 'POST',
      body: JSON.stringify(resume),
    });
  }

  async tailorResume(token: string, jd: any) {
    return this.authRequest<any>('/users/me/tailor', token, {
      method: 'POST',
      body: JSON.stringify(jd),
    });
  }

  async parsePdf(token: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${this.baseURL}/users/me/parse-pdf`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorBody: any = {};
      try { errorBody = await response.json(); } catch {}
      throw new ApiError(response.status, errorBody.detail || 'PDF parsing failed', errorBody);
    }

    return response.json();
  }

  async generatePdf(resume: any): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/generate-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resume),
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'PDF generation failed');
    }

    return response.blob();
  }

  // History
  async getHistory(token: string) {
    return this.authRequest<any[]>('/history/', token);
  }

  async saveHistory(token: string, job_description: string, content: any) {
    return this.authRequest<any>('/history/', token, {
      method: 'POST',
      body: JSON.stringify({ job_description, content }),
    });
  }

  async getHistoryItem(token: string, id: number) {
    return this.authRequest<any>(`/history/${id}`, token);
  }
}

export class ApiError extends Error {
  public status: number;
  public details?: any;
  constructor(status: number, message: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const apiClient = new ApiClient();
