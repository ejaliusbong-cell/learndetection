import { db } from '../config/db.js';

export interface CreateProfileDTO {
  supabaseUserId: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
}

export class ProfileService {
  static async findOrCreateProfile(data: CreateProfileDTO) {
    // 1. Try finding existing
    const existing = await db.query(
      'SELECT id, supabase_user_id, full_name, email, avatar_url, created_at, updated_at FROM public.profiles WHERE supabase_user_id = $1',
      [data.supabaseUserId]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    // 2. Insert new profile
    const id = crypto.randomUUID();
    const created = await db.query(
      `INSERT INTO public.profiles (id, supabase_user_id, full_name, email, avatar_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, supabase_user_id, full_name, email, avatar_url, created_at, updated_at`,
      [id, data.supabaseUserId, data.fullName, data.email, data.avatarUrl || null]
    );

    return created.rows[0];
  }

  static async getProfileById(userId: string) {
    const res = await db.query(
      'SELECT id, supabase_user_id, full_name, email, avatar_url, created_at, updated_at FROM public.profiles WHERE id = $1',
      [userId]
    );
    return res.rows[0] || null;
  }

  static async updateProfile(userId: string, updates: { fullName?: string; avatarUrl?: string }) {
    const res = await db.query(
      `UPDATE public.profiles 
       SET full_name = COALESCE($2, full_name),
           avatar_url = COALESCE($3, avatar_url),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, supabase_user_id, full_name, email, avatar_url, updated_at`,
      [userId, updates.fullName || null, updates.avatarUrl || null]
    );
    return res.rows[0];
  }

  static async deleteUserData(userId: string) {
    await db.query('DELETE FROM public.analysis_sessions WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM public.user_preferences WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM public.consent_records WHERE user_id = $1', [userId]);
    const res = await db.query('DELETE FROM public.profiles WHERE id = $1', [userId]);
    return res.rowCount > 0;
  }
}
