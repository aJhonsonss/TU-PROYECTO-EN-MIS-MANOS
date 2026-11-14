import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Columns2,
  MoveHorizontal,
  ArrowRight,
  Layers,
  Maximize2,
  X,
} from 'lucide-react';
import {
  REAL_PROJECT_STORY_SLIDES,
  REAL_PROJECT_COMPARISONS,
} from '../data/projectData';
import { RevealBlock, SpotlightCard } from './MotionPrimitives';

interface RealProjectShowcaseProps {
  onScheduleClick: () => void;
}

const STORY_DURATION_MS = 5000;

export default function RealProjectShowcase({ onScheduleClick }: RealProjectShowcaseProps) {
  const [activeMode, setActiveMode] = useState<'story' | 'finished'>('story');
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Finished project comparator & hotspot state
  // splitPercent controls how much of the LEFT finished view ("Proyecto Terminado") is revealed (default 88% finished first!)
  const [comparisonId, setComparisonId] = useState<'exterior' | 'interior'>('exterior');
  const [splitPercent, setSplitPercent] = useState(88);
  const [activeHotspotId, setActiveHotspotId] = useState<string>('ext-2');
  const [showFloatingPopover, setShowFloatingPopover] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const compareRef = useRef<HTMLDivElement | null>(null);
  const draggingSplitRef = useRef(false);

  const currentSlide = REAL_PROJECT_STORY_SLIDES[slideIndex];
  const activeComparison =
    REAL_PROJECT_COMPARISONS.find((c) => c.id === comparisonId) ?? REAL_PROJECT_COMPARISONS[0];
  const activeHotspot =
    activeComparison.hotspots.find((h) => h.id === activeHotspotId) ??
    activeComparison.hotspots[0];

  const goToSlide = useCallback(
    (nextIdx: number, dir?: 1 | -1) => {
      const normalized =
        (nextIdx + REAL_PROJECT_STORY_SLIDES.length) % REAL_PROJECT_STORY_SLIDES.length;
      setDirection(dir ?? (normalized >= slideIndex ? 1 : -1));
      setSlideIndex(normalized);
      setProgress(0);
    },
    [slideIndex]
  );

  // Story auto-advance timer
  useEffect(() => {
    if (activeMode !== 'story' || !isPlaying) return;

    const tickMs = 50;
    const step = (tickMs / STORY_DURATION_MS) * 100;
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          setDirection(1);
          setSlideIndex((idx) => (idx + 1) % REAL_PROJECT_STORY_SLIDES.length);
          return 0;
        }
        return prev + step;
      });
    }, tickMs);

    return () => window.clearInterval(interval);
  }, [activeMode, isPlaying]);

  // Split curtain pointer handling + auto-expand trigger when reaching full finished edge (>= 96%)
  const updateSplitFromClientX = useCallback((clientX: number) => {
    if (!compareRef.current) return;
    const rect = compareRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(4, Math.min(98, pct));
    setSplitPercent(clamped);
    if (clamped >= 96 && draggingSplitRef.current) {
      draggingSplitRef.current = false;
      setIsExpanded(true);
    }
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingSplitRef.current) return;
      updateSplitFromClientX(e.clientX);
    };
    const handlePointerUp = () => {
      draggingSplitRef.current = false;
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [updateSplitFromClientX]);

  // Close expanded lightbox on Escape
  useEffect(() => {
    if (!isExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isExpanded]);

  const handleComparisonSwitch = (id: 'exterior' | 'interior') => {
    setComparisonId(id);
    const target = REAL_PROJECT_COMPARISONS.find((c) => c.id === id);
    if (target && target.hotspots[0]) {
      setActiveHotspotId(target.hotspots[0].id);
      setShowFloatingPopover(true);
    }
    setSplitPercent(88);
  };

  return (
    <section
      id="obra-real"
      className="py-16 lg:py-22 bg-[#141311] text-[#F6F4EF] border-t border-white/10"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        {/* Section header */}
        <RevealBlock className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/12">
          <div className="max-w-3xl">
            <span className="font-mono-tech text-xs uppercase tracking-[0.22em] text-[#C8A878] block mb-2.5">
              Proyecto Real Ejecutado · Evidencia en Terreno
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-balance">
              Casa Pinos del Pacífico: historia real hasta la entrega final.
            </h2>
            <p className="mt-3 text-sm text-[#B8B0A4] max-w-2xl leading-relaxed">
              Registro cronológico real de obra en bosque costero —envolvente Rothoblaas, acero
              micro-nervado negro mate y madera en doble altura— junto al visor interactivo del
              proyecto terminado y ampliable.
            </p>
          </div>

          {/* Interactive mode switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-white/[0.05] border border-white/12 shrink-0 self-start lg:self-end">
            <button
              type="button"
              onClick={() => setActiveMode('story')}
              className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors flex items-center gap-2 cursor-pointer ${
                activeMode === 'story' ? 'text-[#141311]' : 'text-[#C5BEB4] hover:text-[#F6F4EF]'
              }`}
            >
              {activeMode === 'story' && (
                <motion.span
                  layoutId="realProjectModePill"
                  transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-[#F6F4EF]"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                Carrusel de Historia ({REAL_PROJECT_STORY_SLIDES.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('finished')}
              className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-colors flex items-center gap-2 cursor-pointer ${
                activeMode === 'finished' ? 'text-[#141311]' : 'text-[#C5BEB4] hover:text-[#F6F4EF]'
              }`}
            >
              {activeMode === 'finished' && (
                <motion.span
                  layoutId="realProjectModePill"
                  transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-[#C8A878]"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Columns2 className="w-3.5 h-3.5" />
                Proyecto Terminado
              </span>
            </button>
          </div>
        </RevealBlock>

        {/* Interactive Stage */}
        <AnimatePresence mode="wait">
          {activeMode === 'story' ? (
            <motion.div
              key="mode-story"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start"
            >
              {/* Left 7 cols: Modern Story Viewer Frame */}
              <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-white/12 bg-[#0D0C0B] shadow-2xl">
                {/* Top Story Progress Bar + Playback Controls */}
                <div className="px-5 pt-4 pb-3 border-b border-white/10 bg-[#181614]">
                  <div className="grid grid-cols-9 gap-1.5 mb-3">
                    {REAL_PROJECT_STORY_SLIDES.map((s, idx) => {
                      const fillPct =
                        idx < slideIndex ? 100 : idx === slideIndex ? progress : 0;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => goToSlide(idx)}
                          aria-label={`Ir al capítulo ${s.chapter}: ${s.title}`}
                          className="h-1.5 rounded-full bg-white/15 overflow-hidden cursor-pointer group"
                        >
                          <div
                            className={`h-full rounded-full transition-[width] duration-75 ${
                              s.isEnhanced ? 'bg-[#C8A878]' : 'bg-[#F6F4EF]'
                            } group-hover:bg-[#C8A878]`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono-tech text-xs text-[#C8A878] tabular-nums">
                        CAPÍTULO {currentSlide.chapter} / 0{REAL_PROJECT_STORY_SLIDES.length}
                      </span>
                      <span className="text-xs text-[#A39A8E] hidden sm:inline">
                        {currentSlide.phase}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPlaying((p) => !p)}
                        aria-label={isPlaying ? 'Pausar historia' : 'Reproducir historia'}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/12 border border-white/12 text-xs text-[#F6F4EF] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-3.5 h-3.5 text-[#C8A878]" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 text-[#C8A878]" />
                            Reproducir
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => goToSlide(slideIndex - 1, -1)}
                        aria-label="Capítulo anterior"
                        className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/12 border border-white/12 flex items-center justify-center text-[#F6F4EF] transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => goToSlide(slideIndex + 1, 1)}
                        aria-label="Siguiente capítulo"
                        className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/12 border border-white/12 flex items-center justify-center text-[#F6F4EF] transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Story Viewport */}
                <div className="relative h-[380px] sm:h-[440px] bg-[#0B0A09] overflow-hidden select-none">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentSlide.id}
                      custom={direction}
                      initial={{ opacity: 0, x: direction * 30, scale: 1.02 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: direction * -30, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -55) goToSlide(slideIndex + 1, 1);
                        else if (info.offset.x > 55) goToSlide(slideIndex - 1, -1);
                      }}
                      className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
                    >
                      <img
                        src={currentSlide.image}
                        alt=""
                        aria-hidden="true"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover opacity-25 blur-2xl scale-110 pointer-events-none"
                      />

                      <motion.img
                        src={currentSlide.image}
                        alt={currentSlide.imageAlt}
                        referrerPolicy="no-referrer"
                        initial={{ scale: 1 }}
                        animate={{ scale: isPlaying ? 1.04 : 1 }}
                        transition={{ duration: 5.0, ease: 'linear' }}
                        className={`relative z-10 max-h-full max-w-full ${
                          currentSlide.aspectHint === 'landscape'
                            ? 'w-full h-full object-cover'
                            : 'h-full w-auto object-contain rounded-lg shadow-2xl'
                        }`}
                      />
                    </motion.div>
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={() => goToSlide(slideIndex - 1, -1)}
                    aria-label="Historia anterior"
                    className="absolute left-0 top-0 bottom-0 w-1/5 z-20 cursor-pointer focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => goToSlide(slideIndex + 1, 1)}
                    aria-label="Historia siguiente"
                    className="absolute right-0 top-0 bottom-0 w-1/5 z-20 cursor-pointer focus:outline-none"
                  />
                </div>

                {/* Bottom Narrative Deck */}
                <div className="p-6 border-t border-white/10 bg-[#181614]">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <span className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#C8A878]">
                      {currentSlide.technicalNote}
                    </span>
                    {currentSlide.isEnhanced && (
                      <span className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#E6C792] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Acabado Final Proyectado
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-normal text-[#F6F4EF]">
                    {currentSlide.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#C5BEB4] leading-relaxed">
                    {currentSlide.caption}
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <span className="font-mono-tech text-[11px] text-[#8E867B]">
                      Desliza la foto o elige un capítulo
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveMode('finished')}
                      className="text-xs font-semibold text-[#C8A878] hover:text-[#F6F4EF] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Ver Proyecto Terminado Interactivo
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right 5 cols: Tracing Timeline Rail */}
              <div className="lg:col-span-5 relative">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono-tech text-[11px] uppercase tracking-[0.18em] text-[#A39A8E]">
                    Bitácora Cronológica · 9 Hitos Reales
                  </span>
                  <span className="font-mono-tech text-[11px] text-[#C8A878] tabular-nums">
                    {Math.round(((slideIndex + 1) / REAL_PROJECT_STORY_SLIDES.length) * 100)}%
                  </span>
                </div>

                <div className="relative pl-5 space-y-2">
                  <div
                    aria-hidden="true"
                    className="absolute left-[7px] top-3 bottom-3 w-[2px] bg-white/10 rounded-full overflow-hidden"
                  >
                    <motion.div
                      className="w-full bg-gradient-to-b from-[#9E7B4F] to-[#E6C792]"
                      animate={{
                        height: `${((slideIndex + 1) / REAL_PROJECT_STORY_SLIDES.length) * 100}%`,
                      }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>

                  {REAL_PROJECT_STORY_SLIDES.map((s, idx) => {
                    const isActive = idx === slideIndex;
                    return (
                      <div key={s.id} className="relative">
                        <span
                          className={`absolute -left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 transition-colors ${
                            isActive
                              ? 'bg-[#C8A878] border-[#141311]'
                              : idx < slideIndex
                                ? 'bg-[#9E7B4F]/60 border-[#141311]'
                                : 'bg-[#252320] border-white/25'
                          }`}
                        />

                        <SpotlightCard
                          spotlightColor="rgba(200, 168, 120, 0.16)"
                          className={`rounded-2xl border transition-all duration-200 ${
                            isActive
                              ? 'bg-[#1F1D1A] border-[#C8A878]/60 shadow-lg'
                              : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => goToSlide(idx)}
                            className="w-full p-2.5 flex items-center gap-3 text-left cursor-pointer"
                          >
                            <img
                              src={s.image}
                              alt={s.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`font-mono-tech text-[10px] uppercase tracking-[0.15em] ${
                                    isActive ? 'text-[#C8A878]' : 'text-[#8E867B]'
                                  }`}
                                >
                                  {s.chapter} · {s.phase}
                                </span>
                                {s.isEnhanced && (
                                  <Sparkles className="w-3 h-3 text-[#C8A878] shrink-0" />
                                )}
                              </div>
                              <p
                                className={`text-xs sm:text-sm font-medium truncate mt-0.5 ${
                                  isActive ? 'text-[#F6F4EF]' : 'text-[#C5BEB4]'
                                }`}
                              >
                                {s.title}
                              </p>
                            </div>
                          </button>
                        </SpotlightCard>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="mode-finished"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-7 items-start"
            >
              {/* Left 8 cols: Viewport-Fitted Finished Project First + Draggable Split Reveal + Adjacent Pin Card */}
              <div className="lg:col-span-8 space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex p-1 rounded-xl bg-white/[0.05] border border-white/12">
                    {REAL_PROJECT_COMPARISONS.map((comp) => (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => handleComparisonSwitch(comp.id)}
                        className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          comparisonId === comp.id
                            ? 'bg-[#F6F4EF] text-[#141311] font-semibold'
                            : 'text-[#C5BEB4] hover:text-[#F6F4EF]'
                        }`}
                      >
                        {comp.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8A878] text-[#141311] hover:bg-[#D9BA8A] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Expandir vista completa
                  </button>
                </div>

                {/* Comparison Canvas (Finished Project shown FIRST on Left/Main 88%!) */}
                <div className="rounded-3xl overflow-hidden border border-white/12 bg-[#0B0A09] shadow-2xl">
                  <div
                    ref={compareRef}
                    onPointerDown={(e) => {
                      if (
                        (e.target as HTMLElement).closest('[data-hotspot="true"]') ||
                        (e.target as HTMLElement).closest('[data-popover="true"]')
                      ) {
                        return;
                      }
                      draggingSplitRef.current = true;
                      updateSplitFromClientX(e.clientX);
                    }}
                    className="relative w-full h-[380px] sm:h-[450px] overflow-hidden cursor-ew-resize select-none touch-none"
                  >
                    {/* Right / Underneath layer: Raw In-Site Photo */}
                    <img
                      src={activeComparison.beforeImage}
                      alt={activeComparison.beforeLabel}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />

                    {/* Left / Dominant Primary Layer (default 88%): Clean Finished Enhanced Project */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - splitPercent}% 0 0)` }}
                    >
                      <img
                        src={activeComparison.afterImage}
                        alt={activeComparison.afterLabel}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* Vertical Split Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-[2px] bg-[#C8A878] pointer-events-none shadow-lg z-20"
                      style={{ left: `${splitPercent}%` }}
                    >
                      <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#141311] border-2 border-[#C8A878] text-[#F6F4EF] flex items-center justify-center shadow-xl">
                        <MoveHorizontal className="w-4 h-4 text-[#C8A878]" />
                      </div>
                    </div>

                    {/* Interactive Numbered Hotspot Pins */}
                    {activeComparison.hotspots.map((spot) => {
                      const selected = spot.id === activeHotspot.id && showFloatingPopover;
                      return (
                        <button
                          key={spot.id}
                          type="button"
                          data-hotspot="true"
                          onClick={() => {
                            if (activeHotspotId === spot.id && showFloatingPopover) {
                              setShowFloatingPopover(false);
                            } else {
                              setActiveHotspotId(spot.id);
                              setShowFloatingPopover(true);
                              setSplitPercent((prev) => Math.max(prev, Math.min(92, spot.xPercent + 10)));
                            }
                          }}
                          style={{
                            left: `${spot.xPercent}%`,
                            top: `${spot.yPercent}%`,
                          }}
                          aria-label={`Inspeccionar ${spot.num}: ${spot.title}`}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full flex items-center justify-center font-mono-tech text-xs font-bold tabular-nums border-2 shadow-xl transition-all duration-200 cursor-pointer ${
                            selected
                              ? 'bg-[#C8A878] text-[#141311] border-[#F6F4EF] scale-110 ring-4 ring-[#C8A878]/35'
                              : 'bg-[#141311] text-[#F6F4EF] border-[#F6F4EF] hover:scale-105 hover:bg-[#C8A878] hover:text-[#141311]'
                          }`}
                        >
                          {spot.num}
                        </button>
                      );
                    })}

                    {/* Floating Adjacent Callout Card Right Next to Clicked Point */}
                    <AnimatePresence mode="wait">
                      {showFloatingPopover && (
                        <motion.div
                          key={activeHotspot.id}
                          data-popover="true"
                          initial={{ opacity: 0, scale: 0.94, y: 6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.94, y: 4 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            left:
                              activeHotspot.xPercent > 52
                                ? `max(12px, calc(${activeHotspot.xPercent}% - 280px))`
                                : `min(calc(100% - 270px), calc(${activeHotspot.xPercent}% + 26px))`,
                            top:
                              activeHotspot.yPercent > 62
                                ? `max(12px, calc(${activeHotspot.yPercent}% - 125px))`
                                : `max(12px, calc(${activeHotspot.yPercent}% - 30px))`,
                          }}
                          className="absolute z-40 w-[255px] p-4 rounded-2xl bg-[#141311]/95 border border-[#C8A878]/60 shadow-[0_14px_34px_rgba(0,0,0,0.65)] text-left"
                        >
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
                            <span className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-[#C8A878]">
                              Detalle 0{activeHotspot.num}
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowFloatingPopover(false)}
                              aria-label="Cerrar descripción"
                              className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#F6F4EF] cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <h4 className="mt-2 font-display text-lg leading-snug text-[#F6F4EF]">
                            {activeHotspot.title}
                          </h4>
                          <p className="mt-1.5 text-xs text-[#D6D0C6] leading-relaxed">
                            {activeHotspot.detail}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Bottom Split Controls + Auto-Expand Hint */}
                <div className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#C8A878]">
                    ← {activeComparison.afterLabel} ({Math.round(splitPercent)}%)
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={4}
                      max={98}
                      value={Math.round(splitPercent)}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSplitPercent(val);
                        if (val >= 97) setIsExpanded(true);
                      }}
                      aria-label="Deslizador comparador proyecto terminado y obra previa"
                      className="w-32 sm:w-44 accent-[#C8A878] cursor-pointer"
                    />
                    <span className="hidden sm:inline font-mono-tech text-[10px] text-[#8E867B]">
                      Lleva al 100% o haz clic para ampliar
                    </span>
                  </div>
                  <span className="font-mono-tech text-[11px] uppercase tracking-[0.14em] text-[#A39A8E]">
                    {activeComparison.beforeLabel} →
                  </span>
                </div>
              </div>

              {/* Right 4 cols: Compact Index + CTA (Fits inside same viewport!) */}
              <div className="lg:col-span-4 space-y-4">
                <div>
                  <span className="font-mono-tech text-[11px] uppercase tracking-[0.18em] text-[#C8A878]">
                    Inspección Interactiva
                  </span>
                  <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-normal text-[#F6F4EF]">
                    {activeComparison.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#B8B0A4] leading-relaxed">
                    Haz clic en cualquier punto numerado sobre la imagen para desplegar su ficha
                    técnica al costado o amplía la vista completa.
                  </p>
                </div>

                {/* Compact Hotspot Buttons */}
                <div className="space-y-2">
                  {activeComparison.hotspots.map((spot) => {
                    const isSelected = spot.id === activeHotspot.id && showFloatingPopover;
                    return (
                      <button
                        key={spot.id}
                        type="button"
                        onClick={() => {
                          setActiveHotspotId(spot.id);
                          setShowFloatingPopover(true);
                          setSplitPercent((prev) => Math.max(prev, 86));
                        }}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-[#F6F4EF] text-[#141311] border-[#F6F4EF]'
                            : 'bg-white/[0.03] text-[#F6F4EF] border-white/10 hover:bg-white/[0.08]'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-full font-mono-tech text-xs font-bold flex items-center justify-center shrink-0 tabular-nums ${
                            isSelected
                              ? 'bg-[#141311] text-[#F6F4EF]'
                              : 'bg-white/10 text-[#C8A878]'
                          }`}
                        >
                          {spot.num}
                        </span>
                        <span className="text-xs font-medium">{spot.title}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={onScheduleClick}
                    className="w-full px-5 py-3 rounded-xl bg-[#C8A878] text-[#141311] hover:bg-[#D9BA8A] text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Cotizar Proyecto Similar en Tu Parcela
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode('story')}
                    className="text-xs font-medium text-[#C5BEB4] hover:text-[#F6F4EF] underline underline-offset-4 cursor-pointer self-start"
                  >
                    Volver al Carrusel de Historia
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expandable Fullscreen Finished Project Lightbox */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-0 z-50 bg-[#0A0908]/95 p-4 sm:p-8 flex flex-col items-center justify-center"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] bg-[#141311] rounded-3xl border border-white/15 overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#C8A878]">
                    {activeComparison.afterLabel} · Vista Ampliada
                  </span>
                  <h3 className="font-display text-2xl text-[#F6F4EF]">
                    {activeComparison.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {REAL_PROJECT_COMPARISONS.map((comp) => (
                    <button
                      key={comp.id}
                      type="button"
                      onClick={() => handleComparisonSwitch(comp.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        comparisonId === comp.id
                          ? 'bg-[#C8A878] text-[#141311] font-semibold'
                          : 'bg-white/10 text-[#F6F4EF] hover:bg-white/20'
                      }`}
                    >
                      {comp.label}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    aria-label="Cerrar vista ampliada"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#F6F4EF] cursor-pointer ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative flex-1 min-h-0 bg-[#0B0A09] flex items-center justify-center p-4 overflow-hidden">
                <img
                  src={activeComparison.afterImage}
                  alt={activeComparison.afterLabel}
                  referrerPolicy="no-referrer"
                  className="max-h-[74vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
