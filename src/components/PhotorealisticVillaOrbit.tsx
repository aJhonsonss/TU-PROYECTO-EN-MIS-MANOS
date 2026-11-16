import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ORBIT_ANGLES, ZONE_VISIT_POINTS, ZoneVisitPoint } from '../data/projectData';

interface PhotorealisticVillaOrbitProps {
  activeZone: ZoneVisitPoint;
  onZoneSyncFromDrag?: (zone: ZoneVisitPoint) => void;
  onUserInteract?: () => void;
}

export default function PhotorealisticVillaOrbit({
  activeZone,
  onZoneSyncFromDrag,
  onUserInteract,
}: PhotorealisticVillaOrbitProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; startAngle: number }>({ x: 0, startAngle: 2 });

  const angleIndex = activeZone.angleIndex;
  const zoom = activeZone.zoom;
  const pan = { x: activeZone.panX, y: activeZone.panY };

  // Keep steady base frame underneath incoming cross-fade image to avoid any mid-dissolve brightness dip
  const [baseAngleIndex, setBaseAngleIndex] = useState<number>(angleIndex);
  const prevAngleRef = useRef<number>(angleIndex);

  useEffect(() => {
    ORBIT_ANGLES.forEach((angle) => {
      const img = new Image();
      img.src = angle.image;
    });
  }, []);

  useEffect(() => {
    dragStartRef.current.startAngle = activeZone.angleIndex;
    if (prevAngleRef.current !== activeZone.angleIndex) {
      setBaseAngleIndex(prevAngleRef.current);
      prevAngleRef.current = activeZone.angleIndex;
    }
  }, [activeZone.angleIndex]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    onUserInteract?.();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, startAngle: angleIndex };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const stepDelta = Math.round(-dx / 120);
    const nextAngle = Math.max(
      0,
      Math.min(ORBIT_ANGLES.length - 1, dragStartRef.current.startAngle + stepDelta)
    );
    if (nextAngle !== angleIndex) {
      const matchedZone =
        ZONE_VISIT_POINTS.find((z) => z.angleIndex === nextAngle) ?? ZONE_VISIT_POINTS[0];
      onZoneSyncFromDrag?.(matchedZone);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const baseAngle = ORBIT_ANGLES[baseAngleIndex] || ORBIT_ANGLES[2];
  const currentAngle = ORBIT_ANGLES[angleIndex] || ORBIT_ANGLES[2];
  const captionTitle =
    activeZone.id === 'general' ? currentAngle.label : `${activeZone.label} · ${currentAngle.label}`;
  const captionText =
    activeZone.id === 'general' ? currentAngle.description : activeZone.summary;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={() => setIsDragging(false)}
      className={`relative w-full h-full overflow-hidden bg-[#161513] select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Zero-Dip Optical Cross-Fade Stage with Natural Camera Color Fidelity */}
      <motion.div
        animate={{
          scale: zoom,
          x: `${pan.x}%`,
          y: `${pan.y}%`,
        }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-full will-change-transform brightness-[0.99] contrast-[1.02] saturate-[0.93]"
      >
        {/* Steady under-layer preserves constant luminance during dissolve */}
        <img
          src={baseAngle.image}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />

        {/* Seamless cross-fade incoming layer */}
        <AnimatePresence initial={false}>
          <motion.img
            key={currentAngle.id}
            src={currentAngle.image}
            alt={currentAngle.imageAlt}
            referrerPolicy="no-referrer"
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover object-center z-10"
          />
        </AnimatePresence>
      </motion.div>

      {/* Subtle bottom gradient scrim for caption contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 z-[15] bg-gradient-to-t from-[#141311]/80 via-[#141311]/35 to-transparent"
      />

      {/* Flex-Centered Soft Translucent Explanatory Caption Over Photo */}
      <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5 sm:inset-x-3 sm:bottom-3 z-20 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeZone.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
            className="px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl bg-[#141311]/84 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs leading-snug text-[#F2EDE4] text-center max-w-[min(36rem,100%)] shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          >
            <span className="text-[#DFC8AA] font-medium mr-1.5">{captionTitle}:</span>
            <span className="text-[#EBE6DD]">{captionText}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
