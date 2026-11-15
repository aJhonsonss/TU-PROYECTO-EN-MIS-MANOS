import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ArrowUpRight, Maximize2, X } from 'lucide-react';
import {
  CEO_PORTRAIT_IMAGE,
  TEAM_DISCIPLINES,
  TRUST_METRICS,
} from '../data/projectData';
import { RevealBlock, SpotlightCard } from './MotionPrimitives';

interface LeadershipTrustProps {
  onScheduleClick: () => void;
}

export default function LeadershipTrust({ onScheduleClick }: LeadershipTrustProps) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>(TEAM_DISCIPLINES[0].id);
  const [isPortraitExpanded, setIsPortraitExpanded] = useState(false);

  useEffect(() => {
    if (!isPortraitExpanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsPortraitExpanded(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPortraitExpanded]);

  return (
    <>
      {/* Slide 1: Founder Spotlight + 5 Compact KPI & Work-Mode Cards */}
      <section
        id="equipo"
        className="relative min-h-[100vh] lg:h-[100vh] w-full max-w-full flex flex-col justify-center overflow-hidden bg-[#EDEAE2] text-[#171614] pt-[74px] pb-8 lg:pt-[76px] lg:pb-6 border-t border-[#171614]/10"
      >
        <div className="max-w-[1360px] w-full max-w-full mx-auto px-4 sm:px-6 md:px-10 flex flex-col justify-center gap-4 lg:gap-5">
          {/* CEO / Founder Spotlight */}
          <RevealBlock className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center w-full max-w-full">
            <div className="lg:col-span-4 min-w-0 w-full">
              <button
                type="button"
                onClick={() => setIsPortraitExpanded(true)}
                aria-label="Ampliar fotografía de Antonio Gianny Soto Solís"
                className="group relative block w-full text-left h-[320px] sm:h-[360px] lg:h-[clamp(285px,44vh,410px)] rounded-2xl overflow-hidden border border-[#171614]/15 bg-[#1D1B18] shadow-[0_18px_40px_rgba(23,22,20,0.14)] cursor-zoom-in focus-visible:outline-2 focus-visible:outline-[#C49A6C]"
              >
                <img
                  src={CEO_PORTRAIT_IMAGE}
                  alt="Antonio Gianny Soto Solís, Fundador y Director de Tu Proyecto en Mis Manos"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-[50%_18%] transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#141311]/75 backdrop-blur-sm border border-white/15 text-[10px] font-medium text-[#F6F4EF] opacity-85 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3 h-3 text-[#DFC8AA]" />
                  Ver completa
                </span>
                <div className="absolute inset-x-0 bottom-0 pt-10 pb-3 px-3.5 sm:px-4 bg-gradient-to-t from-[#141311]/95 via-[#141311]/65 to-transparent text-[#F6F4EF]">
                  <div className="text-[11px] font-medium tracking-wide text-[#DFC8AA]">
                    Fundador y Dirección Directa en Obra
                  </div>
                  <div className="mt-0.5 font-display text-lg sm:text-xl leading-tight">
                    Antonio Gianny Soto Solís
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#E3DCD1] leading-snug">
                    Presencia en obra desde el día uno · Sin intermediarios
                  </div>
                </div>
              </button>
            </div>

            <div className="lg:col-span-8 min-w-0 w-full flex flex-col justify-center">
              <div>
                <p className="text-[11px] font-medium tracking-wide text-[#736C62]">
                  Trato Directo con el Dueño · Conexión Humana Real
                </p>

                <h2
                  className="mt-1.5 font-display font-normal leading-[1.08] tracking-tight text-[#171614]"
                  style={{ fontSize: 'clamp(1.4rem, min(2.4vw, 3.6vh), 2.3rem)', textWrap: 'balance' }}
                >
                  &ldquo;No delegamos tu confianza en intermediarios: estoy contigo en la obra desde el
                  momento uno hasta entregarte las llaves.&rdquo;
                </h2>

                <div className="mt-3 space-y-2 text-xs sm:text-[13px] md:text-sm leading-relaxed text-[#38342F] max-w-3xl">
                  <p>
                    En <strong className="font-semibold text-[#171614]">Tu Proyecto en Mis Manos</strong>{' '}
                    hablas y decides directamente conmigo, como dueño y responsable de tu casa. Te
                    acompaño y asesoro desde la primera visita al terreno para resolver cada consulta,
                    cotización y detalle técnico con cercanía y claridad total.
                  </p>
                  <p>
                    Nuestra empresa no funciona mediante cadenas de intermediarios ni contratistas
                    anónimos. Administro y superviso personalmente toda la construcción en terreno —desde
                    el primer trazado hasta la entrega final— para que vivas el proceso con tranquilidad,
                    trato humano directo y absoluta confianza.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-[#171614]/12 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs text-[#4E4942]">
                  <ShieldCheck className="w-4 h-4 text-[#8C6841] shrink-0" />
                  <span>
                    Administración directa por su dueño · Acompañamiento permanente en terreno
                  </span>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ x: 3 }}
                  onClick={onScheduleClick}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171614] text-[#F6F4EF] text-xs font-semibold hover:bg-[#2F2D29] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Hablar directo con Antonio</span>
                  <ArrowUpRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </RevealBlock>

          {/* Quantified Trust & Transparent Work-Mode Cards */}
          <RevealBlock delay={0.06} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 rounded-2xl overflow-hidden border border-[#171614]/12 bg-[#F6F4EF]">
            {TRUST_METRICS.map((metric, idx) => {
              const isLast = idx === TRUST_METRICS.length - 1;
              return (
                <div
                  key={metric.label}
                  className={`p-3.5 sm:px-4 sm:py-3.5 border-[#171614]/10 ${
                    !isLast ? 'border-b sm:border-b lg:border-b-0 lg:border-r' : ''
                  } ${idx % 2 === 0 && !isLast ? 'sm:border-r' : 'sm:border-r-0'} ${
                    isLast ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className="font-display text-xl sm:text-2xl lg:text-[22px] xl:text-[25px] font-normal text-[#171614] leading-tight tabular-nums">
                    {metric.value}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-[#171614] leading-snug">
                    {metric.label}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#6B645B] leading-snug">
                    {metric.context}
                  </div>
                </div>
              );
            })}
          </RevealBlock>
        </div>
      </section>

      {/* Slide 2: Multidisciplinary Team Interactive Spotlight Cards — Full Centered Viewport */}
      <section
        id="areas-tecnicas"
        className="relative min-h-[100vh] lg:h-[100vh] w-full max-w-full flex flex-col justify-center overflow-hidden bg-[#EDEAE2] text-[#171614] pt-[78px] pb-12 lg:pt-[82px] lg:pb-10 border-t border-[#171614]/10"
      >
        <div className="max-w-[1360px] w-full max-w-full mx-auto px-4 sm:px-6 md:px-10 flex flex-col justify-center">
          <RevealBlock className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 lg:pb-7">
            <div>
              <p className="text-[11px] font-medium tracking-wide text-[#736C62]">
                Equipo Multidisciplinario In-House
              </p>
              <h3 className="mt-1.5 font-display text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#171614] leading-tight">
                Cuatro áreas técnicas integradas en cada obra.
              </h3>
            </div>
            <p className="text-xs sm:text-[13px] text-[#575148] max-w-md leading-relaxed">
              Arquitectura, cálculo, construcción e interiorismo trabajan bajo un mismo equipo para
              eliminar fricciones y errores de coordinación.
            </p>
          </RevealBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {TEAM_DISCIPLINES.map((discipline) => {
              const isSelected = selectedDiscipline === discipline.id;
              return (
                <motion.div
                  key={discipline.id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <SpotlightCard
                    onClick={() => setSelectedDiscipline(discipline.id)}
                    spotlightColor={
                      isSelected ? 'rgba(223, 200, 170, 0.16)' : 'rgba(158, 123, 79, 0.14)'
                    }
                    className={`h-full lg:min-h-[285px] xl:min-h-[305px] rounded-2xl p-5 sm:p-6 border transition-colors flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#171614] text-[#F6F4EF] border-[#171614] shadow-[0_14px_34px_rgba(23,22,20,0.16)]'
                        : 'bg-[#F6F4EF] text-[#171614] border-[#171614]/12 hover:border-[#171614]/35'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span
                          className={`font-mono-tech ${
                            isSelected ? 'text-[#C49A6C]' : 'text-[#8C6841]'
                          }`}
                        >
                          {discipline.code}.
                        </span>
                        <span className={isSelected ? 'text-[#B8B0A4]' : 'text-[#736C62]'}>
                          {discipline.leadName}
                        </span>
                      </div>

                      <h4 className="mt-3 font-display text-lg sm:text-xl font-normal leading-tight">
                        {discipline.role}
                      </h4>

                      <p
                        className={`mt-1 text-[11px] ${
                          isSelected ? 'text-[#DFC8AA]' : 'text-[#736C62]'
                        }`}
                      >
                        {discipline.credentials}
                      </p>

                      <p
                        className={`mt-3 text-xs sm:text-[13px] leading-relaxed ${
                          isSelected ? 'text-[#D6CFC5]' : 'text-[#44403A]'
                        }`}
                      >
                        {discipline.responsibility}
                      </p>
                    </div>

                    <div
                      className={`mt-5 pt-3.5 border-t text-xs leading-relaxed ${
                        isSelected
                          ? 'border-white/15 text-[#F6F4EF]'
                          : 'border-[#171614]/10 text-[#171614]'
                      }`}
                    >
                      <span className="font-semibold block mb-0.5">Garantía de área:</span>
                      <span className={isSelected ? 'text-[#C9C1B6]' : 'text-[#575148]'}>
                        {discipline.guarantee}
                      </span>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Expandable Full Portrait Modal — Closes when clicking anywhere outside */}
      <AnimatePresence>
        {isPortraitExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setIsPortraitExpanded(false)}
            className="fixed inset-0 z-50 bg-[#0A0908]/88 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl overflow-hidden border border-white/15 bg-[#141311] shadow-[0_28px_80px_rgba(0,0,0,0.65)] cursor-default"
            >
              <button
                type="button"
                onClick={() => setIsPortraitExpanded(false)}
                aria-label="Cerrar imagen ampliada"
                className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-[#141311]/80 hover:bg-[#141311] border border-white/20 text-[#F6F4EF] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <img
                src={CEO_PORTRAIT_IMAGE}
                alt="Antonio Gianny Soto Solís, Fundador y Director de Tu Proyecto en Mis Manos"
                referrerPolicy="no-referrer"
                className="w-full max-h-[78vh] object-contain bg-[#141311]"
              />

              <div className="px-5 py-4 border-t border-white/10 bg-[#141311] text-[#F6F4EF]">
                <div className="text-[11px] font-medium tracking-wide text-[#DFC8AA]">
                  Fundador y Dirección Directa en Obra
                </div>
                <div className="mt-0.5 font-display text-2xl">Antonio Gianny Soto Solís</div>
                <div className="mt-0.5 text-xs text-[#C9C1B6]">
                  Atención personalizada, presencia en terreno desde el día uno y trato directo sin intermediarios.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
