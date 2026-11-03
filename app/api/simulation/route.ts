import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/memoryStore';
import { getSupabaseAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const state = memoryStore.getSimulationState();
  return NextResponse.json({
    success: true,
    data: state,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const scenario = body.scenario || 'MEGATHRUST_SUNDA';

    const newState = memoryStore.activateSimulation(scenario, body.customData);

    // Sync state to Supabase if active
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      await supabase.from('simulation_state').upsert({
        id: 'active_scenario',
        is_active: true,
        scenario_name: newState.scenarioName,
        simulated_earthquake: newState.simulatedEarthquake,
        activated_at: newState.activatedAt,
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Skenario simulasi '${newState.scenarioName}' berhasil diaktifkan!`,
      data: newState,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const resetState = memoryStore.deactivateSimulation();

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    await supabase.from('simulation_state').upsert({
      id: 'active_scenario',
      is_active: false,
      scenario_name: 'Normal Real-Time BMKG',
      simulated_earthquake: null,
      activated_at: null,
      updated_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    success: true,
    message: 'Mode simulasi dinonaktifkan. Sistem kembali ke data real-time BMKG.',
    data: resetState,
    timestamp: new Date().toISOString(),
  });
}
