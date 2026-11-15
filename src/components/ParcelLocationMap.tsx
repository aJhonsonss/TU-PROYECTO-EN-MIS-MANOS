import { useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  MapMouseEvent,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { Crosshair, Loader2, LocateFixed, MapPin, Search } from 'lucide-react';

export interface Coordinates {
  lat: number;
  lng: number;
}

interface ParcelLocationMapProps {
  commune: string;
  regionName: string;
  sectorQuery: string;
  onSectorQueryChange: (value: string) => void;
  pinLocation: Coordinates | null;
  hasExplicitPin: boolean;
  onPinChange: (coords: Coordinates, explicit: boolean) => void;
}

const MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ||
  (process.env.GOOGLE_MAPS_API_KEY as string | undefined) ||
  '';

function ParcelMapInner({
  commune,
  regionName,
  sectorQuery,
  onSectorQueryChange,
  pinLocation,
  hasExplicitPin,
  onPinChange,
}: ParcelLocationMapProps) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  const [mapType, setMapType] = useState<'hybrid' | 'roadmap'>('hybrid');
  const [searching, setSearching] = useState(false);
  const [locatingGps, setLocatingGps] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const lastGeocodedCommuneRef = useRef<string>('');

  const searchLocationOnMap = async (query: string, zoomLevel: number, markExplicit: boolean) => {
    if (!placesLib || !map) return;
    setSearching(true);
    setStatusMessage(null);
    try {
      const { places } = await placesLib.Place.searchByText({
        textQuery: query,
        fields: ['location', 'displayName'],
        region: 'cl',
      });
      const firstPlace = places?.[0];
      const loc = firstPlace?.location;
      if (loc) {
        const nextCoords = { lat: loc.lat(), lng: loc.lng() };
        map.panTo(nextCoords);
        map.setZoom(zoomLevel);
        onPinChange(nextCoords, markExplicit);
      } else {
        setStatusMessage('No encontramos esa dirección exacta; haz clic directo en el mapa.');
      }
    } catch (err) {
      const msg = String(err);
      if (
        msg.includes('429') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('OVER_QUERY_LIMIT') ||
        msg.includes('Quota')
      ) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
      setStatusMessage('Puedes mover o hacer clic directamente en el mapa para fijar tu parcela.');
    } finally {
      setSearching(false);
    }
  };

  // Auto-center when region/commune changes (uses Places API New searchByText)
  useEffect(() => {
    if (!placesLib || !map || !commune) return;
    const communeKey = `${commune}|${regionName}`;
    if (lastGeocodedCommuneRef.current === communeKey) return;
    lastGeocodedCommuneRef.current = communeKey;

    void searchLocationOnMap(`${commune}, ${regionName}, Chile`, 13, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placesLib, map, commune, regionName]);

  const handleMapClick = (event: MapMouseEvent) => {
    const latLng = event.detail.latLng;
    if (!latLng) return;
    setStatusMessage(null);
    onPinChange({ lat: latLng.lat, lng: latLng.lng }, true);
  };

  const handleMarkerDragEnd = (event: {
    latLng?: { lat: () => number; lng: () => number } | null;
  }) => {
    const latLng = event.latLng;
    if (!latLng) return;
    setStatusMessage(null);
    onPinChange({ lat: latLng.lat(), lng: latLng.lng() }, true);
  };

  const handleSearchSector = () => {
    const trimmed = sectorQuery.trim();
    const query = trimmed
      ? `${trimmed}, ${commune}, ${regionName}, Chile`
      : `${commune}, ${regionName}, Chile`;
    void searchLocationOnMap(query, trimmed ? 16 : 13, Boolean(trimmed));
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage('Tu navegador no permite geolocalización automática.');
      return;
    }
    setLocatingGps(true);
    setStatusMessage(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nextCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (map) {
          map.panTo(nextCoords);
          map.setZoom(17);
        }
        onPinChange(nextCoords, true);
        setLocatingGps(false);
      },
      () => {
        setStatusMessage('No pudimos obtener tu GPS. Haz clic directo en el mapa.');
        setLocatingGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="space-y-2">
      {/* Compact Sector Search + GPS Trigger Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <input
            id="sector-detail"
            type="text"
            value={sectorQuery}
            onChange={(e) => onSectorQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchSector();
              }
            }}
            placeholder="Dirección, sector o condominio (ej. El Yeco, Chicureo)..."
            className="w-full pl-3.5 pr-20 py-2 rounded-xl bg-[#141311] border border-white/12 text-xs text-[#F6F4EF] placeholder:text-[#6B645B] focus:outline-none focus:border-[#C49A6C]"
          />
          <button
            type="button"
            onClick={handleSearchSector}
            disabled={searching}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25221E] hover:bg-[#322D27] border border-white/10 text-[11px] font-medium text-[#DFC8AA] transition-colors cursor-pointer disabled:opacity-60"
          >
            {searching ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Search className="w-3 h-3" />
            )}
            <span>Ubicar</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locatingGps}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#141311] hover:bg-[#25221E] border border-white/15 text-[11px] font-medium text-[#E5DFD3] transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
        >
          {locatingGps ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C49A6C]" />
          ) : (
            <LocateFixed className="w-3.5 h-3.5 text-[#C49A6C]" />
          )}
          <span>Usar mi GPS</span>
        </button>
      </div>

      {/* Interactive Google Map Container with Explicit Height */}
      <div className="relative w-full h-[168px] sm:h-[185px] lg:h-[clamp(160px,22vh,205px)] rounded-xl overflow-hidden border border-white/15 bg-[#11100E]">
        <GoogleMap
          className="w-full h-full"
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          defaultCenter={{ lat: -33.4489, lng: -70.6693 }}
          defaultZoom={9}
          mapTypeId={mapType}
          gestureHandling="greedy"
          streetViewControl={false}
          fullscreenControl={false}
          mapTypeControl={false}
          onClick={handleMapClick}
        >
          {pinLocation && (
            <AdvancedMarker
              position={pinLocation}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
              title="Ubicación exacta de tu terreno o unidad"
            >
              <Pin
                background="#C49A6C"
                borderColor="#141311"
                glyphColor="#141311"
                scale={1.15}
              />
            </AdvancedMarker>
          )}
        </GoogleMap>

        {/* Satellite / Map View Toggle */}
        <div className="absolute top-2.5 left-2.5 z-10 inline-flex items-center p-0.5 rounded-lg bg-[#141311]/88 backdrop-blur-md border border-white/15 text-[11px]">
          <button
            type="button"
            onClick={() => setMapType('hybrid')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              mapType === 'hybrid'
                ? 'bg-[#C49A6C] text-[#141311]'
                : 'text-[#D6CFC5] hover:text-white'
            }`}
          >
            Satélite
          </button>
          <button
            type="button"
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              mapType === 'roadmap'
                ? 'bg-[#C49A6C] text-[#141311]'
                : 'text-[#D6CFC5] hover:text-white'
            }`}
          >
            Mapa
          </button>
        </div>

        {/* Bottom Instruction & Exact Coordinate Readout */}
        <div className="pointer-events-none absolute inset-x-2 bottom-2 z-10 flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-[#141311]/88 backdrop-blur-md border border-white/12 text-[11px] text-[#E6E0D6]">
          <span className="inline-flex items-center gap-1.5 truncate">
            <Crosshair className="w-3.5 h-3.5 text-[#C49A6C] shrink-0" />
            <span className="truncate">
              {statusMessage ||
                (hasExplicitPin
                  ? 'Pin fijado · Puedes arrastrar o hacer clic para ajustar'
                  : 'Haz clic o arrastra el cursor sobre tu parcela')}
            </span>
          </span>
          {pinLocation && (
            <span className="font-mono-tech text-[10px] text-[#DFC8AA] tabular-nums shrink-0">
              {pinLocation.lat.toFixed(5)}, {pinLocation.lng.toFixed(5)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ParcelLocationMap(props: ParcelLocationMapProps) {
  if (!MAPS_API_KEY) {
    return (
      <div className="space-y-2">
        <input
          id="sector-detail"
          type="text"
          value={props.sectorQuery}
          onChange={(e) => props.onSectorQueryChange(e.target.value)}
          placeholder="Dirección, sector o condominio exacto (ej. El Yeco, Mirasol, Chicureo)..."
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#141311] border border-white/12 text-xs text-[#F6F4EF] placeholder:text-[#6B645B] focus:outline-none focus:border-[#C49A6C]"
        />
        <div className="rounded-xl border border-white/12 bg-[#141311] px-4 py-3 flex items-center gap-2.5 text-xs text-[#968E83]">
          <MapPin className="w-4 h-4 text-[#C49A6C] shrink-0" />
          <span>
            El mapa interactivo de Google Maps cargará aquí en cuanto la clave esté disponible en
            el entorno de ejecución.
          </span>
        </div>
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={MAPS_API_KEY}
      language="es"
      region="CL"
      libraries={['marker', 'places']}
    >
      <ParcelMapInner {...props} />
    </APIProvider>
  );
}
