import { db } from '../config/db.js';

export interface CreateSessionDTO {
  userId: string;
  sessionStartedAt: string;
  sessionEndedAt: string;
  dominantExpression: string;
  averageConfidence: number;
  totalFramesAnalyzed: number;
  expressionDistribution: Record<string, number>;
  notes?: string;
  expressionSamples?: Array<{
    expressionLabel: string;
    confidenceScore: number;
    recordedAt?: string;
  }>;
}

export class AnalysisService {
  static async createSession(data: CreateSessionDTO) {
    const sessionRes = await db.query(
      `INSERT INTO public.analysis_sessions (
         user_id, session_started_at, session_ended_at, dominant_expression,
         average_confidence, total_frames_analyzed, expression_distribution, notes
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.userId,
        data.sessionStartedAt,
        data.sessionEndedAt,
        data.dominantExpression,
        data.averageConfidence,
        data.totalFramesAnalyzed,
        typeof data.expressionDistribution === 'string'
          ? data.expressionDistribution
          : JSON.stringify(data.expressionDistribution),
        data.notes || null,
      ]
    );

    const session = sessionRes.rows[0];

    // Optionally insert sample snapshots if provided
    if (data.expressionSamples && data.expressionSamples.length > 0) {
      for (const sample of data.expressionSamples.slice(0, 50)) {
        await db.query(
          `INSERT INTO public.expression_results (
             session_id, expression_label, confidence_score, recorded_at
           ) VALUES ($1, $2, $3, $4)`,
          [
            session.id,
            sample.expressionLabel,
            sample.confidenceScore,
            sample.recordedAt || new Date().toISOString(),
          ]
        );
      }
    }

    return session;
  }

  static async getSessionsByUser(userId: string, limit: number = 20, offset: number = 0) {
    const res = await db.query(
      `SELECT * FROM public.analysis_sessions 
       WHERE user_id = $1 
       ORDER BY session_started_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return res.rows;
  }

  static async getSessionById(sessionId: string, userId: string) {
    const res = await db.query(
      `SELECT * FROM public.analysis_sessions 
       WHERE id = $1 AND user_id = $2`,
      [sessionId, userId]
    );
    return res.rows[0] || null;
  }

  static async deleteSession(sessionId: string, userId: string) {
    const res = await db.query(
      `DELETE FROM public.analysis_sessions 
       WHERE id = $1 AND user_id = $2 
       RETURNING id`,
      [sessionId, userId]
    );
    return res.rowCount > 0;
  }

  static async getUserStatistics(userId: string) {
    const sessions = await this.getSessionsByUser(userId, 100, 0);

    const totalSessions = sessions.length;
    let totalFrames = 0;
    let confidenceSum = 0;
    const dominantCount: Record<string, number> = {
      Happy: 0,
      Neutral: 0,
      Surprised: 0,
      Sad: 0,
      Angry: 0,
      Fearful: 0,
      Disgusted: 0,
    };

    sessions.forEach(s => {
      totalFrames += s.total_frames_analyzed || 0;
      confidenceSum += Number(s.average_confidence) || 0;
      if (s.dominant_expression && dominantCount[s.dominant_expression] !== undefined) {
        dominantCount[s.dominant_expression]++;
      } else if (s.dominant_expression) {
        dominantCount[s.dominant_expression] = (dominantCount[s.dominant_expression] || 0) + 1;
      }
    });

    const avgConfidence = totalSessions > 0 ? Math.round((confidenceSum / totalSessions) * 10) / 10 : 0;

    return {
      totalSessions,
      totalFrames,
      averageConfidence: avgConfidence,
      dominantDistribution: dominantCount,
      latestSession: sessions[0] || null,
    };
  }
}
