import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExpenseType, PaymentMethod, Attachment } from '../types';
import { DollarSign, Upload, Paperclip, X } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
  const { budgetItems, addExpense, selectedMonth, selectedYear } = useApp();

  const [date, setDate] = useState<string>(
    `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`
  );
  const [budgetId, setBudgetId] = useState<string>(budgetItems[0]?.id || 'b1');
  const [type, setType] = useState<ExpenseType>('ORDINAIRE');
  const [amount, setAmount] = useState<number | ''>('');
  const [beneficiary, setBeneficiary] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ESPECES');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      setAttachment({
        id: 'att-' + Date.now(),
        name: file.name,
        size: file.size,
        type: file.type.includes('image') ? 'image' : 'pdf',
        dataUrl: event.target?.result as string,
        uploadedAt: new Date().toISOString().split('T')[0]
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !beneficiary.trim()) {
      alert('يرجى تحديد المبلغ واسم المستفيد.');
      return;
    }

    const selectedBudget = budgetItems.find(b => b.id === budgetId);

    addExpense({
      date,
      budgetId,
      budgetName: selectedBudget ? selectedBudget.name : 'مصاريف متنوعة',
      type,
      amount: Number(amount),
      beneficiary: beneficiary.trim(),
      paymentMethod,
      invoiceNumber: invoiceNumber.trim() || undefined,
      notes: notes.trim() || undefined,
      attachments: attachment ? [attachment] : []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-2xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                تسجيل مصروف جديد
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                إضافة نفقة / فاتورة مؤداة
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
          {/* Nature de la dépense */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
              طبيعة النفقة *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('ORDINAIRE')}
                className={`py-2 px-3 rounded-xl font-bold border transition ${
                  type === 'ORDINAIRE'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                الميزانية العادية
              </button>
              <button
                type="button"
                onClick={() => setType('EXCEPTIONNEL_RESERVE')}
                className={`py-2 px-3 rounded-xl font-bold border transition ${
                  type === 'EXCEPTIONNEL_RESERVE'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                أشغال استثنائية / الجمع العام
              </button>
            </div>
          </div>

          {/* Date & Montant */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                تاريخ الأداء *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                المبلغ (بالدرهم) *
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                placeholder="مثال: 800"
                value={amount}
                onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-extrabold text-sm text-rose-600"
              />
            </div>
          </div>

          {/* Poste Budgétaire */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              البند المالي المخصص *
            </label>
            <select
              aria-label="البند المالي المخصص"
              value={budgetId}
              onChange={e => setBudgetId(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
            >
              {budgetItems.map(b => (
                <option key={b.id} value={b.id}>
                  {b.code} - {b.name} (المقرر : {b.monthlyBudget} د.م/شهر)
                </option>
              ))}
            </select>
          </div>

          {/* Bénéficiaire & Mode de paiement */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                المستفيد / المورد *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: الحارس، الوكالة، شركة..."
                value={beneficiary}
                onChange={e => setBeneficiary(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                طريقة الأداء
              </label>
              <select
                aria-label="طريقة الأداء"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="ESPECES">نقداً (مع توقيع وصل استلام)</option>
                <option value="VIREMENT">تحويل بنكي</option>
                <option value="CHEQUE">شيك بنكي</option>
                <option value="PRELEVEMENT">اقتطاع بنكي أوتوماتيكي</option>
              </select>
            </div>
          </div>

          {/* N° Facture */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              رقم الفاتورة / الوصل
            </label>
            <input
              type="text"
              placeholder="مثال: وصل-2026-098"
              value={invoiceNumber}
              onChange={e => setInvoiceNumber(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono"
            />
          </div>

          {/* Justificatif Upload */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              صورة الفاتورة أو الوصل المبرر (PDF أو صورة)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer font-bold text-slate-700 dark:text-slate-300">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>اختيار ملف...</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {attachment && (
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5" />
                  {attachment.name}
                </span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              ملاحظات وتفاصيل إضافية
            </label>
            <textarea
              rows={2}
              placeholder="تفاصيل الخدمة المقدمة..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
            ></textarea>
          </div>

          {/* Action Buttons */}
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
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20"
            >
              تسجيل المصروف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
