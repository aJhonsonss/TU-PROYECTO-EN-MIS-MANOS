export interface ConstructionStage {
  id: string;
  step: string;
  rangeLabel: string;
  title: string;
  subtitle: string;
  description: string;
  locationTag: string;
  image: string;
  imageAlt: string;
  specs: { label: string; value: string }[];
  progressTarget: number;
}

export interface OrbitAngle {
  id: string;
  label: string;
  description: string;
  image: string;
  imageAlt: string;
  defaultZoom: number;
  focalPoint: string;
}

export interface ZoneVisitPoint {
  id: string;
  label: string;
  summary: string;
  angleIndex: number;
  zoom: number;
  panX: number;
  panY: number;
  pinX: number;
  pinY: number;
}

export interface ServicePillar {
  id: 'casa' | 'quincho' | 'piscina';
  number: string;
  title: string;
  shortTitle: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  specs: string[];
}

export interface InteriorHotspot {
  id: string;
  xPercent: number;
  yPercent: number;
  category: string;
  title: string;
  material: string;
  specification: string;
  benefit: string;
}

export interface TeamDiscipline {
  id: string;
  code: string;
  role: string;
  leadName: string;
  credentials: string;
  responsibility: string;
  guarantee: string;
}

export const HERO_MAIN_IMAGE = '/src/assets/images/hero_quincho_piscina_natural_1794741217496.jpg';
export const ANGLE_TERRACE_IMAGE = '/src/assets/images/hero_terraza_piscina_natural_1794741217016.jpg';
export const ANGLE_DRIVEWAY_IMAGE = '/src/assets/images/hero_acceso_patente_natural_1794741217456.jpg';

export const STAGE_1_IMAGE = '/src/assets/images/stage_1_terreno_algarrobo_1794668442626.jpg';
export const STAGE_2_IMAGE = '/src/assets/images/stage_2_obra_gruesa_1794668443074.jpg';
export const STAGE_3_IMAGE = '/src/assets/images/stage_3_muros_termopanel_1794668444133.jpg';
export const STAGE_4_IMAGE = HERO_MAIN_IMAGE;

export const INTERIOR_TOUR_IMAGE = '/src/assets/images/interior_living_panoramic_1794667746412.jpg';
export const QUINCHO_SERVICE_IMAGE = '/src/assets/images/service_quincho_terrace_1794667745553.jpg';
export const POOL_SERVICE_IMAGE = '/src/assets/images/service_infinity_pool_1794667746112.jpg';
export const CEO_PORTRAIT_IMAGE = '/src/assets/images/ceo_founder_portrait_1794667746085.jpg';

export const ORBIT_ANGLES: OrbitAngle[] = [
  {
    id: 'terreno-solo',
    label: 'Terreno Solo · Sin Obra',
    description: 'Parcela natural en Algarrobo con estacado topográfico y vista al Pacífico antes de edificar.',
    image: STAGE_1_IMAGE,
    imageAlt: 'Terreno natural sin construcción en Algarrobo con estacas topográficas y vista al océano',
    defaultZoom: 1,
    focalPoint: '50% 50%',
  },
  {
    id: 'vista-piscina',
    label: 'Fachada Costa & Piscina',
    description: 'Vista a nivel de espejo de agua infinito hacia el living de doble altura y piedra natural.',
    image: ANGLE_TERRACE_IMAGE,
    imageAlt: 'Casa mediterránea vista desde la piscina infinita hacia el living vidriado',
    defaultZoom: 1,
    focalPoint: '50% 50%',
  },
  {
    id: 'vista-terraza-quincho',
    label: 'Terraza & Quincho',
    description: 'Perspectiva desde el jardín integrando residencia, pérgola de quincho y piscina.',
    image: HERO_MAIN_IMAGE,
    imageAlt: 'Vista exterior desde el jardín hacia casa mediterránea, piscina y quincho',
    defaultZoom: 1,
    focalPoint: '50% 50%',
  },
  {
    id: 'vista-acceso',
    label: 'Acceso & Estacionamiento',
    description: 'Patio de maniobras en adoquín con estacionamiento amplio y fachada de piedra natural.',
    image: ANGLE_DRIVEWAY_IMAGE,
    imageAlt: 'Acceso vehicular en adoquín con vehículo con patente chilena y fachada de piedra natural',
    defaultZoom: 1,
    focalPoint: '50% 50%',
  },
];

export const ZONE_VISIT_POINTS: ZoneVisitPoint[] = [
  {
    id: 'general',
    label: 'General',
    summary: 'Emplazamiento a nivel de jardín en parcela costera de 5.000 m².',
    angleIndex: 2,
    zoom: 1.0,
    panX: 0,
    panY: 0,
    pinX: 54,
    pinY: 36,
  },
  {
    id: 'terreno',
    label: 'Terreno Solo',
    summary: 'Estado inicial del sitio limpio antes de trazados y fundaciones en hormigón.',
    angleIndex: 0,
    zoom: 1.0,
    panX: 0,
    panY: 0,
    pinX: 50,
    pinY: 50,
  },
  {
    id: 'residencia',
    label: 'Residencia',
    summary: 'Volúmenes en hormigón armado, piedra cantera natural, cedro y termopanel.',
    angleIndex: 1,
    zoom: 1.12,
    panX: -2,
    panY: 2,
    pinX: 52,
    pinY: 38,
  },
  {
    id: 'quincho',
    label: 'Quincho',
    summary: 'Pérgola integrada al living con parrilla en acero inoxidable y terraza en travertino.',
    angleIndex: 2,
    zoom: 1.18,
    panX: -6,
    panY: -3,
    pinX: 65,
    pinY: 56,
  },
  {
    id: 'piscina',
    label: 'Piscina',
    summary: 'Vaso de hormigón con playa húmeda, iluminación LED y reflejo hacia el Pacífico.',
    angleIndex: 1,
    zoom: 1.14,
    panX: 3,
    panY: -4,
    pinX: 46,
    pinY: 68,
  },
  {
    id: 'estacionamiento',
    label: 'Acceso Auto',
    summary: 'Acceso pavimentado en adoquín junto al hall de piedra natural y puerta de entrada.',
    angleIndex: 3,
    zoom: 1.12,
    panX: -5,
    panY: -2,
    pinX: 74,
    pinY: 56,
  },
];

export const CONSTRUCTION_STAGES: ConstructionStage[] = [
  {
    id: 'terreno',
    step: '01',
    rangeLabel: '0% — 25%',
    title: 'Terreno Natural y Estudio de Emplazamiento',
    subtitle: 'Algarrobo, Región de Valparaíso',
    description:
      'Todo proyecto sólido comienza leyendo el terreno. Realizamos levantamiento topográfico con dron, calicatas de mecánica de suelos y análisis de asoleamiento costero para orientar las vistas hacia el horizonte marino y proteger la terraza del viento sur.',
    locationTag: 'Parcela 5.000 m² · Algarrobo Norte',
    image: STAGE_1_IMAGE,
    imageAlt: 'Terreno natural despejado en Algarrobo con estacas topográficas y vista al mar',
    specs: [
      { label: 'Mecánica de Suelos', value: 'NCh 1508 Certificada' },
      { label: 'Orientación Solar', value: 'Norponiente Estratégica' },
      { label: 'Cota de Emplazamiento', value: '+48 m s.n.m.' },
    ],
    progressTarget: 0.15,
  },
  {
    id: 'obra-gruesa',
    step: '02',
    rangeLabel: '25% — 50%',
    title: 'Trazados, Fundaciones y Hormigón Armado',
    subtitle: 'Ingeniería Sísmica Chilena NCh 433',
    description:
      'Ejecutamos excavaciones de precisión, plantillas de hormigón pobre, enfierradura A630-420H y losas de hormigón armado H30. La estructura portante permite grandes luces libres sin pilares intermedios y voladizos mediterráneos limpios.',
    locationTag: 'Etapa Estructural · Mes 2 – 4',
    image: STAGE_2_IMAGE,
    imageAlt: 'Obra gruesa en hormigón armado con pilares, losas y excavación de piscina',
    specs: [
      { label: 'Hormigón Estructural', value: 'Grado G30 / H30' },
      { label: 'Acero de Refuerzo', value: 'A630-420H Antisísmico' },
      { label: 'Luces Libres', value: 'Hasta 8,4 metros' },
    ],
    progressTarget: 0.42,
  },
  {
    id: 'envolvente',
    step: '03',
    rangeLabel: '50% — 75%',
    title: 'Muros Mediterráneos, Termopanel y Piscina',
    subtitle: 'Eficiencia Térmica y Materialidad Noble',
    description:
      'Levantamos los volúmenes blancos con sistema EIFS de alta aislación térmica, revestimientos de piedra cantera natural, cielos de cedro cepillado y ventanales de aluminio RPT con doble vidrio hermético Low-E. En paralelo se excava y hormigona el vaso de piscina.',
    locationTag: 'Terminaciones Exteriores · Mes 5 – 7',
    image: STAGE_3_IMAGE,
    imageAlt: 'Muros mediterráneos blancos, piedra natural, ventanales termopanel y vaso de piscina',
    specs: [
      { label: 'Ventanales', value: 'Termopanel Low-E RPT' },
      { label: 'Aislación Térmica', value: 'EIFS 80 mm + Lana' },
      { label: 'Vaso de Piscina', value: 'Hormigón Proyectado' },
    ],
    progressTarget: 0.7,
  },
  {
    id: 'obra-terminada',
    step: '04',
    rangeLabel: '75% — 100%',
    title: 'Entrega Llave en Mano Lista para Habitar',
    subtitle: 'Arquitectura, Quincho, Piscina y Paisajismo',
    description:
      'La transformación culmina con interiores terminados, cocina integrada operativa, quincho equipado en acero inoxidable, piscina cristalina con borde infinito y paisajismo nativo listo para disfrutar desde el primer día.',
    locationTag: 'Recepción Final · Mes 9',
    image: STAGE_4_IMAGE,
    imageAlt: 'Casa mediterránea terminada con quincho, terraza en travertino y piscina cristalina',
    specs: [
      { label: 'Modalidad', value: 'Llave en Mano Suma Alzada' },
      { label: 'Garantía Estructural', value: '10 Años Estructural' },
      { label: 'Desviación de Plazo', value: '0 días (Contrato Fijo)' },
    ],
    progressTarget: 1.0,
  },
];

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: 'casa',
    number: '01',
    shortTitle: 'Casas Mediterráneas',
    title: 'Construcción Integral de Casas Mediterráneas',
    headline: 'Arquitectura limpia, eficiencia térmica y estacionamientos integrados en tu parcela.',
    description:
      'Diseñamos y construimos residencias de 180 a 480 m² bajo contrato a suma alzada sin sorpresas. Volúmenes puros en blanco mineral, piedra natural, hormigón visto y grandes paños de termopanel orientados al paisaje chileno, con accesos vehiculares pavimentados para 3 o más vehículos.',
    image: ANGLE_DRIVEWAY_IMAGE,
    imageAlt: 'Casa mediterránea con estacionamiento en adoquín, piedra natural y grandes ventanales',
    specs: [
      'Diseño arquitectónico a medida + cálculo estructural',
      'Eficiencia térmica certificada para clima costero y valle central',
      'Estacionamiento amplio y acceso vehicular en adoquín o gravilla estabilizada',
    ],
  },
  {
    id: 'quincho',
    number: '02',
    shortTitle: 'Quinchos y Encuentro',
    title: 'Construcción de Quinchos y Espacios de Encuentro',
    headline: 'El corazón social de la parcela, conectado sin barreras al living y la terraza.',
    description:
      'Proyectamos quinchos de obra sólida integrados a la línea arquitectónica de la vivienda. Pérgolas de acero negro y madera nativa, campanas silenciosas de alta extracción, parrillas en acero inoxidable 304, hornos de barro o pizza, barras en cuarzo y chimeneas exteriores.',
    image: QUINCHO_SERVICE_IMAGE,
    imageAlt: 'Quincho moderno equipado con pérgola de acero y madera conectado a terraza',
    specs: [
      'Conexión fluida entre cocina interior, terraza en travertino y quincho',
      'Pérgolas bioclimáticas o en roble impregnado con iluminación LED cálida',
      'Equipamiento completo en acero inoxidable, mesones de granito y cava',
    ],
  },
  {
    id: 'piscina',
    number: '03',
    shortTitle: 'Piscinas y Mantención',
    title: 'Construcción y Mantenimiento de Piscinas',
    headline: 'Espejos de agua minimalistas en hormigón y servicio técnico continuo todo el año.',
    description:
      'Construimos piscinas de hormigón armado impermeabilizadas con revestimiento de cuarzo o porcelanato técnico, playas húmedas para reposeras, nado contracorriente y bordes infinitos. Además, nuestro equipo de mantención programada asegura agua cristalina las 52 semanas del año.',
    image: POOL_SERVICE_IMAGE,
    imageAlt: 'Piscina minimalista de hormigón con borde infinito y playa húmeda en parcela',
    specs: [
      'Playas húmedas, escaleras integradas y bordes infinitos hacia el paisaje',
      'Cloración salina automatizada, bombas de calor e iluminación subacuática',
      'Plan de mantención mensual permanente post-entrega en V Región y RM',
    ],
  },
];

export const INTERIOR_HOTSPOTS: InteriorHotspot[] = [
  {
    id: 'cielo-vigas',
    xPercent: 52,
    yPercent: 18,
    category: 'Estructura y Cielo',
    title: 'Cielo Doble Altura en Hormigón Visto y Roble',
    material: 'Hormigón arquitectónico + Vigas laminadas de Roble',
    specification: 'Altura libre de 4,60 m con iluminación LED lineal empotrada 2700K',
    benefit:
      'Genera amplitud espacial superior, inercia térmica natural y acústica cálida en todo el recinto social.',
  },
  {
    id: 'termopanel',
    xPercent: 28,
    yPercent: 45,
    category: 'Envolvente Acústica y Térmica',
    title: 'Ventanales Piso-Cielo Termopanel RPT',
    material: 'Aluminio negro anodizado con Ruptura de Puente Térmico',
    specification: 'Doble vidriado hermético 6+12+6 mm templado Low-E con riel embutido',
    benefit:
      'Apertura total de 7,2 metros que elimina la frontera interior-exterior manteniendo aislación frente al viento costero.',
  },
  {
    id: 'cocina-isla',
    xPercent: 78,
    yPercent: 60,
    category: 'Cocina de Autor',
    title: 'Isla Monolítica en Cuarzo y Enchape de Roble',
    material: 'Cuarzo Silestone mate + Carpintería con cierre suave Blum',
    specification: 'Cubierta continua de 3,8 m con encimera de inducción y grifería negra',
    benefit:
      'Diseñada para integrar al anfitrión con el living y la terraza sin sacrificar capacidad de almacenamiento.',
  },
  {
    id: 'pavimento',
    xPercent: 44,
    yPercent: 72,
    category: 'Pavimento Continuo',
    title: 'Travertino Natural Apomazado Interior-Exterior',
    material: 'Piedra Travertino formato 60×120 cm',
    specification: 'Acabado sedoso interior y antideslizante grado R11 hacia la terraza',
    benefit:
      'Continuidad visual absoluta sin desniveles desde el comedor hasta el borde de la piscina.',
  },
  {
    id: 'terraza-piscina',
    xPercent: 50,
    yPercent: 51,
    category: 'Eje Social Exterior',
    title: 'Salida Directa a Quincho y Piscina Cristalina',
    material: 'Pérgola en acero/madera + Vaso de hormigón impermeabilizado',
    specification: 'Alineación visual directa desde el acceso principal hasta el espejo de agua',
    benefit:
      'Circulación natural pensada para reuniones familiares de fin de semana y vida al aire libre.',
  },
];

export const TRUST_METRICS = [
  { value: '42.500 m²', label: 'Construidos en parcelas de Chile', context: 'Residencias, quinchos y obras exteriores' },
  { value: '86', label: 'Proyectos llave en mano entregados', context: 'V Región Costera y Región Metropolitana' },
  { value: '10 años', label: 'Garantía estructural certificada', context: 'Ejecución sólida en hormigón, acero y madera' },
  {
    value: 'Llave en mano',
    label: 'Pago por obra terminada',
    context: 'Modalidad de trabajo completo con pago al recibir tus llaves',
  },
  {
    value: 'Pago directo',
    label: 'Compra directa a proveedores',
    context: 'Transfieres directo a la ferretería o empresa por cada material, con total control y confianza',
  },
];

export const TEAM_DISCIPLINES: TeamDiscipline[] = [
  {
    id: 'arquitectura',
    code: '01',
    role: 'Arquitectura y Diseño',
    leadName: 'Catalina Errázuriz',
    credentials: 'Arquitecta PUC · 14 años en vivienda',
    responsibility:
      'Cabida en terreno, anteproyecto 3D, expediente municipal y selección de materialidad.',
    guarantee: 'Asoleamiento optimizado, vistas y permisos sin observaciones.',
  },
  {
    id: 'calculo',
    code: '02',
    role: 'Cálculo Estructural',
    leadName: 'Matías Santelices',
    credentials: 'Especialista en Cálculo Sísmico',
    responsibility:
      'Fundaciones según estudio de suelos, losas y estructura sísmica NCh 433.',
    guarantee: 'Seguridad estructural para grandes ventanales y voladizos.',
  },
  {
    id: 'construccion',
    code: '03',
    role: 'Construcción en Terreno',
    leadName: 'Cristóbal Bustamante',
    credentials: 'Constructor · Especialista en obra gruesa',
    responsibility:
      'Cuadrillas propias en obra, control de hormigón y avances semanales con bitácora.',
    guarantee: 'Cumplimiento de carta Gantt y terminaciones auditadas por partida.',
  },
  {
    id: 'interiorismo',
    code: '04',
    role: 'Interiorismo y Paisajismo',
    leadName: 'Fernanda Larrondo',
    credentials: 'Diseñadora de Ambientes y Exteriores',
    responsibility:
      'Maderas, iluminación cálida, equipamiento de quincho y vegetación nativa.',
    guarantee: 'Coherencia estética entre interior, quincho, piscina y jardín.',
  },
];

export interface RegionOption {
  id: 'valparaiso' | 'metropolitana';
  shortName: string;
  name: string;
  subtitle: string;
  communes: string[];
}

export const CHILE_REGIONS: RegionOption[] = [
  {
    id: 'valparaiso',
    shortName: 'V Región',
    name: 'Región de Valparaíso',
    subtitle: 'Litoral Central, Costa Norte y Valles (38 comunas)',
    communes: [
      'Algarrobo',
      'Cabildo',
      'Calle Larga',
      'Cartagena',
      'Casablanca',
      'Catemu',
      'Concón',
      'El Quisco',
      'El Tabo',
      'Hijuelas',
      'Isla de Pascua',
      'Juan Fernández',
      'La Calera',
      'La Cruz',
      'La Ligua',
      'Limache',
      'Llay-Llay',
      'Los Andes',
      'Nogales',
      'Olmué',
      'Panquehue',
      'Papudo',
      'Petorca',
      'Puchuncaví (Maitencillo / Horcón)',
      'Putaendo',
      'Quillota',
      'Quilpué',
      'Quintero',
      'Rinconada',
      'San Antonio',
      'San Esteban',
      'San Felipe',
      'Santa María',
      'Santo Domingo',
      'Valparaíso',
      'Villa Alemana',
      'Viña del Mar',
      'Zapallar (Cachagua)',
    ],
  },
  {
    id: 'metropolitana',
    shortName: 'Región Metropolitana',
    name: 'Región Metropolitana de Santiago',
    subtitle: 'Gran Santiago, Chicureo, Pirque y Valles (52 comunas)',
    communes: [
      'Alhué',
      'Buin',
      'Calera de Tango',
      'Cerrillos',
      'Cerro Navia',
      'Colina (Chicureo)',
      'Conchalí',
      'Curacaví',
      'El Bosque',
      'El Monte',
      'Estación Central',
      'Huechuraba',
      'Independencia',
      'Isla de Maipo',
      'La Cisterna',
      'La Florida',
      'La Granja',
      'La Pintana',
      'La Reina',
      'Lampa',
      'Las Condes',
      'Lo Barnechea',
      'Lo Espejo',
      'Lo Prado',
      'Macul',
      'Maipú',
      'María Pinto',
      'Melipilla',
      'Ñuñoa',
      'Padre Hurtado',
      'Paine',
      'Pedro Aguirre Cerda',
      'Peñaflor',
      'Peñalolén',
      'Pirque',
      'Providencia',
      'Pudahuel',
      'Puente Alto',
      'Quilicura',
      'Quinta Normal',
      'Recoleta',
      'Renca',
      'San Bernardo',
      'San Joaquín',
      'San José de Maipo',
      'San Miguel',
      'San Pedro',
      'San Ramón',
      'Santiago',
      'Talagante',
      'Tiltil',
      'Vitacura',
    ],
  },
];

export const REAL_BUILT_EXTERIOR_ENHANCED =
  '/src/assets/images/story_09_real_facade_finished_1794753618996.jpg';
export const REAL_BUILT_INTERIOR_ENHANCED =
  '/src/assets/images/real_project_finished_interior_1794669210117.jpg';

export interface RealProjectStorySlide {
  id: string;
  chapter: string;
  phase: string;
  title: string;
  caption: string;
  technicalNote: string;
  image: string;
  imageAlt: string;
  aspectHint: 'landscape' | 'portrait';
  isEnhanced?: boolean;
}

export const REAL_PROJECT_STORY_SLIDES: RealProjectStorySlide[] = [
  {
    id: 'story-01-envolvente',
    chapter: '01',
    phase: 'Semana 06 · Envolvente Exterior',
    title: 'Barrera Hídrica Matwrap y Subestructura de Deck',
    caption:
      'Tabiquería estructural revestida en tablero OSB + membrana hidrófuga respirable Matwrap en todo el perímetro bajo bosque de pinos costeros.',
    technicalNote: 'Membrana Matwrap · Deck en pino IPV · Ventana proyectada en voladizo',
    image: '/src/assets/images/story_01_matwrap_forest_1794752083985.jpg',
    imageAlt: 'Obra real revestida en membrana blanca Matwrap con terraza frontal rodeada de pinos',
    aspectHint: 'landscape',
  },
  {
    id: 'story-02-vapor',
    chapter: '02',
    phase: 'Semana 09 · Física Constructiva',
    title: 'Control de Vapor Rothoblaas y Revestimiento Pino',
    caption:
      'Instalación de membrana inteligente Rothoblaas en cielos para evitar condensación intersticial antes de fijar machihembrado cepillado.',
    technicalNote: 'Barrera Rothoblaas + Lana mineral 100 mm · Fijaciones ocultas',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_12.03.03_PM_e4f94365.jpeg',
    imageAlt: 'Instalación interior de membrana Rothoblaas y revestimiento vertical en madera',
    aspectHint: 'landscape',
  },
  {
    id: 'story-03-doble-altura',
    chapter: '03',
    phase: 'Semana 11 · Volumen Social',
    title: 'Estructura en Doble Altura y Vigas a la Vista',
    caption:
      'El volumen central se eleva sobre la crujía de dormitorios con envigado robusto a la vista y gran vano hacia la terraza panorámica.',
    technicalNote: 'Altura libre 4,2 m · Madera impregnada estructural',
    image: '/src/assets/images/story_03_doble_altura_wide_1794750911961.jpg',
    imageAlt: 'Vista interior de doble altura con vigas a la vista y andamios de terminación',
    aspectHint: 'landscape',
  },
  {
    id: 'story-04-aislacion',
    chapter: '04',
    phase: 'Semana 13 · Aislación y Luz Alta',
    title: 'Cavidad Térmica Sellada y Lucarna Superior',
    caption:
      'Aislación continua en lana mineral de alta densidad, canalización eléctrica embutida y ventana alta para iluminar el estar todo el día.',
    technicalNote: 'Transmitancia U < 0,32 W/m²K · Precisión en encuentros de madera',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_12.03.02_PM__1__be8804c2.jpeg',
    imageAlt: 'Carpintería interior avanzada con lana mineral expuesta y lucarna superior',
    aspectHint: 'landscape',
  },
  {
    id: 'story-05-revestimiento-social',
    chapter: '05',
    phase: 'Semana 14 · Carpintería Social',
    title: 'Revestimiento Pino Cepillado en Recinto Principal',
    caption:
      'Avance interior con cielos machihembrados instalados, apertura hacia la terraza frontal y tabiques recibiendo aislación térmica de lana mineral.',
    technicalNote: 'Pino cepillado seleccionado · Canalización embutida tras tabique',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_12.03.02_PM_af047877.jpeg',
    imageAlt: 'Living en revestimiento con madera acopiada, lucarna alta y vano hacia el deck',
    aspectHint: 'landscape',
  },
  {
    id: 'story-06-tabiqueria-pasillo',
    chapter: '06',
    phase: 'Semana 15 · Eje Distribuidor',
    title: 'Trazado de Pasillo Central y Puntos Eléctricos',
    caption:
      'Conformación del corredor distribuidor hacia dormitorios con cielos empastados, descuelgues de iluminación y marcos en madera sólida.',
    technicalNote: 'Corredor central recto · Tabiquería acústica entre dormitorios',
    image: '/src/assets/images/story_pasillo_obra_wide_1794754034139.jpg',
    imageAlt: 'Pasillo interior en construcción con muros en pino y cielo preparado para luminarias',
    aspectHint: 'landscape',
  },
  {
    id: 'story-07-dormitorios-pino',
    chapter: '07',
    phase: 'Semana 16 · Ala Privada',
    title: 'Dormitorios Íntegramente Revestidos en Pino',
    caption:
      'Terminación perimetral continua en tablas verticales de pino cepillado sobre radier nivelado con cajas eléctricas listas para artefactos.',
    technicalNote: 'Tablas verticales 1x4 · Radier afinado listo para piso vinílico',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_12.03.03_PM__2__8315f2fe.jpeg',
    imageAlt: 'Dormitorio interior revestido completamente en madera vertical de pino natural',
    aspectHint: 'landscape',
  },
  {
    id: 'story-08-fachada-negra',
    chapter: '08',
    phase: 'Semana 17 · Piel Exterior',
    title: 'Acero Micro-Nervado Negro y Rampa de Acceso',
    caption:
      'Revestimiento vertical negro mate que dialoga con marcos de madera natural impregnada, nicho de acceso iluminado y rampa continua sin escalones.',
    technicalNote: 'Revestimiento acero PV negro mate · Madera tratada con protector UV',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_12.02.28_PM_f1609490.jpeg',
    imageAlt: 'Fachada lateral terminada en acero negro vertical con ventana saliente y rampa',
    aspectHint: 'landscape',
  },
  {
    id: 'story-09-pasillo-led',
    chapter: '09',
    phase: 'Semana 19 · Circulación Terminada',
    title: 'Pasillo en Pino Natural y Portal Carbonizado',
    caption:
      'Eje distribuidor revestido íntegramente en madera vertical con piso continuo cálido y serie lineal de focos cilíndricos negros LED 3000K.',
    technicalNote: 'Portal en tinte carbón · Luminarias sobrepuestas negro mate',
    image: '/src/assets/images/story_06_pasillo_wide_1794750911999.jpg',
    imageAlt: 'Pasillo interior terminado en madera natural con focos negros encendidos',
    aspectHint: 'landscape',
  },
  {
    id: 'story-10-living-obra',
    chapter: '10',
    phase: 'Semana 20 · Pre-Aseo Living',
    title: 'Living Doble Altura con Muro Acento Oscuro',
    caption:
      'Contraste arquitectónico entre el muro en madera teñida oscura de doble altura, los ventanales correderos en aluminio negro y la salida al deck.',
    technicalNote: 'Ventanal corredero termopanel negro · Lucarna superior operativa',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_12.02.24_PM__1__6cf909e5.jpeg',
    imageAlt: 'Living de doble altura con muro de madera oscura y puerta ventana al deck',
    aspectHint: 'landscape',
  },
  {
    id: 'story-11-hora-azul',
    chapter: '11',
    phase: 'Semana 22 · Prueba Lumínica Lateral',
    title: 'Encendido de Fachada y Deck al Atardecer',
    caption:
      'Las luminarias empotradas en el alero bañan la madera y destacan el volumen saliente derecho en medio del bosque costero.',
    technicalNote: 'Iluminación arquitectónica de alero · Termopaneles con luz interior cálida',
    image: '/src/assets/images/story_08_hora_azul_wide_1794750914449.jpg',
    imageAlt: 'Vista real al atardecer de la casa iluminada entre pinos antes del paisajismo',
    aspectHint: 'landscape',
  },
  {
    id: 'story-12-galeria-nocturna',
    chapter: '12',
    phase: 'Semana 22 · Galería Continua',
    title: 'Iluminación Completa de Galería y Deck Longitudinal',
    caption:
      'Encendido simultáneo de todos los apliques perimetrales a lo largo de los ventanales y pasarela frontal en madera iluminada bajo los pinos.',
    technicalNote: 'Apliques direccionales 2700K · Deck continuo perimetral',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-14_at_12.02.25_PM__2__143b1a51.jpeg',
    imageAlt: 'Vista nocturna panorámica de toda la fachada iluminada y deck longitudinal entre pinos',
    aspectHint: 'landscape',
  },
  {
    id: 'story-13-terminada',
    chapter: '13',
    phase: 'Proyecto Terminado · Visión Final',
    title: 'Paisajismo Natural, Camino en Madera y Piedra',
    caption:
      'Propuesta final sobre la fachada real entregada: living equipado visible al interior, deck limpio con terraza, sendero en madera y piedra natural integrado entre pinos y vegetación costera.',
    technicalNote: 'Terminación integral llave en mano · Camino madera/piedra y paisajismo nativo',
    image: REAL_BUILT_EXTERIOR_ENHANCED,
    imageAlt: 'Casa real terminada al atardecer con camino en madera y piedra, vegetación nativa y living iluminado',
    aspectHint: 'landscape',
    isEnhanced: true,
  },
];

export interface RealProjectComparison {
  id: 'exterior';
  label: string;
  title: string;
  subtitle: string;
  aspectClass: string;
  beforeLabel: string;
  afterLabel: string;
  beforeImage: string;
  afterImage: string;
  hotspots: {
    id: string;
    num: number;
    xPercent: number;
    yPercent: number;
    title: string;
    detail: string;
  }[];
}

export const REAL_PROJECT_COMPARISONS: RealProjectComparison[] = [
  {
    id: 'exterior',
    label: 'Inicio vs. Entrega Final',
    title: 'Inicio en Envolvente vs. Entrega Consolidada',
    subtitle:
      'Desliza el selector de cortina para comparar el inicio de obra frente al proyecto terminado con camino en madera, piedra y paisajismo natural.',
    aspectClass: 'aspect-[16/10]',
    beforeLabel: 'Inicio de Obra',
    afterLabel: 'Proyecto Terminado',
    beforeImage: '/src/assets/images/story_01_matwrap_forest_1794752083985.jpg',
    afterImage: REAL_BUILT_EXTERIOR_ENHANCED,
    hotspots: [],
  },
];

