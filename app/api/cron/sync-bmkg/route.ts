import { NextRequest, NextResponse } from 'next/server';
import { fetchLatestBMKG, fetchM5PlusBMKG, fetchFeltBMKG, NormalizedEarthquake } from '@/lib/bmkg';
import { memoryStore } from '@/lib/memoryStore';
import { getSupabaseAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

async function performSync() {
  const startTime = Date.now();
  let totalSynced = 0;
  const errors: string[] = [];

  // 1. Fetch from BMKG endpoints concurrently
  const [latest, m5Plus, felt] = await Promise.all([
    fetchLatestBMKG(),
    fetchM5PlusBMKG(),
    fetchFeltBMKG(),
  ]);

  const allItems: NormalizedEarthquake[] = [];
  if (latest) allItems.push(latest);
  allItems.push(...m5Plus);
  allItems.push(...felt);

  // Save to in-memory store
  if (latest) memoryStore.setLatest(latest);
  memoryStore.upsertMany(allItems);
  memoryStore.recordSync(allItems.length);
  totalSynced += allItems.length;

  // 2. Persist to Supabase if configured
  const supabase = getSupabaseAdminClient();
  let dbInserted = 0;

  if (supabase && allItems.length > 0) {
    try {
      const records = allItems.map(item => ({
        id: item.id,
        bmkg_id: item.id,
        event_time: item.dateTime,
        date_str: item.dateStr,
        time_str: item.timeStr,
        latitude: item.latitude,
        longitude: item.longitude,
        coordinates_str: item.coordinates,
        magnitude: item.magnitude,
        depth_km: item.depthKm,
        region: item.region,
        potency: item.potency,
        felt_mmi: item.feltMmi || null,
        shakemap_url: item.shakemapUrl || null,
        category: item.category,
        is_simulation: false,
      }));

      const { data, error } = await supabase
        .from('earthquakes')
        .upsert(records, { onConflict: 'bmkg_id' })
        .select();

      if (error) {
        errors.push(`Supabase upsert error: ${error.message}`);
      } else {
        dbInserted = data?.length || records.length;
      }

      // Record telemetry
      await supabase.from('sync_telemetry').insert({
        sync_source: 'BMKG_OFFICIAL_API',
        status: errors.length === 0 ? 'SUCCESS' : 'PARTIAL',
        items_synced: dbInserted,
        response_time_ms: Date.now() - startTime,
        error_message: errors.join('; ') || null,
      });
    } catch (e: any) {
      errors.push(`Database connection exception: ${e.message}`);
    }
  }

  const durationMs = Date.now() - startTime;

  return {
    success: errors.length === 0,
    syncedItems: totalSynced,
    dbInserted,
    durationMs,
    latestEvent: latest?.region,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export async function GET(req: NextRequest) {
  const result = await performSync();
  return NextResponse.json({
    message: 'Sinkronisasi data BMKG selesai',
    ...result,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  // Check authorization header or cron secret
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Check url search params as secondary
    const url = new URL(req.url);
    if (url.searchParams.get('key') !== cronSecret) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid cron key' },
        { status: 401 }
      );
    }
  }

  const result = await performSync();
  return NextResponse.json({
    message: 'Sinkronisasi otomatis cron BMKG berhasil diproses',
    ...result,
    timestamp: new Date().toISOString(),
  });
}
