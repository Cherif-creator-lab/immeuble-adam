import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getMonthName } from '../utils/formatters';
import { generateReceiptPDF, generateMonthlyReportPDF } from '../utils/pdfGenerator';
import {
  Wallet,
  Users,
  CheckCircle,
  XCircle,
  Plus,
  Download,
  Hammer,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SimpleViewProps {
  onOpenAddExpense: () => void;
  onOpenAddPayment: () => void;
  onOpenAddTask: () => void;
  onSwitchToAdvanced: () => void;
}

export const SimpleView: React.FC<SimpleViewProps> = ({
  onOpenAddExpense,
  onOpenAddPayment,
  onOpenAddTask,
  onSwitchToAdvanced
}) => {
  const {
    residenceInfo,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    currentBankBalance,
    apartments,
    payments,
    expenses,
    agTasks,
    litigationCases,
    budgetItems,
    addPayment,
    deletePayment,
    deleteExpense
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'cotisations' | 'depenses' | 'travaux' | 'impayes'>('cotisations');
  const [searchTerm, setSearchTerm] = useState('');
  const monthName = getMonthName(selectedMonth);

  // Filter apartments for current month payments
  const taxableApts = apartments.filter(a => a.monthlyDue > 0);
  const paidApartments = taxableApts.filter(a =>
    payments.some(p => p.apartmentId === a.id && p.year === selectedYear && p.month === selectedMonth)
  );
  const unpaidApartments = taxableApts.filter(a =>
    !payments.some(p => p.apartmentId === a.id && p.year === selectedYear && p.month === selectedMonth)
  );

  // Month expenses
  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
  });
  const totalMonthExpenses = currentMonthExpenses.reduce((s, e) => s + Number(e.amount), 0);

  const handleTogglePayment = (apt: typeof apartments[0]) => {
    if (apt.monthlyDue === 0) {
      alert("شقة وكيل الاتحاد (شقة 21) مكراة لصالح صندوق الإقامة بمبلغ 1,600 درهم شهرياً.");
      return;
    }

    const existing = payments.find(
      p => p.apartmentId === apt.id && p.year === selectedYear && p.month === selectedMonth
    );

    if (existing) {
      if (window.confirm(`هل تريد إلغاء أداء شهر ${monthName} لـ ${apt.number} ؟`)) {
        deletePayment(existing.id);
      }
    } else {
      const monthStr = selectedMonth < 10 ? `0${selectedMonth}` : `${selectedMonth}`;
      const newPay = addPayment({
        apartmentId: apt.id,
        year: selectedYear,
        month: selectedMonth,
        amount: apt.monthlyDue,
        paidDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'ESPECES',
        receiptNumber: `وصل-${selectedYear}-${monthStr}-${apt.id.toString().padStart(2, '0')}`,
        notes: `مساهمة شهر ${monthName} ${selectedYear}`,
        collectedBy: `${residenceInfo.syndicPro}`
      });

      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      generateReceiptPDF(newPay, apt, residenceInfo);
    }
  };

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

  const filteredApts = apartments.filter(a => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return a.number.toLowerCase().includes(q) || a.ownerName.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header Card - Ultra Simple */}
      <div className="bg-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-800/80 rounded-full text-xs font-bold text-emerald-200">
              🏢 {residenceInfo.name} &bull; 20 شقة
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              التسيير المبسط للإقامة
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">
              السنديك : <strong>{residenceInfo.syndicPro}</strong> | نائب رئيس المجلس : <strong>{residenceInfo.councilVP}</strong>
            </p>
          </div>

          {/* Month Selector */}
          <div className="bg-emerald-800/80 p-2 rounded-2xl flex items-center gap-2 border border-emerald-600 self-start sm:self-auto">
            <span className="text-xs font-bold pr-2 text-emerald-200">الشهر :</span>
            <select
              aria-label="اختيار الشهر للتتبع"
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              className="bg-white text-slate-900 font-extrabold text-xs py-1.5 px-3 rounded-xl outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                <option key={m} value={m}>{getMonthName(m)} {selectedYear}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3 Main Big Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Card 1: Bank Balance */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <span className="text-xs text-emerald-200 font-bold block">💰 الرصيد المالي المتاح بالبنك</span>
            <span className="text-2xl font-black text-white mt-1 block">
              {formatCurrency(currentBankBalance)}
            </span>
            <span className="text-[11px] text-emerald-200/80">التجاري وفا بنك</span>
          </div>

          {/* Card 2: Paid status */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <span className="text-xs text-emerald-200 font-bold block">👥 استخلاص شهر {monthName}</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">
                {paidApartments.length} / {taxableApts.length}
              </span>
              <span className="text-xs font-bold text-emerald-300">
                ({Math.round((paidApartments.length / taxableApts.length) * 100)}%)
              </span>
            </div>
            <span className="text-[11px] text-emerald-200/80">
              {unpaidApartments.length === 0 ? 'الجميع أدى مساهمته !' : `${unpaidApartments.length} شقق في الانتظار`}
            </span>
          </div>

          {/* Card 3: Spent */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <span className="text-xs text-emerald-200 font-bold block">📉 المصاريف المؤداة في {monthName}</span>
            <span className="text-2xl font-black text-white mt-1 block">
              {formatCurrency(totalMonthExpenses)}
            </span>
            <span className="text-[11px] text-emerald-200/80">
              الحراسة، النظافة، الكهرباء، المصعد...
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="pt-2 flex flex-wrap gap-2.5">
          <button
            onClick={onOpenAddPayment}
            className="flex items-center gap-1.5 bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-black px-4 py-2.5 rounded-xl shadow transition"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            تسجيل مساهمة شقة (300 درهم)
          </button>
          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-1.5 bg-emerald-800/90 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-emerald-600 transition"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            تسجيل نفقة / فاتورة
          </button>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 bg-emerald-800/90 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-emerald-600 transition mr-auto"
          >
            <Download className="w-4 h-4 text-emerald-300" />
            تحميل التقرير الشهري PDF ({monthName})
          </button>
        </div>
      </div>

      {/* Big Simple Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('cotisations')}
          className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
            activeSubTab === 'cotisations'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. من أدى المساهمة ؟ ({paidApartments.length}/19)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('depenses')}
          className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
            activeSubTab === 'depenses'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>2. مصاريف الشهر</span>
        </button>

        <button
          onClick={() => setActiveSubTab('travaux')}
          className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
            activeSubTab === 'travaux'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Hammer className="w-4 h-4" />
          <span>3. أشغال وقرارات الجمع العام ({agTasks.filter(t => t.status === 'TERMINE').length}/9)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('impayes')}
          className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
            activeSubTab === 'impayes'
              ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>4. المتأخرات والملفات القضائية ({litigationCases.length})</span>
        </button>
      </div>

      {/* SECTION 1: QUI A PAYE (LES 20 APPARTEMENTS) */}
      {activeSubTab === 'cotisations' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                وضعية المساهمات الشهرية &bull; شهر {monthName} {selectedYear}
              </h2>
              <p className="text-xs text-slate-500">
                المساهمة : <strong>300 درهم / شهر</strong>. اضغط على الزر لتغيير حالة الشقة أو تحميل وصل الأداء.
              </p>
            </div>

            {/* Quick search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                placeholder="البحث بالاسم أو رقم الشقة..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 pr-8 pl-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
              />
            </div>
          </div>

          {/* Simple List of the 20 Apartments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredApts.map(apt => {
              const isPaid = payments.some(
                p => p.apartmentId === apt.id && p.year === selectedYear && p.month === selectedMonth
              );
              const paymentRecord = payments.find(
                p => p.apartmentId === apt.id && p.year === selectedYear && p.month === selectedMonth
              );
              const isCommonApt = apt.monthlyDue === 0;

              return (
                <div
                  key={apt.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                    isCommonApt
                      ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'
                      : isPaid
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                      : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl font-black text-xs flex items-center justify-center flex-shrink-0 ${
                        isCommonApt
                          ? 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : isPaid
                          ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                          : 'bg-rose-200 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                      }`}
                    >
                      {apt.number.replace('شقة ', '')}
                    </div>

                    <div>
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{apt.number}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        الطابق {apt.floor === 0 ? 'السفلي' : apt.floor}
                      </div>
                    </div>
                  </div>

                  {/* Button Action */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isCommonApt ? (
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950 px-2.5 py-1 rounded-xl">
                        شقة السنديك (مكراة)
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleTogglePayment(apt)}
                          className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl transition ${
                            isPaid
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                          }`}
                        >
                          {isPaid ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>مؤداة (300 د.م)</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>غير مؤداة</span>
                            </>
                          )}
                        </button>

                        {isPaid && paymentRecord && (
                          <button
                            onClick={() => generateReceiptPDF(paymentRecord, apt, residenceInfo)}
                            className="p-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                            title="تحميل وصل الأداء PDF"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: DEPENSES DU MOIS */}
      {activeSubTab === 'depenses' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                المصاريف المؤداة لشهر {monthName} {selectedYear}
              </h2>
              <p className="text-xs text-slate-500">
                مجموع المصاريف المصروفة : <strong className="text-rose-600">{formatCurrency(totalMonthExpenses)}</strong>
              </p>
            </div>
            <button
              onClick={onOpenAddExpense}
              className="flex items-center gap-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl transition"
            >
              <Plus className="w-3.5 h-3.5" />
              تسجيل نفقة جديدة
            </button>
          </div>

          <div className="space-y-2.5">
            {currentMonthExpenses.map(exp => (
              <div
                key={exp.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-extrabold text-slate-900 dark:text-white">
                    {exp.budgetName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    المستفيد : <strong>{exp.beneficiary}</strong> &bull; التاريخ : {exp.date} &bull; طريقة الأداء : {exp.paymentMethod}
                  </div>
                  {exp.notes && (
                    <div className="text-[10px] text-slate-400 italic">
                      "{exp.notes}"
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
                    -{formatCurrency(exp.amount)}
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm('هل تريد حذف هذه النفقة ؟')) {
                        deleteExpense(exp.id);
                      }
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="حذف"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: TRAVAUX DE L'IMMEUBLE */}
      {activeSubTab === 'travaux' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              قرارات وأشغال الجمع العام المنعقد بتاريخ 12/08/2026
            </h2>
            <p className="text-xs text-slate-500">
              متابعة الإنجاز والتكاليف المالية للمشاريع المقررة.
            </p>
          </div>

          <div className="space-y-3">
            {agTasks.map(task => (
              <div
                key={task.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{task.agReference}</span>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">{task.title}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                      task.status === 'TERMINE'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : task.status === 'EN_COURS'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {task.status === 'TERMINE' ? '✅ منجز ومستلم' : task.status === 'EN_COURS' ? '⏳ قيد الإنجاز' : '⏱️ لم يبدأ بعد'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {task.description}
                </p>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    المقاول : <strong>{task.provider}</strong>
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {task.finalInvoice > 0 ? `المبلغ النهائي : ${formatCurrency(task.finalInvoice)}` : `التقدير المالي : ${formatCurrency(task.estimatedBudget)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: LES RETARDS & DOSSIERS EN JUSTICE */}
      {activeSubTab === 'impayes' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/40 p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-rose-100 dark:border-rose-900/40">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-rose-600">⚖️ تتبع الـ 8 ملفات في النزاع القضائي والمتأخرات</span>
            </h2>
            <p className="text-xs text-slate-500">
              مجموع الديون المطالب بها : <strong className="text-rose-600">{formatCurrency(litigationCases.reduce((s, c) => s + c.totalDebt, 0))}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {litigationCases.map(c => {
              const apt = apartments.find(a => a.id === c.apartmentId);
              return (
                <div
                  key={c.apartmentId}
                  className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-extrabold text-slate-900 dark:text-white">
                      {apt?.number || `شقة ${c.apartmentId}`}
                    </div>
                    <span className="text-[10px] font-bold bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 px-2 py-0.5 rounded-full">
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">{c.unpaidMonthsCount} شهراً متأخراً</span>
                    <span className="font-black text-rose-600 text-sm">{formatCurrency(c.totalDebt)}</span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 p-2 rounded-xl border border-rose-100 dark:border-rose-900/30">
                    <strong>المحامي :</strong> {c.lawyer} <br />
                    <strong>الإجراء القادم :</strong> {c.nextStep}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Switch to Advanced View Footer Link */}
      <div className="text-center pt-4">
        <button
          onClick={onSwitchToAdvanced}
          className="text-xs font-bold text-slate-500 hover:text-emerald-700 underline"
        >
          الانتقال إلى لوحة القيادة والمؤشرات المتقدمة &larr;
        </button>
      </div>
    </div>
  );
};
