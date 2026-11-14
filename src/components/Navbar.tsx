import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { id: 'hero-3d', label: 'Residencia' },
  { id: 'cronologia', label: 'Proceso' },
  { id: 'obra-real', label: 'Obra Real' },
  { id: 'tour-interior', label: 'Tour Interior' },
  { id: 'equipo', label: 'Equipo' },
];

export default function Navbar({ onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (id: string) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 border-b ${
        scrolled
          ? 'bg-[#F6F4EF] text-[#171614] border-[#171614]/12 shadow-sm'
          : 'bg-[#141311]/95 text-[#F6F4EF] border-white/10'
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#hero-3d"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('hero-3d');
          }}
          className="font-display text-base sm:text-lg lg:text-xl font-semibold tracking-wide uppercase whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#9E7B4F]"
        >
          Tu Proyecto en Mis Manos
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.id);
              }}
              className="nav-link-underline py-1 whitespace-nowrap shrink-0 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[#9E7B4F]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('cotizador')}
            className={`hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#9E7B4F] ${
              scrolled
                ? 'bg-[#171614] text-[#F6F4EF] hover:bg-[#2F2D29]'
                : 'bg-[#F6F4EF] text-[#171614] hover:bg-[#E5E0D6]'
            }`}
          >
            Evaluar Terreno
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#9E7B4F]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#F6F4EF] text-[#171614] border-t border-[#171614]/10 px-6 py-5 flex flex-col gap-3">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(item.id);
              }}
              className="py-2.5 text-base font-medium border-b border-[#171614]/8"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => handleLinkClick('cotizador')}
            className="mt-2 w-full py-3 px-4 bg-[#171614] text-[#F6F4EF] text-sm font-semibold text-center cursor-pointer"
          >
            Evaluar Terreno
          </button>
        </div>
      )}
    </header>
  );
}
