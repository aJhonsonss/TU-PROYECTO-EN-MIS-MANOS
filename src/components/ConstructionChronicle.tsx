import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MoveHorizontal, SlidersHorizontal, Play, Pause } from 'lucide-react';
import { CONSTRUCTION_STAGES } from '../data/projectData';
import { RevealBlock, SpotlightCard } from './MotionPrimitives';

type ViewerMode = 'timeline' | 'compare';

export default function ConstructionChronicle() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrubPercent, setScrubPercent] = useState(15);
  const [viewerMode, setViewerMode] = useState<ViewerMode>('timeline');
  const [autoCycle, setAutoCycle] = useState(true);
  const [splitPercent, setSplitPercent] = useState(55);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const compareContainerRef = useRef<HTMLDivElement | null>(null);

  // Smooth automatic transparent crossfade carousel through stages when idle
  useEffect(() => {
    if (viewerMode !== 'timeline' || !autoCycle) return;
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % CONSTRUCTION_STAGES.length;
        setScrubPercent(Math.round(CONSTRUCTION_STAGES[next].progressTarget * 100));
        return next;
      });
    }, 4200);
    return () => window.clearInterval(interval);
  }, [viewerMode, autoCycle]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !autoCycle) {
              setActiveIndex(idx);
              setScrubPercent(Math.round(CONSTRUCTION_STAGES[idx].progressTarget * 100));
            }
          });
        },
        {
          rootMargin: '-35% 0px -35% 0px',
          threshold: 0.1,
        }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, [autoCycle]);

  const handleStageSelect = (idx: number) => {
    setAutoCycle(false);
    setActiveIndex(idx);
    setScrubPercent(Math.round(CONSTRUCTION_STAGES[idx].progressTarget * 100));
    const targetCard = cardRefs.current[idx];
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleScrubChange = (val: number) => {
    setAutoCycle(false);
    setScrubPercent(val);
    const idx = val <= 25 ? 0 : val <= 50 ? 1 : val <= 75 ? 2 : 3;
    setActiveIndex(idx);
  };

  const updateSplitFromPointer = (clientX: number) => {
    const el = compareContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplitPercent(Math.max(6, Math.min(94, pct)));
  };

  const currentStage = CONSTRUCTION_STAGES[activeIndex];
  const compareStage = activeIndex === 0 ? CONSTRUCTION_STAGES[3] : currentStage;

  const getStageOpacity = (idx: number): number => {
    if (idx === 0) {
      if (scrubPercent <= 20) return 1;
      if (scrubPercent >= 36) return 0;
      return 1 - (scrubPercent - 20) / 16;
    }
    if (idx === 1) {
      if (scrubPercent <= 20) return 0;
      if (scrubPercent < 36) return (scrubPercent - 20) / 16;
      if (scrubPercent <= 48) return 1;
      if (scrubPercent >= 62) return 0;
      return 1 - (scrubPercent - 48) / 14;
    }
    if (idx === 2) {
      if (scrubPercent <= 48) return 0;
      if (scrubPercent < 62) return (scrubPercent - 48) / 14;
      if (scrubPercent <= 75) return 1;
      if (scrubPercent >= 90) return 0;
      return 1 - (scrubPercent - 75) / 15;
    }
    if (scrubPercent <= 75) return 0;
    if (scrubPercent >= 90) return 1;
    return (scrubPercent - 75) / 15;
  };

  return (
    <section
      id="cronologia"
      className="relative bg-[#F6F4EF] text-[#171614] py-20 md:py-28 border-t border-[#171614]/10"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        {/* Section Header */}
        <RevealBlock className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-[#171614]/12">
          <div>
            <p className="text-xs font-medium tracking-wide text-[#736C62]">
              Historia Visual de Construcción · Algarrobo, Región de Valparaíso
            </p>
            <h2
              className="mt-2 font-display font-normal leading-[1.08] tracking-tight text-[#171614]"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.1rem)', textWrap: 'balance' }}
            >
              Del terreno natural a la casa terminada al atardecer.
            </h2>
          </div>

          {/* Interactive Mode Switcher (Timeline vs Split Curtain Compare) */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#EDEAE2] border border-[#171614]/12 self-start lg:self-auto">
            {[
              { id: 'timeline' as ViewerMode, label: 'Avance continuo', icon: SlidersHorizontal },
              { id: 'compare' as ViewerMode, label: 'Comparar con cortina', icon: MoveHorizontal },
            ].map((mode) => {
              const Icon = mode.icon;
              const isModeActive = viewerMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setViewerMode(mode.id)}
                  className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    isModeActive ? 'text-[#F6F4EF]' : 'text-[#4E4942] hover:text-[#171614]'
                  }`}
                >
                  {isModeActive && (
                    <motion.span
                      layoutId="chronicle-mode-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute inset-0 rounded-lg bg-[#171614]"
                    />
                  )}
                  <Icon className="relative z-10 w-3.5 h-3.5" />
                  <span className="relative z-10">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </RevealBlock>

        {/* Sticky Two-Column Scrollytelling */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Right Visual Viewport Sticky on Desktop */}
          <div className="lg:col-span-7 lg:order-2 lg:sticky lg:top-24">
            <div className="bg-[#EDEAE2] rounded-2xl border border-[#171614]/12 p-4 md:p-5 shadow-[0_18px_45px_rgba(23,22,20,0.08)]">
              {viewerMode === 'timeline' ? (
                <div className="relative w-full aspect-video rounded-xl bg-[#1A1815] overflow-hidden">
                  {CONSTRUCTION_STAGES.map((stage, idx) => (
                    <img
                      key={stage.id}
                      src={stage.image}
                      alt={stage.imageAlt}
                      referrerPolicy="no-referrer"
                      style={{ opacity: getStageOpacity(idx) }}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                    />
                  ))}

                  <div className="absolute top-3 left-3 px-3.5 py-1.5 rounded-lg bg-[#141311]/90 text-[#F6F4EF] text-xs border border-white/15 shadow-md">
                    <span className="font-mono-tech text-[#DFC8AA] mr-2">
                      Etapa {currentStage.step}
                    </span>
                    <span>{currentStage.rangeLabel}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAutoCycle((p) => !p)}
                    className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141311]/90 hover:bg-[#141311] text-[#F6F4EF] text-xs border border-white/15 shadow-md transition-colors cursor-pointer"
                  >
                    {autoCycle ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-[#DFC8AA]" />
                        <span>Ciclo automático</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-[#DFC8AA]" />
                        <span>Reanudar ciclo</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Interactive Before / After Architectural Split Curtain */
                <div
                  ref={compareContainerRef}
                  onPointerDown={(e) => {
                    setIsDraggingSplit(true);
                    updateSplitFromPointer(e.clientX);
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    if (isDraggingSplit) updateSplitFromPointer(e.clientX);
                  }}
                  onPointerUp={() => setIsDraggingSplit(false)}
                  onPointerCancel={() => setIsDraggingSplit(false)}
                  className="relative w-full aspect-video rounded-xl bg-[#1A1815] overflow-hidden select-none cursor-ew-resize"
                >
                  {/* Right Layer: Selected or Final Stage */}
                  <img
                    src={compareStage.image}
                    alt={compareStage.imageAlt}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Left Clipped Layer: Stage 1 Natural Terrain */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - splitPercent}% 0 0)` }}
                  >
                    <img
                      src={CONSTRUCTION_STAGES[0].image}
                      alt={CONSTRUCTION_STAGES[0].imageAlt}
                      referrerPolicy="no-referrer"
                      draggable={false}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Luminous Architectural Vertical Beam + Dual Arrow Handle */}
                  <div
                    style={{ left: `${splitPercent}%` }}
                    className="absolute top-0 bottom-0 -translate-x-1/2 w-[2px] bg-[#DFC8AA] shadow-[0_0_16px_rgba(223,200,170,0.9)] pointer-events-none"
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#141311] border-2 border-[#DFC8AA] text-[#F6F4EF] flex items-center justify-center shadow-xl">
                      <MoveHorizontal className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="pointer-events-none absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-[#141311]/90 text-[#F6F4EF] text-[11px] border border-white/15">
                    Terreno inicial (0%)
                  </div>
                  <div className="pointer-events-none absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-[#141311]/90 text-[#DFC8AA] text-[11px] border border-white/15">
                    {compareStage.step} · {compareStage.rangeLabel}
                  </div>
                </div>
              )}

              {/* Interactive Timeline Scrubber + Stage Tabs */}
              <div className="mt-5 pt-4 border-t border-[#171614]/10 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="construction-progress-slider"
                    className="text-xs font-medium text-[#4E4942]"
                  >
                    {viewerMode === 'timeline'
                      ? 'Desliza para simular el avance en terreno'
                      : 'Arrastra la línea sobre la foto o selecciona la etapa a comparar'}
                  </label>
                  <span className="font-mono-tech text-xs font-semibold text-[#171614] tabular-nums">
                    {viewerMode === 'timeline'
                      ? `${scrubPercent}% completado`
                      : `División ${Math.round(splitPercent)}%`}
                  </span>
                </div>

                {viewerMode === 'timeline' ? (
                  <div className="relative flex items-center h-6">
                    <div className="w-full h-1.5 rounded-full bg-[#171614]/12 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#9E7B4F] to-[#171614] transition-all duration-150"
                        style={{ width: `${scrubPercent}%` }}
                      />
                    </div>
                    <input
                      id="construction-progress-slider"
                      type="range"
                      min={0}
                      max={100}
                      value={scrubPercent}
                      onChange={(e) => handleScrubChange(Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                    <div
                      style={{ left: `${scrubPercent}%` }}
                      className="pointer-events-none absolute -translate-x-1/2 w-5 h-5 rounded-full bg-[#171614] border-2 border-[#F6F4EF] shadow-md transition-all duration-150"
                    />
                  </div>
                ) : (
                  <div className="relative flex items-center h-6">
                    <div className="w-full h-1.5 rounded-full bg-[#171614]/12 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#9E7B4F]"
                        style={{ width: `${splitPercent}%` }}
                      />
                    </div>
                    <input
                      id="construction-progress-slider"
                      type="range"
                      min={6}
                      max={94}
                      value={Math.round(splitPercent)}
                      onChange={(e) => setSplitPercent(Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    />
                    <div
                      style={{ left: `${splitPercent}%` }}
                      className="pointer-events-none absolute -translate-x-1/2 w-5 h-5 rounded-full bg-[#9E7B4F] border-2 border-[#F6F4EF] shadow-md"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CONSTRUCTION_STAGES.map((stage, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        onClick={() => handleStageSelect(idx)}
                        className={`relative px-3.5 py-2.5 rounded-xl text-left border transition-colors cursor-pointer ${
                          isActive
                            ? 'text-[#F6F4EF] border-[#171614]'
                            : 'bg-[#F6F4EF] text-[#4E4942] border-[#171614]/12 hover:bg-[#E4DFD3]'
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="stage-tab-active"
                            transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                            className="absolute inset-0 rounded-xl bg-[#171614]"
                          />
                        )}
                        <div className="relative z-10 font-mono-tech text-[11px] opacity-80">
                          {stage.step} · {stage.rangeLabel}
                        </div>
                        <div className="relative z-10 mt-0.5 text-xs font-semibold truncate">
                          {stage.id === 'terreno'
                            ? 'Terreno'
                            : stage.id === 'obra-gruesa'
                            ? 'Obra Gruesa'
                            : stage.id === 'envolvente'
                            ? 'Envolvente'
                            : 'Terminada'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Left Scrolling Chronicle Cards with Vertical Tracing Timeline Line */}
          <div className="lg:col-span-5 lg:order-1 relative pl-7 md:pl-9 space-y-8">
            {/* Vertical Architectural Connecting Rail */}
            <div
              aria-hidden="true"
              className="absolute left-2.5 top-6 bottom-6 w-px bg-[#171614]/15"
            />
            <motion.div
              aria-hidden="true"
              animate={{ height: `${Math.max(12, ((activeIndex + 1) / CONSTRUCTION_STAGES.length) * 100)}%` }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-2.5 top-6 w-[2px] -translate-x-[0.5px] bg-gradient-to-b from-[#9E7B4F] to-[#171614] rounded-full"
            />

            {CONSTRUCTION_STAGES.map((stage, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={stage.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className="relative"
                >
                  {/* Timeline Node */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[25px] md:-left-[33px] top-8 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-[#C49A6C] border-[#171614] scale-125 shadow-[0_0_0_4px_rgba(196,154,108,0.25)]'
                        : idx < activeIndex
                        ? 'bg-[#171614] border-[#171614]'
                        : 'bg-[#F6F4EF] border-[#171614]/35'
                    }`}
                  />

                  <SpotlightCard
                    onClick={() => handleStageSelect(idx)}
                    spotlightColor={
                      isActive ? 'rgba(223, 200, 170, 0.14)' : 'rgba(158, 123, 79, 0.12)'
                    }
                    className={`rounded-2xl p-7 md:p-8 border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-[#171614] text-[#F6F4EF] border-[#171614] shadow-[0_18px_40px_rgba(23,22,20,0.16)]'
                        : 'bg-[#EDEAE2] text-[#171614] border-[#171614]/10 hover:border-[#171614]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={isActive ? 'text-[#DFC8AA]' : 'text-[#736C62]'}>
                        Etapa {stage.step} de 04
                      </span>
                      <span className="font-mono-tech">{stage.rangeLabel}</span>
                    </div>

                    <h3 className="mt-4 font-display text-2xl md:text-3xl font-normal leading-snug">
                      {stage.title}
                    </h3>

                    <p
                      className={`mt-1.5 text-xs font-medium ${
                        isActive ? 'text-[#C49A6C]' : 'text-[#8C6841]'
                      }`}
                    >
                      {stage.subtitle}
                    </p>

                    <p
                      className={`mt-4 text-sm leading-relaxed ${
                        isActive ? 'text-[#D5CEC3]' : 'text-[#3F3B36]'
                      }`}
                    >
                      {stage.description}
                    </p>

                    <div
                      className={`mt-6 pt-5 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 ${
                        isActive ? 'border-white/15' : 'border-[#171614]/10'
                      }`}
                    >
                      {stage.specs.map((spec) => (
                        <div key={spec.label}>
                          <div
                            className={`text-[11px] ${
                              isActive ? 'text-[#A8A095]' : 'text-[#6B645B]'
                            }`}
                          >
                            {spec.label}
                          </div>
                          <div className="mt-1 text-xs font-semibold tabular-nums">
                            {spec.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SpotlightCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
