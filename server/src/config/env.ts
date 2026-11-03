import dotenv from 'dotenv';
import path from 'path';

// Load from .env or root .env.local
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  
  // Supabase Auth & JWT
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fvpbaxlbdiedghesetba.supabase.co',
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET || 'fKLL83cYh5I/bTFswwVqEgzW7ZrBTPa2nBWiDx6ekV2ukWYBxcrAHFJJpJlHk7fIbYwrxaVLztyHXZbdwGI8HQ==',
  
  // Database (Google Cloud SQL / Supabase PostgreSQL)
  DATABASE_URL: process.env.DATABASE_URL || '',
  PGHOST: process.env.PGHOST || 'db.fvpbaxlbdiedghesetba.supabase.co',
  PGPORT: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
  PGDATABASE: process.env.PGDATABASE || 'postgres',
  PGUSER: process.env.PGUSER || 'postgres',
  PGPASSWORD: process.env.PGPASSWORD || '',
};
