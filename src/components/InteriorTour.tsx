import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Layers, X } from 'lucide-react';
import { INTERIOR_HOTSPOTS, INTERIOR_TOUR_IMAGE } from '../data/projectData';
import { RevealBlock } from './MotionPrimitives';

export default function InteriorTour() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFloatingCard, setShowFloatingCard] = useState(true);
  const currentHotspot = INTERIOR_HOTSPOTS[activeIndex];

  const handleSelect = (idx: number) => {
    setActiveIndex(idx);
    setShowFloatingCard(true);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + INTERIOR_HOTSPOTS.length) % INTERIOR_HOTSPOTS.length);
    setShowFloatingCard(true);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % INTERIOR_HOTSPOTS.length);
    setShowFloatingCard(true);
  };

  return (
    <section
      id="tour-interior"
      className="w-full max-w-full overflow-hidden bg-[#F6F4EF] text-[#171614] pt-24 pb-20 md:pt-28 md:pb-24 lg:min-h-dvh flex flex-col justify-center"
    >
      <div className="max-w-[1360px] w-full max-w-full mx-auto px-4 sm:px-6 md:px-10">
        {/* Editorial Header */}
        <RevealBlock className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-[#736C62]">
              Paseo Interior Interactivo · Recorrido de Terminaciones
            </p>
            <h2
              className="mt-2 font-display font-normal leading-[1.08] tracking-tight text-[#171614]"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.1rem)', textWrap: 'balance' }}
            >
              Calidad constructiva visible en cada encuentro de material.
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#575148]">
            <Layers className="w-4 h-4 text-[#8C6841]" />
            <span>Haz clic en los puntos numerados para ver su detalle al costado</span>
          </div>
        </RevealBlock>

        {/* Interactive Panoramic Tour Canvas + Specification Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full max-w-full">
          {/* Left: Panoramic Image with High-Contrast Hotspots + Adjacent Floating Description */}
          <div className="lg:col-span-8 min-w-0 w-full max-w-full flex flex-col gap-3.5">
            <div className="relative w-full aspect-video rounded-2xl bg-[#1D1B18] border border-[#171614]/15 overflow-hidden shadow-[0_20px_50px_rgba(23,22,20,0.12)]">
              <img
                src={INTERIOR_TOUR_IMAGE}
                alt="Living de doble altura y cocina integrada conectados a terraza, quincho y piscina"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Hotspot Markers — Solid 21:1 High-Contrast Badges */}
              {INTERIOR_HOTSPOTS.map((spot, idx) => {
                const isSelected = idx === activeIndex && showFloatingCard;
                return (
                  <motion.button
                    key={spot.id}
                    type="button"
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleSelect(idx)}
                    aria-label={`Inspeccionar punto ${idx + 1}: ${spot.title}`}
                    style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center font-mono-tech text-sm font-bold leading-none transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-white shadow-[0_4px_14px_rgba(0,0,0,0.55)] ${
                      isSelected
                        ? 'bg-[#FFFFFF] text-[#141311] border-2 border-[#141311] ring-4 ring-[#C49A6C] scale-110'
                        : 'bg-[#141311] text-[#FFFFFF] border-2 border-[#FFFFFF] hover:bg-[#C49A6C] hover:text-[#141311] hover:border-[#141311]'
                    }`}
                  >
                    {idx + 1}
                  </motion.button>
                );
              })}

              {/* Adjacent Floating Description Card Next to Active Point */}
              <AnimatePresence mode="wait">
                {showFloatingCard && (
                  <motion.div
                    key={currentHotspot.id}
                    initial={{ opacity: 0, scale: 0.94, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 4 }}
                    transition={{ duration: 0.22 }}
                    style={{
                      left:
                        currentHotspot.xPercent > 52
                          ? `max(14px, calc(${currentHotspot.xPercent}% - 295px))`
                          : `min(calc(100% - 285px), calc(${currentHotspot.xPercent}% + 30px))`,
                      top:
                        currentHotspot.yPercent > 60
                          ? `max(14px, calc(${currentHotspot.yPercent}% - 145px))`
                          : `max(14px, calc(${currentHotspot.yPercent}% - 28px))`,
                    }}
                    className="hidden sm:block absolute z-30 w-[268px] p-4 rounded-2xl bg-[#141311]/95 text-[#F6F4EF] border border-[#C49A6C]/60 shadow-[0_14px_34px_rgba(0,0,0,0.6)]"
                  >
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/12">
                      <span className="font-mono-tech text-[10px] uppercase tracking-[0.15em] text-[#C49A6C]">
                        0{activeIndex + 1} · {currentHotspot.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowFloatingCard(false)}
                        aria-label="Cerrar tarjeta"
                        className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <h4 className="mt-2 font-display text-lg leading-snug text-[#F6F4EF]">
                      {currentHotspot.title}
                    </h4>
                    <p className="mt-1 text-xs text-[#DFC8AA] font-medium">
                      {currentHotspot.material}
                    </p>
                    <p className="mt-1.5 text-xs text-[#D5CEC3] leading-relaxed">
                      {currentHotspot.benefit}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Numbered Index Strip Outside Photo */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {INTERIOR_HOTSPOTS.map((spot, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left border transition-colors cursor-pointer ${
                      isSelected
                        ? 'text-[#FFFFFF] border-[#171614]'
                        : 'bg-[#FFFFFF] text-[#171614] border-[#171614]/15 hover:bg-[#EDEAE2]'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="interior-index-pill"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-xl bg-[#171614]"
                      />
                    )}
                    <span
                      className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center font-mono-tech text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-[#C49A6C] text-[#141311]'
                          : 'bg-[#171614] text-[#FFFFFF]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="relative z-10 text-xs font-medium leading-tight truncate">
                      {spot.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Specification Inspector Card */}
          <div className="lg:col-span-4 min-w-0 w-full max-w-full flex flex-col justify-between bg-[#EDEAE2] rounded-2xl border border-[#171614]/12 p-6 sm:p-7 md:p-8 min-h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHotspot.id}
                initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-between text-xs text-[#575148]">
                  <span>{currentHotspot.category}</span>
                  <span className="font-mono-tech font-semibold text-[#171614]">
                    Punto 0{activeIndex + 1} / 0{INTERIOR_HOTSPOTS.length}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-2xl md:text-3xl font-normal leading-snug text-[#171614]">
                  {currentHotspot.title}
                </h3>

                <div className="mt-6 space-y-4 pt-5 border-t border-[#171614]/12">
                  <div>
                    <div className="text-[11px] text-[#575148]">Materialidad especificada</div>
                    <div className="mt-1 text-sm font-semibold text-[#171614]">
                      {currentHotspot.material}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-[#575148]">Estándar técnico</div>
                    <div className="mt-1 text-sm text-[#2E2A25]">
                      {currentHotspot.specification}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-[#575148]">Valor en el habitar diario</div>
                    <div className="mt-1 text-sm leading-relaxed text-[#2E2A25]">
                      {currentHotspot.benefit}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Hotspot Selector Strip & Next/Prev Controls */}
            <div className="mt-8 pt-6 border-t border-[#171614]/12 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                {INTERIOR_HOTSPOTS.map((spot, idx) => (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    aria-label={`Ver detalle ${idx + 1}`}
                    className={`w-9 h-9 rounded-lg font-mono-tech text-sm font-semibold transition-colors cursor-pointer border ${
                      idx === activeIndex
                        ? 'bg-[#171614] text-[#FFFFFF] border-[#171614]'
                        : 'bg-[#FFFFFF] text-[#171614] border-[#171614]/20 hover:bg-[#E4DFD3]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Detalle anterior"
                  className="w-9 h-9 rounded-lg inline-flex items-center justify-center bg-[#FFFFFF] border border-[#171614]/20 text-[#171614] hover:bg-[#E4DFD3] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Siguiente detalle"
                  className="w-9 h-9 rounded-lg inline-flex items-center justify-center bg-[#171614] text-[#FFFFFF] hover:bg-[#2E2C28] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
