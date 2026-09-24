export const formatCurrency = (amount: number | string | undefined | null): string => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('ar-MA', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num) + ' درهم';
};

export const formatDateFr = (dateString: string | undefined | null): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('ar-MA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};

export const getMonthName = (monthNumber: number): string => {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو',
    'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر'
  ];
  return months[monthNumber - 1] || `شهر ${monthNumber}`;
};

export const getMonthShortName = (monthNumber: number): string => {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو',
    'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر'
  ];
  return months[monthNumber - 1] || `ش${monthNumber}`;
};

export const getLitigationStatusBadge = (status: string) => {
  switch (status) {
    case 'MISE_EN_DEMEURE':
      return { label: 'إنذار مباشر', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300' };
    case 'AVOCAT':
      return { label: 'ملف لدى المحامي', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-300' };
    case 'INJONCTION_PAYER':
      return { label: 'أمر بالأداء', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300' };
    case 'JUGEMENT':
      return { label: 'حكم قضائي صادر', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300' };
    case 'EXECUTION':
      return { label: 'تنفيذ جبري / حجز', color: 'bg-red-100 text-red-900 dark:bg-red-900/50 dark:text-red-200 border-red-400 font-bold' };
    case 'ACCORD_AMIABLE':
      return { label: 'صلح ودي / جدول أداء', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300' };
    default:
      return { label: status, color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' };
  }
};

export const getTaskStatusBadge = (status: string) => {
  switch (status) {
    case 'NON_COMMENCE':
      return { label: 'لم يبدأ بعد', bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300' };
    case 'EN_COURS':
      return { label: 'قيد الإنجاز', bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300' };
    case 'TERMINE':
      return { label: 'منجز ومكتمل', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300' };
    default:
      return { label: status, bg: 'bg-slate-100 text-slate-700' };
  }
};
