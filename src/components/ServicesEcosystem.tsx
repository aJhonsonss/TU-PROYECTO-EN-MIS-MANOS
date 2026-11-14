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
    setParallax({ x: -nx * 1.6, y: -ny * 1.2 });
  };

  return (
    <section
      id="servicios"
      className="bg-[#141311] text-[#F6F4EF] py-20 md:py-28 border-t border-white/10"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        {/* Section Header */}
        <RevealBlock className="max-w-3xl">
          <p className="text-xs font-medium tracking-wide text-[#C49A6C]">
            Ecosistema de Servicios · Enfoque por Zonas de Parcela
          </p>
          <h2
            className="mt-3 font-display font-normal leading-[1.08] tracking-tight text-[#F6F4EF]"
            style={{ fontSize: 'clamp(2rem, 3.6vw, 3.25rem)', textWrap: 'balance' }}
          >
            Tres especialidades integradas bajo una sola dirección de obra.
          </h2>
          <p className="mt-4 text-sm md:text-base leading-relaxed text-[#B8B0A4] max-w-2xl">
            Explora cada área constructiva de la parcela para conocer cómo integramos la
            residencia principal, el quincho y la piscina sin contratistas externos.
          </p>
        </RevealBlock>

        {/* Interactive Zone Pillars + High-Res Architectural Showcase */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: 3 Rounded Spotlight Service Selectors */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {SERVICE_PILLARS.map((pillar) => {
              const isSelected = activePillar.id === pillar.id;
              return (
                <SpotlightCard
                  key={pillar.id}
                  onClick={() => setActivePillar(pillar)}
                  className={`rounded-2xl border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1F1D1A] border-[#C49A6C] text-[#F6F4EF]'
                      : 'bg-[#181614] border-white/10 text-[#C8C0B4] hover:border-white/25 hover:bg-[#1C1A17]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActivePillar(pillar)}
                    className="w-full text-left p-6 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tech text-xs text-[#C49A6C]">
                        {pillar.number}.
                      </span>
                      <span className="text-[11px] text-[#968E83]">
                        {isSelected ? 'Zona seleccionada' : 'Ver especialidad'}
                      </span>
                    </div>

                    <h3 className="mt-2.5 font-display text-2xl font-normal text-[#F6F4EF]">
                      {pillar.title}
                    </h3>

                    <p className="mt-2 text-xs md:text-sm leading-relaxed text-[#B2AA9E]">
                      {pillar.headline}
                    </p>

                    <AnimatePresence initial={false}>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
                            <p className="text-xs md:text-sm leading-relaxed text-[#DDD7CD]">
                              {pillar.description}
                            </p>
                            <ul className="space-y-1.5">
                              {pillar.specs.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2 text-xs text-[#C9C1B6]"
                                >
                                  <Check className="w-3.5 h-3.5 text-[#C49A6C] shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="pt-2">
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

          {/* Right: Dedicated Photorealistic Architectural Zone Showcase */}
          <div className="lg:col-span-7 flex flex-col">
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setParallax({ x: 0, y: 0 })}
              className="relative flex-1 min-h-[380px] lg:min-h-[540px] rounded-2xl border border-white/12 bg-[#1A1815] overflow-hidden shadow-[0_24px_55px_rgba(0,0,0,0.45)]"
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
                      transform: `scale(1.06) translate3d(${parallax.x}%, ${parallax.y}%, 0)`,
                    }}
                    className="w-full h-full object-cover transition-transform duration-300 ease-out"
                  />
                </motion.div>
              </AnimatePresence>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141311]/90 via-[#141311]/20 to-transparent"
              />

              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <div className="text-xs text-[#DFC8AA]">
                    Especialidad {activePillar.number} · Obra ejecutada
                  </div>
                  <div className="mt-1 font-display text-2xl md:text-3xl text-[#F6F4EF]">
                    {activePillar.title}
                  </div>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelectQuoteWithAddon(activePillar.id)}
                  className="px-5 py-2.5 rounded-xl bg-[#F6F4EF] text-[#141311] text-xs font-semibold hover:bg-[#E4DFD3] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Solicitar evaluación
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
