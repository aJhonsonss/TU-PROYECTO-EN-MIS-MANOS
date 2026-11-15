import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck2,
  Check,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FileText,
  ImagePlus,
  MapPin,
  Search,
  Upload,
  X,
} from 'lucide-react';
import { CHILE_REGIONS, RegionOption } from '../data/projectData';
import { RevealBlock } from './MotionPrimitives';
import ParcelLocationMap, { Coordinates } from './ParcelLocationMap';

interface QuoteSchedulerProps {
  preselectedAddon?: 'casa' | 'quincho' | 'piscina' | null;
}

interface AttachedReference {
  id: string;
  name: string;
  sizeLabel: string;
  isImage: boolean;
  previewUrl: string | null;
}

interface QuoteState {
  hasLand: 'si' | 'en-busqueda';
  regionId: RegionOption['id'];
  commune: string;
  sectorDetail: string;
  pinLocation: Coordinates | null;
  hasExplicitPin: boolean;
  surfaceM2: number;
  bedrooms: number;
  includeQuincho: boolean;
  includePool: boolean;
  exteriorsCustomNote: string;
  projectNotes: string;
  name: string;
  email: string;
  phone: string;
  preferredTime: string;
}

const PREFERRED_TIME_OPTIONS = [
  { id: 'manana', label: 'Mañana', hours: '09:30 - 12:30 hrs' },
  { id: 'tarde', label: 'Tarde', hours: '14:30 - 18:00 hrs' },
  { id: 'terreno', label: 'Visita en terreno', hours: 'Fin de semana' },
];

const STEPS = [
  { num: 1, label: 'Terreno' },
  { num: 2, label: 'Superficie' },
  { num: 3, label: 'Exteriores' },
  { num: 4, label: 'Detalle' },
  { num: 5, label: 'Agenda' },
];

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function QuoteScheduler({ preselectedAddon }: QuoteSchedulerProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [communeMenuOpen, setCommuneMenuOpen] = useState(false);
  const [communeQuery, setCommuneQuery] = useState('');
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [attachments, setAttachments] = useState<AttachedReference[]>([]);

  const communeContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentsRef = useRef<AttachedReference[]>([]);

  const [form, setForm] = useState<QuoteState>({
    hasLand: 'si',
    regionId: 'valparaiso',
    commune: 'Algarrobo',
    sectorDetail: '',
    pinLocation: null,
    hasExplicitPin: false,
    surfaceM2: 240,
    bedrooms: 4,
    includeQuincho: true,
    includePool: true,
    exteriorsCustomNote: '',
    projectNotes: '',
    name: '',
    email: '',
    phone: '',
    preferredTime: 'Mañana (09:30 - 12:30 hrs)',
  });

  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);

  useEffect(() => {
    return () => {
      attachmentsRef.current.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  useEffect(() => {
    if (preselectedAddon === 'quincho') {
      setForm((prev) => ({ ...prev, includeQuincho: true }));
    } else if (preselectedAddon === 'piscina') {
      setForm((prev) => ({ ...prev, includePool: true }));
    }
  }, [preselectedAddon]);

  useEffect(() => {
    if (!communeMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        communeContainerRef.current &&
        !communeContainerRef.current.contains(e.target as Node)
      ) {
        setCommuneMenuOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCommuneMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 60);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
      window.clearTimeout(focusTimer);
    };
  }, [communeMenuOpen]);

  const currentRegion = useMemo(
    () => CHILE_REGIONS.find((r) => r.id === form.regionId) ?? CHILE_REGIONS[0],
    [form.regionId]
  );

  const filteredCommunes = useMemo(() => {
    const q = normalizeText(communeQuery.trim());
    if (!q) return currentRegion.communes;
    return currentRegion.communes.filter((c) => normalizeText(c).includes(q));
  }, [currentRegion, communeQuery]);

  const handleRegionChange = (region: RegionOption) => {
    setCommuneQuery('');
    setForm((prev) => ({
      ...prev,
      regionId: region.id,
      commune: region.id === 'valparaiso' ? 'Algarrobo' : 'Colina (Chicureo)',
      hasExplicitPin: false,
    }));
    setCommuneMenuOpen(true);
  };

  const handleFilesAdded = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const remainingSlots = Math.max(0, 8 - attachments.length);
    if (remainingSlots === 0) return;

    const picked = Array.from(fileList).slice(0, remainingSlots);
    const nextItems: AttachedReference[] = picked.map((file, idx) => {
      const isImage = file.type.startsWith('image/');
      return {
        id: `${Date.now()}-${idx}-${file.name}`,
        name: file.name,
        sizeLabel: formatFileSize(file.size),
        isImage,
        previewUrl: isImage ? URL.createObjectURL(file) : null,
      };
    });

    setAttachments((prev) => [...prev, ...nextItems]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((item) => item.id !== id);
    });
  };

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
      className="w-full max-w-full overflow-x-clip bg-[#141311] text-[#F6F4EF] pt-[74px] pb-10 lg:pt-[76px] lg:pb-6 lg:min-h-[100vh] flex flex-col justify-center"
    >
      <div className="max-w-[1360px] w-full max-w-full mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center w-full max-w-full">
          {/* Left Column: Value Proposition */}
          <RevealBlock className="lg:col-span-5 min-w-0 w-full">
            <p className="text-xs font-medium tracking-wide text-[#C49A6C]">
              Evaluación de Terreno y Proyecto · Sin Costo Inicial
            </p>
            <h2
              className="mt-2 font-display font-normal leading-[1.06] tracking-tight text-[#F6F4EF]"
              style={{ fontSize: 'clamp(1.75rem, min(3vw, 4.6vh), 2.85rem)', textWrap: 'balance' }}
            >
              Agenda una sesión técnica directa con nosotros.
            </h2>
            <p className="mt-3 text-xs sm:text-sm md:text-[15px] leading-relaxed text-[#B8B0A4]">
              Indícanos tu ubicación exacta en el mapa, superficie estimada, detalles escritos y
              fotos de referencia para estudiar tu terreno y preparar una propuesta acorde a lo que
              realmente necesitas construir.
            </p>

            <div className="mt-5 pt-4 border-t border-white/10 space-y-2.5 text-xs sm:text-[13px] text-[#C9C1B6]">
              <div className="flex items-start gap-2.5">
                <span className="font-mono-tech text-[#C49A6C] shrink-0">01.</span>
                <span>Revisión directa con Antonio, sin intermediarios ni vendedores.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-mono-tech text-[#C49A6C] shrink-0">02.</span>
                <span>Ubicación exacta de tu parcela en mapa satelital para evaluar orientación.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="font-mono-tech text-[#C49A6C] shrink-0">03.</span>
                <span>Cotización a medida en modalidad llave en mano o compra directa de materiales.</span>
              </div>
            </div>
          </RevealBlock>

          {/* Right Column: Compact Multi-Step Configurator Fitted to Single Viewport */}
          <RevealBlock
            delay={0.08}
            className="lg:col-span-7 min-w-0 w-full max-w-full rounded-2xl bg-[#1A1815] border border-white/12 p-4 sm:p-5 lg:p-6"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-3 space-y-4"
              >
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#DFC8AA]">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#C49A6C]" />
                  <span>Solicitud de evaluación registrada</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-normal text-[#F6F4EF]">
                  Gracias, {form.name.split(' ')[0]}. Tu proyecto ya está en revisión técnica.
                </h3>

                <p className="text-xs sm:text-sm leading-relaxed text-[#C9C1B6]">
                  Antonio analizará personalmente los antecedentes de{' '}
                  <strong className="text-[#F6F4EF] font-medium">
                    {form.commune} ({currentRegion.shortName})
                  </strong>{' '}
                  para una residencia de{' '}
                  <strong className="text-[#F6F4EF] font-medium font-mono-tech">
                    {form.surfaceM2} m²
                  </strong>{' '}
                  y se comunicará contigo al{' '}
                  <strong className="text-[#F6F4EF] font-medium">{form.phone}</strong> durante la
                  jornada seleccionada ({form.preferredTime}).
                </p>

                <div className="p-4 rounded-xl bg-[#141311] border border-white/10 text-xs text-[#B8B0A4] space-y-1.5">
                  <div>
                    Correo de respaldo: <span className="text-[#F6F4EF]">{form.email}</span>
                  </div>
                  {form.sectorDetail.trim() && (
                    <div>
                      Sector especificado:{' '}
                      <span className="text-[#F6F4EF]">{form.sectorDetail}</span>
                    </div>
                  )}
                  {form.pinLocation && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span>Coordenadas marcadas:</span>
                      <span className="font-mono-tech text-[#DFC8AA] tabular-nums">
                        {form.pinLocation.lat.toFixed(5)}, {form.pinLocation.lng.toFixed(5)}
                      </span>
                      <a
                        href={`https://www.google.com/maps?q=${form.pinLocation.lat},${form.pinLocation.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#C49A6C] hover:underline"
                      >
                        <span>Ver en Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  <div>
                    Alcance seleccionado:{' '}
                    <span className="text-[#F6F4EF]">
                      Casa {form.surfaceM2} m²
                      {form.includeQuincho ? ' + Quincho equipado' : ''}
                      {form.includePool ? ' + Piscina hormigón' : ''}
                      {form.exteriorsCustomNote.trim() ? ` (${form.exteriorsCustomNote.trim()})` : ''}
                    </span>
                  </div>
                  {form.projectNotes.trim() && (
                    <div className="pt-1.5 border-t border-white/10">
                      <span className="text-[#8E867B] block mb-0.5">Lo que necesitas construir:</span>
                      <p className="text-[#E6E0D6] leading-relaxed">{form.projectNotes}</p>
                    </div>
                  )}
                  {attachments.length > 0 && (
                    <div className="pt-1.5 border-t border-white/10">
                      <span className="text-[#8E867B] block mb-1.5">
                        Referencias adjuntas ({attachments.length}):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {attachments.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 rounded-lg bg-[#1D1B18] border border-white/10 p-1 pr-2"
                          >
                            {file.isImage && file.previewUrl ? (
                              <img
                                src={file.previewUrl}
                                alt={file.name}
                                referrerPolicy="no-referrer"
                                className="w-7 h-7 rounded object-cover"
                              />
                            ) : (
                              <FileText className="w-4 h-4 text-[#C49A6C] shrink-0" />
                            )}
                            <span className="text-[11px] text-[#F6F4EF] max-w-[130px] truncate">
                              {file.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/20 text-[#F6F4EF] hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Configurar otro proyecto
                </button>
              </motion.div>
            ) : (
              <form onSubmit={validateAndSubmit} noValidate>
                {/* Step Indicator Bar (5 Steps) */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5 mb-4 sm:mb-5">
                  {STEPS.map((s) => (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => {
                        setErrorMsg(null);
                        setCommuneMenuOpen(false);
                        setStep(s.num);
                      }}
                      className={`text-left pb-2 border-b-2 transition-colors cursor-pointer ${
                        step === s.num
                          ? 'border-[#C49A6C] text-[#F6F4EF]'
                          : step > s.num
                            ? 'border-white/40 text-[#B8B0A4]'
                            : 'border-white/10 text-[#6F685F]'
                      }`}
                    >
                      <span className="font-mono-tech text-[10px] sm:text-[11px] block">
                        0{s.num}
                      </span>
                      <span className="text-[11px] sm:text-xs font-medium whitespace-nowrap truncate block">
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* STEP 1: TERRENO + REGION + COMUNA + GOOGLE MAPS PIN PICKER */}
                    {step === 1 && (
                      <div className="space-y-3.5">
                        {/* Land Ownership Compact Row */}
                        <div>
                          <label className="block text-xs font-medium text-[#D5CEC3] mb-1.5">
                            ¿Ya cuentas con terreno o parcela?
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, hasLand: 'si' })}
                              className={`px-3.5 py-2.5 rounded-xl text-left border transition-colors cursor-pointer ${
                                form.hasLand === 'si'
                                  ? 'bg-[#25221E] border-[#C49A6C] text-[#F6F4EF]'
                                  : 'bg-[#141311] border-white/10 text-[#B8B0A4] hover:border-white/25'
                              }`}
                            >
                              <div className="text-xs sm:text-sm font-semibold">
                                Sí, ya tengo parcela
                              </div>
                              <div className="mt-0.5 text-[11px] text-[#968E83] truncate">
                                Evaluamos topografía y orientación solar
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, hasLand: 'en-busqueda' })}
                              className={`px-3.5 py-2.5 rounded-xl text-left border transition-colors cursor-pointer ${
                                form.hasLand === 'en-busqueda'
                                  ? 'bg-[#25221E] border-[#C49A6C] text-[#F6F4EF]'
                                  : 'bg-[#141311] border-white/10 text-[#B8B0A4] hover:border-white/25'
                              }`}
                            >
                              <div className="text-xs sm:text-sm font-semibold">
                                Estoy buscando parcela
                              </div>
                              <div className="mt-0.5 text-[11px] text-[#968E83] truncate">
                                Te asesoramos antes de comprar
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Region + Modern Searchable Commune Picker Side-by-Side */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-start">
                          {/* Region Selector */}
                          <div className="sm:col-span-5">
                            <span className="block text-xs font-medium text-[#D5CEC3] mb-1.5">
                              Región
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              {CHILE_REGIONS.map((region) => {
                                const isSelected = form.regionId === region.id;
                                return (
                                  <button
                                    key={region.id}
                                    type="button"
                                    onClick={() => handleRegionChange(region)}
                                    className={`px-2.5 py-2 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                                      isSelected
                                        ? 'bg-[#25221E] border-[#C49A6C] text-[#F6F4EF]'
                                        : 'bg-[#141311] border-white/10 text-[#B8B0A4] hover:border-white/25'
                                    }`}
                                  >
                                    <div className="min-w-0">
                                      <div className="text-xs font-semibold text-[#F6F4EF] truncate">
                                        {region.id === 'valparaiso' ? 'V Región' : 'Metropolitana'}
                                      </div>
                                      <div className="text-[10px] text-[#8E867B] tabular-nums">
                                        {region.communes.length} comunas
                                      </div>
                                    </div>
                                    <span
                                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                        isSelected
                                          ? 'bg-[#C49A6C] border-[#C49A6C] text-[#141311]'
                                          : 'border-white/20 text-transparent'
                                      }`}
                                    >
                                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Modern Searchable Custom Commune Picker (Overlay Popover) */}
                          <div ref={communeContainerRef} className="sm:col-span-7 relative">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-medium text-[#D5CEC3]">
                                Comuna ({currentRegion.shortName})
                              </span>
                            </div>

                            <button
                              type="button"
                              aria-expanded={communeMenuOpen}
                              onClick={() => setCommuneMenuOpen((open) => !open)}
                              className={`w-full px-3.5 py-2 rounded-xl bg-[#141311] border text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                                communeMenuOpen
                                  ? 'border-[#C49A6C] ring-2 ring-[#C49A6C]/20'
                                  : 'border-white/15 hover:border-[#C49A6C]/50'
                              }`}
                            >
                              <span className="flex items-center gap-2.5 min-w-0">
                                <span className="w-7 h-7 rounded-lg bg-[#25221E] border border-white/10 flex items-center justify-center text-[#DFC8AA] shrink-0">
                                  <MapPin className="w-3.5 h-3.5" />
                                </span>
                                <span className="min-w-0">
                                  <span className="block text-[10px] text-[#8E867B] leading-none truncate">
                                    {currentRegion.name}
                                  </span>
                                  <span className="mt-1 block text-xs sm:text-sm font-medium text-[#F6F4EF] truncate">
                                    {form.commune}
                                  </span>
                                </span>
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-[#C49A6C] shrink-0 transition-transform duration-200 ${
                                  communeMenuOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </button>

                            <AnimatePresence>
                              {communeMenuOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4, scale: 0.99 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -4, scale: 0.99 }}
                                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                                  className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-2xl bg-[#141311] border border-[#C49A6C]/45 shadow-[0_24px_60px_rgba(0,0,0,0.78)] overflow-hidden"
                                >
                                  <div className="p-2.5 border-b border-white/10 bg-[#181613] flex items-center gap-2">
                                    <Search className="w-3.5 h-3.5 text-[#C49A6C] shrink-0" />
                                    <input
                                      ref={searchInputRef}
                                      type="text"
                                      value={communeQuery}
                                      onChange={(e) => setCommuneQuery(e.target.value)}
                                      placeholder={`Buscar comuna en ${currentRegion.shortName}...`}
                                      className="w-full bg-transparent text-xs sm:text-sm text-[#F6F4EF] placeholder:text-[#787268] focus:outline-none"
                                    />
                                    {communeQuery && (
                                      <button
                                        type="button"
                                        onClick={() => setCommuneQuery('')}
                                        aria-label="Limpiar búsqueda"
                                        className="p-1 rounded-lg text-[#968E83] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>

                                  <div className="p-2 max-h-[190px] overflow-y-auto">
                                    {filteredCommunes.length === 0 ? (
                                      <div className="py-5 text-center text-xs text-[#8E867B]">
                                        No encontramos &ldquo;{communeQuery}&rdquo; en{' '}
                                        {currentRegion.shortName}.
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                        {filteredCommunes.map((commune) => {
                                          const isCurrent = form.commune === commune;
                                          return (
                                            <button
                                              key={commune}
                                              type="button"
                                              onClick={() => {
                                                setForm((prev) => ({
                                                  ...prev,
                                                  commune,
                                                  hasExplicitPin: false,
                                                }));
                                                setCommuneMenuOpen(false);
                                              }}
                                              className={`px-3 py-2 rounded-xl text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                                isCurrent
                                                  ? 'bg-[#C49A6C] text-[#141311] font-semibold'
                                                  : 'text-[#D6CFC5] hover:bg-white/[0.07] hover:text-white'
                                              }`}
                                            >
                                              <span className="truncate">{commune}</span>
                                              {isCurrent && <Check className="w-3.5 h-3.5 shrink-0" />}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Interactive Google Maps Exact Parcel / Unit Picker */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-[#D5CEC3]">
                              Posiciona el cursor en la ubicación exacta de tu terreno o unidad
                            </span>
                          </div>
                          <ParcelLocationMap
                            commune={form.commune}
                            regionName={currentRegion.name}
                            sectorQuery={form.sectorDetail}
                            onSectorQueryChange={(sectorDetail) =>
                              setForm((prev) => ({ ...prev, sectorDetail }))
                            }
                            pinLocation={form.pinLocation}
                            hasExplicitPin={form.hasExplicitPin}
                            onPinChange={(coords, explicit) =>
                              setForm((prev) => ({
                                ...prev,
                                pinLocation: coords,
                                hasExplicitPin: explicit,
                              }))
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 2: SUPERFICIE */}
                    {step === 2 && (
                      <div className="space-y-5 py-2">
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

                    {/* STEP 3: EXTERIORES + ESPECIFICACION PERSONALIZADA */}
                    {step === 3 && (
                      <div className="space-y-3.5">
                        <span className="block text-sm font-medium text-[#F6F4EF]">
                          ¿Qué obras exteriores deseas integrar en la misma faena?
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setForm({ ...form, includeQuincho: !form.includeQuincho })
                          }
                          className={`w-full p-4 rounded-2xl text-left border transition-colors cursor-pointer flex items-start justify-between gap-4 ${
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
                          className={`w-full p-4 rounded-2xl text-left border transition-colors cursor-pointer flex items-start justify-between gap-4 ${
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

                        <div>
                          <label
                            htmlFor="exteriors-custom-note"
                            className="block text-xs font-medium text-[#DFC8AA] mb-1.5"
                          >
                            Otro trabajo exterior o especificación especial (opcional)
                          </label>
                          <textarea
                            id="exteriors-custom-note"
                            rows={2}
                            value={form.exteriorsCustomNote}
                            onChange={(e) =>
                              setForm({ ...form, exteriorsCustomNote: e.target.value })
                            }
                            placeholder="Ej. Cierre perimetral, deck en madera nativa, camino de acceso en piedra, portón eléctrico o terraza techada a medida..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#141311] border border-white/15 text-xs sm:text-sm text-[#F6F4EF] placeholder:text-[#6B645B] focus:outline-none focus:border-[#C49A6C] resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 4: DETALLE ESCRITO + FOTOS DE REFERENCIA (PRE-AGENDA) */}
                    {step === 4 && (
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="project-notes"
                            className="block text-sm font-medium text-[#F6F4EF] mb-1"
                          >
                            Cuéntanos qué deseas construir o cotizar en detalle
                          </label>
                          <p className="text-xs text-[#968E83] mb-2">
                            Especifícanos lo que imaginas (estilo, terminaciones, desniveles o idea
                            especial) para darte un precio acorde a tu proyecto.
                          </p>
                          <textarea
                            id="project-notes"
                            rows={3}
                            value={form.projectNotes}
                            onChange={(e) => setForm({ ...form, projectNotes: e.target.value })}
                            placeholder="Ej. Queremos construir una casa de un piso con living de doble altura, cocina integrada mirando al bosque, revestimiento exterior oscuro y deck frontal..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#141311] border border-white/15 text-xs sm:text-sm text-[#F6F4EF] placeholder:text-[#6B645B] focus:outline-none focus:border-[#C49A6C] resize-none"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs sm:text-sm font-medium text-[#F6F4EF]">
                              Adjunta fotos del terreno, ideas o planos de referencia
                            </span>
                            <span className="text-[11px] text-[#8E867B] tabular-nums">
                              {attachments.length} / 8 archivos
                            </span>
                          </div>

                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              handleFilesAdded(e.target.files);
                              e.target.value = '';
                            }}
                            className="hidden"
                          />

                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() => fileInputRef.current?.click()}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                fileInputRef.current?.click();
                              }
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsDraggingFiles(true);
                            }}
                            onDragLeave={() => setIsDraggingFiles(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDraggingFiles(false);
                              handleFilesAdded(e.dataTransfer.files);
                            }}
                            className={`rounded-xl border border-dashed p-3.5 transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-3 ${
                              isDraggingFiles
                                ? 'border-[#C49A6C] bg-[#25221E]'
                                : 'border-white/20 bg-[#141311] hover:border-[#C49A6C]/60'
                            }`}
                          >
                            <div className="flex items-center gap-3 text-center sm:text-left">
                              <div className="w-9 h-9 rounded-lg bg-[#25221E] border border-white/10 flex items-center justify-center text-[#DFC8AA] shrink-0">
                                <ImagePlus className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs sm:text-sm font-medium text-[#F6F4EF]">
                                  Arrastra tus fotos aquí o haz clic para subir
                                </div>
                                <div className="mt-0.5 text-[11px] text-[#8E867B]">
                                  Fotos de parcela, referencias, croquis o planos (JPG, PNG, PDF)
                                </div>
                              </div>
                            </div>

                            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-[#F6F4EF] whitespace-nowrap shrink-0">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Seleccionar</span>
                            </span>
                          </div>

                          {attachments.length > 0 && (
                            <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[120px] overflow-y-auto">
                              {attachments.map((file) => (
                                <div
                                  key={file.id}
                                  className="group relative rounded-xl overflow-hidden border border-white/12 bg-[#141311]"
                                >
                                  {file.isImage && file.previewUrl ? (
                                    <img
                                      src={file.previewUrl}
                                      alt={file.name}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-14 object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-14 flex flex-col items-center justify-center bg-[#1D1B18] text-[#C49A6C]">
                                      <FileText className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div className="px-2 py-1 bg-[#141311] border-t border-white/10">
                                    <div className="text-[10px] text-[#F6F4EF] truncate">
                                      {file.name}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveAttachment(file.id)}
                                    aria-label={`Quitar ${file.name}`}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#141311]/85 border border-white/20 text-[#F6F4EF] hover:bg-[#461E1E] flex items-center justify-center transition-colors cursor-pointer"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* STEP 5: AGENDA */}
                    {step === 5 && (
                      <div className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141311] border border-white/15 text-sm text-[#F6F4EF] placeholder:text-[#6B645B] focus:outline-none focus:border-[#C49A6C]"
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
                              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141311] border border-white/15 text-sm text-[#F6F4EF] placeholder:text-[#6B645B] focus:outline-none focus:border-[#C49A6C]"
                            />
                          </div>
                        </div>

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
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#141311] border border-white/15 text-sm text-[#F6F4EF] placeholder:text-[#6B645B] focus:outline-none focus:border-[#C49A6C]"
                          />
                        </div>

                        <div>
                          <span className="block text-xs font-medium text-[#D5CEC3] mb-1.5">
                            Horario preferido de contacto o visita
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {PREFERRED_TIME_OPTIONS.map((option) => {
                              const value = `${option.label} (${option.hours})`;
                              const isActive = form.preferredTime === value;
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => setForm({ ...form, preferredTime: value })}
                                  className={`p-2.5 sm:p-3 rounded-xl text-left border transition-colors cursor-pointer ${
                                    isActive
                                      ? 'bg-[#25221E] border-[#C49A6C] text-[#F6F4EF]'
                                      : 'bg-[#141311] border-white/12 text-[#B8B0A4] hover:border-white/25'
                                  }`}
                                >
                                  <div className="text-xs font-semibold">{option.label}</div>
                                  <div className="mt-0.5 text-[11px] text-[#8E867B]">
                                    {option.hours}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {errorMsg && (
                          <div
                            role="alert"
                            className="px-4 py-2 rounded-xl bg-[#461E1E] border border-[#C96B6B]/40 text-xs text-[#FAD4D4]"
                          >
                            {errorMsg}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between gap-4">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg(null);
                        setCommuneMenuOpen(false);
                        setStep((s) => s - 1);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-[#D5CEC3] border border-white/15 hover:text-white hover:border-white/30 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Anterior</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < STEPS.length ? (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setCommuneMenuOpen(false);
                        setStep((s) => s + 1);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6F4EF] text-[#141311] text-xs font-semibold hover:bg-[#E4DFD3] transition-colors cursor-pointer"
                    >
                      <span>Continuar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C49A6C] text-[#141311] text-xs font-semibold hover:bg-[#D3AB7E] transition-colors cursor-pointer"
                    >
                      <CalendarCheck2 className="w-4 h-4" />
                      <span>Enviar proyecto y agendar</span>
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
