import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, FileText, Lock, ShieldCheck, X } from 'lucide-react';

export type LegalTab = 'privacidad' | 'terminos';

interface LegalTermsModalProps {
  open: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
  onAcceptAndClose?: () => void;
}

export default function LegalTermsModal({
  open,
  initialTab = 'privacidad',
  onClose,
  onAcceptAndClose,
}: LegalTermsModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#0A0908]/88 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90dvh] rounded-2xl sm:rounded-3xl bg-[#141311] border border-white/15 text-[#F6F4EF] shadow-[0_28px_80px_rgba(0,0,0,0.75)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 sm:px-6 border-b border-white/10 bg-[#181614] flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#C49A6C]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Resguardo Legal Chile · Ley N° 19.628 y Ley N° 21.719</span>
                </div>
                <h3
                  id="legal-modal-title"
                  className="mt-1 font-display text-xl sm:text-2xl font-normal text-[#F6F4EF]"
                >
                  Términos, Condiciones y Protección de Datos Personales
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar ventana legal"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#F6F4EF] transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-5 sm:px-6 pt-3 pb-2.5 border-b border-white/10 bg-[#161412] flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('privacidad')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'privacidad'
                    ? 'bg-[#C49A6C] text-[#141311]'
                    : 'bg-white/[0.05] text-[#D5CEC3] hover:bg-white/10'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Política de Datos (Ley N° 21.719)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('terminos')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'terminos'
                    ? 'bg-[#C49A6C] text-[#141311]'
                    : 'bg-white/[0.05] text-[#D5CEC3] hover:bg-white/10'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Términos y Condiciones de Uso</span>
              </button>
            </div>

            {/* Scrollable Body */}
            <div
              data-lenis-prevent
              data-lenis-prevent-wheel
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5 space-y-4 text-xs sm:text-[13px] leading-relaxed text-[#CFC8BC]"
            >
              {activeTab === 'privacidad' ? (
                <>
                  <div className="p-3.5 rounded-2xl bg-[#1A1815] border border-[#C49A6C]/30 text-[#E8E1D6]">
                    <p>
                      En <strong className="text-[#F6F4EF]">Tu Proyecto en Mis Manos</strong>{' '}
                      cumplimos estrictamente con la legislación chilena vigente en materia de
                      privacidad, específicamente la{' '}
                      <strong className="text-[#DFC8AA]">Ley N° 19.628</strong> sobre Protección de
                      la Vida Privada y los estándares establecidos por la nueva{' '}
                      <strong className="text-[#DFC8AA]">Ley N° 21.719</strong> sobre Protección y
                      Tratamiento de Datos Personales.
                    </p>
                  </div>

                  <section className="space-y-1.5">
                    <h4 className="text-sm font-semibold text-[#F6F4EF]">
                      1. Responsable del tratamiento de datos
                    </h4>
                    <p>
                      El responsable del resguardo y tratamiento de los datos ingresados es{' '}
                      <strong className="text-[#F6F4EF]">Tu Proyecto en Mis Manos</strong>, bajo
                      dirección directa de Antonio Gianny Soto Solís, con operación en la Región de
                      Valparaíso (Quinta Región) y Región Metropolitana de Santiago, Chile.
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="text-sm font-semibold text-[#F6F4EF]">
                      2. Datos personales y antecedentes que recopilamos
                    </h4>
                    <p>
                      Al completar el formulario de evaluación y agenda tratamos únicamente los datos
                      que entregas de forma voluntaria:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-[#C2BAB0]">
                      <li>
                        <strong className="text-[#EAE4DA]">Identificación y contacto:</strong> nombre
                        completo, número de teléfono o WhatsApp, correo electrónico, canal de contacto
                        y franja horaria preferida.
                      </li>
                      <li>
                        <strong className="text-[#EAE4DA]">Ubicación de la parcela o terreno:</strong>{' '}
                        región, comuna, sector referencial y coordenadas geográficas en caso de que
                        decidas fijar voluntariamente el marcador en Google Maps.
                      </li>
                      <li>
                        <strong className="text-[#EAE4DA]">Antecedentes técnicos del proyecto:</strong>{' '}
                        superficie estimada, programa de dormitorios, obras exteriores, descripción
                        escrita y fotografías o planos referenciales adjuntos.
                      </li>
                    </ul>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="text-sm font-semibold text-[#F6F4EF]">
                      3. Finalidad exclusiva y prohibición de cesión a terceros
                    </h4>
                    <p>
                      Tus datos se utilizan <strong className="text-[#F6F4EF]">exclusivamente</strong>{' '}
                      para analizar la factibilidad técnica de tu terreno, preparar una propuesta de
                      arquitectura o construcción acorde a tus requerimientos y coordinar el contacto
                      directo solicitado por ti.{' '}
                      <strong className="text-[#DFC8AA]">
                        No vendemos, arrendamos ni cedemos tus datos personales a bases comerciales,
                        corredoras ni intermediarios externos.
                      </strong>
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="text-sm font-semibold text-[#F6F4EF]">
                      4. Base de licitud, consentimiento y plazo de conservación
                    </h4>
                    <p>
                      El tratamiento se fundamenta en tu consentimiento libre, expreso e informado al
                      marcar la casilla de aceptación previa al envío. Conservaremos estos
                      antecedentes únicamente durante el tiempo necesario para gestionar tu evaluación
                      técnica, cotización o eventual ejecución de obra, y serán eliminados cuando
                      solicites su supresión o concluya la finalidad informada.
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="text-sm font-semibold text-[#F6F4EF]">
                      5. Tus derechos bajo la Ley N° 21.719 (Acceso, Rectificación, Supresión,
                      Oposición y Portabilidad)
                    </h4>
                    <p>
                      Como titular de tus datos personales puedes ejercer en cualquier momento, y de
                      forma gratuita, tus derechos de acceso, rectificación de información inexacta,
                      supresión (eliminación definitiva), oposición al tratamiento, limitación o
                      portabilidad, así como revocar el consentimiento otorgado sin efecto
                      retroactivo, comunicándolo directamente durante tu contacto con Antonio o por
                      escrito al canal de respuesta acordado.
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="text-sm font-semibold text-[#F6F4EF]">
                      6. Confidencialidad sobre parcelas, planos y archivos adjuntos
                    </h4>
                    <p>
                      Las coordenadas exactas de terrenos privados, fotografías de entorno y planos
                      referenciales enviados se mantienen bajo estricto resguardo técnico y reserva
                      profesional, sin publicación ni difusión sin autorización expresa del propietario.
                    </p>
                  </section>
                </>
              ) : (
                <>
                  <section className="space-y-1.5">
                    <h4 className="text-sm font-semibold text-[#F6F4EF]">
                      1. Objeto y alcance de la plataforma
                    </h4>
                    <p>
                      Este sitio web presenta los servicios profesionales de arquitectura, ingeniería
                      y construcción de <strong className="text-[#F6F4EF]">Tu Proyecto en Mis Manos</strong>{' '}
                      en la Quinta Región y Región Metropolitana de Chile, permitiendo solicitar
                      evaluaciones técnicas y agendar contacto directo sin intermediarios.
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="text-sm font-semibold text-[#F6F4EF]">
                      2. Carácter referencial de la evaluación preliminar
                    </h4>
                    <p>
                      La información ingresada en el configurador (superficie, comuna, exteriores y
                      referencias) permite preparar un diagnóstico inicial. Toda cotización formal —ya
                      sea bajo modalidad <strong className="text-[#EAE4DA]">Llave en Mano a suma alzada</strong>{' '}
                      o mediante <strong className="text-[#EAE4DA]">compra directa de materiales a ferreterías o proveedores</strong>—
                      se define por escrito tras la revisión técnica en terreno, topografía y análisis
                      de antecedentes normativos (DOM).
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="text-sm font-semibold text-[#F6F4EF]">
                      3. Veracidad de los antecedentes y uso del mapa
                    </h4>
                    <p>
                      El usuario declara que los datos de contacto y referencias de terreno entregados
                      son reales y corresponden a una consulta legítima. La herramienta interactiva de
                      ubicación utiliza servicios cartográficos de Google Maps; el posicionamiento del
                      marcador exacto de la parcela es opcional y voluntario.
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="text-sm font-semibold text-[#F6F4EF]">
                      4. Propiedad intelectual y documentación del cliente
                    </h4>
                    <p>
                      El contenido visual, fotografías de obra ejecutada, textos y diseño de esta web
                      pertenecen a Tu Proyecto en Mis Manos. Asimismo, los croquis, planos o imágenes
                      que adjunte el solicitante siguen siendo de su exclusiva propiedad y se emplean
                      únicamente para estudiar su requerimiento constructivo.
                    </p>
                  </section>

                  <section className="space-y-1.5">
                    <h4 className="text-sm font-semibold text-[#F6F4EF]">
                      5. Legislación aplicable y jurisdicción
                    </h4>
                    <p>
                      Estos términos se rigen íntegramente por las leyes de la República de Chile,
                      incluyendo la normativa de protección de datos personales (Leyes N° 19.628 y
                      N° 21.719) y derechos del consumidor en lo que corresponda.
                    </p>
                  </section>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 sm:px-6 border-t border-white/10 bg-[#181614] flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-[#8E867B]">
                Actualizado conforme a Ley N° 19.628 y Ley N° 21.719 · Chile
              </span>

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#D5CEC3] border border-white/15 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                {onAcceptAndClose && (
                  <button
                    type="button"
                    onClick={() => {
                      onAcceptAndClose();
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C49A6C] text-[#141311] text-xs font-semibold hover:bg-[#D5AE82] transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aceptar y volver al formulario</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
