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
import { RevealBlock } from './MotionPrimitives';

interface RealProjectShowcaseProps {
  onScheduleClick: () => void;
}

const STORY_DURATION_MS = 5000;

export default function RealProjectShowcase({ onScheduleClick }: RealProjectShowcaseProps) {
  const [activeMode, setActiveMode] = useState<'story' | 'finished'>('story');
  const [slideIndex, setSlideIndex] = useState(0);
  const [baseSlideIndex, setBaseSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Finished project curtain split comparator state
  const [splitPercent, setSplitPercent] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);

  const compareRef = useRef<HTMLDivElement | null>(null);
  const draggingSplitRef = useRef(false);
  const prevSlideRef = useRef(0);

  const baseSlide = REAL_PROJECT_STORY_SLIDES[baseSlideIndex] ?? REAL_PROJECT_STORY_SLIDES[0];
  const currentSlide = REAL_PROJECT_STORY_SLIDES[slideIndex] ?? REAL_PROJECT_STORY_SLIDES[0];
  const activeComparison = REAL_PROJECT_COMPARISONS[0];

  // Preload all 9 story slides and finished comparison photos so transitions never flash dark
  useEffect(() => {
    REAL_PROJECT_STORY_SLIDES.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
    REAL_PROJECT_COMPARISONS.forEach((c) => {
      const b = new Image();
      b.src = c.beforeImage;
      const a = new Image();
      a.src = c.afterImage;
    });
  }, []);

  useEffect(() => {
    if (prevSlideRef.current !== slideIndex) {
      setBaseSlideIndex(prevSlideRef.current);
      prevSlideRef.current = slideIndex;
    }
  }, [slideIndex]);

  const goToSlide = useCallback((nextIdx: number) => {
    const normalized =
      (nextIdx + REAL_PROJECT_STORY_SLIDES.length) % REAL_PROJECT_STORY_SLIDES.length;
    setSlideIndex(normalized);
    setProgress(0);
  }, []);

  // Story auto-advance timer
  useEffect(() => {
    if (activeMode !== 'story' || !isPlaying) return;

    const tickMs = 50;
    const step = (tickMs / STORY_DURATION_MS) * 100;
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          setSlideIndex((idx) => (idx + 1) % REAL_PROJECT_STORY_SLIDES.length);
          return 0;
        }
        return prev + step;
      });
    }, tickMs);

    return () => window.clearInterval(interval);
  }, [activeMode, isPlaying]);

  // Split curtain pointer handling (0% to 100% smooth comparison)
  const updateSplitFromClientX = useCallback((clientX: number) => {
    if (!compareRef.current) return;
    const rect = compareRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, pct));
    setSplitPercent(clamped);
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

  return (
    <section
      id="obra-real"
      className="w-full max-w-full flex-1 overflow-hidden bg-[#141311] text-[#F6F4EF] pt-[82px] pb-12 sm:pt-24 sm:pb-14 lg:pt-[68px] lg:pb-4 flex flex-col justify-center border-t border-white/10"
    >
      <div className="max-w-[1360px] w-full max-w-full mx-auto px-4 sm:px-6 md:px-10">
        {/* Compact Viewport-Fitted Header */}
        <RevealBlock className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 pb-3 border-b border-white/12">
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-wide text-[#C8A878]">
              Proyecto Real Ejecutado · Evidencia en Terreno
            </p>
            <h2
              className="mt-0.5 font-display font-normal leading-[1.06] tracking-tight text-[#F6F4EF]"
              style={{ fontSize: 'clamp(1.45rem, 2.25vw, 2.1rem)', textWrap: 'balance' }}
            >
              Casa Pinos del Pacífico: historia real hasta la entrega final.
            </h2>
          </div>

          {/* Interactive mode switcher */}
          <div className="flex flex-wrap sm:inline-flex p-1 rounded-xl bg-white/[0.05] border border-white/12 max-w-full shrink-0 self-start lg:self-auto gap-1">
            <button
              type="button"
              onClick={() => setActiveMode('story')}
              className={`relative px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'story' ? 'text-[#141311]' : 'text-[#C5BEB4] hover:text-[#F6F4EF]'
              }`}
            >
              {activeMode === 'story' && (
                <motion.span
                  layoutId="realProjectModePill"
                  transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-[#F6F4EF]"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Carrusel de Historia ({REAL_PROJECT_STORY_SLIDES.length})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('finished')}
              className={`relative px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeMode === 'finished' ? 'text-[#141311]' : 'text-[#C5BEB4] hover:text-[#F6F4EF]'
              }`}
            >
              {activeMode === 'finished' && (
                <motion.span
                  layoutId="realProjectModePill"
                  transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                  className="absolute inset-0 rounded-lg bg-[#C8A878]"
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3.5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch w-full max-w-full"
            >
              {/* Left 7 cols: Compact Story Viewer Frame (Full Uncropped Photo + Caption Fit In 100vh) */}
              <div className="lg:col-span-7 min-w-0 w-full max-w-full rounded-2xl overflow-hidden border border-white/12 bg-[#0D0C0B] shadow-2xl flex flex-col">
                {/* Top Story Progress Bar + Playback Controls */}
                <div className="px-4 pt-3 pb-2.5 border-b border-white/10 bg-[#181614]">
                  <div
                    className="grid gap-1 sm:gap-1.5 mb-2"
                    style={{
                      gridTemplateColumns: `repeat(${REAL_PROJECT_STORY_SLIDES.length}, minmax(0, 1fr))`,
                    }}
                  >
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

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono-tech text-[11px] text-[#C8A878] tabular-nums shrink-0">
                        CAPÍTULO {currentSlide.chapter} /{' '}
                        {String(REAL_PROJECT_STORY_SLIDES.length).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] text-[#A39A8E] hidden sm:inline truncate">
                        {currentSlide.phase}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsPlaying((p) => !p)}
                        aria-label={isPlaying ? 'Pausar historia' : 'Reproducir historia'}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/12 border border-white/12 text-[11px] text-[#F6F4EF] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-3 h-3 text-[#C8A878]" />
                            Pausar
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 text-[#C8A878]" />
                            Reanudar
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => goToSlide(slideIndex - 1)}
                        aria-label="Capítulo anterior"
                        className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/12 border border-white/12 flex items-center justify-center text-[#F6F4EF] transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => goToSlide(slideIndex + 1)}
                        aria-label="Siguiente capítulo"
                        className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/12 border border-white/12 flex items-center justify-center text-[#F6F4EF] transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Zero-Dip Cross-Fade Photo Viewport (Natural Landscape Perspective on Mobile & Desktop) */}
                <div className="relative aspect-[16/10] sm:aspect-auto sm:h-[300px] lg:h-[clamp(250px,41vh,420px)] bg-[#0B0A09] overflow-hidden select-none">
                  {/* Steady Base Frame Underneath */}
                  <img
                    src={baseSlide.image}
                    alt=""
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                  />

                  {/* Smooth Incoming Cross-Fade Layer */}
                  <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -55) goToSlide(slideIndex + 1);
                      else if (info.offset.x > 55) goToSlide(slideIndex - 1);
                    }}
                    className="absolute inset-0 z-10 bg-[#0B0A09] cursor-grab active:cursor-grabbing"
                  >
                    <img
                      src={currentSlide.image}
                      alt={currentSlide.imageAlt}
                      referrerPolicy="no-referrer"
                      draggable={false}
                      className="w-full h-full object-cover object-center"
                    />
                  </motion.div>

                  <button
                    type="button"
                    onClick={() => goToSlide(slideIndex - 1)}
                    aria-label="Historia anterior"
                    className="absolute left-0 top-0 bottom-0 w-1/6 z-20 cursor-pointer focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => goToSlide(slideIndex + 1)}
                    aria-label="Historia siguiente"
                    className="absolute right-0 top-0 bottom-0 w-1/6 z-20 cursor-pointer focus:outline-none"
                  />
                </div>

                {/* Compact Bottom Narrative Deck (Always 100% Visible) */}
                <div className="px-4 py-3 border-t border-white/10 bg-[#181614] flex flex-col justify-between gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono-tech text-[10px] uppercase tracking-[0.14em] text-[#C8A878] truncate">
                      {currentSlide.technicalNote}
                    </span>
                    {currentSlide.isEnhanced && (
                      <span className="font-mono-tech text-[10px] uppercase tracking-[0.14em] text-[#E6C792] flex items-center gap-1 shrink-0">
                        <Sparkles className="w-3 h-3" />
                        Acabado Final
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-normal text-[#F6F4EF] leading-tight">
                      {currentSlide.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#C5BEB4] leading-relaxed line-clamp-2">
                      {currentSlide.caption}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono-tech text-[10px] text-[#8E867B]">
                      Desliza la foto o elige cualquiera de los {REAL_PROJECT_STORY_SLIDES.length} hitos
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

              {/* Right 5 cols: All 14 Chapters Visible Simultaneously in Balanced 4-Column Grid */}
              <div className="lg:col-span-5 min-w-0 w-full max-w-full flex flex-col justify-between gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#A39A8E]">
                    Bitácora Cronológica · {REAL_PROJECT_STORY_SLIDES.length} Hitos Reales
                  </span>
                  <span className="font-mono-tech text-[11px] text-[#C8A878] tabular-nums">
                    {Math.round(((slideIndex + 1) / REAL_PROJECT_STORY_SLIDES.length) * 100)}%
                  </span>
                </div>

                {/* Progress Bar Line */}
                <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#9E7B4F] to-[#E6C792]"
                    animate={{
                      width: `${((slideIndex + 1) / REAL_PROJECT_STORY_SLIDES.length) * 100}%`,
                    }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>

                {/* Balanced 4-Column Thumbnail Grid — All 13 Chapters Visible Without Scrolling */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 flex-1">
                  {REAL_PROJECT_STORY_SLIDES.map((s, idx) => {
                    const isActive = idx === slideIndex;
                    const isFinale = idx === REAL_PROJECT_STORY_SLIDES.length - 1;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => goToSlide(idx)}
                        className={`group relative rounded-xl overflow-hidden border text-left transition-all duration-200 flex cursor-pointer ${
                          isFinale
                            ? 'col-span-2 sm:col-span-4 flex-row items-center min-h-[54px] sm:min-h-[58px]'
                            : 'flex-col min-h-[72px] sm:min-h-[78px]'
                        } ${
                          isActive
                            ? 'border-[#C8A878] ring-2 ring-[#C8A878]/35 bg-[#1F1D1A] shadow-lg'
                            : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div
                          className={`relative overflow-hidden bg-[#0D0C0B] shrink-0 ${
                            isFinale ? 'w-20 sm:w-28 h-full min-h-[54px]' : 'h-14 sm:h-11 w-full'
                          }`}
                        >
                          <img
                            src={s.image}
                            alt={s.title}
                            referrerPolicy="no-referrer"
                            className={`w-full h-full object-cover object-center transition-transform duration-300 ${
                              isActive ? 'scale-105' : 'group-hover:scale-105 opacity-80'
                            }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#141311]/75 via-transparent to-transparent" />
                          <span
                            className={`absolute top-1 left-1 px-1.5 py-0.5 rounded font-mono-tech text-[9px] font-bold ${
                              isActive
                                ? 'bg-[#C8A878] text-[#141311]'
                                : 'bg-[#141311]/85 text-[#F6F4EF]'
                            }`}
                          >
                            {s.chapter}
                          </span>
                          {s.isEnhanced && (
                            <Sparkles className="absolute top-1 right-1 w-3 h-3 text-[#C8A878]" />
                          )}
                        </div>

                        <div className="px-2.5 py-1.5 flex-1 flex flex-col justify-center min-w-0">
                          {isFinale && (
                            <span className="font-mono-tech text-[9px] uppercase tracking-[0.14em] text-[#C8A878] mb-0.5">
                              Entrega Final
                            </span>
                          )}
                          <p
                            className={`font-medium leading-tight ${
                              isFinale ? 'text-[11px] truncate' : 'text-[10px] line-clamp-2'
                            } ${isActive ? 'text-[#F6F4EF]' : 'text-[#C5BEB4]'}`}
                          >
                            {s.title}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Action CTA */}
                <button
                  type="button"
                  onClick={onScheduleClick}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#C8A878] text-[#141311] hover:bg-[#D9BA8A] text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  Cotizar Proyecto Similar en Tu Parcela
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="mode-finished"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3.5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch w-full max-w-full"
            >
              {/* Left 9 cols: Clean Draggable Curtain Comparator (Image 1 vs Last Image, Zero Pins) */}
              <div className="lg:col-span-9 min-w-0 w-full max-w-full flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#C8A878]">
                    Comparativa Directa · {activeComparison.label}
                  </span>

                  <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C8A878] text-[#141311] hover:bg-[#D9BA8A] text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Expandir vista completa
                  </button>
                </div>

                {/* Comparison Canvas */}
                <div className="rounded-2xl overflow-hidden border border-white/12 bg-[#0B0A09] shadow-2xl">
                  <div
                    ref={compareRef}
                    onPointerDown={(e) => {
                      draggingSplitRef.current = true;
                      updateSplitFromClientX(e.clientX);
                    }}
                    className="relative w-full aspect-[16/10] sm:aspect-auto sm:h-[340px] lg:h-[clamp(300px,46vh,460px)] overflow-hidden cursor-ew-resize select-none touch-none"
                  >
                    {/* Right / Underneath layer: Image 1 (Inicio de Obra) */}
                    <img
                      src={activeComparison.beforeImage}
                      alt={activeComparison.beforeLabel}
                      referrerPolicy="no-referrer"
                      draggable={false}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />

                    {/* Left / Clipped Top layer: Last Image (Proyecto Terminado) */}
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - splitPercent}% 0 0)` }}
                    >
                      <img
                        src={activeComparison.afterImage}
                        alt={activeComparison.afterLabel}
                        referrerPolicy="no-referrer"
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* Clean Corner State Labels */}
                    <span className="pointer-events-none absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20 px-2 sm:px-2.5 py-1 rounded-lg bg-[#141311]/85 border border-[#C8A878]/50 font-mono-tech text-[9px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.12em] text-[#C8A878]">
                      {activeComparison.afterLabel}
                    </span>
                    <span className="pointer-events-none absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 px-2 sm:px-2.5 py-1 rounded-lg bg-[#141311]/85 border border-white/20 font-mono-tech text-[9px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.12em] text-[#F6F4EF]">
                      {activeComparison.beforeLabel}
                    </span>

                    {/* Vertical Split Handle */}
                    <div
                      className="absolute top-0 bottom-0 w-[2px] bg-[#C8A878] pointer-events-none shadow-lg z-20"
                      style={{ left: `${splitPercent}%` }}
                    >
                      <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#141311] border-2 border-[#C8A878] text-[#F6F4EF] flex items-center justify-center shadow-xl">
                        <MoveHorizontal className="w-4 h-4 text-[#C8A878]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Moving Selector Controls (Full-Width Range on Mobile) */}
                <div className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="order-1 sm:order-2 flex items-center w-full sm:w-auto">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(splitPercent)}
                      onChange={(e) => setSplitPercent(Number(e.target.value))}
                      aria-label="Selector deslizable entre inicio de obra y proyecto terminado"
                      className="w-full sm:w-56 accent-[#C8A878] cursor-pointer"
                    />
                  </div>
                  <div className="order-2 sm:order-1 flex items-center justify-between sm:contents gap-2">
                    <span className="font-mono-tech text-[10px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.12em] text-[#C8A878]">
                      ← {activeComparison.afterLabel} ({Math.round(splitPercent)}%)
                    </span>
                    <span className="order-3 font-mono-tech text-[10px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.12em] text-[#A39A8E]">
                      {activeComparison.beforeLabel} →
                    </span>
                  </div>
                </div>
              </div>

              {/* Right 3 cols: Clean Summary & CTAs (Zero Hotspots, Zero Living Doble Altura Button) */}
              <div className="lg:col-span-3 min-w-0 w-full max-w-full flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div>
                  <span className="font-mono-tech text-[10px] uppercase tracking-[0.18em] text-[#C8A878]">
                    Antes y Después Real
                  </span>
                  <h3 className="mt-1.5 font-display text-xl sm:text-2xl font-normal text-[#F6F4EF] leading-tight">
                    {activeComparison.title}
                  </h3>
                  <p className="mt-2.5 text-xs text-[#C5BEB4] leading-relaxed">
                    {activeComparison.subtitle}
                  </p>
                </div>

                <div className="space-y-2 py-3 border-y border-white/10 text-xs text-[#D6D0C6]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#968E83]">Izquierda</span>
                    <span className="font-medium text-[#C8A878] text-right">
                      {activeComparison.afterLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#968E83]">Derecha</span>
                    <span className="font-medium text-[#F6F4EF] text-right">
                      {activeComparison.beforeLabel}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={onScheduleClick}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#C8A878] text-[#141311] hover:bg-[#D9BA8A] text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
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

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Cerrar vista ampliada"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#F6F4EF] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
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
