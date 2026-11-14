import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  ready: boolean;
}

export default function Preloader({ ready }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - start;
      const target = ready ? 100 : Math.min(88, Math.floor((elapsed / 900) * 88));
      setProgress((prev) => (prev < target ? Math.min(target, prev + (ready ? 6 : 3)) : prev));

      if (ready && target === 100) {
        setProgress(100);
        window.setTimeout(() => setVisible(false), 320);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-[#141311] text-[#F6F4EF] px-6 py-8 md:px-12 md:py-10"
          aria-live="polite"
        >
          <div className="flex items-center justify-between text-xs tracking-wide text-[#A39B8F]">
            <span>TU PROYECTO EN MIS MANOS</span>
            <span>Algarrobo · Santiago</span>
          </div>

          <div className="max-w-xl">
            <p className="font-display text-3xl md:text-5xl font-normal leading-tight text-[#F6F4EF]">
              Construimos tu sueño en hormigón, piedra y luz.
            </p>
            <div className="mt-8 w-full h-px bg-white/15 overflow-hidden">
              <div
                className="h-full bg-[#C49A6C] transition-transform duration-200 origin-left"
                style={{ transform: `scaleX(${progress / 100})` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#A39B8F]">
              <span>Preparando recorrido arquitectónico interactivo</span>
              <span className="font-mono-tech tabular-nums text-[#F6F4EF]">{progress}%</span>
            </div>
          </div>

          <div className="text-xs text-[#787268]">
            Parcelas · Casas Mediterráneas · Quinchos · Piscinas
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
