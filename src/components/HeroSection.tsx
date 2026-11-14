import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, Sun, Sunset, Moon } from 'lucide-react';
import PhotorealisticVillaOrbit, { AtmosphereMode } from './PhotorealisticVillaOrbit';
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
  const [atmosphere, setAtmosphere] = useState<AtmosphereMode>('sunset');
  const [activeZone, setActiveZone] = useState<ZoneVisitPoint>(ZONE_VISIT_POINTS[0]);
  const magneticBtnRef = useRef<HTMLButtonElement | null>(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = window.setTimeout(() => onCanvasReady(), 250);
    return () => window.clearTimeout(t);
  }, [onCanvasReady]);

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
      className="bg-[#141311] text-[#F6F4EF] pt-20 pb-10 lg:min-h-[calc(100vh-12px)] flex items-center"
    >
      <div className="max-w-[1360px] w-full mx-auto px-6 md:px-10">
        {/* Balanced Above-The-Fold Editorial Composition (Full House Always Visible) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left 5 cols: Editorial Headline, Value Prop & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <div className="flex items-center gap-2.5 text-xs tracking-wide text-[#DFC8AA]">
              <span>Construimos tu sueño</span>
              <span aria-hidden="true">·</span>
              <span>Algarrobo y Zona Central</span>
            </div>

            <h1
              className="mt-3 font-display font-normal leading-[1.03] tracking-tight text-[#F6F4EF]"
              style={{ fontSize: 'clamp(2.1rem, 3.4vw, 3.45rem)', textWrap: 'balance' }}
            >
              Tu parcela. Tu legado. Construimos el hogar que siempre imaginaste.
            </h1>

            <p className="mt-4 text-sm md:text-base leading-relaxed text-[#D5CEC3]">
              En <strong className="font-semibold text-[#F6F4EF]">Tu Proyecto en Mis Manos</strong>{' '}
              diseñamos y construimos casas mediterráneas y residencias contemporáneas llave en mano
              en parcelas de Chile. Ejecutamos desde el estudio de terreno y la ingeniería en
              hormigón, acero o madera hasta quinchos, piscinas y terminaciones a medida, con
              presupuesto cerrado y plazo garantizado.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                ref={magneticBtnRef}
                type="button"
                onClick={onExploreStart}
                onMouseMove={handleMagneticMove}
                onMouseLeave={() => setMagneticOffset({ x: 0, y: 0 })}
                style={{
                  transform: `translate3d(${magneticOffset.x}px, ${magneticOffset.y}px, 0)`,
                }}
                className="inline-flex items-center gap-2 bg-[#F6F4EF] text-[#141311] px-5 py-3 rounded-xl text-xs md:text-sm font-semibold tracking-wide transition-transform duration-150 ease-out hover:bg-[#E7E1D6] cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C49A6C]"
              >
                <span>Ver proceso de obra</span>
                <ArrowDownRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onScheduleClick}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs md:text-sm font-medium text-[#F6F4EF] border border-white/25 bg-white/5 hover:bg-white/12 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C49A6C]"
              >
                <span>Agendar evaluación</span>
              </button>
            </div>

            {/* Compact Lighting Atmosphere Selector */}
            <div className="mt-7 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-[#968E83] mr-1">Ambiente:</span>
              {[
                { id: 'sunset' as AtmosphereMode, label: 'Atardecer', icon: Sunset, color: 'text-[#D89F66]' },
                { id: 'daylight' as AtmosphereMode, label: 'Día', icon: Sun, color: 'text-[#E5C97B]' },
                { id: 'night' as AtmosphereMode, label: 'Noche', icon: Moon, color: 'text-[#9BB9DF]' },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = atmosphere === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAtmosphere(item.id)}
                    className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-colors whitespace-nowrap cursor-pointer ${
                      isActive ? 'text-[#F6F4EF]' : 'text-[#A8A095] hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="hero-light-pill"
                        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                        className="absolute inset-0 rounded-xl bg-white/15"
                      />
                    )}
                    <Icon className={`relative z-10 w-3.5 h-3.5 ${item.color}`} />
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Right 7 cols: Full-Height Architectural Showcase Stage + Zone Selector */}
          <motion.div
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col gap-3"
          >
            <div className="w-full h-[320px] sm:h-[420px] lg:h-[min(62vh,520px)] rounded-2xl border border-white/15 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              <PhotorealisticVillaOrbit
                activeZone={activeZone}
                onSelectZone={setActiveZone}
                atmosphere={atmosphere}
              />
            </div>

            {/* Zone Visit Strip Directly Under House Frame (Zero Scrollbar) */}
            <div className="flex flex-wrap items-center justify-between gap-1 p-1.5 bg-[#1B1916] rounded-2xl border border-white/12">
              <span className="text-[11px] text-[#968E83] px-2.5 whitespace-nowrap shrink-0">
                Recorrer:
              </span>
              <div className="flex flex-wrap items-center gap-1 flex-1 justify-end sm:justify-start">
                {ZONE_VISIT_POINTS.map((zone) => {
                  const active = activeZone.id === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setActiveZone(zone)}
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
