import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getMonthName } from '../utils/formatters';
import {
  Building2,
  Wallet,
  Calendar,
  Sun,
  Moon,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Eye,
  UserCheck,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isPublicView: boolean;
  setIsPublicView: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isPublicView,
  setIsPublicView,
  darkMode,
  setDarkMode
}) => {
  const {
    residenceInfo,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    currentBankBalance,
    exportDataJson,
    importDataJson
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const success = importDataJson(content);
      if (success) {
        alert('تمت استعادة النسخة الاحتياطية بنجاح!');
      } else {
        alert('خطأ : ملف النسخ الاحتياطي غير صالح.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const navItems = [
    { id: 'dashboard', label: 'لوحة القيادة والمؤشرات', icon: '📊' },
    { id: 'ag-tasks', label: 'قرارات الجمع العام والأشغال', icon: '🛠️' },
    { id: 'expenses', label: 'المصاريف والميزانية', icon: '💰' },
    { id: 'apartments', label: 'المساهمات والـ 20 شقة', icon: '🏢' },
    { id: 'litigation', label: 'المنازعات والملفات القضائية (8)', icon: '⚖️' },
    { id: 'reports', label: 'التقارير الشهرية والشفافية PDF', icon: '📑' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Top Banner with info */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3 space-x-reverse text-slate-300">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Building2 className="w-3.5 h-3.5" /> {residenceInfo.name} ({residenceInfo.city})
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> السنديك : {residenceInfo.syndicPro} ({residenceInfo.syndicManager})
          </span>
          <span className="hidden lg:inline text-slate-500">|</span>
          <span className="hidden lg:flex items-center gap-1 text-slate-300">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" /> نائب رئيس المجلس : {residenceInfo.councilVP}
          </span>
        </div>

        <div className="flex items-center space-x-3 space-x-reverse mr-auto text-[11px]">
          <span className="bg-slate-800 text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            السنة المالية {residenceInfo.fiscalYear}
          </span>
          <span className="text-slate-400 hidden sm:inline">جمع عام {residenceInfo.agDate}</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-md flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                  {residenceInfo.name}
                </span>
                <span className="text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  20 شقة
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                تسيير السنديك والشفافية المالية للملاك المشتركين
              </p>
            </div>
          </div>

          {/* Center: Month/Year selector & Realtime Balance badge */}
          <div className="hidden md:flex items-center space-x-3 space-x-reverse">
            {/* Period Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <Calendar className="w-4 h-4 text-slate-500 ml-2 mr-1" />
              <select
                aria-label="اختيار الشهر"
                value={selectedMonth}
                onChange={e => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 border-none outline-none cursor-pointer py-1 px-1.5 focus:ring-0"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                  <option key={m} value={m} className="dark:bg-slate-800">
                    {getMonthName(m)}
                  </option>
                ))}
              </select>
              <select
                aria-label="اختيار السنة"
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 border-none outline-none cursor-pointer py-1 px-1.5 focus:ring-0"
              >
                <option value={2026} className="dark:bg-slate-800">2026</option>
                <option value={2027} className="dark:bg-slate-800">2027</option>
              </select>
            </div>

            {/* Real-time Bank Balance Pill */}
            <div className="flex items-center gap-2 bg-gradient-to-l from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 px-3.5 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
              <div className="p-1.5 bg-emerald-500 text-white rounded-lg shadow-sm">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-medium">الرصيد بالبنك</div>
                <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(currentBankBalance)}
                </div>
              </div>
            </div>
          </div>

          {/* Right Tools & Mode Toggles */}
          <div className="flex items-center space-x-2 space-x-reverse">
            {/* Public View / Resident Toggle */}
            <button
              onClick={() => setIsPublicView(!isPublicView)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm ${
                isPublicView
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
              title="عرض صفحة الملاك المشتركين"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isPublicView ? 'وضع السنديك' : 'عرض الملاك'}</span>
            </button>

            {/* Dark mode button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="تغيير المظهر (ليلي / نهاري)"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Backup actions */}
            <div className="hidden lg:flex items-center space-x-1 space-x-reverse pr-1 border-r border-slate-200 dark:border-slate-800">
              <button
                onClick={exportDataJson}
                className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="تصدير نسخة احتياطية JSON"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="استيراد نسخة احتياطية JSON"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
            </div>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <nav className="hidden md:flex space-x-1 space-x-reverse py-2 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800/80">
          {navItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center space-x-2 space-x-reverse px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                currentTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
