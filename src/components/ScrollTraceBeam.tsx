import { motion, useScroll, useSpring, useTransform } from 'motion/react';

export default function ScrollTraceBeam() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  const beamTop = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <div
      aria-hidden="true"
      className="hidden xl:block fixed left-5 top-28 bottom-12 z-30 w-5 pointer-events-none"
    >
      {/* Background hairline rail */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[#9E7B4F]/20" />

      {/* Active illuminated tracing stroke */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] bg-gradient-to-b from-[#C49A6C]/20 via-[#C49A6C] to-[#F6F4EF] origin-top rounded-full"
        style={{ height: '100%', scaleY: smoothProgress }}
      />

      {/* Moving architectural reticle / drafting head */}
      <motion.div
        style={{ top: beamTop }}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#141311] border-2 border-[#C49A6C] shadow-[0_0_12px_rgba(196,154,108,0.65)] flex items-center justify-center"
      >
        <span className="w-1 h-1 rounded-full bg-[#F6F4EF]" />
      </motion.div>
    </div>
  );
}
