import type { CoProprieteState, BudgetItem, Apartment, AGTask, Expense, PaymentRecord, LitigationCase, ExtraIncome } from '../types';

export const initialResidenceInfo: CoProprieteState = {
  name: 'إقامة آدم 168',
  address: '168 شارع محمد الخامس، حي ميموزا',
  city: 'القنيطرة',
  syndicPro: 'شركة التدبير العقاري COPRO SYNC H T',
  syndicManager: 'حمزة التيعال',
  syndicContact: '+212 6 61 23 45 67 / contact@coprosync.ma',
  councilVP: 'شريف',
  councilVPContact: '+212 6 63 98 76 54',
  initialBankBalance: 6580, // الرصيد المالي الأولي في 12/08/2026
  monthlyDuePerApt: 300,
  totalApartments: 20,
  bankAccountRib: '011 360 0000 123456789012 34 (التجاري وفا بنك - وكالة القنيطرة)',
  bankName: 'التجاري وفا بنك',
  fiscalYear: 'من 01/09/2026 إلى 31/08/2027',
  agDate: '12/08/2026',
  syndicApartmentRent: 1600,
  monthlyOperatingBudget: 6000
};

// المعطيات المالية التاريخية من محضر الجمع العام لـ 12/08/2026
export const historicalFinancials = {
  recettesHistoriques: 101000,
  depensesPassees: 157220,
  deficitAnterieur: 49000,
  soldeDepartReel: 6580
};

// 1. المصاريف الشهرية التقديرية (الميزانية العادية - 6,000 درهم / شهر - 72,000 درهم / سنة)
export const initialBudgetItems: BudgetItem[] = [
  {
    id: 'b1',
    code: 'Poste-01',
    name: 'Gardiennage (12h/7)',
    monthlyBudget: 2500,
    annualBudget: 30000,
    category: 'Personnel',
    description: 'Salaire du gardien (12h/7j) et sortie des poubelles'
  },
  {
    id: 'b2',
    code: 'Poste-02',
    name: 'Nettoyage des parties communes (1x/semaine)',
    monthlyBudget: 800,
    annualBudget: 9600,
    category: 'Entretien',
    description: '4 passages mensuels de nettoyage des escaliers et hall'
  },
  {
    id: 'b3',
    code: 'Poste-03',
    name: 'Électricité des communs',
    monthlyBudget: 700,
    annualBudget: 8400,
    category: 'Énergie',
    description: 'Factures RAK Kénitra (compteur communs & ascenseur)'
  },
  {
    id: 'b4',
    code: 'Poste-04',
    name: 'Produits et matériel de nettoyage',
    monthlyBudget: 200,
    annualBudget: 2400,
    category: 'Entretien',
    description: 'Achat détergents, eau de javel, sacs poubelles et serpillières'
  },
  {
    id: 'b5',
    code: 'Poste-05',
    name: 'Frais de gestion et syndic (COPRO SYNC)',
    monthlyBudget: 900,
    annualBudget: 10800,
    category: 'Gestion',
    description: 'Honoraires mensuels de gestion de la société COPRO SYNC H T'
  },
  {
    id: 'b6',
    code: 'Poste-06',
    name: "Maintenance de l'ascenseur",
    monthlyBudget: 300,
    annualBudget: 3600,
    category: 'Maintenance',
    description: 'Contrat de maintenance technique mensuelle et graissage'
  },
  {
    id: 'b7',
    code: 'Poste-07',
    name: 'Jardinage / Espace vert',
    monthlyBudget: 200,
    annualBudget: 2400,
    category: 'Espaces Verts',
    description: 'Taille des ficus, désherbage et entretien de la végétation'
  },
  {
    id: 'b8',
    code: 'Poste-08',
    name: 'Compte de réserve / Imprévus',
    monthlyBudget: 200,
    annualBudget: 2400,
    category: 'Réserve',
    description: 'Fonds pour imprévus et réparations urgentes votées en AG',
    isReserve: true
  },
  {
    id: 'b9',
    code: 'Poste-09',
    name: 'Frais bancaires, notifications & conseil juridique',
    monthlyBudget: 200,
    annualBudget: 2400,
    category: 'Administration',
    description: 'Tenue de compte, courriers recommandés et conseil juridique'
  }
];

// 2. الأشغال الكبرى والإصلاحات وقرارات الجمع العام (محضر الجمع العام 12/08/2026 - 9 قرارات)
export const initialAGTasks: AGTask[] = [
  // أ. أشغال التحسين واقتصاد الطاقة
  {
    id: 'ag-1',
    agReference: 'الجمع العام 12/08/2026 - قرار أ.1',
    title: 'تركيب نظام الرقاقات الإلكترونية لتشغيل المصعد',
    description: 'تثبيت نظام شارات / رقاقات إلكترونية في كابينة المصعد لحصر الاستعمال وتقليص استهلاك الكهرباء، مع تسليم الرقاقات فقط للملاك المؤدين لمساهماتهم.',
    category: 'SECURITE',
    status: 'EN_COURS',
    priority: 'HAUTE',
    deadline: '2026-10-15',
    provider: 'شركة القنيطرة للمصاعد والأمن',
    providerPhone: '+212 5 37 37 88 99',
    estimatedBudget: 4200,
    finalInvoice: 0,
    attachments: [
      {
        id: 'att-1',
        name: 'Devis_Puces_Ascenseur.pdf',
        size: 145000,
        type: 'pdf',
        dataUrl: '',
        uploadedAt: '2026-08-15'
      }
    ],
    notes: 'تم طلب المعدات وبرمجة 60 رقاقة (3 شارات لكل شقة مؤدية).',
    createdAt: '2026-08-13'
  },
  {
    id: 'ag-2',
    agReference: 'الجمع العام 12/08/2026 - قرار أ.2',
    title: 'فتح نافذة تهوية في غرفة محرك المصعد',
    description: 'فتح نافذة تهوية بشباك حماية في غرفة المحرك بالسطح لخفض درجة الحرارة ومنع الأعطال الحرارية للمصعد صيفاً.',
    category: 'TRAVAUX',
    status: 'NON_COMMENCE',
    priority: 'MOYENNE',
    deadline: '2026-11-15',
    provider: 'مقاولة البحري للبناء والألمنيوم',
    providerPhone: '+212 6 68 90 23 45',
    estimatedBudget: 2200,
    finalInvoice: 0,
    attachments: [],
    notes: 'في انتظار عروض الأسعار النهائية للبدء في الأشغال.',
    createdAt: '2026-08-13'
  },
  {
    id: 'ag-3',
    agReference: 'الجمع العام 12/08/2026 - قرار أ.3',
    title: 'إصلاح كهرباء المرآب والسلالم وتركيب مصابيح LED',
    description: 'تجديد كامل للإنارة في القبو والسلالم وتركيب مصابيح LED اقتصادية مع حساسات الحركة التلقائية.',
    category: 'ELECTRICITE',
    status: 'TERMINE',
    priority: 'HAUTE',
    deadline: '2026-09-10',
    provider: 'الكهربائي المعتمد حسن التلمساني',
    providerPhone: '+212 6 61 77 44 22',
    estimatedBudget: 2800,
    finalInvoice: 2650,
    attachments: [
      {
        id: 'att-2',
        name: 'Facture_Electricite_LED.pdf',
        size: 210000,
        type: 'pdf',
        dataUrl: '',
        uploadedAt: '2026-09-08'
      }
    ],
    notes: 'تم إنهاء الأشغال ومعاينتها من طرف السيد شريف، مع توفير 150 درهم مقارنة بالتقدير الأولي.',
    completionDate: '2026-09-08',
    createdAt: '2026-08-13'
  },

  // ب. معدات السلامة والصيانة
  {
    id: 'ag-4',
    agReference: 'الجمع العام 12/08/2026 - قرار ب.4',
    title: 'إصلاح كاميرات المراقبة وتركيب شاشة تلفاز 32 بوصة',
    description: '1) صيانة وإعادة تشغيل الكاميرات الحالية. 2) تركيب شاشة تلفاز 32 بوصة عند مدخل الإقامة للمراقبة المباشرة وردع المتطفلين.',
    category: 'SECURITE',
    status: 'EN_COURS',
    priority: 'HAUTE',
    deadline: '2026-10-25',
    provider: 'شركة كاميرات المراقبة بالقنيطرة',
    providerPhone: '+212 5 37 36 90 90',
    estimatedBudget: 3500,
    finalInvoice: 0,
    attachments: [],
    notes: 'تم فحص الكاميرات الست والأسلاك، جاري شراء الشاشة والحامل الجداري.',
    createdAt: '2026-08-13'
  },
  {
    id: 'ag-5',
    agReference: 'الجمع العام 12/08/2026 - قرار ب.5',
    title: 'السلامة من الحرائق : شراء 4 مطفآت حريق (2 بودرة + 2 CO2)',
    description: 'تجهيز الإقامة بـ 4 مطفآت معتمدة: 2 مطفأة بودرة 6 كلغ للممرات والمرآب + 2 مطفأة ثنائي أكسيد الكربون 2 كلغ للوحة الكهربائية وغرفة المصعد.',
    category: 'SECURITE',
    status: 'TERMINE',
    priority: 'URGENT',
    deadline: '2026-08-30',
    provider: 'شركة الوقاية من الحرائق - الغرب',
    providerPhone: '+212 5 37 38 12 12',
    estimatedBudget: 1900,
    finalInvoice: 1850,
    attachments: [
      {
        id: 'att-3',
        name: 'Certificat_Extincteurs.pdf',
        size: 185000,
        type: 'pdf',
        dataUrl: '',
        uploadedAt: '2026-08-28'
      }
    ],
    notes: 'تم تثبيت المطفآت الأربع جدارياً مع اللوحات الإرشادية في الأماكن المحددة.',
    completionDate: '2026-08-28',
    createdAt: '2026-08-13'
  },
  {
    id: 'ag-6',
    agReference: 'الجمع العام 12/08/2026 - قرار ب.6',
    title: 'إصلاح الباب الرئيسي للعمارة والقفل الأوتوماتيكي',
    description: 'إصلاح مغلاق الباب الهيدروليكي Geze، تسوية الفتح وتغيير أسطوانة القفل بأخرى مصفحة عالية الأمان.',
    category: 'TRAVAUX',
    status: 'TERMINE',
    priority: 'HAUTE',
    deadline: '2026-08-20',
    provider: 'ورشة المنصور للحدادة والأقفال',
    providerPhone: '+212 6 63 45 11 99',
    estimatedBudget: 1200,
    finalInvoice: 1100,
    attachments: [
      {
        id: 'att-4',
        name: 'Facture_Ferme_Porte.pdf',
        size: 98000,
        type: 'pdf',
        dataUrl: '',
        uploadedAt: '2026-08-19'
      }
    ],
    notes: 'الباب يغلق بإحكام وهدوء، وتم تسليم المفاتيح للحارس وأعضاء المكتب.',
    completionDate: '2026-08-19',
    createdAt: '2026-08-13'
  },
  {
    id: 'ag-7',
    agReference: 'الجمع العام 12/08/2026 - قرار ب.7',
    title: 'عملية النظافة الشاملة الشهرية والتنظيف اليومي',
    description: '1) تنفيذ عملية تنظيف شهرية عميقة (جلي السلالم، تنظيف الزجاج، تعقيم الحاويات). 2) الالتزام ببرنامج النظافة اليومي من طرف الحارس.',
    category: 'ENTRETIEN',
    status: 'TERMINE',
    priority: 'MOYENNE',
    deadline: '2026-09-05',
    provider: 'شركة القنيطرة لخدمات النظافة',
    providerPhone: '+212 5 37 36 77 88',
    estimatedBudget: 1500,
    finalInvoice: 1400,
    attachments: [
      {
        id: 'att-5',
        name: 'Rapport_Nettoyage_Complet.pdf',
        size: 320000,
        type: 'pdf',
        dataUrl: '',
        uploadedAt: '2026-09-04'
      }
    ],
    notes: 'تمت العملية بنجاح يوم السبت 04/09، وتسليم جدول التتبع اليومي للحارس ميلود.',
    completionDate: '2026-09-04',
    createdAt: '2026-08-13'
  },
  {
    id: 'ag-8',
    agReference: 'الجمع العام 12/08/2026 - قرار ب.8',
    title: 'إخلاء وإزالة جميع المتلاشيات في الأجزاء المشتركة',
    description: 'إفراغ ونقل جميع الأثاث القديم، مواد البناء والمتلاشيات المتروكة تحت السلالم وفي الممرات والقبو لأسباب تتعلق بالنظافة والسلامة.',
    category: 'ENTRETIEN',
    status: 'TERMINE',
    priority: 'MOYENNE',
    deadline: '2026-08-25',
    provider: 'شاحنة النقل والإخلاء مع الحراسة',
    providerPhone: '+212 6 61 23 45 67',
    estimatedBudget: 600,
    finalInvoice: 550,
    attachments: [],
    notes: 'تم إخلاء جميع الممرات بالكامل يوم 22/08/2026.',
    completionDate: '2026-08-22',
    createdAt: '2026-08-13'
  },

  // ج. استغلال شقة وكيل الاتحاد
  {
    id: 'ag-9',
    agReference: 'الجمع العام 12/08/2026 - قرار ج.9',
    title: 'كراء شقة وكيل الاتحاد (شقة السنديك - شقة 21) لتمويل الصندوق',
    description: 'المصادقة على استغلال الشقة المخصصة للسنديك (شقة 21) للكراء بمبلغ 1,600 درهم/شهر لدعم مداخيل الإقامة وصندوق الإصلاحات.',
    category: 'GESTION',
    status: 'TERMINE',
    priority: 'HAUTE',
    deadline: '2026-08-31',
    provider: 'شركة COPRO SYNC مع الموثق',
    providerPhone: '+212 5 37 35 44 33',
    estimatedBudget: 800,
    finalInvoice: 800,
    attachments: [
      {
        id: 'att-6',
        name: 'Contrat_Bail_Appt_Syndic_1600DH.pdf',
        size: 450000,
        type: 'pdf',
        dataUrl: '',
        uploadedAt: '2026-08-30'
      }
    ],
    notes: 'تم توقيع العقد، ويتم تحويل السومة الكرائية (1,600 درهم شهرياً) مباشرة إلى حساب الإقامة البنكي.',
    completionDate: '2026-08-30',
    createdAt: '2026-08-13'
  }
];

// 20 شقة
export const initialApartments: Apartment[] = [
  { id: 1, number: 'شقة 01', floor: 0, ownerName: 'شقة 01', phone: '', surfaceM2: 85, isRented: false, monthlyDue: 300, isLitigation: false },
  { id: 2, number: 'شقة 02', floor: 0, ownerName: 'شقة 02', phone: '', surfaceM2: 78, isRented: false, monthlyDue: 300, isLitigation: false },
  { id: 3, number: 'شقة 03', floor: 0, ownerName: 'شقة 03', phone: '', surfaceM2: 90, isRented: false, monthlyDue: 300, isLitigation: true },
  { id: 4, number: 'شقة 04', floor: 0, ownerName: 'شقة 04', phone: '', surfaceM2: 82, isRented: false, monthlyDue: 300, isLitigation: false },
  
  { id: 5, number: 'شقة 05', floor: 1, ownerName: 'شقة 05', phone: '', surfaceM2: 95, isRented: false, monthlyDue: 300, isLitigation: true },
  { id: 6, number: 'شقة 06', floor: 1, ownerName: 'شقة 06', phone: '', surfaceM2: 88, isRented: false, monthlyDue: 300, isLitigation: false },
  { id: 7, number: 'شقة 07', floor: 1, ownerName: 'شقة 07', phone: '', surfaceM2: 84, isRented: false, monthlyDue: 300, isLitigation: true },
  { id: 8, number: 'شقة 08', floor: 1, ownerName: 'شقة 08', phone: '', surfaceM2: 92, isRented: false, monthlyDue: 300, isLitigation: false },

  { id: 9, number: 'شقة 09', floor: 2, ownerName: 'شقة 09', phone: '', surfaceM2: 90, isRented: false, monthlyDue: 300, isLitigation: true },
  { id: 10, number: 'شقة 10', floor: 2, ownerName: 'شقة 10', phone: '', surfaceM2: 86, isRented: false, monthlyDue: 300, isLitigation: false },
  { id: 11, number: 'شقة 11', floor: 2, ownerName: 'شقة 11', phone: '', surfaceM2: 96, isRented: false, monthlyDue: 300, isLitigation: true },
  { id: 12, number: 'شقة 12', floor: 2, ownerName: 'شقة 12', phone: '', surfaceM2: 80, isRented: false, monthlyDue: 300, isLitigation: false },

  { id: 13, number: 'شقة 13', floor: 3, ownerName: 'شقة 13', phone: '', surfaceM2: 89, isRented: false, monthlyDue: 300, isLitigation: true },
  { id: 14, number: 'شقة 14', floor: 3, ownerName: 'شقة 14', phone: '', surfaceM2: 83, isRented: false, monthlyDue: 300, isLitigation: false },
  { id: 15, number: 'شقة 15', floor: 3, ownerName: 'شقة 15', phone: '', surfaceM2: 91, isRented: false, monthlyDue: 300, isLitigation: true },
  { id: 16, number: 'شقة 16', floor: 3, ownerName: 'شقة 16', phone: '', surfaceM2: 87, isRented: false, monthlyDue: 300, isLitigation: false },

  { id: 17, number: 'شقة 17', floor: 4, ownerName: 'شقة 17', phone: '', surfaceM2: 94, isRented: false, monthlyDue: 300, isLitigation: true },
  { id: 18, number: 'شقة 18', floor: 4, ownerName: 'شقة 18', phone: '', surfaceM2: 85, isRented: false, monthlyDue: 300, isLitigation: false },
  { id: 19, number: 'شقة 19', floor: 4, ownerName: 'شقة 19', phone: '', surfaceM2: 92, isRented: false, monthlyDue: 300, isLitigation: false },
  { id: 21, number: 'شقة 21', floor: 4, ownerName: 'شقة وكيل الاتحاد (شقة 21)', phone: '', surfaceM2: 55, isRented: true, monthlyDue: 0, isLitigation: false, notes: 'ملك مشترك مكترى بـ 1,600 درهم/شهر لصالح حساب الإقامة' }
];

export const initialLitigationCases: LitigationCase[] = [
  { apartmentId: 3, ownerName: 'شقة 03', status: 'AVOCAT', unpaidMonthsCount: 14, totalDebt: 4200, courtFeesEngaged: 1500, lawyer: 'الأستاذ بنشقرون (هيئة القنيطرة)', caseReference: 'DOS-2026-03-KT', lastActionDate: '2026-08-18', nextStep: 'إيداع مقال افتتاحي', notes: 'الملف محال.' },
  { apartmentId: 5, ownerName: 'شقة 05', status: 'INJONCTION_PAYER', unpaidMonthsCount: 22, totalDebt: 6600, courtFeesEngaged: 1800, lawyer: 'الأستاذ بنشقرون', caseReference: 'INJ-2026-882', lastActionDate: '2026-09-02', nextStep: 'تبليغ بواسطة المفوض القضائي', notes: 'أمر صادر.' },
  { apartmentId: 7, ownerName: 'شقة 07', status: 'MISE_EN_DEMEURE', unpaidMonthsCount: 8, totalDebt: 2400, courtFeesEngaged: 450, lawyer: 'مكتب COPRO SYNC القانوني', caseReference: 'MED-2026-07-KA', lastActionDate: '2026-08-25', nextStep: 'انقضاء أجل 15 يوماً', notes: 'إنذار متوصل به.' },
  { apartmentId: 9, ownerName: 'شقة 09', status: 'JUGEMENT', unpaidMonthsCount: 30, totalDebt: 9000, courtFeesEngaged: 2500, lawyer: 'الأستاذ بنشقرون', caseReference: 'JUG-2026-1452', lastActionDate: '2026-07-15', nextStep: 'فتح ملف التنفيذ', notes: 'حكم نهائي صادر.' },
  { apartmentId: 11, ownerName: 'شقة 11', status: 'EXECUTION', unpaidMonthsCount: 38, totalDebt: 11400, courtFeesEngaged: 3200, lawyer: 'الأستاذ بنشقرون', caseReference: 'EXEC-2026-041', lastActionDate: '2026-09-10', nextStep: 'حجز تحفظي على الحساب', notes: 'إعذار بالتنفيذ.' },
  { apartmentId: 13, ownerName: 'شقة 13', status: 'AVOCAT', unpaidMonthsCount: 12, totalDebt: 3600, courtFeesEngaged: 1500, lawyer: 'الأستاذ بنشقرون', caseReference: 'DOS-2026-13-AK', lastActionDate: '2026-08-20', nextStep: 'استدعاء للجلسة', notes: 'إحالة على المحكمة.' },
  { apartmentId: 15, ownerName: 'شقة 15', status: 'ACCORD_AMIABLE', unpaidMonthsCount: 16, totalDebt: 4800, courtFeesEngaged: 500, lawyer: 'مكتب COPRO SYNC', caseReference: 'ACC-2026-15-NS', lastActionDate: '2026-09-01', nextStep: 'تتبع سداد 600 درهم/شهر', notes: 'اتفاق موقع ومحترم.' },
  { apartmentId: 17, ownerName: 'شقة 17', status: 'MISE_EN_DEMEURE', unpaidMonthsCount: 6, totalDebt: 1800, courtFeesEngaged: 350, lawyer: 'مكتب COPRO SYNC', caseReference: 'MED-2026-17-RB', lastActionDate: '2026-08-05', nextStep: 'إحالة على القضاء', notes: 'انتهاء المهلة.' }
];

export const initialExpenses: Expense[] = [
  // شتنبر 2026
  {
    id: 'exp-2026-09-01',
    date: '2026-09-01',
    budgetId: 'b1',
    budgetName: 'Gardiennage (12h/7)',
    type: 'ORDINAIRE',
    amount: 2500,
    beneficiary: 'M. Miloud Zaidi (Gardien)',
    paymentMethod: 'ESPECES',
    invoiceNumber: 'RECU-GAR-09/2026',
    notes: 'Salaire du mois de septembre 2026 avec émargement du reçu',
    createdAt: '2026-09-01'
  },
  {
    id: 'exp-2026-09-02',
    date: '2026-09-02',
    budgetId: 'b5',
    budgetName: 'Frais de gestion et syndic (COPRO SYNC)',
    type: 'ORDINAIRE',
    amount: 900,
    beneficiary: 'Société COPRO SYNC H T',
    paymentMethod: 'VIREMENT',
    invoiceNumber: 'FAC-CS-2026-09-168',
    notes: 'Honoraires de gestion syndic pour septembre 2026',
    createdAt: '2026-09-02'
  },
  {
    id: 'exp-2026-09-04',
    date: '2026-09-04',
    budgetId: 'b2',
    budgetName: 'Nettoyage des parties communes (1x/semaine)',
    type: 'ORDINAIRE',
    amount: 800,
    beneficiary: 'Mme Fatima Zahra (Agent d\'entretien)',
    paymentMethod: 'ESPECES',
    invoiceNumber: 'RECU-MEN-09/2026',
    notes: '4 passages hebdomadaires du mois de septembre',
    createdAt: '2026-09-04'
  },
  {
    id: 'exp-2026-09-06',
    date: '2026-09-06',
    budgetId: 'b3',
    budgetName: 'Électricité des communs',
    type: 'ORDINAIRE',
    amount: 684,
    beneficiary: 'RAK Kénitra (Régie Autonome)',
    paymentMethod: 'PRELEVEMENT',
    invoiceNumber: 'FAC-RAK-08-98472',
    notes: 'Consommation compteur parties communes & ascenseur',
    createdAt: '2026-09-06'
  },
  {
    id: 'exp-2026-09-08',
    date: '2026-09-08',
    budgetId: 'b8',
    budgetName: 'Compte de réserve / Imprévus',
    type: 'EXCEPTIONNEL_RESERVE',
    amount: 2650,
    beneficiary: 'M. Hassan Tlemcani (Électricien)',
    paymentMethod: 'CHEQUE',
    invoiceNumber: 'FAC-ELEC-2026-04',
    notes: 'Exécution de la résolution AG N°2 : Réparation complète de l\'éclairage garage et escaliers',
    createdAt: '2026-09-08'
  },
  {
    id: 'exp-2026-09-04-bis',
    date: '2026-09-04',
    budgetId: 'b8',
    budgetName: 'Compte de réserve / Imprévus',
    type: 'EXCEPTIONNEL_RESERVE',
    amount: 1400,
    beneficiary: 'Société Kénitra Net Services',
    paymentMethod: 'VIREMENT',
    invoiceNumber: 'FAC-KNS-2026-551',
    notes: 'Exécution résolution AG N°6 : Nettoyage annuel approfondi',
    createdAt: '2026-09-04'
  },
  {
    id: 'exp-2026-09-10',
    date: '2026-09-10',
    budgetId: 'b4',
    budgetName: 'Produits et matériel de nettoyage',
    type: 'ORDINAIRE',
    amount: 190,
    beneficiary: 'Droguerie Al Amal Kénitra',
    paymentMethod: 'ESPECES',
    invoiceNumber: 'BL-DROG-742',
    notes: 'Achat détergents, eau de javel, sacs poubelles 100L et serpillières',
    createdAt: '2026-09-10'
  },
  {
    id: 'exp-2026-09-12',
    date: '2026-09-12',
    budgetId: 'b6',
    budgetName: 'Maintenance de l\'ascenseur',
    type: 'ORDINAIRE',
    amount: 300,
    beneficiary: 'Société Kénitra Ascenseurs',
    paymentMethod: 'VIREMENT',
    invoiceNumber: 'FAC-ASC-09/2026',
    notes: 'Visite mensuelle de contrôle technique et graissage des câbles',
    createdAt: '2026-09-12'
  },
  {
    id: 'exp-2026-09-15',
    date: '2026-09-15',
    budgetId: 'b7',
    budgetName: 'Jardinage / Espace vert',
    type: 'ORDINAIRE',
    amount: 200,
    beneficiary: 'M. Larbi (Jardinier)',
    paymentMethod: 'ESPECES',
    invoiceNumber: 'RECU-JARD-09/2026',
    notes: 'Taille des ficus, désherbage et nettoyage des abords',
    createdAt: '2026-09-15'
  },
  {
    id: 'exp-2026-09-18',
    date: '2026-09-18',
    budgetId: 'b9',
    budgetName: 'Frais bancaires, notifications & conseil juridique',
    type: 'ORDINAIRE',
    amount: 110,
    beneficiary: 'Attijariwafa Bank',
    paymentMethod: 'PRELEVEMENT',
    invoiceNumber: 'AVIS-OP-09-332',
    notes: 'Frais de tenue de compte et commissions virements',
    createdAt: '2026-09-18'
  },
  {
    id: 'exp-2026-09-20',
    date: '2026-09-20',
    budgetId: 'b9',
    budgetName: 'Frais bancaires, notifications & conseil juridique',
    type: 'ORDINAIRE',
    amount: 2500,
    beneficiary: 'Cabinet Me Bencheqroun (Avocat agréé)',
    paymentMethod: 'CHEQUE',
    invoiceNumber: 'FAC-AVOCAT-2026-09',
    notes: 'Procédures juridiques et injonctions de payer pour le recouvrement des impayés',
    createdAt: '2026-09-20'
  },

  // غشت 2026
  {
    id: 'exp-2026-08-01',
    date: '2026-08-01',
    budgetId: 'b1',
    budgetName: 'الحراسة (12 ساعة / 7 أيام)',
    type: 'ORDINAIRE',
    amount: 2500,
    beneficiary: 'السيد ميلود الزايدي',
    paymentMethod: 'ESPECES',
    invoiceNumber: 'وصل-حراسة-08/2026',
    notes: 'أجر شهر غشت 2026',
    createdAt: '2026-08-01'
  },
  {
    id: 'exp-2026-08-02',
    date: '2026-08-02',
    budgetId: 'b5',
    budgetName: 'أتعاب السنديك وشركة التدبير (COPRO SYNC)',
    type: 'ORDINAIRE',
    amount: 900,
    beneficiary: 'شركة COPRO SYNC H T',
    paymentMethod: 'VIREMENT',
    invoiceNumber: 'FAC-CS-2026-08-168',
    notes: 'أتعاب التسيير لشهر غشت',
    createdAt: '2026-08-02'
  },
  {
    id: 'exp-2026-08-19',
    date: '2026-08-19',
    budgetId: 'b8',
    budgetName: 'صندوق الاحتياط والطوارئ (غير المتوقع)',
    type: 'EXCEPTIONNEL_RESERVE',
    amount: 1100,
    beneficiary: 'ورشة المنصور للحدادة',
    paymentMethod: 'CHEQUE',
    invoiceNumber: 'فاتورة-حدادة-08-99',
    notes: 'تنفيذ قرار الجمع العام ب.6 : إصلاح الباب الرئيسي ومغلاق Geze',
    createdAt: '2026-08-19'
  },
  {
    id: 'exp-2026-08-22',
    date: '2026-08-22',
    budgetId: 'b8',
    budgetName: 'صندوق الاحتياط والطوارئ (غير المتوقع)',
    type: 'EXCEPTIONNEL_RESERVE',
    amount: 550,
    beneficiary: 'شاحنة الإخلاء والنقل',
    paymentMethod: 'ESPECES',
    invoiceNumber: 'وصل-نقل-08',
    notes: 'تنفيذ قرار الجمع العام ب.8 : إخلاء وإزالة المتلاشيات في الأجزاء المشتركة',
    createdAt: '2026-08-22'
  },
  {
    id: 'exp-2026-08-28',
    date: '2026-08-28',
    budgetId: 'b8',
    budgetName: 'صندوق الاحتياط والطوارئ (غير المتوقع)',
    type: 'EXCEPTIONNEL_RESERVE',
    amount: 1850,
    beneficiary: 'شركة الوقاية من الحرائق',
    paymentMethod: 'VIREMENT',
    invoiceNumber: 'فاتورة-مطفآت-2026-88',
    notes: 'تنفيذ قرار الجمع العام ب.5 : شراء وتثبيت 4 مطفآت حريق (2 بودرة + 2 CO2)',
    createdAt: '2026-08-28'
  }
];

export const initialPaymentRecords: PaymentRecord[] = [
  ...[1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 19].flatMap(aptId =>
    [1, 2, 3, 4, 5, 6, 7, 8, 9].map(m => ({
      id: `pay-2026-${m < 10 ? '0' + m : m}-apt${aptId}`,
      apartmentId: aptId,
      year: 2026,
      month: m,
      amount: 300,
      paidDate: `2026-${m < 10 ? '0' + m : m}-05`,
      paymentMethod: 'VIREMENT' as const,
      receiptNumber: `وصل-2026-${m < 10 ? '0' + m : m}-0${aptId}`,
      notes: `أداء المساهمة الشهرية`,
      collectedBy: 'شركة COPRO SYNC (حمزة التيعال)'
    }))
  )
];

export const initialExtraIncomes: ExtraIncome[] = [
  {
    id: 'inc-2026-08',
    date: '2026-08-15',
    source: 'سومة كراء شقة وكيل الاتحاد (شقة السنديك - شقة 21)',
    amount: 1600,
    paymentMethod: 'VIREMENT',
    receiptNumber: 'كراء-2026-08-21',
    notes: 'واجب كراء شهر غشت محول إلى حساب الإقامة البنكي'
  },
  {
    id: 'inc-2026-09',
    date: '2026-09-05',
    source: 'سومة كراء شقة وكيل الاتحاد (شقة السنديك - شقة 21)',
    amount: 1600,
    paymentMethod: 'VIREMENT',
    receiptNumber: 'كراء-2026-09-21',
    notes: 'واجب كراء شهر شتنبر محول إلى حساب الإقامة البنكي'
  }
];
