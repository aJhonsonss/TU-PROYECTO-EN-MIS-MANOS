import { useState } from 'react';
import LegalTermsModal, { LegalTab } from './LegalTermsModal';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('privacidad');

  const openLegal = (tab: LegalTab) => {
    setLegalTab(tab);
    setLegalOpen(true);
  };

  return (
    <footer className="w-full max-w-full overflow-hidden bg-[#0F0E0D] text-[#B8B0A4] border-t border-white/10 py-10">
      <div className="max-w-[1360px] w-full max-w-full mx-auto px-4 sm:px-6 md:px-10 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="font-display text-xl sm:text-2xl font-semibold tracking-wide uppercase text-[#F6F4EF]">
              Tu Proyecto en Mis Manos
            </span>
            <p className="mt-1.5 text-xs text-[#8E867B]">
              Arquitectura y Construcción de Casas Mediterráneas en Parcelas · Quinta Región y Región
              Metropolitana
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2.5 sm:gap-6 text-xs">
            {[
              { id: 'hero-3d', label: 'Residencia' },
              { id: 'cronologia', label: 'Proceso' },
              { id: 'servicios', label: 'Servicios' },
              { id: 'obra-real', label: 'Obra Real' },
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

        <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-[#8E867B]">
          <span>
            Resguardo de datos personales conforme a Ley N° 19.628 y nueva Ley N° 21.719 de Chile.
          </span>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => openLegal('terminos')}
              className="text-[#B8B0A4] hover:text-[#DFC8AA] underline underline-offset-4 transition-colors cursor-pointer"
            >
              Términos y Condiciones
            </button>
            <button
              type="button"
              onClick={() => openLegal('privacidad')}
              className="text-[#B8B0A4] hover:text-[#DFC8AA] underline underline-offset-4 transition-colors cursor-pointer"
            >
              Protección de Datos Personales
            </button>
          </div>
        </div>
      </div>

      <LegalTermsModal
        open={legalOpen}
        initialTab={legalTab}
        onClose={() => setLegalOpen(false)}
      />
    </footer>
  );
}
