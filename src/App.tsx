import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import ScrollTraceBeam from './components/ScrollTraceBeam';
import HeroSection from './components/HeroSection';
import ConstructionChronicle from './components/ConstructionChronicle';
import ServicesEcosystem from './components/ServicesEcosystem';
import RealProjectShowcase from './components/RealProjectShowcase';
import LeadershipTrust from './components/LeadershipTrust';
import QuoteScheduler from './components/QuoteScheduler';
import Footer from './components/Footer';
import { ServicePillar } from './data/projectData';

const SNAP_SECTION_IDS = [
  'hero-3d',
  'cronologia',
  'servicios',
  'obra-real',
  'equipo',
  'areas-tecnicas',
  'cotizador',
];

export default function App() {
  const [sceneReady, setSceneReady] = useState(false);
  const [preselectedAddon, setPreselectedAddon] = useState<ServicePillar['id'] | null>(null);
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const isAutoAligningRef = useRef(false);
  const isPointerDownRef = useRef(false);

  useEffect(() => {
    const onQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis: Lenis | null = null;
    let rafId = 0;
    let settleTimer: number | null = null;

    if (!prefersReduced) {
      lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    const alignNearestSectionEdge = () => {
      if (isPointerDownRef.current || isAutoAligningRef.current) return;
      if (window.innerWidth < 1024) return;

      let closestEl: HTMLElement | null = null;
      let smallestAbsTop = Infinity;

      for (const id of SNAP_SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const absTop = Math.abs(el.getBoundingClientRect().top);
        if (absTop < smallestAbsTop) {
          smallestAbsTop = absTop;
          closestEl = el;
        }
      }

      // Auto-adjust when stopped within 180px of a section boundary so partial slivers never peek above or below the slide
      if (closestEl && smallestAbsTop > 2 && smallestAbsTop <= 180) {
        isAutoAligningRef.current = true;
        if (lenisRef.current) {
          lenisRef.current.scrollTo(closestEl, {
            offset: 0,
            duration: 0.42,
            onComplete: () => {
              window.setTimeout(() => {
                isAutoAligningRef.current = false;
              }, 120);
            },
          });
        } else {
          closestEl.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
          window.setTimeout(() => {
            isAutoAligningRef.current = false;
          }, 420);
        }
      }
    };

    const scheduleSettleAlign = () => {
      if (isAutoAligningRef.current) return;
      if (settleTimer !== null) window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(alignNearestSectionEdge, 160);
    };

    const onPointerDown = () => {
      isPointerDownRef.current = true;
      if (settleTimer !== null) window.clearTimeout(settleTimer);
    };
    const onPointerUp = () => {
      isPointerDownRef.current = false;
      scheduleSettleAlign();
    };

    if (lenis) {
      lenis.on('scroll', scheduleSettleAlign);
    }
    window.addEventListener('scroll', scheduleSettleAlign, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });

    return () => {
      if (settleTimer !== null) window.clearTimeout(settleTimer);
      window.removeEventListener('scroll', scheduleSettleAlign);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) {
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setSceneReady(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const navigateToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    isAutoAligningRef.current = true;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, {
        offset: 0,
        onComplete: () => {
          window.setTimeout(() => {
            isAutoAligningRef.current = false;
          }, 120);
        },
      });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => {
        isAutoAligningRef.current = false;
      }, 600);
    }
  }, []);

  const handleSelectQuoteWithAddon = useCallback(
    (serviceId: ServicePillar['id']) => {
      setPreselectedAddon(serviceId);
      navigateToSection('cotizador');
    },
    [navigateToSection]
  );

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F6F4EF] text-[#171614]">
      {mapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <Preloader ready={sceneReady} />
      <Navbar onNavigate={navigateToSection} />
      <ScrollTraceBeam />

      <main className="w-full max-w-full overflow-hidden">
        <div className="relative min-h-[100vh] lg:h-[100vh] w-full flex flex-col overflow-hidden">
          <HeroSection
            onExploreStart={() => navigateToSection('cronologia')}
            onScheduleClick={() => navigateToSection('cotizador')}
            onCanvasReady={() => setSceneReady(true)}
          />
        </div>

        <div className="relative min-h-[100vh] lg:h-[100vh] w-full flex flex-col overflow-hidden">
          <ConstructionChronicle />
        </div>

        <div className="relative min-h-[100vh] lg:h-[100vh] w-full flex flex-col overflow-hidden">
          <ServicesEcosystem onSelectQuoteWithAddon={handleSelectQuoteWithAddon} />
        </div>

        <div className="relative min-h-[100vh] lg:h-[100vh] w-full flex flex-col overflow-hidden">
          <RealProjectShowcase onScheduleClick={() => navigateToSection('cotizador')} />
        </div>

        <LeadershipTrust onScheduleClick={() => navigateToSection('cotizador')} />

        <QuoteScheduler preselectedAddon={preselectedAddon} />
      </main>

      <Footer onNavigate={navigateToSection} />
    </div>
  );
}
