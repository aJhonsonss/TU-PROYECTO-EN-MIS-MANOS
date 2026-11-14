interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#0F0E0D] text-[#B8B0A4] border-t border-white/10 py-12">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <span className="font-display text-xl sm:text-2xl font-semibold tracking-wide uppercase text-[#F6F4EF]">
            Tu Proyecto en Mis Manos
          </span>
          <p className="mt-1.5 text-xs text-[#8E867B]">
            Arquitectura y Construcción de Casas Mediterráneas en Parcelas · Algarrobo · Santiago
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-6 text-xs">
          {[
            { id: 'hero-3d', label: 'Residencia' },
            { id: 'cronologia', label: 'Proceso' },
            { id: 'servicios', label: 'Servicios' },
            { id: 'obra-real', label: 'Obra Real' },
            { id: 'tour-interior', label: 'Tour Interior' },
            { id: 'equipo', label: 'Equipo' },
            { id: 'cotizador', label: 'Evaluar Terreno' },
          ].map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(link.id);
              }}
              className="hover:text-[#F6F4EF] transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="text-xs text-[#787268]">
          © {new Date().getFullYear()} TU PROYECTO EN MIS MANOS · Chile
        </div>
      </div>
    </footer>
  );
}
