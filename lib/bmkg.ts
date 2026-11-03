export interface BMKGRawEarthquake {
  Tanggal: string;
  Jam: string;
  DateTime: string;
  Coordinates: string;
  Lintang: string;
  Bujur: string;
  Magnitude: string;
  Kedalaman: string;
  Wilayah: string;
  Potensi: string;
  Dirasakan?: string;
  Shakemap?: string;
}

export interface NormalizedEarthquake {
  id: string;
  dateTime: string;
  dateStr: string;
  timeStr: string;
  latitude: number;
  longitude: number;
  coordinates: string;
  magnitude: number;
  depthKm: number;
  region: string;
  potency: string;
  feltMmi?: string;
  shakemapUrl?: string;
  category: 'LATEST' | 'M5+' | 'FELT';
  isSimulation?: boolean;
}

const BMKG_BASE_URL = 'https://data.bmkg.go.id/DataMKG/TEWS';

// Browser-like User-Agent to prevent 403 Forbidden from BMKG Edge WAF
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 BMKG-Seismic-Client/1.0',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'Cache-Control': 'no-cache',
};

/**
 * Parses BMKG raw coordinate string e.g. "-7.85", "107.12" or "7.85 LS", "107.12 BT"
 */
export function parseCoordinates(lintangStr: string, bujurStr: string): { lat: number; lng: number } {
  let lat = 0;
  let lng = 0;

  if (lintangStr) {
    const isSouth = lintangStr.toUpperCase().includes('LS');
    const val = parseFloat(lintangStr.replace(/[^0-9.-]/g, ''));
    lat = isSouth ? -Math.abs(val) : val;
  }

  if (bujurStr) {
    const isWest = bujurStr.toUpperCase().includes('BB');
    const val = parseFloat(bujurStr.replace(/[^0-9.-]/g, ''));
    lng = isWest ? -Math.abs(val) : val;
  }

  return {
    lat: Number(lat.toFixed(4)),
    lng: Number(lng.toFixed(4)),
  };
}

/**
 * Normalizes BMKG JSON record into standardized application format
 */
export function normalizeBMKGRecord(
  item: BMKGRawEarthquake,
  category: 'LATEST' | 'M5+' | 'FELT'
): NormalizedEarthquake {
  const { lat, lng } = parseCoordinates(item.Lintang, item.Bujur);
  const mag = parseFloat(item.Magnitude) || 5.0;
  const depth = parseFloat(item.Kedalaman?.replace(/[^0-9.]/g, '')) || 10;
  const shakemap = item.Shakemap ? `${BMKG_BASE_URL}/${item.Shakemap}` : undefined;

  const id = `bmkg-${item.DateTime || `${item.Tanggal}-${item.Jam}`.replace(/\s+/g, '_')}`;

  return {
    id,
    dateTime: item.DateTime || new Date().toISOString(),
    dateStr: item.Tanggal || '',
    timeStr: item.Jam || '',
    latitude: lat,
    longitude: lng,
    coordinates: `${lat}, ${lng}`,
    magnitude: mag,
    depthKm: depth,
    region: item.Wilayah || 'Wilayah Indonesia',
    potency: item.Potensi || 'Tidak berpotensi tsunami',
    feltMmi: item.Dirasakan,
    shakemapUrl: shakemap,
    category,
  };
}

/**
 * Fetches the latest single headline earthquake (autogempa)
 */
export async function fetchLatestBMKG(): Promise<NormalizedEarthquake | null> {
  try {
    const res = await fetch(`${BMKG_BASE_URL}/autogempa.json`, {
      headers: HEADERS,
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`BMKG returned HTTP status ${res.status}`);
    }

    const data = await res.json();
    if (data?.Infogempa?.gempa) {
      return normalizeBMKGRecord(data.Infogempa.gempa, 'LATEST');
    }
    return null;
  } catch (err: any) {
    console.warn('[BMKG Fetch Warning - Latest]:', err.message);
    return null;
  }
}

/**
 * Fetches 15 latest earthquakes with M 5.0+
 */
export async function fetchM5PlusBMKG(): Promise<NormalizedEarthquake[]> {
  try {
    const res = await fetch(`${BMKG_BASE_URL}/gempaterkini.json`, {
      headers: HEADERS,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`BMKG returned HTTP status ${res.status}`);
    }

    const data = await res.json();
    const list: BMKGRawEarthquake[] = data?.Infogempa?.gempa || [];
    return list.map(item => normalizeBMKGRecord(item, 'M5+'));
  } catch (err: any) {
    console.warn('[BMKG Fetch Warning - M5+]:', err.message);
    return [];
  }
}

/**
 * Fetches 15 latest felt earthquakes (gempa dirasakan)
 */
export async function fetchFeltBMKG(): Promise<NormalizedEarthquake[]> {
  try {
    const res = await fetch(`${BMKG_BASE_URL}/gempadirasakan.json`, {
      headers: HEADERS,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`BMKG returned HTTP status ${res.status}`);
    }

    const data = await res.json();
    const list: BMKGRawEarthquake[] = data?.Infogempa?.gempa || [];
    return list.map(item => normalizeBMKGRecord(item, 'FELT'));
  } catch (err: any) {
    console.warn('[BMKG Fetch Warning - Felt]:', err.message);
    return [];
  }
}
