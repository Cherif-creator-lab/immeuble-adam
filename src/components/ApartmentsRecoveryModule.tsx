import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Apartment, PaymentRecord } from '../types';
import { formatCurrency, formatDateFr, getMonthName, getMonthShortName } from '../utils/formatters';
import { generateReceiptPDF } from '../utils/pdfGenerator';
import {
  Building,
  CheckCircle2,
  XCircle,
  Search,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApartmentsRecoveryModuleProps {
  onOpenAddPaymentWithApartment?: (apartmentId: number, month: number) => void;
}

export const ApartmentsRecoveryModule: React.FC<ApartmentsRecoveryModuleProps> = () => {
  const {
    apartments,
    payments,
    addPayment,
    deletePayment,
    selectedYear,
    selectedMonth,
    residenceInfo
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedApartmentDetails, setSelectedApartmentDetails] = useState<Apartment | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'list' | 'receipts'>('matrix');

  const filteredApartments = apartments.filter(apt => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return apt.number.toLowerCase().includes(q);
  });

  const handleTogglePaymentCell = (apt: Apartment, month: number) => {
    if (apt.monthlyDue === 0) {
      alert("شقة وكيل الاتحاد (شقة 21) مكراة لصالح صندوق الإقامة بمبلغ 1,600 درهم شهرياً.");
      return;
    }

    const existingPayment = payments.find(
      p => p.apartmentId === apt.id && p.year === selectedYear && p.month === month
    );

    if (existingPayment) {
      if (window.confirm(`هل تريد إلغاء أداء شهر ${getMonthName(month)} لـ ${apt.number} ؟`)) {
        deletePayment(existingPayment.id);
      }
    } else {
      const monthStr = month < 10 ? `0${month}` : `${month}`;
      addPayment({
        apartmentId: apt.id,
        year: selectedYear,
        month,
        amount: apt.monthlyDue,
        paidDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'ESPECES',
        receiptNumber: `وصل-${selectedYear}-${monthStr}-${apt.id.toString().padStart(2, '0')}`,
        notes: `مساهمة شهر ${getMonthName(month)} ${selectedYear}`,
        collectedBy: `${residenceInfo.syndicPro} (${residenceInfo.syndicManager})`
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleDownloadReceipt = (payment: PaymentRecord) => {
    const apt = apartments.find(a => a.id === payment.apartmentId);
    if (apt) {
      generateReceiptPDF(payment, apt, residenceInfo);
    }
  };

  const currentMonthReceipts = payments
    .filter(p => p.year === selectedYear)
    .sort((a, b) => new Date(b.paidDate).getTime() - new Date(a.paidDate).getTime());

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
            <Building className="w-3.5 h-3.5" />
            <span>جدول استخلاص مساهمات الـ 20 شقة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            جدول المساهمات السنوي والوصولات
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            المساهمة الشهرية : <strong>{residenceInfo.monthlyDuePerApt} درهم / شقة</strong> (المجموع المستهدف : {formatCurrency(6000)}/شهر). اضغط على أي شهر لتأكيد الأداء وتوليد الوصل.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3.5 py-2 rounded-xl font-bold border border-slate-200 dark:border-slate-700">
            السنة {selectedYear}
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'matrix'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            الجدول السنوي (12 شهراً)
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'list'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            بطاقات الشقق (20 شقة)
          </button>
          <button
            onClick={() => setActiveTab('receipts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'receipts'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            سجل الوصولات المسلمة ({payments.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder="البحث برقم الشقة (مثال: 05)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 pr-8 pl-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
          />
        </div>
      </div>

      {/* TAB 1: 12-MONTH MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 text-right">الشقة</th>
                  <th className="p-3 text-right">الطابق</th>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                    <th
                      key={m}
                      className={`p-2.5 text-center min-w-[45px] ${
                        m === selectedMonth ? 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-extrabold' : ''
                      }`}
                    >
                      {getMonthShortName(m)}
                    </th>
                  ))}
                  <th className="p-3 text-left">المجموع المؤدى</th>
                  <th className="p-3 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredApartments.map(apt => {
                  const aptPayments = payments.filter(
                    p => p.apartmentId === apt.id && p.year === selectedYear
                  );
                  const totalPaidThisYear = aptPayments.reduce((s, p) => s + Number(p.amount), 0);
                  const paidMonthsCount = aptPayments.length;
                  const isCommonApt = apt.monthlyDue === 0;

                  return (
                    <tr
                      key={apt.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition ${
                        apt.isLitigation ? 'bg-rose-50/30 dark:bg-rose-950/10' : ''
                      }`}
                    >
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{apt.number}</span>
                          {apt.isLitigation && (
                            <span className="text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-1.5 py-0.2 rounded font-bold">
                              نزاع
                            </span>
                          )}
                        </div>
                      </td>

                      <td
                        className="p-3 text-right font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap cursor-pointer hover:text-emerald-600"
                        onClick={() => setSelectedApartmentDetails(apt)}
                      >
                        <span className="text-[11px] text-slate-500">الطابق {apt.floor === 0 ? 'السفلي' : apt.floor}</span>
                      </td>

                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
                        const payment = payments.find(
                          p => p.apartmentId === apt.id && p.year === selectedYear && p.month === m
                        );
                        const isPaid = Boolean(payment);

                        if (isCommonApt) {
                          return (
                            <td key={m} className="p-2 text-center">
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                                مكراة
                              </span>
                            </td>
                          );
                        }

                        return (
                          <td
                            key={m}
                            className={`p-2 text-center ${
                              m === selectedMonth ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                            }`}
                          >
                            <button
                              onClick={() => handleTogglePaymentCell(apt, m)}
                              className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                                isPaid
                                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                                  : 'bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                              }`}
                              title={
                                isPaid
                                  ? `مؤداة (${payment?.receiptNumber}) - اضغط للإلغاء`
                                  : `غير مؤداة (${getMonthName(m)}) - اضغط لتأكيد الأداء`
                              }
                            >
                              {isPaid ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                        );
                      })}

                      <td className="p-3 text-left font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                        {isCommonApt ? 'سومة كرائية' : formatCurrency(totalPaidThisYear)}
                      </td>

                      <td className="p-3 text-center whitespace-nowrap">
                        {isCommonApt ? (
                          <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                            ملك مشترك
                          </span>
                        ) : apt.isLitigation ? (
                          <span className="text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded-full font-bold">
                            دعوى قضائية
                          </span>
                        ) : paidMonthsCount >= selectedMonth ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                            مستوفى
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                            متأخر
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
                <strong>أخضر</strong> = مساهمة 300 درهم مؤداة
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-400 inline-block"></span>
                <strong>أحمر</strong> = غير مؤداة / في الانتظار
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: APARTMENT PROFILES / FICHES */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredApartments.map(apt => {
            const aptPayments = payments.filter(
              p => p.apartmentId === apt.id && p.year === selectedYear
            );
            const isPaidCurrentMonth = aptPayments.some(p => p.month === selectedMonth);

            return (
              <div
                key={apt.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border p-5 shadow-sm space-y-4 transition hover:shadow-md ${
                  apt.isLitigation
                    ? 'border-rose-300 dark:border-rose-900/60'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-extrabold flex items-center justify-center text-sm">
                      {apt.number.replace('شقة ', '')}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {apt.number}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        الطابق {apt.floor === 0 ? 'السفلي' : apt.floor} {apt.surfaceM2 ? `&bull; ${apt.surfaceM2} م²` : ''}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      apt.monthlyDue === 0
                        ? 'bg-blue-100 text-blue-800'
                        : isPaidCurrentMonth
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {apt.monthlyDue === 0 ? 'شقة السنديك' : isPaidCurrentMonth ? 'مؤداة هذا الشهر' : 'غير مؤداة'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block">الواجب الشهري</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {apt.monthlyDue > 0 ? formatCurrency(apt.monthlyDue) : '0 د.م (معفى)'}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-slate-400 text-[10px] block">الأشهر المؤداة {selectedYear}</span>
                    <span className="font-bold text-emerald-600">
                      {aptPayments.length} / 12 شهراً
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <button
                    onClick={() => setSelectedApartmentDetails(apt)}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center"
                  >
                    عرض سجل الأداء &larr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: REGISTER OF ISSUED RECEIPTS */}
      {activeTab === 'receipts' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                سجل وصولات الأداء المسلمة ({currentMonthReceipts.length})
              </h2>
              <p className="text-xs text-slate-500">
                أرشيف الوصولات الصادرة عن شركة التدبير العقاري COPRO SYNC H T.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4">رقم الوصل</th>
                  <th className="p-4">تاريخ الأداء</th>
                  <th className="p-4">الشقة</th>
                  <th className="p-4">الشهر / السنة</th>
                  <th className="p-4">طريقة الأداء</th>
                  <th className="p-4 text-left">المبلغ</th>
                  <th className="p-4 text-center">تحميل PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {currentMonthReceipts.map(rec => {
                  const apt = apartments.find(a => a.id === rec.apartmentId);
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {rec.receiptNumber}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {formatDateFr(rec.paidDate)}
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {apt?.number}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">
                        {getMonthName(rec.month)} {rec.year}
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-semibold text-slate-700 dark:text-slate-300">
                          {rec.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 text-left font-extrabold text-slate-900 dark:text-white text-sm">
                        {formatCurrency(rec.amount)}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDownloadReceipt(rec)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-950 px-3 py-1.5 rounded-xl transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Apartment Details Modal */}
      {selectedApartmentDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase">
                  بطاقة الشقة
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {selectedApartmentDetails.number}
                </h2>
              </div>
              <button
                onClick={() => setSelectedApartmentDetails(null)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl">
              <div>
                <span className="text-slate-400 block text-[10px]">الطابق :</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedApartmentDetails.floor === 0 ? 'الطابق السفلي (RDC)' : `الطابق ${selectedApartmentDetails.floor}`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">المساحة التقديرية :</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedApartmentDetails.surfaceM2 ? `${selectedApartmentDetails.surfaceM2} م²` : '-'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">الواجب الشهري :</span>
                <span className="font-bold text-emerald-600">
                  {selectedApartmentDetails.monthlyDue > 0 ? `${selectedApartmentDetails.monthlyDue} درهم/شهر` : 'معفى (شقة السنديك)'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">حالة النزاع :</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedApartmentDetails.isLitigation ? 'ملف قضائي رائج' : 'عادي'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
                سجل أداءات سنة {selectedYear}
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pl-1">
                {payments
                  .filter(p => p.apartmentId === selectedApartmentDetails.id && p.year === selectedYear)
                  .map(p => (
                    <div
                      key={p.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {getMonthName(p.month)} {p.year}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {p.receiptNumber} &bull; {p.paymentMethod} &bull; {p.paidDate}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-emerald-600">{formatCurrency(p.amount)}</span>
                        <button
                          onClick={() => handleDownloadReceipt(p)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                          title="تحميل الوصل"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedApartmentDetails(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
