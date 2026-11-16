import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  Building2,
  Compass,
  Flame,
  Hammer,
  KeyRound,
  Landmark,
  Ruler,
  Waves,
} from 'lucide-react';
import { SERVICE_PILLARS, ServicePillar } from '../data/projectData';
import { RevealBlock, SpotlightCard } from './MotionPrimitives';

interface ServicesEcosystemProps {
  onSelectQuoteWithAddon: (serviceId: ServicePillar['id']) => void;
}

const SERVICE_ICONS: Record<ServicePillar['id'], typeof Compass> = {
  terreno: Compass,
  arquitectura: Ruler,
  casa: Building2,
  quincho: Flame,
  piscina: Waves,
  especiales: Hammer,
};

export default function ServicesEcosystem({ onSelectQuoteWithAddon }: ServicesEcosystemProps) {
  const [focusedId, setFocusedId] = useState<ServicePillar['id']>('casa');

  return (
    <section
      id="servicios"
      className="w-full max-w-full flex-1 overflow-hidden bg-[#141311] text-[#F6F4EF] pt-[82px] pb-12 sm:pt-24 sm:pb-14 lg:pt-[68px] lg:pb-4 flex flex-col justify-center"
    >
      <div className="max-w-[1360px] w-full max-w-full mx-auto px-4 sm:px-6 md:px-10">
        {/* Compact Unified Header */}
        <RevealBlock className="flex flex-col lg:flex-row lg:items-end justify-between gap-2 pb-2 border-b border-white/12">
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-wide text-[#C49A6C]">
              Servicios Integrales · Quinta Región y Región Metropolitana
            </p>
            <h2
              className="mt-0.5 font-display font-normal leading-[1.06] tracking-tight text-[#F6F4EF]"
              style={{ fontSize: 'clamp(1.35rem, 2.15vw, 2rem)', textWrap: 'balance' }}
            >
              Todos nuestros servicios unificados en una sola dirección técnica.
            </h2>
          </div>

          <p className="text-xs leading-relaxed text-[#B8B0A4] max-w-lg lg:text-right shrink-0">
            Contrata el proyecto completo llave en mano o una etapa puntual: estudio de terreno,
            arquitectura, construcción de casa, quincho, piscina y obras a medida.
          </p>
        </RevealBlock>

        {/* Unified 6-Service Grid (No Hidden Accordions — All Services Visible Clearly) */}
        <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 w-full max-w-full">
          {SERVICE_PILLARS.map((service) => {
            const Icon = SERVICE_ICONS[service.id];
            const isHighlighted = focusedId === service.id;

            return (
              <SpotlightCard
                key={service.id}
                onClick={() => setFocusedId(service.id)}
                spotlightColor="rgba(196, 154, 108, 0.14)"
                className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-start gap-2 transition-colors cursor-pointer ${
                  isHighlighted
                    ? 'bg-[#1D1B18] border-[#C49A6C] shadow-[0_12px_30px_rgba(0,0,0,0.35)]'
                    : 'bg-[#181614] border-white/10 hover:border-white/25 hover:bg-[#1B1916]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-[#25221E] border border-white/10 flex items-center justify-center text-[#C49A6C] shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <span className="font-mono-tech text-[10px] text-[#C49A6C] mr-1.5">
                        {service.number}
                      </span>
                      <span className="text-[11px] font-medium text-[#A8A095] truncate">
                        {service.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-normal leading-snug text-[#F6F4EF]">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] leading-relaxed text-[#C9C1B6]">
                    {service.description}
                  </p>
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        {/* Bottom Unified Work & Payment Modalities Strip */}
        <RevealBlock
          delay={0.05}
          className="mt-3 rounded-2xl bg-[#1A1815] border border-white/12 px-4 py-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center"
        >
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#25221E] border border-[#C49A6C]/35 flex items-center justify-center text-[#DFC8AA] shrink-0 mt-0.5">
                <KeyRound className="w-3.5 h-3.5" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#F6F4EF]">
                  Modalidad Llave en Mano (Trabajo Completo)
                </div>
                <p className="text-[11px] text-[#B8B0A4] leading-snug">
                  Presupuesto cerrado y plazo fijo: pagas por proyecto terminado al recibir tus llaves.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#25221E] border border-[#C49A6C]/35 flex items-center justify-center text-[#DFC8AA] shrink-0 mt-0.5">
                <Landmark className="w-3.5 h-3.5" />
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#F6F4EF]">
                  Compra Directa a Ferreterías y Proveedores
                </div>
                <p className="text-[11px] text-[#B8B0A4] leading-snug">
                  Cuando se requieren insumos, transfieres directo a la empresa proveedora con total control.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 flex lg:justify-end">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectQuoteWithAddon('casa')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#C49A6C] text-[#141311] text-xs font-semibold hover:bg-[#D5AE82] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Evaluar mi proyecto</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
