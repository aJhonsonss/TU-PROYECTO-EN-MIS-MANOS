import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
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

  return (
    <section
      id="equipo"
      className="bg-[#EDEAE2] text-[#171614] py-20 md:py-28 border-t border-[#171614]/10"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        {/* CEO / Founder Spotlight */}
        <RevealBlock className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[420px] max-h-[580px] rounded-2xl overflow-hidden border border-[#171614]/12 bg-[#1D1B18] shadow-[0_20px_45px_rgba(23,22,20,0.12)]">
              <img
                src={CEO_PORTRAIT_IMAGE}
                alt="Rodrigo Valdivieso, Fundador y Director de Obras de Tu Proyecto en Mis Manos"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#141311]/92 via-[#141311]/55 to-transparent text-[#F6F4EF]">
                <div className="text-xs text-[#DFC8AA]">Fundador y Director General</div>
                <div className="mt-1 font-display text-2xl">Rodrigo Valdivieso Matte</div>
                <div className="mt-0.5 text-xs text-[#C9C1B6]">
                  Ingeniero Civil · 18 años dirigiendo obras residenciales en Chile
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between py-2">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#736C62]">
                Respaldo Directo · Humanizando la Obra
              </p>

              <h2
                className="mt-3 font-display font-normal leading-[1.08] tracking-tight text-[#171614]"
                style={{ fontSize: 'clamp(2rem, 3.4vw, 3.1rem)', textWrap: 'balance' }}
              >
                &ldquo;Construir tu casa en parcela no debe ser una fuente de incertidumbre, sino el
                proceso más claro de tu vida.&rdquo;
              </h2>

              <div className="mt-6 space-y-4 text-sm md:text-base leading-relaxed text-[#38342F] max-w-2xl">
                <p>
                  En Tu Proyecto en Mis Manos firmamos contratos a suma alzada con especificaciones
                  técnicas cerradas antes de excavar el primer metro cúbico. Sabes desde el día uno
                  cuánto cuesta tu casa, qué marcas de termopanel y quincallería instalamos y en qué
                  fecha exacta recibes tus llaves.
                </p>
                <p>
                  Superviso personalmente cada hito crítico en terreno —desde la recepción de
                  enfierradura hasta las pruebas hidráulicas de piscina— para que el resultado final
                  supere lo proyectado en el modelo arquitectónico.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[#171614]/12 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-[#4E4942]">
                <ShieldCheck className="w-5 h-5 text-[#8C6841] shrink-0" />
                <span>
                  Registro Nacional de Constructores · Seguro de Responsabilidad Civil y Garantía
                  OGUC
                </span>
              </div>

              <motion.button
                type="button"
                whileHover={{ x: 3 }}
                onClick={onScheduleClick}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171614] text-[#F6F4EF] text-xs font-semibold hover:bg-[#2F2D29] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Reunirme con dirección de proyectos</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </RevealBlock>

        {/* Quantified Trust Indicators Strip */}
        <RevealBlock delay={0.08} className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden border border-[#171614]/12 bg-[#F6F4EF]">
          {TRUST_METRICS.map((metric, idx) => (
            <div
              key={metric.label}
              className={`p-7 ${
                idx < TRUST_METRICS.length - 1
                  ? 'border-b sm:border-b-0 sm:border-r border-[#171614]/10'
                  : ''
              }`}
            >
              <div className="font-display text-4xl md:text-5xl font-normal text-[#171614] tabular-nums">
                {metric.value}
              </div>
              <div className="mt-2 text-sm font-semibold text-[#171614]">{metric.label}</div>
              <div className="mt-1 text-xs text-[#6B645B]">{metric.context}</div>
            </div>
          ))}
        </RevealBlock>

        {/* Multidisciplinary Team Interactive Spotlight Cards */}
        <div className="mt-16">
          <RevealBlock className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8">
            <div>
              <p className="text-xs font-medium tracking-wide text-[#736C62]">
                Equipo Multidisciplinario In-House
              </p>
              <h3 className="mt-2 font-display text-2xl md:text-4xl font-normal text-[#171614]">
                Cuatro áreas técnicas integradas en cada obra.
              </h3>
            </div>
            <p className="text-xs md:text-sm text-[#575148] max-w-md">
              Arquitectura, cálculo, construcción civil e interiorismo trabajan bajo el mismo techo
              para eliminar fricciones y errores de coordinación.
            </p>
          </RevealBlock>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM_DISCIPLINES.map((discipline) => {
              const isSelected = selectedDiscipline === discipline.id;
              return (
                <motion.div
                  key={discipline.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <SpotlightCard
                    onClick={() => setSelectedDiscipline(discipline.id)}
                    spotlightColor={
                      isSelected ? 'rgba(223, 200, 170, 0.16)' : 'rgba(158, 123, 79, 0.14)'
                    }
                    className={`h-full rounded-2xl p-6 border transition-colors flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#171614] text-[#F6F4EF] border-[#171614] shadow-[0_18px_40px_rgba(23,22,20,0.16)]'
                        : 'bg-[#F6F4EF] text-[#171614] border-[#171614]/12 hover:border-[#171614]/35'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs">
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

                      <h4 className="mt-4 font-display text-2xl font-normal leading-tight">
                        {discipline.role}
                      </h4>

                      <p
                        className={`mt-1.5 text-xs ${
                          isSelected ? 'text-[#DFC8AA]' : 'text-[#736C62]'
                        }`}
                      >
                        {discipline.credentials}
                      </p>

                      <p
                        className={`mt-4 text-xs md:text-sm leading-relaxed ${
                          isSelected ? 'text-[#D6CFC5]' : 'text-[#44403A]'
                        }`}
                      >
                        {discipline.responsibility}
                      </p>
                    </div>

                    <div
                      className={`mt-6 pt-4 border-t text-xs leading-relaxed ${
                        isSelected
                          ? 'border-white/15 text-[#F6F4EF]'
                          : 'border-[#171614]/10 text-[#171614]'
                      }`}
                    >
                      <span className="font-semibold block mb-1">Garantía de área:</span>
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
      </div>
    </section>
  );
}
