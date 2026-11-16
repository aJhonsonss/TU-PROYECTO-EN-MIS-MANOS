import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface PreloaderProps {
  ready?: boolean;
}

const INTRO_VIDEO_SRC = '/assets/intro-tu-proyecto.mp4';

export default function Preloader({ ready = true }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const dismissedRef = useRef(false);

  const readyRef = useRef(ready);

  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  const dismissIntro = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setVisible(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // If browser blocks autoplay, exit cleanly once ready or after brief fallback
          window.setTimeout(() => {
            if (readyRef.current) dismissIntro();
          }, 400);
        });
      }
    }

    // Hard safety timeout (~6.5s) in case the video takes too long or stalls on slow networks
    const maxTimer = window.setTimeout(() => {
      dismissIntro();
    }, 6500);

    return () => window.clearTimeout(maxTimer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000] text-[#F6F4EF] overflow-hidden select-none"
          aria-label="Presentación inicial Tu Proyecto en Mis Manos"
        >
          {/* Centered Pure Monochrome Logo Animation Video (Watermark Removed) */}
          <div className="relative w-full max-w-[min(88vw,78vh)] aspect-square flex items-center justify-center bg-[#000000]">
            <video
              ref={videoRef}
              src={INTRO_VIDEO_SRC}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={dismissIntro}
              onError={dismissIntro}
              className="w-full h-full object-contain pointer-events-none"
            />
            {/* Defense-in-depth pure-black mask on bottom-right corner */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 w-[26%] h-[12%] bg-[#000000]"
            />
          </div>

          {/* Subtle Skip Action */}
          <button
            type="button"
            onClick={dismissIntro}
            className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.06] hover:bg-white/14 border border-white/15 text-[11px] font-medium tracking-wide text-[#D5CEC3] hover:text-white transition-colors cursor-pointer"
          >
            <span>Saltar intro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
