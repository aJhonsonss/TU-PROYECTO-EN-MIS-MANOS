import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { id: 'hero-3d', label: 'Residencia' },
  { id: 'cronologia', label: 'Proceso' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'obra-real', label: 'Obra Real' },
  { id: 'equipo', label: 'Equipo' },
];

const DARK_SECTION_IDS = new Set(['hero-3d', 'servicios', 'obra-real', 'cotizador']);
const SECTION_ORDER = [
  'hero-3d',
  'cronologia',
  'servicios',
  'obra-real',
  'equipo',
  'areas-tecnicas',
  'cotizador',
];

export default function Navbar({ onNavigate }: NavbarProps) {
  const [isLightSurface, setIsLightSurface] = useState(false);
  const [activeSection, setActiveSection] = useState('hero-3d');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const updateSurfaceTheme = () => {
      // Probe below the floating header (~110px) so the header matches the section actually filling the screen
      const probeY = 110;
      let matchedId = 'hero-3d';

      for (const id of SECTION_ORDER) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) {
          matchedId = id;
          break;
        }
      }

      setActiveSection(matchedId);
      setIsLightSurface(!DARK_SECTION_IDS.has(matchedId));
    };

    updateSurfaceTheme();
    window.addEventListener('scroll', updateSurfaceTheme, { passive: true });
    window.addEventListener('resize', updateSurfaceTheme, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateSurfaceTheme);
      window.removeEventListener('resize', updateSurfaceTheme);
    };
  }, []);

  const handleLinkClick = (id: string) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header className="fixed top-2.5 sm:top-3 inset-x-0 w-full max-w-full z-40 px-3 sm:px-6 pointer-events-none">
      <div
        className={`pointer-events-auto max-w-[1320px] w-full max-w-full mx-auto px-4 sm:px-5 h-[52px] rounded-full backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 flex items-center justify-between gap-3 md:gap-5 ${
          isLightSurface
            ? 'bg-[#F6F4EF]/78 text-[#171614] border border-[#171614]/12 shadow-[0_14px_34px_rgba(23,22,20,0.12)]'
            : 'bg-[#171614]/68 text-[#F6F4EF] border border-white/14 shadow-[0_16px_40px_rgba(0,0,0,0.42)]'
        }`}
      >
        {/* Zone 1: Brand wordmark with warm champagne architectural dot */}
        <a
          href="#hero-3d"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('hero-3d');
          }}
          className="inline-flex items-center gap-2 font-display text-[13px] sm:text-base lg:text-lg font-semibold tracking-wide uppercase whitespace-nowrap min-w-0 flex-1 lg:flex-initial focus-visible:outline-2 focus-visible:outline-[#C49A6C]"
        >
          <span
            aria-hidden="true"
            className="w-2 h-2 rounded-full bg-[#C49A6C] shrink-0 shadow-[0_0_8px_rgba(196,154,108,0.8)]"
          />
          <span className="truncate">Tu Proyecto en Mis Manos</span>
        </a>

        {/* Zone 2: Soft floating pill navigation with active section state */}
        <nav className="hidden lg:flex items-center gap-1 text-[13px] font-medium">
          {NAV_ITEMS.map((item) => {
            const isCurrent =
              activeSection === item.id ||
              (item.id === 'equipo' && activeSection === 'areas-tecnicas');
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.id);
                }}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#C49A6C] ${
                  isCurrent
                    ? isLightSurface
                      ? 'bg-[#171614] text-[#F6F4EF]'
                      : 'bg-white/14 text-[#DFC8AA]'
                    : isLightSurface
                      ? 'text-[#3A3631] hover:text-[#171614] hover:bg-[#171614]/[0.06]'
                      : 'text-[#DED8CE] hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Rounded pill CTA + mobile toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('cotizador')}
            className={`hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C49A6C] ${
              isLightSurface
                ? 'bg-[#171614] text-[#F6F4EF] hover:bg-[#2F2D29] shadow-sm'
                : 'bg-[#DFC8AA] text-[#141311] hover:bg-[#EAD6BC] shadow-sm'
            }`}
          >
            Evaluar Terreno
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className={`lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#C49A6C] ${
              isLightSurface ? 'hover:bg-[#171614]/[0.06]' : 'hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating glassmorphism mobile navigation drawer */}
      {mobileOpen && (
        <div
          className={`pointer-events-auto lg:hidden max-w-[1320px] mx-auto mt-2 rounded-3xl backdrop-blur-2xl px-5 py-4 flex flex-col gap-1.5 shadow-[0_20px_45px_rgba(0,0,0,0.28)] border ${
            isLightSurface
              ? 'bg-[#F6F4EF]/94 text-[#171614] border-[#171614]/12'
              : 'bg-[#171614]/94 text-[#F6F4EF] border-white/14'
          }`}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.id);
              }}
              className={`py-2.5 px-3.5 rounded-2xl text-sm font-medium transition-colors ${
                activeSection === item.id ||
                (item.id === 'equipo' && activeSection === 'areas-tecnicas')
                  ? isLightSurface
                    ? 'bg-[#171614] text-[#F6F4EF]'
                    : 'bg-white/14 text-[#DFC8AA]'
                  : isLightSurface
                    ? 'hover:bg-[#171614]/[0.06]'
                    : 'hover:bg-white/10'
              }`}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => handleLinkClick('cotizador')}
            className={`mt-2 w-full py-3 px-4 rounded-full text-sm font-semibold text-center cursor-pointer ${
              isLightSurface ? 'bg-[#171614] text-[#F6F4EF]' : 'bg-[#DFC8AA] text-[#141311]'
            }`}
          >
            Evaluar Terreno
          </button>
        </div>
      )}
    </header>
  );
}
