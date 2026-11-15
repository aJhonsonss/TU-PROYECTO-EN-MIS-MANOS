import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight } from 'lucide-react';
import PhotorealisticVillaOrbit from './PhotorealisticVillaOrbit';
import { ZONE_VISIT_POINTS, ZoneVisitPoint } from '../data/projectData';

interface HeroSectionProps {
  onExploreStart: () => void;
  onScheduleClick: () => void;
  onCanvasReady: () => void;
}

export default function HeroSection({
  onExploreStart,
  onScheduleClick,
  onCanvasReady,
}: HeroSectionProps) {
  const [activeZoneIndex, setActiveZoneIndex] = useState(0);
  const [autoPauseUntil, setAutoPauseUntil] = useState(0);
  const magneticBtnRef = useRef<HTMLButtonElement | null>(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  const activeZone = ZONE_VISIT_POINTS[activeZoneIndex] ?? ZONE_VISIT_POINTS[0];

  useEffect(() => {
    const t = window.setTimeout(() => onCanvasReady(), 250);
    return () => window.clearTimeout(t);
  }, [onCanvasReady]);

  // Auto-advance both the displayed photo AND the highlighted zone button in lockstep
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (Date.now() < autoPauseUntil) return;
      setActiveZoneIndex((prev) => (prev + 1) % ZONE_VISIT_POINTS.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [autoPauseUntil]);

  const handleManualZoneSelect = (zone: ZoneVisitPoint, idx: number) => {
    setActiveZoneIndex(idx);
    // Pause briefly on manual click so user can read comfortably, then resume synced cycle
    setAutoPauseUntil(Date.now() + 9000);
  };

  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = magneticBtnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.16;
    setMagneticOffset({ x: dx, y: dy });
  };

  return (
    <section
      id="hero-3d"
      className="relative w-full max-w-full flex-1 overflow-x-hidden bg-[#141311] text-[#F6F4EF] pt-20 pb-5 lg:pt-[84px] lg:pb-6 flex flex-col justify-center"
    >
      <div className="relative max-w-[1360px] w-full max-w-full mx-auto px-4 sm:px-6 md:px-10">
        {/* Balanced Above-The-Fold Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center w-full max-w-full">
          {/* Left 5 cols: Editorial Headline, Subtle Readability Scrim & CTAs (always above carousel) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 lg:col-span-5 min-w-0 w-full flex flex-col justify-center"
          >
            {/* Subtle dark ambient scrim behind text to guarantee legibility over any image edge */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-3 sm:-inset-5 -z-10 rounded-3xl bg-[radial-gradient(ellipse_at_left_center,rgba(14,13,11,0.88)_0%,rgba(20,19,17,0.68)_62%,transparent_100%)] backdrop-blur-[2px]"
            />

            <div className="flex items-center gap-2.5 text-xs tracking-wide text-[#DFC8AA]">
              <span>Construimos tu sueño</span>
              <span aria-hidden="true">·</span>
              <span>Algarrobo y Zona Central</span>
            </div>

            <h1
              className="mt-2.5 lg:mt-3 font-display font-normal leading-[1.05] tracking-tight text-[#F6F4EF] [text-shadow:0_2px_20px_rgba(0,0,0,0.75)]"
              style={{ fontSize: 'clamp(1.8rem, min(3.2vw, 4.9vh), 3.3rem)', textWrap: 'balance' }}
            >
              Tu parcela. Tu legado. Construimos el hogar que siempre imaginaste.
            </h1>

            <p className="mt-3 lg:mt-4 text-sm md:text-[15px] leading-relaxed text-[#D5CEC3] [text-shadow:0_1px_10px_rgba(0,0,0,0.55)]">
              En <strong className="font-semibold text-[#F6F4EF]">Tu Proyecto en Mis Manos</strong>{' '}
              diseñamos y construimos casas mediterráneas y residencias contemporáneas llave en mano
              en parcelas de Chile. Ejecutamos desde el estudio de terreno y la ingeniería en
              hormigón, acero o madera hasta quinchos, piscinas y terminaciones a medida, con
              presupuesto cerrado y plazo garantizado.
            </p>

            <div className="mt-5 lg:mt-6 flex flex-wrap items-center gap-3">
              <button
                ref={magneticBtnRef}
                type="button"
                onClick={onExploreStart}
                onMouseMove={handleMagneticMove}
                onMouseLeave={() => setMagneticOffset({ x: 0, y: 0 })}
                style={{
                  transform: `translate3d(${magneticOffset.x}px, ${magneticOffset.y}px, 0)`,
                }}
                className="inline-flex items-center gap-2 bg-[#F6F4EF] text-[#141311] px-5 py-2.5 lg:py-3 rounded-xl text-xs md:text-sm font-semibold tracking-wide transition-transform duration-150 ease-out hover:bg-[#E7E1D6] cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C49A6C]"
              >
                <span>Ver proceso de obra</span>
                <ArrowDownRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onScheduleClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 lg:py-3 rounded-xl text-xs md:text-sm font-medium text-[#F6F4EF] border border-white/25 bg-white/5 hover:bg-white/12 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C49A6C]"
              >
                <span>Agendar evaluación</span>
              </button>
            </div>
          </motion.div>

          {/* Right 7 cols: Architectural Stage + Lockstep Synced Zone Selector */}
          <motion.div
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 lg:col-span-7 min-w-0 w-full max-w-full flex flex-col gap-3"
          >
            <div className="w-full max-w-full h-[280px] sm:h-[360px] lg:h-[clamp(300px,50vh,520px)] rounded-2xl border border-white/15 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              <PhotorealisticVillaOrbit
                activeZone={activeZone}
                onUserInteract={() => setAutoPauseUntil(Date.now() + 9000)}
                onZoneSyncFromDrag={(matchedZone) => {
                  const foundIdx = ZONE_VISIT_POINTS.findIndex((z) => z.id === matchedZone.id);
                  if (foundIdx !== -1) setActiveZoneIndex(foundIdx);
                }}
              />
            </div>

            {/* Clean Zone Selector Bar Synced 1:1 With Automatic Slideshow */}
            <div className="w-full max-w-full flex flex-wrap items-center justify-between gap-1 p-1.5 bg-[#1B1916] rounded-2xl border border-white/12">
              <span className="text-[11px] text-[#968E83] px-2.5 whitespace-nowrap shrink-0">
                Recorrer:
              </span>
              <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0 justify-end sm:justify-start">
                {ZONE_VISIT_POINTS.map((zone, idx) => {
                  const active = activeZone.id === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => handleManualZoneSelect(zone, idx)}
                      className={`relative px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active ? 'text-[#141311]' : 'text-[#D5CEC3] hover:text-white'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="hero-zone-pill"
                          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                          className="absolute inset-0 rounded-xl bg-[#C49A6C]"
                        />
                      )}
                      <span className="relative z-10">{zone.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
