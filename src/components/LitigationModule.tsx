import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { LitigationCase, LitigationStatus } from '../types';
import { formatCurrency, formatDateFr, getLitigationStatusBadge } from '../utils/formatters';
import {
  Gavel,
  Scale,
  FileWarning,
  Edit3
} from 'lucide-react';

export const LitigationModule: React.FC = () => {
  const { litigationCases, updateLitigationCase, apartments } = useApp();

  const [selectedCaseForEdit, setSelectedCaseForEdit] = useState<LitigationCase | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const totalLitigationDebt = litigationCases.reduce((s, c) => s + (Number(c.totalDebt) || 0), 0);
  const totalCourtFees = litigationCases.reduce((s, c) => s + (Number(c.courtFeesEngaged) || 0), 0);

  const filteredCases = litigationCases.filter(c => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    return true;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseForEdit) return;
    updateLitigationCase(selectedCaseForEdit.apartmentId, selectedCaseForEdit);
    setSelectedCaseForEdit(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-rose-950 via-slate-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-rose-900/30">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30">
            <Scale className="w-3.5 h-3.5" />
            <span>الشؤون القانونية والمنازعات القضائية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            تتبع الملفات القضائية والمنازعات ({litigationCases.length} ملفات)
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            متابعة دقيقة للملفات الرائجة بالمحكمة الابتدائية بالقنيطرة ومساطر الأوامر بالأداء والتنفيذ الجبري لحماية التوازن المالي للإقامة.
          </p>
        </div>

        <div className="bg-rose-900/40 p-4 rounded-2xl border border-rose-800/60 text-left">
          <span className="text-[11px] text-rose-300 block">مجموع المتأخرات في النزاع</span>
          <span className="text-2xl font-black text-rose-400">{formatCurrency(totalLitigationDebt)}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">الملفات قيد المتابعة</span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {litigationCases.length} ملاك
            </div>
            <span className="text-[11px] text-slate-400">من أصل 20 شقة (40%)</span>
          </div>
          <div className="p-3 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-2xl">
            <Gavel className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">مجموع المبالغ الأصلية المطالب بها</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrency(totalLitigationDebt)}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">مستحقات قيد الاسترجاع</span>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-950/60 text-blue-600 rounded-2xl">
            <FileWarning className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">مصاريف المحاماة والقضاء المؤداة</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {formatCurrency(totalCourtFees)}
            </div>
            <span className="text-[11px] text-slate-400">قابلة للاسترداد بعد الحكم</span>
          </div>
          <div className="p-3 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-2xl">
            <Scale className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter status */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">تصفية حسب المرحلة القانونية :</span>
          <select
            aria-label="تصفية حسب المرحلة القانونية"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 outline-none font-semibold"
          >
            <option value="ALL">جميع المراحل ({litigationCases.length})</option>
            <option value="MISE_EN_DEMEURE">إنذار مباشر</option>
            <option value="AVOCAT">ملف لدى المحامي</option>
            <option value="INJONCTION_PAYER">أمر بالأداء</option>
            <option value="JUGEMENT">حكم قضائي صادر</option>
            <option value="EXECUTION">تنفيذ جبري / حجز</option>
            <option value="ACCORD_AMIABLE">صلح ودي</option>
          </select>
        </div>
      </div>

      {/* Litigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.map(c => {
          const apt = apartments.find(a => a.id === c.apartmentId);
          const badge = getLitigationStatusBadge(c.status);

          return (
            <div
              key={c.apartmentId}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/40 p-6 shadow-sm space-y-4 hover:border-rose-400 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-black text-sm flex items-center justify-center flex-shrink-0">
                    {apt?.number.replace('شقة ', '')}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {apt?.number || `شقة ${c.apartmentId}`}
                    </h3>
                    <div className="text-[11px] text-slate-400">
                      الطابق {apt?.floor === 0 ? 'السفلي' : apt?.floor}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-rose-50/50 dark:bg-rose-950/20 p-3 rounded-2xl text-center border border-rose-100 dark:border-rose-900/30">
                <div>
                  <span className="text-[10px] text-slate-500 block">الدين الإجمالي</span>
                  <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400">
                    {formatCurrency(c.totalDebt)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">عدد الأشهر</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {c.unpaidMonthsCount} شهراً
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">مصاريف القضاء</span>
                  <span className="text-sm font-bold text-amber-600">
                    {formatCurrency(c.courtFeesEngaged)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">مرجع الملف :</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{c.caseReference}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">المحامي المكلف :</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{c.lawyer}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">آخر إجراء :</span>
                  <span>{formatDateFr(c.lastActionDate)}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mb-0.5">
                    الإجراء القادم :
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {c.nextStep}
                  </span>
                </div>
                {c.notes && (
                  <p className="text-[11px] text-slate-500 italic pt-1">
                    "{c.notes}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedCaseForEdit(c)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  تعديل الحالة والإجراء
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Litigation Modal */}
      {selectedCaseForEdit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase">تحديث ملف المنازعة</span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  شقة {selectedCaseForEdit.apartmentId}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCaseForEdit(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  المرحلة القضائية
                </label>
                <select
                  aria-label="المرحلة القضائية"
                  value={selectedCaseForEdit.status}
                  onChange={e =>
                    setSelectedCaseForEdit({
                      ...selectedCaseForEdit,
                      status: e.target.value as LitigationStatus
                    })
                  }
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  <option value="MISE_EN_DEMEURE">إنذار مباشر مع الإشعار بالتوصل</option>
                  <option value="AVOCAT">إحالة الملف على المحامي</option>
                  <option value="INJONCTION_PAYER">مقال أمر بالأداء لدى المحكمة</option>
                  <option value="JUGEMENT">صدور حكم قضائي نهائي</option>
                  <option value="EXECUTION">مرحلة التنفيذ الجبري / الحجز</option>
                  <option value="ACCORD_AMIABLE">صلح ودي مع التزام بالأداء</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    المبلغ الأصلي المطلوب (بالدرهم)
                  </label>
                  <input
                    type="number"
                    value={selectedCaseForEdit.totalDebt}
                    onChange={e =>
                      setSelectedCaseForEdit({
                        ...selectedCaseForEdit,
                        totalDebt: Number(e.target.value)
                      })
                    }
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-rose-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    مصاريف القضاء (بالدرهم)
                  </label>
                  <input
                    type="number"
                    value={selectedCaseForEdit.courtFeesEngaged}
                    onChange={e =>
                      setSelectedCaseForEdit({
                        ...selectedCaseForEdit,
                        courtFeesEngaged: Number(e.target.value)
                      })
                    }
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  الإجراء القضائي القادم
                </label>
                <input
                  type="text"
                  value={selectedCaseForEdit.nextStep}
                  onChange={e =>
                    setSelectedCaseForEdit({
                      ...selectedCaseForEdit,
                      nextStep: e.target.value
                    })
                  }
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  ملاحظات وتطورات الملف
                </label>
                <textarea
                  rows={3}
                  value={selectedCaseForEdit.notes}
                  onChange={e =>
                    setSelectedCaseForEdit({
                      ...selectedCaseForEdit,
                      notes: e.target.value
                    })
                  }
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCaseForEdit(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
