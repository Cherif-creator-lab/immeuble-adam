import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getMonthName } from '../utils/formatters';
import { generateMonthlyReportPDF } from '../utils/pdfGenerator';
import {
  Download,
  ShieldCheck,
  Building,
  Printer,
  Eye
} from 'lucide-react';

interface TransparencyModuleProps {
  onTogglePublicView: () => void;
}

export const TransparencyModule: React.FC<TransparencyModuleProps> = ({ onTogglePublicView }) => {
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

  const handleDownloadMonthlyPDF = () => {
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>الشفافية الكاملة والتواصل مع الملاك</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            فضاء التقارير الشهرية والشفافية PDF
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            توليد وتحميل <strong>التقرير الشهري الرسمي</strong> بصيغة PDF مع الرأسية المعتمدة والبيان المالي والتوقيعات.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleDownloadMonthlyPDF}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            تحميل التقرير PDF ({monthName})
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition"
          >
            <Printer className="w-4 h-4" />
            طباعة
          </button>
          <button
            onClick={onTogglePublicView}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            <Eye className="w-4 h-4" />
            عرض الملاك
          </button>
        </div>
      </div>

      {/* Live Preview of the Monthly Report */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-md space-y-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="p-3 bg-slate-900 text-white rounded-2xl">
              <Building className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {residenceInfo.name}
              </h2>
              <p className="text-xs text-slate-500">
                {residenceInfo.address} &bull; {residenceInfo.city} | السنة المالية {residenceInfo.fiscalYear}
              </p>
            </div>
          </div>

          <div className="text-right sm:text-left">
            <span className="inline-block bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
              التقرير الشهري &bull; {monthName} {selectedYear}
            </span>
            <div className="text-[11px] text-slate-400 mt-1">
              صادر عن : {residenceInfo.syndicPro}
            </div>
          </div>
        </div>

        {/* Executive Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">الرصيد بالبنك</span>
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1 block">
              {formatCurrency(currentBankBalance)}
            </span>
            <span className="text-[10px] text-emerald-600/80">رصيد مالي معتمد</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block">نسبة الاستخلاص</span>
            <span className="text-xl font-black text-blue-700 dark:text-blue-400 mt-1 block">
              {recoveryRateCurrentMonth}%
            </span>
            <span className="text-[10px] text-blue-600/80">من أصل 20 شقة</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block">الميزانية السنوية</span>
            <span className="text-xl font-black text-amber-700 dark:text-amber-400 mt-1 block">
              {formatCurrency(72000)}
            </span>
            <span className="text-[10px] text-amber-600/80">9 بنود للمصاريف</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-200/40 border border-purple-200 dark:border-purple-800">
            <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300 block">قرارات الجمع العام</span>
            <span className="text-xl font-black text-purple-700 dark:text-purple-400 mt-1 block">
              {agTasks.filter(t => t.status === 'TERMINE').length} / {agTasks.length}
            </span>
            <span className="text-[10px] text-purple-600/80">قرارات منجزة</span>
          </div>
        </div>

        {/* Section 1: Postes Budgétaires */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase flex items-center gap-2">
            <span>1. جدول تتبع المصاريف حسب البنود</span>
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">الرمز</th>
                  <th className="p-3">البند المالي</th>
                  <th className="p-3 text-left">المقرر شهرياً</th>
                  <th className="p-3 text-left">المصروف الفعلي ({monthName})</th>
                  <th className="p-3 text-left">الفارق</th>
                  <th className="p-3 text-center">المطابقة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {budgetItems.map(item => {
                  const spent = expenses
                    .filter(e => {
                      const d = new Date(e.date);
                      return e.budgetId === item.id && d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
                    })
                    .reduce((s, e) => s + Number(e.amount), 0);
                  const variance = item.monthlyBudget - spent;
                  const isExceeded = variance < 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-slate-500">{item.code}</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">{item.name}</td>
                      <td className="p-3 text-left font-medium text-slate-600 dark:text-slate-400">{formatCurrency(item.monthlyBudget)}</td>
                      <td className="p-3 text-left font-bold text-slate-900 dark:text-white">{formatCurrency(spent)}</td>
                      <td className="p-3 text-left font-bold">
                        <span className={isExceeded ? 'text-rose-600' : 'text-emerald-600'}>
                          {isExceeded ? `-${formatCurrency(Math.abs(variance))}` : `+${formatCurrency(variance)}`}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isExceeded
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {isExceeded ? 'تجاوز' : 'مطابق'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: AG Decisions Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase flex items-center gap-2">
            <span>2. تقدم قرارات الجمع العام المنعقد بتاريخ 12/08/2026</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {agTasks.map(t => (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-start text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{t.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">المقاول : {t.provider}</div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap mr-2 ${
                    t.status === 'TERMINE'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : t.status === 'EN_COURS'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {t.status === 'TERMINE' ? 'منجز' : t.status === 'EN_COURS' ? 'قيد الإنجاز' : 'لم يبدأ بعد'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Certification Signatures Footer */}
        <div className="pt-8 border-t-2 border-dashed border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-8 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center space-y-4">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">عن المجلس المشترك للملاك</span>
              <span className="text-slate-500 text-[11px]">نائب رئيس المجلس</span>
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">{residenceInfo.councilVP}</div>
            <div className="text-[10px] text-slate-400 italic">(تأشيرة ومصادقة)</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center space-y-4">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">عن شركة التدبير العقاري</span>
              <span className="text-slate-500 text-[11px]">{residenceInfo.syndicPro}</span>
            </div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">{residenceInfo.syndicManager}</div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold border border-blue-400/40 rounded-lg py-1 px-3 inline-block">
              مطابق للأصل ومصادق عليه
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
