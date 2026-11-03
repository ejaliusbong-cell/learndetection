import { getAccessToken } from './supabase';
import { AnalysisSessionRecord, UserStatistics, UserProfile } from '../types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  async getCurrentUser(): Promise<{ success: boolean; user: UserProfile }> {
    return request('/auth/me');
  },

  // Profile
  async getProfile(): Promise<{ success: boolean; data: UserProfile }> {
    return request('/profile');
  },

  async updateProfile(updates: { fullName?: string; avatarUrl?: string | null }) {
    return request('/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async purgeUserData() {
    return request('/profile/delete-data', {
      method: 'POST',
    });
  },

  // Analysis Sessions
  async saveAnalysisSession(payload: {
    sessionStartedAt: string;
    sessionEndedAt: string;
    dominantExpression: string;
    averageConfidence: number;
    totalFramesAnalyzed: number;
    expressionDistribution: Record<string, number>;
    notes?: string;
  }): Promise<{ success: boolean; data: AnalysisSessionRecord }> {
    return request('/analysis/sessions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getSessions(limit = 20, offset = 0): Promise<{ success: boolean; data: AnalysisSessionRecord[] }> {
    return request(`/analysis/sessions?limit=${limit}&offset=${offset}`);
  },

  async getSessionDetails(id: string): Promise<{ success: boolean; data: AnalysisSessionRecord }> {
    return request(`/analysis/sessions/${id}`);
  },

  async deleteSession(id: string): Promise<{ success: boolean }> {
    return request(`/analysis/sessions/${id}`, {
      method: 'DELETE',
    });
  },

  async getStatistics(): Promise<{ success: boolean; data: UserStatistics }> {
    return request('/analysis/stats');
  },

  // Preferences
  async getPreferences() {
    return request('/preferences');
  },

  async updatePreferences(prefs: { cameraPreference?: any; analysisPreferences?: any }) {
    return request('/preferences', {
      method: 'PATCH',
      body: JSON.stringify(prefs),
    });
  },

  // Consent
  async recordConsent(consentType: 'CAMERA_PROCESSING' | 'SESSION_STATS_STORAGE' | 'PRIVACY_POLICY', consentStatus = true) {
    return request('/consent', {
      method: 'POST',
      body: JSON.stringify({ consentType, consentStatus }),
    });
  },
};
