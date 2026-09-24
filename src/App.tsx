import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SyndicAuditPortal } from './components/SyndicAuditPortal';
import { Sun, Moon, Building2, ShieldCheck } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('adam168_theme') === 'dark';
  });

  const { residenceInfo } = useApp();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('adam168_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('adam168_theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200" dir="rtl">
      {/* Top Header */}
      <header className="bg-slate-900 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-slate-800 shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 text-slate-950 p-2 rounded-2xl font-black text-sm flex items-center justify-center shadow-sm">
            <Building2 className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base sm:text-lg">{residenceInfo.name}</span>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                القنيطرة &bull; 20 شقة
              </span>
            </div>
            <p className="text-[11px] text-slate-400">بوابة الملاك لتتبع ومراقبة السنديك &bull; {residenceInfo.syndicPro}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <ShieldCheck className="w-4 h-4" />
            <span>ممثل الملاك : {residenceInfo.councilVP}</span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
            title={darkMode ? 'الوضع المضيء' : 'الوضع الليلي'}
            aria-label="تبديل الوضع"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>
        </div>
      </header>

      {/* Main Content: Ultra Simple & Direct Co-Owner Portal */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <SyndicAuditPortal />
      </main>

      {/* Simple Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center py-4 text-xs text-slate-500">
        <p>
          تطبيق الشفافية وتتبع السنديك &bull; إقامة آدم 168 (القنيطرة) &bull; الجمع العام 12/08/2026 &bull; الميزانية السنوية 72,000 درهم
        </p>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
