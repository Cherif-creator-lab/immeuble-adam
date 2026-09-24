import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskPriority, TaskStatus } from '../types';
import { PlusCircle, X } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose }) => {
  const { addAGTask, residenceInfo } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [agReference, setAgReference] = useState(`الجمع العام ${residenceInfo.agDate} - قرار إضافي`);
  const [category, setCategory] = useState<'EQUIPEMENT' | 'SECURITE' | 'ELECTRICITE' | 'ENTRETIEN' | 'GESTION' | 'TRAVAUX'>('TRAVAUX');
  const [priority, setPriority] = useState<TaskPriority>('HAUTE');
  const [status, setStatus] = useState<TaskStatus>('NON_COMMENCE');
  const [deadline, setDeadline] = useState('2026-11-30');
  const [provider, setProvider] = useState('');
  const [providerPhone, setProviderPhone] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState<number | ''>('');
  const [finalInvoice, setFinalInvoice] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !provider.trim()) {
      alert('يرجى كتابة عنوان المشروع واسم المقاول.');
      return;
    }

    addAGTask({
      title: title.trim(),
      description: description.trim(),
      agReference: agReference.trim(),
      category,
      priority,
      status,
      deadline,
      provider: provider.trim(),
      providerPhone: providerPhone.trim() || undefined,
      estimatedBudget: Number(estimatedBudget) || 0,
      finalInvoice: Number(finalInvoice) || 0,
      attachments: [],
      notes: notes.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-2xl">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                خطة عمل الجمع العام
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                إضافة قرار أو مشروع إصلاح جديد
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
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              عنوان القرار أو العمل المطلوب *
            </label>
            <input
              type="text"
              required
              placeholder="مثال: صباغة مدخل العمارة..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                الصنف *
              </label>
              <select
                aria-label="الصنف"
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="SECURITE">الأمن والمراقبة</option>
                <option value="ELECTRICITE">الكهرباء والإنارة</option>
                <option value="TRAVAUX">أشغال البناء والحدادة</option>
                <option value="ENTRETIEN">النظافة والصيانة</option>
                <option value="GESTION">التدبير والكراء</option>
                <option value="EQUIPEMENT">التجهيزات</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                درجة الأولوية
              </label>
              <select
                aria-label="درجة الأولوية"
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
              >
                <option value="URGENT">مستعجل جداً</option>
                <option value="HAUTE">أولوية عالية</option>
                <option value="MOYENNE">متوسطة</option>
                <option value="BASSE">منخفضة</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                المقاول / الحرفي المختار *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: شركة البناء المغربية"
                value={provider}
                onChange={e => setProvider(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                هاتف المقاول
              </label>
              <input
                type="text"
                placeholder="مثال: 06..."
                value={providerPhone}
                onChange={e => setProviderPhone(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                التقدير المالي (بالدرهم)
              </label>
              <input
                type="number"
                placeholder="0"
                value={estimatedBudget}
                onChange={e => setEstimatedBudget(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                آخر أجل للإنجاز
              </label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              الوصف وتفاصيل دفتر التحملات
            </label>
            <textarea
              rows={2}
              placeholder="تفاصيل الأشغال والمواد المطلوبة..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
            ></textarea>
          </div>

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
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20"
            >
              إضافة القرار
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
