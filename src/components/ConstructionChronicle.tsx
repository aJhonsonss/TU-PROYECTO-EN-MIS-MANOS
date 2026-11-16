import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

  const compareContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    CONSTRUCTION_STAGES.forEach((stage) => {
      const img = new Image();
      img.src = stage.image;
    });
  }, []);

  // Smooth automatic transparent crossfade carousel synced 1:1 with the expanded stage card
  useEffect(() => {
    if (viewerMode !== 'timeline' || !autoCycle) return;
    const interval = window.setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % CONSTRUCTION_STAGES.length;
        setScrubPercent(Math.round(CONSTRUCTION_STAGES[next].progressTarget * 100));
        return next;
      });
    }, 4400);
    return () => window.clearInterval(interval);
  }, [viewerMode, autoCycle]);

  const handleStageSelect = (idx: number) => {
    setAutoCycle(false);
    setActiveIndex(idx);
    setScrubPercent(Math.round(CONSTRUCTION_STAGES[idx].progressTarget * 100));
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

  const handleModeChange = (modeId: ViewerMode) => {
    setViewerMode(modeId);
    if (modeId === 'compare') {
      setAutoCycle(false);
      setActiveIndex(3);
      setScrubPercent(100);
    }
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
      className="relative w-full max-w-full flex-1 overflow-hidden bg-[#F6F4EF] text-[#171614] pt-[82px] pb-12 sm:pt-24 sm:pb-14 lg:pt-[68px] lg:pb-4 flex flex-col justify-center"
    >
      <div className="max-w-[1360px] w-full max-w-full mx-auto px-4 sm:px-6 md:px-10">
        {/* Compact Header That Fits Comfortably Below Fixed Navbar */}
        <RevealBlock className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 pb-3 border-b border-[#171614]/12">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-[#736C62]">
              Historia Visual de Construcción · Algarrobo, Región de Valparaíso
            </p>
            <h2
              className="mt-0.5 font-display font-normal leading-[1.06] tracking-tight text-[#171614]"
              style={{ fontSize: 'clamp(1.55rem, 2.5vw, 2.2rem)', textWrap: 'balance' }}
            >
              Del terreno natural a tu casa terminada llave en mano.
            </h2>
          </div>

          {/* Interactive Mode Switcher (Timeline vs Split Curtain Compare) */}
          <div className="flex flex-wrap sm:inline-flex items-center gap-1 p-1 rounded-xl bg-[#EDEAE2] border border-[#171614]/12 self-start lg:self-auto shrink-0 max-w-full">
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
                  onClick={() => handleModeChange(mode.id)}
                  className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
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

        {/* Viewport-Fitted Two-Column Interactive Storyteller (Visual First on Mobile) */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full max-w-full">
          {/* Left 5 cols: Synchronized Compact 4-Stage Rail */}
          <div className="order-2 lg:order-1 lg:col-span-5 min-w-0 w-full max-w-full relative pl-5 sm:pl-6 md:pl-7 space-y-1.5">
            {/* Vertical Architectural Connecting Rail */}
            <div
              aria-hidden="true"
              className="absolute left-2 top-4 bottom-4 w-px bg-[#171614]/15"
            />
            <motion.div
              aria-hidden="true"
              animate={{
                height: `${Math.max(16, ((activeIndex + 1) / CONSTRUCTION_STAGES.length) * 90)}%`,
              }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-2 top-4 w-[2px] -translate-x-[0.5px] bg-gradient-to-b from-[#9E7B4F] to-[#171614] rounded-full"
            />

            {CONSTRUCTION_STAGES.map((stage, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div key={stage.id} className="relative">
                  {/* Timeline Node */}
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[21px] md:-left-[25px] top-3.5 w-3 h-3 rounded-full border-2 transition-all duration-300 ${
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
                    className={`rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-[#171614] text-[#F6F4EF] border-[#171614] p-3.5 md:p-4 shadow-[0_14px_32px_rgba(23,22,20,0.16)]'
                        : 'bg-[#EDEAE2] text-[#171614] border-[#171614]/10 hover:border-[#171614]/30 px-3.5 py-2'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`font-mono-tech font-semibold shrink-0 ${
                            isActive ? 'text-[#C49A6C]' : 'text-[#8C6841]'
                          }`}
                        >
                          {stage.step}
                        </span>
                        {!isActive && (
                          <span className="font-medium truncate text-[#2B2824]">
                            {stage.title}
                          </span>
                        )}
                        {isActive && (
                          <span className="text-[#DFC8AA]">Etapa {stage.step} de 04</span>
                        )}
                      </div>
                      <span
                        className={`font-mono-tech text-[11px] shrink-0 ${
                          isActive ? 'text-[#F6F4EF]' : 'text-[#6B645B]'
                        }`}
                      >
                        {stage.rangeLabel}
                      </span>
                    </div>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <h3 className="mt-1.5 font-display text-lg md:text-xl font-normal leading-snug">
                            {stage.title}
                          </h3>

                          <p className="mt-0.5 text-[11px] font-medium text-[#C49A6C]">
                            {stage.subtitle}
                          </p>

                          <p className="mt-1.5 text-xs leading-relaxed text-[#D5CEC3]">
                            {stage.description}
                          </p>

                          <div className="mt-2.5 pt-2.5 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {stage.specs.map((spec) => (
                              <div key={spec.label} className="flex items-baseline justify-between sm:block gap-2">
                                <div className="text-[10px] text-[#A8A095]">{spec.label}</div>
                                <div className="mt-0.5 text-[11px] font-semibold tabular-nums leading-tight text-right sm:text-left">
                                  {spec.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </SpotlightCard>
                </div>
              );
            })}
          </div>

          {/* Right 7 cols: Full Uncropped Visual Viewport + Progress Percentage + 4 Stage Tabs */}
          <div className="order-1 lg:order-2 lg:col-span-7 min-w-0 w-full max-w-full">
            <div className="bg-[#EDEAE2] rounded-2xl border border-[#171614]/12 p-2 sm:p-2.5 shadow-[0_18px_45px_rgba(23,22,20,0.08)]">
              {viewerMode === 'timeline' ? (
                <div className="relative w-full aspect-[16/10] sm:aspect-auto sm:h-[260px] lg:h-[clamp(230px,36vh,400px)] rounded-xl bg-[#1A1815] overflow-hidden brightness-[0.99] contrast-[1.02] saturate-[0.93]">
                  {CONSTRUCTION_STAGES.map((stage, idx) => (
                    <img
                      key={stage.id}
                      src={stage.image}
                      alt={stage.imageAlt}
                      referrerPolicy="no-referrer"
                      style={{ opacity: getStageOpacity(idx) }}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out"
                    />
                  ))}

                  <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 px-2.5 sm:px-3 py-1 rounded-lg bg-[#141311]/90 text-[#F6F4EF] text-[10px] sm:text-xs border border-white/15 shadow-md">
                    <span className="font-mono-tech text-[#DFC8AA] mr-1.5 sm:mr-2">
                      Etapa {currentStage.step}
                    </span>
                    <span>{currentStage.rangeLabel}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAutoCycle((p) => !p)}
                    className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-[#141311]/90 hover:bg-[#141311] text-[#F6F4EF] text-[10px] sm:text-xs border border-white/15 shadow-md transition-colors cursor-pointer"
                  >
                    {autoCycle ? (
                      <>
                        <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DFC8AA]" />
                        <span className="hidden sm:inline">Ciclo automático</span>
                        <span className="sm:hidden">Pausar</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#DFC8AA]" />
                        <span className="hidden sm:inline">Reanudar ciclo</span>
                        <span className="sm:hidden">Reanudar</span>
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
                  className="relative w-full aspect-[16/10] sm:aspect-auto sm:h-[260px] lg:h-[clamp(230px,36vh,400px)] rounded-xl bg-[#1A1815] overflow-hidden select-none cursor-ew-resize"
                >
                  {/* Right Layer: Selected or Final Stage */}
                  <img
                    src={compareStage.image}
                    alt={compareStage.imageAlt}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover object-center"
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
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Luminous Architectural Vertical Beam + Dual Arrow Handle */}
                  <div
                    style={{ left: `${splitPercent}%` }}
                    className="absolute top-0 bottom-0 -translate-x-1/2 w-[2px] bg-[#DFC8AA] shadow-[0_0_16px_rgba(223,200,170,0.9)] pointer-events-none"
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#141311] border-2 border-[#DFC8AA] text-[#F6F4EF] flex items-center justify-center shadow-xl">
                      <MoveHorizontal className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="pointer-events-none absolute top-2.5 left-2.5 px-3 py-1 rounded-lg bg-[#141311]/90 text-[#F6F4EF] text-[11px] border border-white/15">
                    Terreno inicial (0%)
                  </div>
                  <div className="pointer-events-none absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-[#141311]/90 text-[#DFC8AA] text-[11px] border border-white/15">
                    {compareStage.id === 'terminada'
                      ? 'Casa terminada (100%)'
                      : `${compareStage.step} · ${compareStage.rangeLabel}`}
                  </div>
                </div>
              )}

              {/* Interactive Timeline Scrubber + Progress % + Stage Tabs (Always Visible!) */}
              <div className="mt-2.5 pt-2 border-t border-[#171614]/10 space-y-2">
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
                  <div className="relative flex items-center h-4">
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
                      className="pointer-events-none absolute -translate-x-1/2 w-4 h-4 rounded-full bg-[#171614] border-2 border-[#F6F4EF] shadow-md transition-all duration-150"
                    />
                  </div>
                ) : (
                  <div className="relative flex items-center h-4">
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
                      className="pointer-events-none absolute -translate-x-1/2 w-4 h-4 rounded-full bg-[#9E7B4F] border-2 border-[#F6F4EF] shadow-md"
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
                        className={`relative px-3 py-1.5 rounded-xl text-left border transition-colors cursor-pointer ${
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
                        <div className="relative z-10 font-mono-tech text-[10px] opacity-80">
                          {stage.step} · {stage.rangeLabel}
                        </div>
                        <div className="relative z-10 text-xs font-semibold truncate">
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
        </div>
      </div>
    </section>
  );
}
