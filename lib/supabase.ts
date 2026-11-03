import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fvpbaxlbdiedghesetba.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const jwtSecret = process.env.SUPABASE_JWT_SECRET || '';

// Generates a JWT signed with the Supabase JWT Secret if service_role key is missing
function generateSignedJwt(role: 'anon' | 'service_role'): string {
  if (!jwtSecret) return '';
  try {
    const crypto = require('crypto');
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({
        iss: 'supabase',
        ref: 'fvpbaxlbdiedghesetba',
        role,
        iat: Math.floor(Date.now() / 1000) - 60,
        exp: Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 3600,
      })
    ).toString('base64url');

    const signature = crypto
      .createHmac('sha256', jwtSecret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    return `${header}.${payload}.${signature}`;
  } catch {
    return '';
  }
}

const activeAnonKey = supabaseAnonKey || generateSignedJwt('anon');
const activeServiceKey = supabaseServiceKey || supabaseAnonKey || generateSignedJwt('service_role');

export const isSupabaseReady = Boolean(
  supabaseUrl &&
  !supabaseUrl.includes('your-project') &&
  (Boolean(supabaseAnonKey) || Boolean(supabaseServiceKey) || Boolean(jwtSecret))
);

// Client-side singleton
let browserClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseReady || !activeAnonKey) return null;
  if (browserClient) return browserClient;

  try {
    browserClient = createClient(supabaseUrl, activeAnonKey, {
      auth: { persistSession: false },
    });
    return browserClient;
  } catch {
    return null;
  }
}

// Server-side admin client (bypasses RLS)
let serverClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!isSupabaseReady || !activeServiceKey) return null;
  if (serverClient) return serverClient;

  try {
    serverClient = createClient(supabaseUrl, activeServiceKey, {
      auth: { persistSession: false },
    });
    return serverClient;
  } catch {
    return null;
  }
}
