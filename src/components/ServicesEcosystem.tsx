import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Check } from 'lucide-react';
import { SERVICE_PILLARS, ServicePillar } from '../data/projectData';
import { RevealBlock, SpotlightCard } from './MotionPrimitives';

interface ServicesEcosystemProps {
  onSelectQuoteWithAddon: (serviceId: ServicePillar['id']) => void;
}

export default function ServicesEcosystem({ onSelectQuoteWithAddon }: ServicesEcosystemProps) {
  const [activePillar, setActivePillar] = useState<ServicePillar>(SERVICE_PILLARS[0]);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setParallax({ x: -nx * 1.4, y: -ny * 1.0 });
  };

  return (
    <section
      id="servicios"
      className="w-full max-w-full flex-1 overflow-hidden bg-[#141311] text-[#F6F4EF] pt-16 pb-4 lg:pt-[68px] lg:pb-4 flex flex-col justify-center"
    >
      <div className="max-w-[1360px] w-full max-w-full mx-auto px-4 sm:px-6 md:px-10">
        {/* Compact Viewport-Fitted Header */}
        <RevealBlock className="flex flex-col lg:flex-row lg:items-end justify-between gap-2 pb-3 border-b border-white/12">
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-wide text-[#C49A6C]">
              Ecosistema de Servicios · Enfoque por Zonas de Parcela
            </p>
            <h2
              className="mt-0.5 font-display font-normal leading-[1.06] tracking-tight text-[#F6F4EF]"
              style={{ fontSize: 'clamp(1.45rem, 2.25vw, 2.1rem)', textWrap: 'balance' }}
            >
              Tres especialidades integradas bajo una sola dirección de obra.
            </h2>
          </div>

          <p className="text-xs leading-relaxed text-[#B8B0A4] max-w-md lg:text-right shrink-0">
            Explora cada área de la parcela para conocer cómo integramos residencia, quincho y
            piscina sin contratistas externos.
          </p>
        </RevealBlock>

        {/* Responsive Two-Column Zone Showcase Fitted Cleanly Inside 100vh Without Clipping */}
        <div className="mt-3.5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch w-full max-w-full">
          {/* Left 5 cols: Ultra-Compact 3-Specialty Accordion (All 3 Cards + Bottom Padding Always Visible) */}
          <div className="lg:col-span-5 min-w-0 w-full max-w-full flex flex-col justify-between gap-2">
            {SERVICE_PILLARS.map((pillar) => {
              const isSelected = activePillar.id === pillar.id;
              return (
                <SpotlightCard
                  key={pillar.id}
                  onClick={() => setActivePillar(pillar)}
                  className={`rounded-2xl border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1F1D1A] border-[#C49A6C] text-[#F6F4EF] shadow-[0_14px_34px_rgba(0,0,0,0.35)]'
                      : 'bg-[#181614] border-white/10 text-[#C8C0B4] hover:border-white/25 hover:bg-[#1C1A17]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActivePillar(pillar)}
                    className={`w-full text-left cursor-pointer ${
                      isSelected ? 'p-3.5 sm:p-4' : 'px-4 py-2.5'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono-tech text-xs text-[#C49A6C] shrink-0">
                          {pillar.number}.
                        </span>
                        {!isSelected && (
                          <span className="font-display text-base sm:text-lg font-normal text-[#EAE4DA] truncate">
                            {pillar.title}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#968E83] shrink-0">
                        {isSelected ? 'Zona seleccionada' : 'Ver especialidad'}
                      </span>
                    </div>

                    {isSelected && (
                      <h3 className="mt-1 font-display text-lg sm:text-xl font-normal leading-snug text-[#F6F4EF]">
                        {pillar.title}
                      </h3>
                    )}

                    <AnimatePresence initial={false}>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 pt-2 border-t border-white/10 space-y-2">
                            <p className="text-xs leading-relaxed text-[#DDD7CD]">
                              {pillar.description}
                            </p>
                            <ul className="space-y-1">
                              {pillar.specs.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2 text-[11px] leading-snug text-[#C9C1B6]"
                                >
                                  <Check className="w-3.5 h-3.5 text-[#C49A6C] shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="pt-0.5">
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectQuoteWithAddon(pillar.id);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.stopPropagation();
                                    onSelectQuoteWithAddon(pillar.id);
                                  }
                                }}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C49A6C] hover:text-[#DFC8AA]"
                              >
                                <span>Cotizar proyecto con {pillar.shortTitle.toLowerCase()}</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </SpotlightCard>
              );
            })}
          </div>

          {/* Right 7 cols: Full Uncropped Photorealistic Architectural Zone Showcase */}
          <div className="lg:col-span-7 min-w-0 w-full max-w-full flex flex-col">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setParallax({ x: 0, y: 0 })}
              className="relative w-full max-w-full flex-1 min-h-[270px] sm:min-h-[320px] lg:min-h-[clamp(290px,46vh,480px)] rounded-2xl border border-white/12 bg-[#1A1815] overflow-hidden shadow-[0_24px_55px_rgba(0,0,0,0.45)]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePillar.id}
                  initial={{ opacity: 0.25, scale: 1.04, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0.25, filter: 'blur(4px)' }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={activePillar.image}
                    alt={activePillar.imageAlt}
                    referrerPolicy="no-referrer"
                    style={{
                      transform: `scale(1.04) translate3d(${parallax.x}%, ${parallax.y}%, 0)`,
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-300 ease-out"
                  />
                </motion.div>
              </AnimatePresence>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141311]/90 via-[#141311]/15 to-transparent"
              />

              <div className="pointer-events-none absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-4 z-10 flex items-center justify-center">
                <div className="pointer-events-auto flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-2.5 sm:gap-5 px-4 py-2.5 sm:px-5 rounded-2xl bg-[#141311]/75 backdrop-blur-md border border-white/12 shadow-xl max-w-full">
                  <div className="min-w-0">
                    <div className="text-[11px] text-[#DFC8AA]">
                      Especialidad {activePillar.number} · Obra ejecutada
                    </div>
                    <div className="mt-0.5 font-display text-lg sm:text-xl leading-tight text-[#F6F4EF]">
                      {activePillar.title}
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectQuoteWithAddon(activePillar.id)}
                    className="px-4 py-2 rounded-xl bg-[#F6F4EF] text-[#141311] text-xs font-semibold hover:bg-[#E4DFD3] transition-colors cursor-pointer whitespace-nowrap shrink-0 shadow-md"
                  >
                    Solicitar evaluación
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
