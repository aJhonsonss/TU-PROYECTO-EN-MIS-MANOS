import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MoveHorizontal, ZoomIn, ZoomOut, RotateCcw, Eye, Pause, Play } from 'lucide-react';
import { ORBIT_ANGLES, ZONE_VISIT_POINTS, ZoneVisitPoint } from '../data/projectData';

export type AtmosphereMode = 'sunset' | 'daylight' | 'night';

interface PhotorealisticVillaOrbitProps {
  activeZone: ZoneVisitPoint;
  onSelectZone: (zone: ZoneVisitPoint) => void;
  atmosphere: AtmosphereMode;
}

export default function PhotorealisticVillaOrbit({
  activeZone,
  onSelectZone,
  atmosphere,
}: PhotorealisticVillaOrbitProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [angleIndex, setAngleIndex] = useState<number>(activeZone.angleIndex);
  const [zoom, setZoom] = useState<number>(activeZone.zoom);
  const [pan, setPan] = useState<{ x: number; y: number }>({
    x: activeZone.panX,
    y: activeZone.panY,
  });
  const [autoCarousel, setAutoCarousel] = useState(true);
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const [cursorSpot, setCursorSpot] = useState<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; startAngle: number }>({ x: 0, startAngle: 2 });

  useEffect(() => {
    setAngleIndex(activeZone.angleIndex);
    setZoom(activeZone.zoom);
    setPan({ x: activeZone.panX, y: activeZone.panY });
    if (activeZone.id !== 'general') {
      setAutoCarousel(false);
    }
  }, [activeZone]);

  // Automatic transparent crossfade carousel across all 4 scenes (including empty parcel)
  useEffect(() => {
    if (!autoCarousel || isDragging || cursorSpot.active) return;
    const timer = window.setInterval(() => {
      setAngleIndex((prev) => (prev + 1) % ORBIT_ANGLES.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [autoCarousel, isDragging, cursorSpot.active]);

  const currentAngle = ORBIT_ANGLES[angleIndex] || ORBIT_ANGLES[2];

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setAutoCarousel(false);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, startAngle: angleIndex };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    const nx = (px / 100) * 2 - 1;
    const ny = (py / 100) * 2 - 1;

    setTilt({
      rx: -ny * 1.1,
      ry: nx * 1.4,
    });
    setCursorSpot({ x: px, y: py, active: true });

    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const stepDelta = Math.round(-dx / 120);
      const nextAngle = Math.max(
        0,
        Math.min(ORBIT_ANGLES.length - 1, dragStartRef.current.startAngle + stepDelta)
      );
      if (nextAngle !== angleIndex) {
        setAngleIndex(nextAngle);
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    onSelectZone(ZONE_VISIT_POINTS[0]);
    setAngleIndex(2);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setAutoCarousel(true);
  };

  // Authentic natural DSLR tonal balance (no over-processed HDR look)
  const atmosphereFilter =
    atmosphere === 'daylight'
      ? 'brightness(1.02) contrast(1.01) saturate(0.92)'
      : atmosphere === 'night'
      ? 'brightness(0.78) contrast(1.08) saturate(0.88)'
      : 'brightness(0.99) contrast(1.02) saturate(0.93)';

  const angleShortLabel = (id: string) => {
    switch (id) {
      case 'terreno-solo':
        return 'Terreno';
      case 'vista-piscina':
        return 'Piscina';
      case 'vista-terraza-quincho':
        return 'Quincho';
      case 'vista-acceso':
        return 'Acceso';
      default:
        return 'Vista';
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={() => {
        setIsDragging(false);
        setTilt({ rx: 0, ry: 0 });
        setCursorSpot((prev) => ({ ...prev, active: false }));
      }}
      style={{ perspective: '1600px' }}
      className={`relative w-full h-full overflow-hidden bg-[#161513] select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Multi-Angle Smooth Crossfade Layer */}
      <div
        className="relative w-full h-full transition-transform duration-700 ease-out will-change-transform"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${zoom}) translate3d(${pan.x}%, ${pan.y}%, 0)`,
          filter: atmosphereFilter,
        }}
      >
        {ORBIT_ANGLES.map((angle, idx) => (
          <img
            key={angle.id}
            src={angle.image}
            alt={angle.imageAlt}
            referrerPolicy="no-referrer"
            draggable={false}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
              idx === angleIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        ))}
      </div>

      {/* Subtle Night Atmospheric Vignette */}
      {atmosphere === 'night' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D131F]/60 via-[#0F1726]/18 to-[#0D131F]/35"
        />
      )}

      {/* Interactive Zone Visit Pins on Terraza & Quincho view (Angle 2) */}
      {angleIndex === 2 && zoom <= 1.05 && (
        <div className="hidden md:block">
          {ZONE_VISIT_POINTS.slice(2).map((zone) => (
            <motion.button
              key={zone.id}
              type="button"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setAutoCarousel(false);
                onSelectZone(zone);
              }}
              style={{ left: `${zone.pinX}%`, top: `${zone.pinY}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141311]/90 text-[#F6F4EF] border border-white/40 text-[11px] font-medium hover:bg-[#C49A6C] hover:text-[#141311] hover:border-[#141311] transition-colors cursor-pointer whitespace-nowrap shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
            >
              <Eye className="w-3 h-3" />
              <span>{zone.label}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Top Control Strip */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141311]/90 border border-white/15 text-[11px] text-[#F6F4EF] shadow-lg">
          <MoveHorizontal className="w-3.5 h-3.5 text-[#C49A6C]" />
          <span className="font-medium">{currentAngle.label}</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1 bg-[#141311]/90 border border-white/15 p-1 rounded-xl shadow-lg">
          <button
            type="button"
            onClick={() => setAutoCarousel((p) => !p)}
            aria-label={autoCarousel ? 'Pausar carrusel' : 'Reproducir carrusel'}
            className="p-1.5 rounded-lg text-[#C49A6C] hover:text-white hover:bg-white/10 cursor-pointer"
          >
            {autoCarousel ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <div className="w-px h-4 bg-white/15 mx-0.5" aria-hidden="true" />

          {ORBIT_ANGLES.map((angle, idx) => {
            const isSelected = angleIndex === idx;
            return (
              <button
                key={angle.id}
                type="button"
                onClick={() => {
                  setAutoCarousel(false);
                  setAngleIndex(idx);
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
                className={`relative px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected ? 'text-[#141311]' : 'text-[#D5CEC3] hover:text-white'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="orbit-angle-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-lg bg-[#C49A6C]"
                  />
                )}
                <span className="relative z-10">{angleShortLabel(angle.id)}</span>
              </button>
            );
          })}

          <div className="w-px h-4 bg-white/15 mx-0.5" aria-hidden="true" />

          <button
            type="button"
            onClick={() => {
              setAutoCarousel(false);
              setZoom((z) => Math.min(1.32, Number((z + 0.14).toFixed(2))));
            }}
            aria-label="Acercar vista"
            className="p-1.5 rounded-lg text-[#D5CEC3] hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setAutoCarousel(false);
              setZoom((z) => Math.max(1, Number((z - 0.14).toFixed(2))));
            }}
            aria-label="Alejar vista"
            className="p-1.5 rounded-lg text-[#D5CEC3] hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Restablecer vista"
            className="p-1.5 rounded-lg text-[#D5CEC3] hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Clean Caption Bar (without 'Visitar interior') */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center pointer-events-none">
        <div className="pointer-events-auto px-3.5 py-2 rounded-xl bg-[#141311]/90 border border-white/15 text-xs text-[#E5DFD3] max-w-xl shadow-lg">
          <span className="text-[#DFC8AA] font-medium mr-1.5">{currentAngle.label}:</span>
          <span>{currentAngle.description}</span>
        </div>
      </div>
    </div>
  );
}
