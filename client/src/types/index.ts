export type ExpressionCategory =
  | 'Happy'
  | 'Neutral'
  | 'Surprised'
  | 'Sad'
  | 'Angry'
  | 'Fearful'
  | 'Disgusted';

export interface ExpressionScore {
  category: ExpressionCategory;
  score: number; // 0 to 1
  percentage: number; // 0 to 100
}

export interface AnalysisFrameResult {
  dominantExpression: ExpressionCategory;
  dominantConfidence: number;
  scores: Record<ExpressionCategory, number>;
  landmarksCount: number;
  faceDetected: boolean;
  facesCount: number;
  fps: number;
  timestamp: number;
}

export interface UserProfile {
  id: string;
  supabaseUserId: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisSessionRecord {
  id: string;
  user_id: string;
  session_started_at: string;
  session_ended_at: string;
  dominant_expression: ExpressionCategory;
  average_confidence: number;
  total_frames_analyzed: number;
  expression_distribution: Record<ExpressionCategory, number>;
  notes?: string | null;
  created_at: string;
}

export interface UserStatistics {
  totalSessions: number;
  totalFrames: number;
  averageConfidence: number;
  dominantDistribution: Record<ExpressionCategory, number>;
  latestSession: AnalysisSessionRecord | null;
}
