import { NextResponse } from 'next/server';
import { memoryStore } from '@/lib/memoryStore';
import { fetchLatestBMKG } from '@/lib/bmkg';
import { getSupabaseAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Check if simulation is currently active
    const simState = memoryStore.getSimulationState();
    if (simState.isActive && simState.simulatedEarthquake) {
      return NextResponse.json({
        success: true,
        source: 'SIMULATION',
        data: simState.simulatedEarthquake,
        simulation: simState,
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Try fetching from Supabase database
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('earthquakes')
        .select('*')
        .order('event_time', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        return NextResponse.json({
          success: true,
          source: 'SUPABASE_DB',
          data: {
            id: data.id,
            dateTime: data.event_time,
            dateStr: data.date_str,
            timeStr: data.time_str,
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
            coordinates: data.coordinates_str,
            magnitude: Number(data.magnitude),
            depthKm: Number(data.depth_km),
            region: data.region,
            potency: data.potency,
            feltMmi: data.felt_mmi,
            shakemapUrl: data.shakemap_url,
            category: data.category,
          },
          timestamp: new Date().toISOString(),
        });
      }
    }

    // 3. Try fetching directly from BMKG API
    const liveBMKG = await fetchLatestBMKG();
    if (liveBMKG) {
      memoryStore.setLatest(liveBMKG);
      return NextResponse.json({
        success: true,
        source: 'BMKG_LIVE',
        data: liveBMKG,
        timestamp: new Date().toISOString(),
      });
    }

    // 4. In-memory fallback
    const fallback = memoryStore.getLatest();
    return NextResponse.json({
      success: true,
      source: 'IN_MEMORY_FALLBACK',
      data: fallback,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        data: memoryStore.getLatest(),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
