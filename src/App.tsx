import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import ScrollTraceBeam from './components/ScrollTraceBeam';
import HeroSection from './components/HeroSection';
import ConstructionChronicle from './components/ConstructionChronicle';
import ServicesEcosystem from './components/ServicesEcosystem';
import RealProjectShowcase from './components/RealProjectShowcase';
import InteriorTour from './components/InteriorTour';
import LeadershipTrust from './components/LeadershipTrust';
import QuoteScheduler from './components/QuoteScheduler';
import Footer from './components/Footer';
import { ServicePillar } from './data/projectData';

export default function App() {
  const [sceneReady, setSceneReady] = useState(false);
  const [preselectedAddon, setPreselectedAddon] = useState<ServicePillar['id'] | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setSceneReady(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const navigateToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -64 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <div className="min-h-screen bg-[#F6F4EF] text-[#171614]">
      <Preloader ready={sceneReady} />
      <Navbar onNavigate={navigateToSection} />
      <ScrollTraceBeam />

      <main>
        <HeroSection
          onExploreStart={() => navigateToSection('cronologia')}
          onScheduleClick={() => navigateToSection('cotizador')}
          onCanvasReady={() => setSceneReady(true)}
        />

        <ConstructionChronicle />

        <ServicesEcosystem onSelectQuoteWithAddon={handleSelectQuoteWithAddon} />

        <RealProjectShowcase onScheduleClick={() => navigateToSection('cotizador')} />

        <InteriorTour />

        <LeadershipTrust onScheduleClick={() => navigateToSection('cotizador')} />

        <QuoteScheduler preselectedAddon={preselectedAddon} />
      </main>

      <Footer onNavigate={navigateToSection} />
    </div>
  );
}
