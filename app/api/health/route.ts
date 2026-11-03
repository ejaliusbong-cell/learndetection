import { NextResponse } from 'next/server';
import { memoryStore } from '@/lib/memoryStore';
import { isSupabaseReady } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const telemetry = memoryStore.getTelemetry();

  return NextResponse.json({
    status: 'ONLINE',
    service: 'BMKG Real-Time Early Warning & Seismic API',
    uptimeSeconds: Math.floor(telemetry.serverUptimeSec),
    supabaseStatus: isSupabaseReady ? 'CONNECTED' : 'LOCAL_IN_MEMORY_MODE',
    telemetry,
    timestamp: new Date().toISOString(),
  });
}
