'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { SimulationAlertBanner } from '@/components/SimulationAlertBanner';
import { EarthquakeHero } from '@/components/EarthquakeHero';
import { EarthquakeMap } from '@/components/EarthquakeMap';
import { EarthquakeList } from '@/components/EarthquakeList';
import { SimulationModal } from '@/components/SimulationModal';
import { NormalizedEarthquake } from '@/lib/bmkg';
import { Database, ShieldCheck, Info } from 'lucide-react';

export default function DashboardPage() {
  const [latestEarthquake, setLatestEarthquake] = useState<NormalizedEarthquake | null>(null);
  const [earthquakes, setEarthquakes] = useState<NormalizedEarthquake[]>([]);
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(false);
  const [scenarioName, setScenarioName] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSimModalOpen, setIsSimModalOpen] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<string>('Memuat...');

  // Fetch latest data and seismic catalog
  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // 1. Fetch latest earthquake
      const resLatest = await fetch('/api/earthquakes/latest', { cache: 'no-store' });
      const dataLatest = await resLatest.json();
      if (dataLatest?.data) {
        setLatestEarthquake(dataLatest.data);
        setDataSource(dataLatest.source || 'BMKG_LIVE');
        if (dataLatest.simulation?.isActive) {
          setIsSimulationActive(true);
          setScenarioName(dataLatest.simulation.scenarioName);
        } else {
          setIsSimulationActive(false);
          setScenarioName('');
        }
      }

      // 2. Fetch catalog list
      const resList = await fetch('/api/earthquakes?limit=25', { cache: 'no-store' });
      const dataList = await resList.json();
      if (dataList?.data) {
        setEarthquakes(dataList.data);
      }
    } catch (e) {
      console.warn('Failed to load seismic data from API:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial load & 30-sec polling
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Activate simulation
  const handleActivateSimulation = async (
    scenario: 'MEGATHRUST_SUNDA' | 'TSUNAMI_MALUKU' | 'CUSTOM',
    customData?: any
  ) => {
    try {
      const res = await fetch('/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, customData }),
      });
      const result = await res.json();
      if (result.success) {
        setIsSimulationActive(true);
        setScenarioName(result.data.scenarioName);
        await loadData();
      }
    } catch (e) {
      console.error('Error activating simulation:', e);
    }
  };

  // Deactivate simulation
  const handleDeactivateSimulation = async () => {
    try {
      const res = await fetch('/api/simulation', { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setIsSimulationActive(false);
        setScenarioName('');
        await loadData();
      }
    } catch (e) {
      console.error('Error deactivating simulation:', e);
    }
  };

  // Trigger manual sync from BMKG
  const handleManualSync = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/cron/sync-bmkg');
      await loadData();
    } catch (e) {
      console.error('Sync failed:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1120] text-slate-100">
      {/* Navbar */}
      <Navbar
        onOpenSimulation={() => setIsSimModalOpen(true)}
        onRefresh={handleManualSync}
        isRefreshing={isRefreshing}
        isSimulationActive={isSimulationActive}
      />

      {/* Simulation / Tsunami Banner */}
      <SimulationAlertBanner
        isSimulationActive={isSimulationActive}
        scenarioName={scenarioName}
        earthquake={latestEarthquake}
        onDeactivate={handleDeactivateSimulation}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Source Badge Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-2xl">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            <span>Sumber Data Aktif: <strong className="text-white font-mono">{dataSource}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terhubung ke Ingestion Engine BMKG & Supabase</span>
          </div>
        </div>

        {/* Headline Gempa Terkini */}
        <EarthquakeHero earthquake={latestEarthquake} />

        {/* GIS Map & Catalog Grid */}
        <div className="space-y-6">
          <EarthquakeMap
            earthquakes={earthquakes}
            latestEarthquake={latestEarthquake}
          />
          <EarthquakeList earthquakes={earthquakes} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0f172a] py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">BMKG Seismik Dashboard</span>
            <span>•</span>
            <span>InaTEWS Tsunami Early Warning System</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Data bersumber dari Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)</span>
          </div>
        </div>
      </footer>

      {/* Simulation Scenario Modal */}
      <SimulationModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        isSimulationActive={isSimulationActive}
        onActivate={handleActivateSimulation}
        onDeactivate={handleDeactivateSimulation}
      />
    </div>
  );
}
