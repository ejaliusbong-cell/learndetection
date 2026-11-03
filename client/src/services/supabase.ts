import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fvpbaxlbdiedghesetba.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  localStorage.removeItem('facescan_demo_session');
  if (error) throw error;
}

export async function getAccessToken(): Promise<string | null> {
  // Check demo session first
  const demo = localStorage.getItem('facescan_demo_session');
  if (demo) {
    try {
      const parsed = JSON.parse(demo);
      return parsed.token;
    } catch {}
  }

  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}
