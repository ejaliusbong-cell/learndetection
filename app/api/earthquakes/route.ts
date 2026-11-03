import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/memoryStore';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { NormalizedEarthquake } from '@/lib/bmkg';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'ALL';
    const minMagnitude = searchParams.get('minMagnitude')
      ? parseFloat(searchParams.get('minMagnitude')!)
      : undefined;
    const limit = parseInt(searchParams.get('limit') || '25', 10);

    const supabase = getSupabaseAdminClient();

    if (supabase) {
      let query = supabase
        .from('earthquakes')
        .select('*')
        .order('event_time', { ascending: false })
        .limit(limit);

      if (category !== 'ALL') {
        query = query.eq('category', category);
      }
      if (minMagnitude !== undefined) {
        query = query.gte('magnitude', minMagnitude);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        const formatted: NormalizedEarthquake[] = data.map(item => ({
          id: item.id,
          dateTime: item.event_time,
          dateStr: item.date_str,
          timeStr: item.time_str,
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
          coordinates: item.coordinates_str,
          magnitude: Number(item.magnitude),
          depthKm: Number(item.depth_km),
          region: item.region,
          potency: item.potency,
          feltMmi: item.felt_mmi || undefined,
          shakemapUrl: item.shakemap_url || undefined,
          category: item.category as 'LATEST' | 'M5+' | 'FELT',
          isSimulation: item.is_simulation,
        }));

        // Prepend active simulation if applicable
        const sim = memoryStore.getSimulationState();
        if (sim.isActive && sim.simulatedEarthquake) {
          formatted.unshift(sim.simulatedEarthquake);
        }

        return NextResponse.json({
          success: true,
          source: 'SUPABASE_DB',
          total: formatted.length,
          data: formatted,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // In-memory store fallback
    const items = memoryStore.getEarthquakes({
      category: category !== 'ALL' ? category : undefined,
      minMagnitude,
    });

    return NextResponse.json({
      success: true,
      source: 'IN_MEMORY_STORE',
      total: items.length,
      data: items.slice(0, limit),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
