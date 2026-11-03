import pg from 'pg';
import { ENV } from './env.js';

const { Pool } = pg;

export interface DBClient {
  query: (text: string, params?: any[]) => Promise<{ rows: any[]; rowCount: number }>;
  isLiveDB: boolean;
}

// In-Memory store fallback
class InMemoryDatabase {
  private profiles: Map<string, any> = new Map();
  private sessions: Map<string, any> = new Map();
  private expressionResults: Map<string, any> = new Map();
  private preferences: Map<string, any> = new Map();
  private consents: Map<string, any> = new Map();

  constructor() {
    // Seed initial demo profile
    const defaultId = '11111111-1111-1111-1111-111111111111';
    this.profiles.set('demo-google-user-01', {
      id: defaultId,
      supabase_user_id: 'demo-google-user-01',
      full_name: 'Dr. Jane Doe',
      email: 'jane.doe@example.com',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Seed sample session
    const sessionId = '22222222-2222-2222-2222-222222222222';
    this.sessions.set(sessionId, {
      id: sessionId,
      user_id: defaultId,
      session_started_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      session_ended_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      dominant_expression: 'Happy',
      average_confidence: 88.5,
      total_frames_analyzed: 180,
      expression_distribution: {
        Happy: 65,
        Neutral: 20,
        Surprised: 10,
        Sad: 3,
        Angry: 2,
        Fearful: 0,
        Disgusted: 0,
      },
      notes: 'Initial test session',
      created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    });
  }

  async query(text: string, params: any[] = []): Promise<{ rows: any[]; rowCount: number }> {
    const q = text.toLowerCase().trim();

    // 1. SELECT from profiles
    if (q.includes('from public.profiles') || q.includes('from profiles')) {
      if (q.includes('where supabase_user_id = $1') || q.includes('where supabase_user_id=$1')) {
        const val = this.profiles.get(params[0]);
        return { rows: val ? [val] : [], rowCount: val ? 1 : 0 };
      }
      if (q.includes('where id = $1')) {
        for (const p of this.profiles.values()) {
          if (p.id === params[0]) return { rows: [p], rowCount: 1 };
        }
        return { rows: [], rowCount: 0 };
      }
    }

    // 2. INSERT into profiles
    if (q.includes('insert into public.profiles') || q.includes('insert into profiles')) {
      const id = params[0] || crypto.randomUUID();
      const newProf = {
        id,
        supabase_user_id: params[1],
        full_name: params[2],
        email: params[3],
        avatar_url: params[4],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      this.profiles.set(params[1], newProf);
      return { rows: [newProf], rowCount: 1 };
    }

    // 3. SELECT from analysis_sessions
    if (q.includes('from public.analysis_sessions') || q.includes('from analysis_sessions')) {
      if (q.includes('where id = $1 and user_id = $2')) {
        const s = this.sessions.get(params[0]);
        if (s && s.user_id === params[1]) {
          return { rows: [s], rowCount: 1 };
        }
        return { rows: [], rowCount: 0 };
      }
      if (q.includes('where user_id = $1')) {
        const userSessions = Array.from(this.sessions.values())
          .filter(s => s.user_id === params[0])
          .sort((a, b) => new Date(b.session_started_at).getTime() - new Date(a.session_started_at).getTime());
        return { rows: userSessions, rowCount: userSessions.length };
      }
    }

    // 4. INSERT into analysis_sessions
    if (q.includes('insert into public.analysis_sessions') || q.includes('insert into analysis_sessions')) {
      const id = crypto.randomUUID();
      const newSession = {
        id,
        user_id: params[0],
        session_started_at: params[1],
        session_ended_at: params[2],
        dominant_expression: params[3],
        average_confidence: params[4],
        total_frames_analyzed: params[5],
        expression_distribution: typeof params[6] === 'string' ? JSON.parse(params[6]) : params[6],
        notes: params[7] || null,
        created_at: new Date().toISOString(),
      };
      this.sessions.set(id, newSession);
      return { rows: [newSession], rowCount: 1 };
    }

    // 5. DELETE from analysis_sessions
    if (q.includes('delete from public.analysis_sessions') || q.includes('delete from analysis_sessions')) {
      const s = this.sessions.get(params[0]);
      if (s && s.user_id === params[1]) {
        this.sessions.delete(params[0]);
        return { rows: [s], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }

    // 6. SELECT / UPSERT user_preferences
    if (q.includes('from public.user_preferences') || q.includes('from user_preferences')) {
      const pref = this.preferences.get(params[0]) || {
        user_id: params[0],
        camera_preference: { preferredDeviceId: null, mirrorMode: true, showLandmarks: true },
        analysis_preferences: { smoothingFactor: 0.35, inferenceFps: 30, minConfidence: 0.4 },
      };
      return { rows: [pref], rowCount: 1 };
    }

    if (q.includes('insert into public.user_preferences') || q.includes('insert into user_preferences')) {
      const pref = {
        user_id: params[0],
        camera_preference: typeof params[1] === 'string' ? JSON.parse(params[1]) : params[1],
        analysis_preferences: typeof params[2] === 'string' ? JSON.parse(params[2]) : params[2],
        updated_at: new Date().toISOString(),
      };
      this.preferences.set(params[0], pref);
      return { rows: [pref], rowCount: 1 };
    }

    // 7. INSERT consent
    if (q.includes('insert into public.consent_records') || q.includes('insert into consent_records')) {
      const rec = {
        id: crypto.randomUUID(),
        user_id: params[0],
        consent_type: params[1],
        consent_status: params[2],
        ip_hash: params[3] || null,
        consented_at: new Date().toISOString(),
      };
      this.consents.set(rec.id, rec);
      return { rows: [rec], rowCount: 1 };
    }

    return { rows: [], rowCount: 0 };
  }
}

// Setup connection pool
let pool: pg.Pool | null = null;
let isLiveDBConnected = false;
const inMemoryFallback = new InMemoryDatabase();

if (ENV.DATABASE_URL || (ENV.PGHOST && ENV.PGPASSWORD)) {
  try {
    pool = new Pool({
      connectionString: ENV.DATABASE_URL || undefined,
      host: ENV.PGHOST,
      port: ENV.PGPORT,
      database: ENV.PGDATABASE,
      user: ENV.PGUSER,
      password: ENV.PGPASSWORD,
      ssl: { rejectUnauthorized: false },
      max: 15,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 4000,
    });

    pool.connect((err, client, release) => {
      if (err) {
        console.warn(`[Database Notice]: PostgreSQL connection failed (${err.message}). Using high-speed resilient in-memory store adapter.`);
        isLiveDBConnected = false;
      } else {
        console.log('✅ [Database]: Successfully connected to PostgreSQL (Google Cloud SQL / Supabase).');
        isLiveDBConnected = true;
        release();
      }
    });
  } catch (err: any) {
    console.warn(`[Database Notice]: Pool initialization exception: ${err.message}. Using in-memory fallback.`);
  }
} else {
  console.log('ℹ️ [Database]: No direct PG credentials provided. Running in resilient in-memory store mode.');
}

export const db: DBClient = {
  async query(text: string, params: any[] = []) {
    if (pool && isLiveDBConnected) {
      try {
        const res = await pool.query(text, params);
        return { rows: res.rows, rowCount: res.rowCount || 0 };
      } catch (e: any) {
        console.warn(`[Database query fallback]: ${e.message}`);
        return inMemoryFallback.query(text, params);
      }
    }
    return inMemoryFallback.query(text, params);
  },
  get isLiveDB() {
    return isLiveDBConnected;
  },
};
