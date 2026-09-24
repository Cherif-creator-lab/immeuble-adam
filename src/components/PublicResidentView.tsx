import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getMonthName } from '../utils/formatters';
import { generateMonthlyReportPDF } from '../utils/pdfGenerator';
import {
  Building2,
  ShieldCheck,
  Download,
  UserCheck
} from 'lucide-react';

interface PublicResidentViewProps {
  onExitPublicView: () => void;
}

export const PublicResidentView: React.FC<PublicResidentViewProps> = ({ onExitPublicView }) => {
  const {
    residenceInfo,
    selectedMonth,
    selectedYear,
    budgetItems,
    expenses,
    payments,
    apartments,
    agTasks,
    currentBankBalance,
    recoveryRateCurrentMonth
  } = useApp();

  const monthName = getMonthName(selectedMonth);

  const completedTasks = agTasks.filter(t => t.status === 'TERMINE');
  const inProgressTasks = agTasks.filter(t => t.status === 'EN_COURS');

  const handleDownloadReport = () => {
    generateMonthlyReportPDF(
      selectedMonth,
      selectedYear,
      residenceInfo,
      budgetItems,
      expenses,
      payments,
      apartments,
      agTasks
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Resident Mode Alert Bar */}
      <div className="bg-amber-500 text-white px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>فضاء الاطلاع للملاك المشتركين &bull; وضع القراءة والشفافية التامة</span>
        </div>
        <button
          onClick={onExitPublicView}
          className="bg-white text-slate-900 px-3 py-1 rounded-xl text-xs font-extrabold hover:bg-slate-100 transition"
        >
          العودة لوضع التتبع
        </button>
      </div>

      {/* Building Welcome Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>إقامة {residenceInfo.name} &bull; {residenceInfo.city}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            الشفافية والوضعية المالية &bull; {monthName} {selectedYear}
          </h1>

          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            مرحباً بكم في فضاء الشفافية الخاص بالملاك وسكان الإقامة. تجدون هنا تتبعاً دقيقاً لصرف المساهمات الشهرية (300 درهم/شهرياً)، ورصيد الحساب البنكي، ونسبة إنجاز أشغال وقرارات الجمع العام المؤرخ في 12/08/2026.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              السنديك المهني : {residenceInfo.syndicPro} ({residenceInfo.syndicManager})
            </span>
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-400" />
              ممثل الملاك المشتركين : {residenceInfo.councilVP}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Main KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500">الرصيد البنكي المتوفر</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(currentBankBalance)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">الحساب البنكي التجاري وفا بنك</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500">نسبة الاستخلاص ({monthName})</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {recoveryRateCurrentMonth}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">من مجموع 20 شقة</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500">مشاريع الجمع العام المنجزة</span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {completedTasks.length} / {agTasks.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">{inProgressTasks.length} مشاريع قيد الإنجاز</span>
        </div>
      </div>

      {/* Section 1: AG Resolutions Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>تقدم تنفيذ أشغال وقرارات الجمع العام</span>
            </h2>
            <p className="text-xs text-slate-500">
              القرارات المعتمدة في الجمع العام لـ 12/08/2026
            </p>
          </div>
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            <Download className="w-4 h-4" />
            تحميل التقرير الشهري (PDF)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agTasks.map(task => (
            <div
              key={task.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {task.agReference}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    task.status === 'TERMINE'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : task.status === 'EN_COURS'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {task.status === 'TERMINE' ? 'منجز ومطابق' : task.status === 'EN_COURS' ? 'قيد الإنجاز' : 'في الانتظار'}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">{task.title}</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{task.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[11px]">
                <span className="text-slate-400">المزود / المهني : <strong className="text-slate-700 dark:text-slate-300">{task.provider}</strong></span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  {task.finalInvoice > 0 ? formatCurrency(task.finalInvoice) : formatCurrency(task.estimatedBudget)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Budget Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            الميزانية التقديرية للمصاريف المشتركة (72,000 درهم/سنوياً)
          </h2>
          <p className="text-xs text-slate-500">
            توزيع البنود الـ 9 المعتمدة الممولة عبر واجبات السنديك 300 درهم/شهرياً
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {budgetItems.map(item => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-1 text-xs"
            >
              <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                <span className="truncate">{item.name}</span>
                <span className="text-emerald-600 font-extrabold flex-shrink-0">{formatCurrency(item.monthlyBudget)}/شهر</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
