import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, CalendarCheck2, CheckCircle2 } from 'lucide-react';
import { CHILE_COMMUNES } from '../data/projectData';
import { RevealBlock } from './MotionPrimitives';

interface QuoteSchedulerProps {
  preselectedAddon?: 'casa' | 'quincho' | 'piscina' | null;
}

interface QuoteState {
  hasLand: 'si' | 'en-busqueda';
  commune: string;
  surfaceM2: number;
  bedrooms: number;
  includeQuincho: boolean;
  includePool: boolean;
  name: string;
  email: string;
  phone: string;
  preferredTime: string;
}

export default function QuoteScheduler({ preselectedAddon }: QuoteSchedulerProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState<QuoteState>({
    hasLand: 'si',
    commune: CHILE_COMMUNES[0],
    surfaceM2: 240,
    bedrooms: 4,
    includeQuincho: true,
    includePool: true,
    name: '',
    email: '',
    phone: '',
    preferredTime: 'Mañana (09:30 - 12:30)',
  });

  useEffect(() => {
    if (preselectedAddon === 'quincho') {
      setForm((prev) => ({ ...prev, includeQuincho: true }));
    } else if (preselectedAddon === 'piscina') {
      setForm((prev) => ({ ...prev, includePool: true }));
    }
  }, [preselectedAddon]);

  const baseUfPerM2 = 42;
  const houseUf = form.surfaceM2 * baseUfPerM2;
  const quinchoUf = form.includeQuincho ? 1150 : 0;
  const poolUf = form.includePool ? 980 : 0;
  const totalEstimatedUf = houseUf + quinchoUf + poolUf;
  const estimatedMonths = form.surfaceM2 >= 300 ? 11 : form.surfaceM2 >= 220 ? 9 : 7;
  const surfacePercent = ((form.surfaceM2 - 160) / (460 - 160)) * 100;

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.name.trim() || form.name.trim().length < 3) {
      setErrorMsg('Ingresa tu nombre completo para coordinar la reunión.');
      return;
    }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!emailValid) {
      setErrorMsg('Ingresa un correo electrónico válido.');
      return;
    }
    const digits = form.phone.replace(/\D/g, '');
    if (digits.length < 8) {
      setErrorMsg('Ingresa un teléfono de contacto válido (ej. +56 9 8765 4321).');
      return;
    }

    setSubmitted(true);
  };

  return (
    <section
      id="cotizador"
      className="bg-[#141311] text-[#F6F4EF] py-20 md:py-28 border-t border-white/10"
    >
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Summary & Value Proposition */}
          <RevealBlock className="lg:col-span-5">
            <p className="text-xs font-medium tracking-wide text-[#C49A6C]">
              Evaluación de Terreno y Proyecto · Sin Costo Inicial
            </p>
            <h2
              className="mt-3 font-display font-normal leading-[1.08] tracking-tight text-[#F6F4EF]"
              style={{ fontSize: 'clamp(2rem, 3.4vw, 3.1rem)', textWrap: 'balance' }}
            >
              Agenda una sesión técnica con nuestro equipo de arquitectura.
            </h2>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-[#B8B0A4]">
              Configura las variables iniciales de tu futura casa mediterránea. Revisaremos
              factibilidad normativa en tu comuna, emplazamiento solar y presupuesto referencial a
              suma alzada.
            </p>

            {/* Live Tabular Scope Summary */}
            <div className="mt-8 p-6 rounded-2xl bg-[#1C1A17] border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#A8A095] pb-3 border-b border-white/10">
                <span>Resumen preliminar de proyecto</span>
                <span className="font-mono-tech text-[#C49A6C]">Paso {step} / 4</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#8E867B] block">Estado del terreno</span>
                  <span className="mt-1 font-medium text-[#F6F4EF] block">
                    {form.hasLand === 'si' ? 'Parcela propia' : 'En búsqueda'}
                  </span>
                </div>
                <div>
                  <span className="text-[#8E867B] block">Comuna</span>
                  <span className="mt-1 font-medium text-[#F6F4EF] block truncate">
                    {form.commune}
                  </span>
                </div>
                <div>
                  <span className="text-[#8E867B] block">Superficie vivienda</span>
                  <span className="mt-1 font-mono-tech font-medium text-[#F6F4EF] block">
                    {form.surfaceM2} m² · {form.bedrooms} dormitorios
                  </span>
                </div>
                <div>
                  <span className="text-[#8E867B] block">Exteriores incluidos</span>
                  <span className="mt-1 font-medium text-[#F6F4EF] block">
                    {[
                      form.includeQuincho ? 'Quincho' : null,
                      form.includePool ? 'Piscina' : null,
                    ]
                      .filter(Boolean)
                      .join(' + ') || 'Solo residencia'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-[#A8A095] block">Inversión referencial llave en mano</span>
                  <span className="text-[11px] text-[#787268]">
                    Plazo estimado de obra: {estimatedMonths} meses
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono-tech text-xl md:text-2xl font-medium text-[#DFC8AA] tabular-nums">
                    {totalEstimatedUf.toLocaleString('es-CL')} UF
                  </span>
                  <span className="block text-[11px] text-[#8E867B]">+ IVA según proyecto</span>
                </div>
              </div>
            </div>
          </RevealBlock>

          {/* Right Column: Multi-Step Interactive Configurator & Form */}
          <RevealBlock delay={0.08} className="lg:col-span-7 rounded-2xl bg-[#1A1815] border border-white/12 p-7 md:p-10">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 space-y-6"
              >
                <div className="inline-flex items-center gap-2.5 text-sm font-medium text-[#DFC8AA]">
                  <CheckCircle2 className="w-5 h-5 text-[#C49A6C]" />
                  <span>Solicitud de evaluación registrada</span>
                </div>

                <h3 className="font-display text-3xl md:text-4xl font-normal text-[#F6F4EF]">
                  Gracias, {form.name.split(' ')[0]}. Tu proyecto ya está en revisión técnica.
                </h3>

                <p className="text-sm md:text-base leading-relaxed text-[#C9C1B6]">
                  Nuestra arquitecta jefa analizará los antecedentes de{' '}
                  <strong className="text-[#F6F4EF] font-medium">{form.commune}</strong> para una
                  residencia mediterránea de{' '}
                  <strong className="text-[#F6F4EF] font-medium font-mono-tech">
                    {form.surfaceM2} m²
                  </strong>{' '}
                  y se comunicará contigo al{' '}
                  <strong className="text-[#F6F4EF] font-medium">{form.phone}</strong> durante la
                  jornada seleccionada ({form.preferredTime}).
                </p>

                <div className="p-5 rounded-xl bg-[#141311] border border-white/10 text-xs text-[#B8B0A4] space-y-1.5">
                  <div>
                    Correo de respaldo: <span className="text-[#F6F4EF]">{form.email}</span>
                  </div>
                  <div>
                    Alcance seleccionado:{' '}
                    <span className="text-[#F6F4EF]">
                      Casa {form.surfaceM2} m²
                      {form.includeQuincho ? ' + Quincho equipado' : ''}
                      {form.includePool ? ' + Piscina hormigón' : ''}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                  }}
                  className="px-5 py-3 rounded-xl text-xs font-semibold border border-white/20 text-[#F6F4EF] hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Configurar otro proyecto
                </button>
              </motion.div>
            ) : (
              <form onSubmit={validateAndSubmit} noValidate>
                {/* Step Indicator Bar */}
                <div className="grid grid-cols-4 gap-2.5 mb-8">
                  {[
                    { num: 1, label: 'Terreno' },
                    { num: 2, label: 'Superficie' },
                    { num: 3, label: 'Exteriores' },
                    { num: 4, label: 'Agenda' },
                  ].map((s) => (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => setStep(s.num)}
                      className={`text-left pb-2.5 border-b-2 transition-colors cursor-pointer ${
                        step === s.num
                          ? 'border-[#C49A6C] text-[#F6F4EF]'
                          : step > s.num
                          ? 'border-white/40 text-[#B8B0A4]'
                          : 'border-white/10 text-[#6F685F]'
                      }`}
                    >
                      <span className="font-mono-tech text-[11px] block">0{s.num}</span>
                      <span className="text-xs font-medium">{s.label}</span>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* STEP 1 */}
                    {step === 1 && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-[#F6F4EF] mb-3">
                            ¿Ya cuentas con terreno o parcela?
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, hasLand: 'si' })}
                              className={`p-4 rounded-xl text-left border transition-colors cursor-pointer ${
                                form.hasLand === 'si'
                                  ? 'bg-[#25221E] border-[#C49A6C] text-[#F6F4EF]'
                                  : 'bg-[#141311] border-white/10 text-[#B8B0A4] hover:border-white/25'
                              }`}
                            >
                              <div className="text-sm font-semibold">Sí, ya tengo parcela</div>
                              <div className="mt-1 text-xs text-[#968E83]">
                                Evaluamos topografía, orientación solar y normativa DOM.
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, hasLand: 'en-busqueda' })}
                              className={`p-4 rounded-xl text-left border transition-colors cursor-pointer ${
                                form.hasLand === 'en-busqueda'
                                  ? 'bg-[#25221E] border-[#C49A6C] text-[#F6F4EF]'
                                  : 'bg-[#141311] border-white/10 text-[#B8B0A4] hover:border-white/25'
                              }`}
                            >
                              <div className="text-sm font-semibold">Estoy buscando parcela</div>
                              <div className="mt-1 text-xs text-[#968E83]">
                                Te asesoramos antes de comprar sobre factibilidad y suelo.
                              </div>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="commune-select"
                            className="block text-sm font-medium text-[#F6F4EF] mb-2.5"
                          >
                            Comuna o sector del proyecto
                          </label>
                          <select
                            id="commune-select"
                            value={form.commune}
                            onChange={(e) => setForm({ ...form, commune: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-[#141311] border border-white/15 text-sm text-[#F6F4EF] focus:outline-none focus:border-[#C49A6C]"
                          >
                            {CHILE_COMMUNES.map((commune) => (
                              <option key={commune} value={commune}>
                                {commune}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label
                              htmlFor="surface-range"
                              className="text-sm font-medium text-[#F6F4EF]"
                            >
                              Superficie estimada de la vivienda
                            </label>
                            <span className="font-mono-tech text-lg text-[#DFC8AA] tabular-nums">
                              {form.surfaceM2} m²
                            </span>
                          </div>

                          <div className="relative flex items-center h-6">
                            <div className="w-full h-1.5 rounded-full bg-white/12 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#9E7B4F] to-[#DFC8AA]"
                                style={{ width: `${surfacePercent}%` }}
                              />
                            </div>
                            <input
                              id="surface-range"
                              type="range"
                              min={160}
                              max={460}
                              step={20}
                              value={form.surfaceM2}
                              onChange={(e) =>
                                setForm({ ...form, surfaceM2: Number(e.target.value) })
                              }
                              className="absolute inset-0 w-full opacity-0 cursor-pointer"
                            />
                            <div
                              style={{ left: `${surfacePercent}%` }}
                              className="pointer-events-none absolute -translate-x-1/2 w-5 h-5 rounded-full bg-[#DFC8AA] border-2 border-[#141311] shadow-md"
                            />
                          </div>

                          <div className="mt-2 flex justify-between text-[11px] font-mono-tech text-[#8E867B]">
                            <span>160 m²</span>
                            <span>280 m²</span>
                            <span>460 m²</span>
                          </div>
                        </div>

                        <div>
                          <span className="block text-sm font-medium text-[#F6F4EF] mb-3">
                            Programa de dormitorios
                          </span>
                          <div className="grid grid-cols-4 gap-2.5">
                            {[3, 4, 5, 6].map((count) => {
                              const isActive = form.bedrooms === count;
                              return (
                                <button
                                  key={count}
                                  type="button"
                                  onClick={() => setForm({ ...form, bedrooms: count })}
                                  className={`relative py-3 rounded-xl text-center border text-sm font-mono-tech cursor-pointer transition-colors ${
                                    isActive
                                      ? 'text-[#141311] border-[#C49A6C] font-semibold'
                                      : 'bg-[#141311] text-[#D5CEC3] border-white/15 hover:border-white/30'
                                  }`}
                                >
                                  {isActive && (
                                    <motion.span
                                      layoutId="bedrooms-pill"
                                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                                      className="absolute inset-0 rounded-xl bg-[#C49A6C]"
                                    />
                                  )}
                                  <span className="relative z-10">{count} Dorm.</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                      <div className="space-y-4">
                        <span className="block text-sm font-medium text-[#F6F4EF] mb-2">
                          ¿Qué obras exteriores deseas integrar en la misma faena?
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setForm({ ...form, includeQuincho: !form.includeQuincho })
                          }
                          className={`w-full p-5 rounded-xl text-left border transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                            form.includeQuincho
                              ? 'bg-[#25221E] border-[#C49A6C]'
                              : 'bg-[#141311] border-white/10 hover:border-white/25'
                          }`}
                        >
                          <div>
                            <div className="text-sm font-semibold text-[#F6F4EF]">
                              Quincho Mediterráneo Equipado + Pérgola
                            </div>
                            <div className="mt-1 text-xs text-[#A8A095]">
                              Estructura conectada a la terraza en travertino, parrilla en acero
                              inoxidable, mesón en cuarzo e iluminación cálida.
                            </div>
                          </div>
                          <span className="font-mono-tech text-xs px-3 py-1 rounded-lg border border-white/20 text-[#DFC8AA] shrink-0">
                            {form.includeQuincho ? 'Incluido' : 'Agregar'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setForm({ ...form, includePool: !form.includePool })}
                          className={`w-full p-5 rounded-xl text-left border transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                            form.includePool
                              ? 'bg-[#25221E] border-[#C49A6C]'
                              : 'bg-[#141311] border-white/10 hover:border-white/25'
                          }`}
                        >
                          <div>
                            <div className="text-sm font-semibold text-[#F6F4EF]">
                              Piscina de Hormigón Minimalista + Playa Húmeda
                            </div>
                            <div className="mt-1 text-xs text-[#A8A095]">
                              Vaso en hormigón armado con revestimiento mineral, iluminación LED
                              subacuática y opción de servicio de mantención mensual.
                            </div>
                          </div>
                          <span className="font-mono-tech text-xs px-3 py-1 rounded-lg border border-white/20 text-[#DFC8AA] shrink-0">
                            {form.includePool ? 'Incluido' : 'Agregar'}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* STEP 4 */}
                    {step === 4 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="lead-name"
                              className="block text-xs font-medium text-[#D5CEC3] mb-1.5"
                            >
                              Nombre completo
                            </label>
                            <input
                              id="lead-name"
                              type="text"
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              placeholder="Ej. Sebastián Guzmán"
                              className="w-full px-4 py-3 rounded-xl bg-[#141311] border border-white/15 text-sm text-[#F6F4EF] placeholder:text-[#6B645B] focus:outline-none focus:border-[#C49A6C]"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="lead-phone"
                              className="block text-xs font-medium text-[#D5CEC3] mb-1.5"
                            >
                              Teléfono / WhatsApp
                            </label>
                            <input
                              id="lead-phone"
                              type="tel"
                              value={form.phone}
                              onChange={(e) => setForm({ ...form, phone: e.target.value })}
                              placeholder="+56 9 8765 4321"
                              className="w-full px-4 py-3 rounded-xl bg-[#141311] border border-white/15 text-sm text-[#F6F4EF] placeholder:text-[#6B645B] focus:outline-none focus:border-[#C49A6C]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="lead-email"
                              className="block text-xs font-medium text-[#D5CEC3] mb-1.5"
                            >
                              Correo electrónico
                            </label>
                            <input
                              id="lead-email"
                              type="email"
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              placeholder="sebastian@empresa.cl"
                              className="w-full px-4 py-3 rounded-xl bg-[#141311] border border-white/15 text-sm text-[#F6F4EF] placeholder:text-[#6B645B] focus:outline-none focus:border-[#C49A6C]"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="lead-time"
                              className="block text-xs font-medium text-[#D5CEC3] mb-1.5"
                            >
                              Horario preferido de reunión
                            </label>
                            <select
                              id="lead-time"
                              value={form.preferredTime}
                              onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-[#141311] border border-white/15 text-sm text-[#F6F4EF] focus:outline-none focus:border-[#C49A6C]"
                            >
                              <option value="Mañana (09:30 - 12:30)">Mañana (09:30 - 12:30)</option>
                              <option value="Tarde (14:30 - 18:00)">Tarde (14:30 - 18:00)</option>
                              <option value="Visita a terreno fin de semana">
                                Visita a terreno fin de semana
                              </option>
                            </select>
                          </div>
                        </div>

                        {errorMsg && (
                          <div
                            role="alert"
                            className="px-4 py-2.5 rounded-xl bg-[#461E1E] border border-[#C96B6B]/40 text-xs text-[#FAD4D4]"
                          >
                            {errorMsg}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg(null);
                        setStep((s) => s - 1);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-[#D5CEC3] border border-white/15 hover:text-white hover:border-white/30 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Anterior</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep((s) => s + 1)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F6F4EF] text-[#141311] text-xs font-semibold hover:bg-[#E4DFD3] transition-colors cursor-pointer"
                    >
                      <span>Continuar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C49A6C] text-[#141311] text-xs font-semibold hover:bg-[#D3AB7E] transition-colors cursor-pointer"
                    >
                      <CalendarCheck2 className="w-4 h-4" />
                      <span>Agendar reunión con Arquitectura</span>
                    </motion.button>
                  )}
                </div>
              </form>
            )}
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
