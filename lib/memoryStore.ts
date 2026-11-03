import { NormalizedEarthquake } from './bmkg';

// Fallback seed earthquakes representing Indonesian tectonic regions
const INITIAL_EARTHQUAKES: NormalizedEarthquake[] = [
  {
    id: 'bmkg-seed-01',
    dateTime: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    dateStr: '03 Nov 2026',
    timeStr: '22:45:10 WIB',
    latitude: -7.42,
    longitude: 106.91,
    coordinates: '-7.42, 106.91',
    magnitude: 5.6,
    depthKm: 24,
    region: '84 km BaratDaya KAB-SUKABUMI-JABAR',
    potency: 'Tidak berpotensi tsunami',
    feltMmi: 'III-IV Sukabumi, II-III Pelabuhan Ratu, II Bandung',
    shakemapUrl: 'https://data.bmkg.go.id/DataMKG/TEWS/20261103224510.mmi.jpg',
    category: 'LATEST',
  },
  {
    id: 'bmkg-seed-02',
    dateTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    dateStr: '03 Nov 2026',
    timeStr: '21:03:00 WIB',
    latitude: -0.89,
    longitude: 133.45,
    coordinates: '-0.89, 133.45',
    magnitude: 6.2,
    depthKm: 15,
    region: '78 km TimurLaut TAMBRAUW-PAPUABARAT',
    potency: 'Tidak berpotensi tsunami',
    feltMmi: 'IV Manokwari, III Sorong',
    category: 'M5+',
  },
  {
    id: 'bmkg-seed-03',
    dateTime: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    dateStr: '03 Nov 2026',
    timeStr: '19:15:32 WIB',
    latitude: 1.45,
    longitude: 126.88,
    coordinates: '1.45, 126.88',
    magnitude: 5.2,
    depthKm: 45,
    region: '122 km BaratLaut JAILOLO-MALUT',
    potency: 'Tidak berpotensi tsunami',
    feltMmi: 'II-III Ternate',
    category: 'FELT',
  },
  {
    id: 'bmkg-seed-04',
    dateTime: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    dateStr: '03 Nov 2026',
    timeStr: '16:12:05 WIB',
    latitude: -9.12,
    longitude: 113.82,
    coordinates: '-9.12, 113.82',
    magnitude: 5.1,
    depthKm: 10,
    region: '115 km BaratDaya JEMBER-JATIM',
    potency: 'Tidak berpotensi tsunami',
    category: 'M5+',
  },
  {
    id: 'bmkg-seed-05',
    dateTime: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    dateStr: '03 Nov 2026',
    timeStr: '13:08:44 WIB',
    latitude: 2.11,
    longitude: 97.23,
    coordinates: '2.11, 97.23',
    magnitude: 5.4,
    depthKm: 28,
    region: '43 km BaratDaya KAB-ACEHSINGKIL',
    potency: 'Tidak berpotensi tsunami',
    feltMmi: 'III Singkil, II Subulussalam',
    category: 'FELT',
  },
];

export interface SimulationState {
  isActive: boolean;
  scenarioName: string;
  simulatedEarthquake: NormalizedEarthquake | null;
  activatedAt: string | null;
}

// In-memory global store
class MemoryStore {
  private earthquakes: NormalizedEarthquake[] = [...INITIAL_EARTHQUAKES];
  private latestEarthquake: NormalizedEarthquake = INITIAL_EARTHQUAKES[0];
  private simulation: SimulationState = {
    isActive: false,
    scenarioName: 'Normal Real-Time BMKG',
    simulatedEarthquake: null,
    activatedAt: null,
  };
  private lastSyncTime: string = new Date().toISOString();
  private syncCount: number = 0;

  getEarthquakes(filter?: { category?: string; minMagnitude?: number }): NormalizedEarthquake[] {
    let list = this.simulation.isActive && this.simulation.simulatedEarthquake
      ? [this.simulation.simulatedEarthquake, ...this.earthquakes]
      : this.earthquakes;

    if (filter?.category && filter.category !== 'ALL') {
      list = list.filter(e => e.category === filter.category);
    }
    if (filter?.minMagnitude) {
      list = list.filter(e => e.magnitude >= filter.minMagnitude!);
    }
    return list;
  }

  getLatest(): NormalizedEarthquake {
    if (this.simulation.isActive && this.simulation.simulatedEarthquake) {
      return this.simulation.simulatedEarthquake;
    }
    return this.latestEarthquake;
  }

  setLatest(earthquake: NormalizedEarthquake) {
    this.latestEarthquake = earthquake;
    this.upsertEarthquake(earthquake);
  }

  upsertEarthquake(item: NormalizedEarthquake) {
    const idx = this.earthquakes.findIndex(e => e.id === item.id);
    if (idx >= 0) {
      this.earthquakes[idx] = item;
    } else {
      this.earthquakes.unshift(item);
      if (this.earthquakes.length > 50) {
        this.earthquakes.pop();
      }
    }
  }

  upsertMany(items: NormalizedEarthquake[]) {
    items.forEach(item => this.upsertEarthquake(item));
  }

  getSimulationState(): SimulationState {
    return this.simulation;
  }

  activateSimulation(scenario: 'MEGATHRUST_SUNDA' | 'TSUNAMI_MALUKU' | 'CUSTOM', customData?: Partial<NormalizedEarthquake>): SimulationState {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

    let simulated: NormalizedEarthquake;

    if (scenario === 'MEGATHRUST_SUNDA') {
      simulated = {
        id: `sim-megathrust-${Date.now()}`,
        dateTime: now.toISOString(),
        dateStr,
        timeStr,
        latitude: -6.82,
        longitude: 105.12,
        coordinates: '-6.82, 105.12',
        magnitude: 8.7,
        depthKm: 10,
        region: 'Zona Megathrust Selat Sunda - Banten',
        potency: 'PERINGATAN DINI: Berpotensi TSUNAMI untuk Wilayah Banten dan Lampung!',
        feltMmi: 'VI-VII Banten, V-VI Jakarta, V Bandung, IV Lampung',
        shakemapUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        category: 'LATEST',
        isSimulation: true,
      };
      this.simulation = {
        isActive: true,
        scenarioName: 'Simulasi Megathrust Selat Sunda (M 8.7) - Status SIAGA TSUNAMI',
        simulatedEarthquake: simulated,
        activatedAt: now.toISOString(),
      };
    } else if (scenario === 'TSUNAMI_MALUKU') {
      simulated = {
        id: `sim-maluku-${Date.now()}`,
        dateTime: now.toISOString(),
        dateStr,
        timeStr,
        latitude: -3.85,
        longitude: 128.45,
        coordinates: '-3.85, 128.45',
        magnitude: 7.8,
        depthKm: 12,
        region: 'Laut Maluku - 45 km Barat Daya Ambon',
        potency: 'PERINGATAN DINI: Potensi Tsunami Lokal Ketinggian 1-3 Meter!',
        feltMmi: 'V-VI Ambon, IV Masohi',
        category: 'LATEST',
        isSimulation: true,
      };
      this.simulation = {
        isActive: true,
        scenarioName: 'Simulasi Gempa Laut Maluku (M 7.8) - Waspada Tsunami',
        simulatedEarthquake: simulated,
        activatedAt: now.toISOString(),
      };
    } else {
      simulated = {
        id: `sim-custom-${Date.now()}`,
        dateTime: now.toISOString(),
        dateStr,
        timeStr,
        latitude: customData?.latitude ?? -7.0,
        longitude: customData?.longitude ?? 107.0,
        coordinates: `${customData?.latitude ?? -7.0}, ${customData?.longitude ?? 107.0}`,
        magnitude: customData?.magnitude ?? 7.2,
        depthKm: customData?.depthKm ?? 15,
        region: customData?.region ?? 'Simulasi Sesar Aktif',
        potency: customData?.potency ?? 'Berpotensi Tsunami',
        feltMmi: customData?.feltMmi ?? 'IV-V MMI',
        category: 'LATEST',
        isSimulation: true,
      };
      this.simulation = {
        isActive: true,
        scenarioName: 'Simulasi Kustom Demo',
        simulatedEarthquake: simulated,
        activatedAt: now.toISOString(),
      };
    }

    return this.simulation;
  }

  deactivateSimulation() {
    this.simulation = {
      isActive: false,
      scenarioName: 'Normal Real-Time BMKG',
      simulatedEarthquake: null,
      activatedAt: null,
    };
    return this.simulation;
  }

  recordSync(itemsCount: number) {
    this.lastSyncTime = new Date().toISOString();
    this.syncCount += itemsCount;
  }

  getTelemetry() {
    return {
      lastSyncTime: this.lastSyncTime,
      totalSyncedItems: this.syncCount,
      totalCachedRecords: this.earthquakes.length,
      isSimulationActive: this.simulation.isActive,
      activeScenario: this.simulation.scenarioName,
      serverUptimeSec: process.uptime(),
    };
  }
}

// Global singleton instance across Next.js API route invocations
const globalStore = (global as any).__bmkg_memory_store__ || new MemoryStore();
if (process.env.NODE_ENV !== 'production') {
  (global as any).__bmkg_memory_store__ = globalStore;
}

export const memoryStore: MemoryStore = globalStore;
