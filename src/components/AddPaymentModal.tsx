import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';
import { getMonthName } from '../utils/formatters';
import { generateReceiptPDF } from '../utils/pdfGenerator';
import { PlusCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultApartmentId?: number;
  defaultMonth?: number;
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  isOpen,
  onClose,
  defaultApartmentId,
  defaultMonth
}) => {
  const { apartments, addPayment, selectedMonth, selectedYear, residenceInfo } = useApp();

  const [apartmentId, setApartmentId] = useState<number>(defaultApartmentId || 1);
  const [month, setMonth] = useState<number>(defaultMonth || selectedMonth);
  const [year, setYear] = useState<number>(selectedYear);
  const [amount, setAmount] = useState<number>(300);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ESPECES');
  const [paidDate, setPaidDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [autoDownloadReceipt, setAutoDownloadReceipt] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedApt = apartments.find(a => a.id === apartmentId);
    if (!selectedApt) return;

    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const newPayment = addPayment({
      apartmentId,
      year,
      month,
      amount: Number(amount),
      paidDate,
      paymentMethod,
      receiptNumber: `وصل-${year}-${monthStr}-${apartmentId.toString().padStart(2, '0')}`,
      notes: notes.trim() || `أداء مساهمة شهر ${getMonthName(month)} ${year}`,
      collectedBy: `${residenceInfo.syndicPro} (${residenceInfo.syndicManager})`
    });

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (autoDownloadReceipt) {
      generateReceiptPDF(newPayment, selectedApt, residenceInfo);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-2xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                استخلاص المساهمات
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                تسجيل أداء واجب السنديك
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Sélection Appartement */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              رقم الشقة *
            </label>
            <select
              aria-label="رقم الشقة"
              value={apartmentId}
              onChange={e => setApartmentId(Number(e.target.value))}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
            >
              {apartments.map(apt => (
                <option key={apt.id} value={apt.id}>
                  {apt.number} {apt.isLitigation ? '(ملف قضائي)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Mois & Année */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                الشهر المعني *
              </label>
              <select
                aria-label="الشهر المعني"
                value={month}
                onChange={e => setMonth(Number(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                  <option key={m} value={m}>{getMonthName(m)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                السنة
              </label>
              <select
                aria-label="السنة"
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>
          </div>

          {/* Montant & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                المبلغ المؤدى (بالدرهم) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-extrabold text-sm text-emerald-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                تاريخ الاستلام *
              </label>
              <input
                type="date"
                required
                value={paidDate}
                onChange={e => setPaidDate(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
              />
            </div>
          </div>

          {/* Mode de règlement */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              طريقة الأداء *
            </label>
            <select
              aria-label="طريقة الأداء"
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
            >
              <option value="ESPECES">نقداً (مع تسليم وصل الأداء مباشرة)</option>
              <option value="VIREMENT">تحويل بنكي (التجاري وفا بنك)</option>
              <option value="CHEQUE">شيك لأمر السنديك</option>
              <option value="VERSEMENT">إيداع نقدي بالوكالة البنكية</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              ملاحظات
            </label>
            <input
              type="text"
              placeholder="مثال: أداء كامل عن طريق تحويل..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
            />
          </div>

          {/* Auto download checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoDownloadReceipt}
                onChange={e => setAutoDownloadReceipt(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>تحميل وصل الأداء الرسمي تلقائياً (PDF)</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
            >
              تأكيد الأداء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
