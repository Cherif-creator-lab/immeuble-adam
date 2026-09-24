import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AGTask, TaskStatus, Attachment } from '../types';
import { formatCurrency, formatDateFr } from '../utils/formatters';
import {
  Calendar,
  Plus,
  Paperclip,
  Phone,
  Building,
  Upload,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

interface AGTasksModuleProps {
  onOpenAddTask: () => void;
}

export const AGTasksModule: React.FC<AGTasksModuleProps> = ({ onOpenAddTask }) => {
  const { agTasks, updateTaskStatus, updateAGTask, residenceInfo } = useApp();

  const [activeView, setActiveView] = useState<'kanban' | 'table'>('kanban');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<AGTask | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  // File upload state for selected task
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filteredTasks = agTasks.filter(task => {
    if (filterCategory !== 'ALL' && task.category !== filterCategory) return false;
    return true;
  });

  const todoTasks = filteredTasks.filter(t => t.status === 'NON_COMMENCE');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'EN_COURS');
  const doneTasks = filteredTasks.filter(t => t.status === 'TERMINE');

  const totalDevisEngage = agTasks.reduce((s, t) => s + (Number(t.estimatedBudget) || 0), 0);
  const totalFacturesPayees = agTasks.reduce((s, t) => s + (Number(t.finalInvoice) || 0), 0);
  const completionPercentage = agTasks.length > 0 ? Math.round((doneTasks.length / agTasks.length) * 100) : 0;

  const handleFileUploadForTask = (e: React.ChangeEvent<HTMLInputElement>, taskId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const dataUrl = event.target?.result as string;
      const newAtt: Attachment = {
        id: 'att-' + Date.now(),
        name: file.name,
        size: file.size,
        type: file.type.includes('image') ? 'image' : 'pdf',
        dataUrl,
        uploadedAt: new Date().toISOString().split('T')[0]
      };

      const task = agTasks.find(t => t.id === taskId);
      if (task) {
        const updatedAttachments = [...(task.attachments || []), newAtt];
        updateAGTask(taskId, { attachments: updatedAttachments });
        if (selectedTaskForDetails?.id === taskId) {
          setSelectedTaskForDetails({ ...selectedTaskForDetails, attachments: updatedAttachments });
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800">
            <Building className="w-3.5 h-3.5" />
            <span>خارطة الطريق &bull; قرارات الجمع العام لـ {residenceInfo.agDate}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            متابعة أشغال وقرارات الجمع العام
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            مراقبة وتتبع تنفيذ القرارات المعتمدة، مقارنة التقديرات بالفواتير المدفوعة وأرشفة صور ووثائق الإنجاز.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAddTask}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            إضافة إجراء / مشروع
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">نسبة الإنجاز الإجمالية</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {doneTasks.length} / {agTasks.length} مشاريع ({completionPercentage}%)
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 font-extrabold text-sm">
            {completionPercentage}%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">إجمالي التقديرات المعتمدة</span>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(totalDevisEngage)}
            </div>
          </div>
          <span className="text-xs text-slate-400">التقديرات الأولية</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">إجمالي الفواتير المؤداة</span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalFacturesPayees)}
            </div>
          </div>
          <span className="text-xs text-emerald-600 font-semibold">
            {totalDevisEngage - totalFacturesPayees > 0 && totalFacturesPayees > 0
              ? `وفر مالي: ${formatCurrency(totalDevisEngage - totalFacturesPayees)}`
              : 'مطابق للتقديرات'}
          </span>
        </div>
      </div>

      {/* Controls & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2 space-x-reverse">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">التصنيف :</span>
          <select
            aria-label="تصفية حسب الصنف"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 outline-none"
          >
            <option value="ALL">جميع الأصناف</option>
            <option value="SECURITE">الأمن والرقائق والكاميرات</option>
            <option value="ELECTRICITE">الكهرباء والإنارة</option>
            <option value="TRAVAUX">الأشغال والتهيئة</option>
            <option value="ENTRETIEN">النظافة والصيانة</option>
            <option value="GESTION">التسيير والكراء</option>
          </select>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeView === 'kanban'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            لوحة كانبان
          </button>
          <button
            onClick={() => setActiveView('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeView === 'table'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            جدول تفصيلي
          </button>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {activeView === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Non Commencé */}
          <div className="space-y-3 bg-slate-100/70 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                <h2 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  في الانتظار ({todoTasks.length})
                </h2>
              </div>
            </div>

            <div className="space-y-3 min-h-[300px]">
              {todoTasks.map(task => (
                <TaskKanbanCard
                  key={task.id}
                  task={task}
                  onSelect={() => setSelectedTaskForDetails(task)}
                  onStatusChange={(newStatus) => updateTaskStatus(task.id, newStatus)}
                />
              ))}
              {todoTasks.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  لا توجد مهام في الانتظار
                </div>
              )}
            </div>
          </div>

          {/* Column 2: En cours */}
          <div className="space-y-3 bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-3xl border border-blue-100 dark:border-blue-900/40">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200 dark:border-blue-900/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                <h2 className="font-bold text-xs uppercase tracking-wider text-blue-800 dark:text-blue-300">
                  قيد الإنجاز ({inProgressTasks.length})
                </h2>
              </div>
            </div>

            <div className="space-y-3 min-h-[300px]">
              {inProgressTasks.map(task => (
                <TaskKanbanCard
                  key={task.id}
                  task={task}
                  onSelect={() => setSelectedTaskForDetails(task)}
                  onStatusChange={(newStatus) => updateTaskStatus(task.id, newStatus)}
                />
              ))}
              {inProgressTasks.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  لا توجد مهام قيد الإنجاز
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Terminé */}
          <div className="space-y-3 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-3xl border border-emerald-100 dark:border-emerald-900/40">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-900/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <h2 className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  منجز ومطابق ({doneTasks.length})
                </h2>
              </div>
            </div>

            <div className="space-y-3 min-h-[300px]">
              {doneTasks.map(task => (
                <TaskKanbanCard
                  key={task.id}
                  task={task}
                  onSelect={() => setSelectedTaskForDetails(task)}
                  onStatusChange={(newStatus) => updateTaskStatus(task.id, newStatus)}
                />
              ))}
              {doneTasks.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs italic">
                  لا توجد مهام منجزة بعد
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TABLE VIEW */}
      {activeView === 'table' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4">الإجراء / قرار الجمع العام</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">المزود والمهني</th>
                  <th className="p-4 text-left">التقدير المعتمد</th>
                  <th className="p-4 text-left">الفاتورة النهائية</th>
                  <th className="p-4">أجل التنفيذ</th>
                  <th className="p-4 text-center">المرفقات</th>
                  <th className="p-4 text-center">معاينة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white max-w-xs">
                      <div className="text-slate-900 dark:text-white font-bold">{task.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{task.agReference}</div>
                    </td>
                    <td className="p-4">
                      <select
                        aria-label="تغيير حالة المهمة"
                        value={task.status}
                        onChange={e => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                        className={`text-[11px] font-bold py-1 px-2.5 rounded-full border cursor-pointer outline-none ${
                          task.status === 'TERMINE'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : task.status === 'EN_COURS'
                            ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        <option value="NON_COMMENCE">في الانتظار</option>
                        <option value="EN_COURS">قيد الإنجاز</option>
                        <option value="TERMINE">منجز</option>
                      </select>
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">
                      <div>{task.provider}</div>
                      {task.providerPhone && <div className="text-[10px] text-slate-400">{task.providerPhone}</div>}
                    </td>
                    <td className="p-4 text-left font-semibold text-slate-800 dark:text-slate-200">
                      {formatCurrency(task.estimatedBudget)}
                    </td>
                    <td className="p-4 text-left font-bold text-emerald-600 dark:text-emerald-400">
                      {task.finalInvoice > 0 ? formatCurrency(task.finalInvoice) : '-'}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {formatDateFr(task.deadline)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedTaskForDetails(task)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg"
                      >
                        <Paperclip className="w-3 h-3" />
                        <span>{task.attachments?.length || 0}</span>
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedTaskForDetails(task)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Details & Attachments Modal */}
      {selectedTaskForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-row-reverse">
              <button
                onClick={() => setSelectedTaskForDetails(null)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {selectedTaskForDetails.agReference}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {selectedTaskForDetails.title}
                </h2>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedTaskForDetails.description}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] block">الحالة</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedTaskForDetails.status === 'TERMINE'
                    ? 'منجز'
                    : selectedTaskForDetails.status === 'EN_COURS'
                    ? 'قيد الإنجاز'
                    : 'في الانتظار'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] block">أجل التنفيذ</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatDateFr(selectedTaskForDetails.deadline)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] block">التقدير المعتمد</span>
                <span className="font-bold text-blue-600">
                  {formatCurrency(selectedTaskForDetails.estimatedBudget)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] block">الفاتورة النهائية</span>
                <span className="font-bold text-emerald-600">
                  {selectedTaskForDetails.finalInvoice > 0
                    ? formatCurrency(selectedTaskForDetails.finalInvoice)
                    : '-'}
                </span>
              </div>
            </div>

            {/* Provider info */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="text-slate-500 font-semibold">المزود المعتمد :</div>
              <div className="font-bold text-slate-900 dark:text-white">{selectedTaskForDetails.provider}</div>
              {selectedTaskForDetails.providerPhone && (
                <div className="text-slate-500 flex items-center gap-1.5 pt-0.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {selectedTaskForDetails.providerPhone}
                </div>
              )}
            </div>

            {/* Notes */}
            {selectedTaskForDetails.notes && (
              <div className="text-xs text-slate-600 dark:text-slate-400 bg-amber-50 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40">
                <strong className="text-amber-800 dark:text-amber-300 block mb-1">ملاحظات وتقرير المتابعة :</strong>
                {selectedTaskForDetails.notes}
              </div>
            )}

            {/* Attachments & Upload */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-emerald-600" />
                  الوثائق والوصولات والصور المرفقة ({selectedTaskForDetails.attachments?.length || 0})
                </h3>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-xl transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  إضافة وثيقة / صورة
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e => handleFileUploadForTask(e, selectedTaskForDetails.id)}
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                />
              </div>

              <div className="space-y-2">
                {selectedTaskForDetails.attachments?.map((att, idx) => (
                  <div
                    key={att.id || idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate max-w-sm">
                      <Paperclip className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {att.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {att.dataUrl ? (
                        <button
                          onClick={() => setPreviewAttachment(att)}
                          className="px-2 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                        >
                          معاينة
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">مؤرشف</span>
                      )}
                    </div>
                  </div>
                ))}

                {(!selectedTaskForDetails.attachments || selectedTaskForDetails.attachments.length === 0) && (
                  <p className="text-xs text-slate-400 italic text-center py-4">
                    لا توجد مرفقات أو صور مضافة بعد.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedTaskForDetails(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{previewAttachment.name}</span>
              <button
                onClick={() => setPreviewAttachment(null)}
                className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center">
              {previewAttachment.type === 'image' ? (
                <img src={previewAttachment.dataUrl} alt="Preview" className="max-w-full rounded-lg" />
              ) : (
                <iframe src={previewAttachment.dataUrl} className="w-full h-96 rounded-lg" title="Document Preview" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: Kanban Card
const TaskKanbanCard: React.FC<{
  task: AGTask;
  onSelect: () => void;
  onStatusChange: (status: TaskStatus) => void;
}> = ({ task, onSelect, onStatusChange }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition space-y-3 text-right">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          {task.agReference.split('-')[1]?.trim() || task.category}
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            task.priority === 'URGENT'
              ? 'bg-rose-100 text-rose-700'
              : task.priority === 'HAUTE'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {task.priority === 'URGENT' ? 'عاجل' : task.priority === 'HAUTE' ? 'أولوية عالية' : 'عادي'}
        </span>
      </div>

      <div onClick={onSelect} className="cursor-pointer">
        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white hover:text-emerald-600 transition leading-snug">
          {task.title}
        </h4>
        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
          {task.description}
        </p>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block">المزود</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[120px] block text-[11px]">
            {task.provider}
          </span>
        </div>
        <div className="text-left">
          <span className="text-[10px] text-slate-400 block">
            {task.finalInvoice > 0 ? 'الفاتورة' : 'التقدير'}
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
            {task.finalInvoice > 0 ? formatCurrency(task.finalInvoice) : formatCurrency(task.estimatedBudget)}
          </span>
        </div>
      </div>

      {/* Move Task Dropdown */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>{formatDateFr(task.deadline)}</span>
        </div>
        <div className="flex items-center gap-1">
          {task.attachments?.length > 0 && (
            <span className="flex items-center text-[10px] text-slate-500 ml-2">
              <Paperclip className="w-3 h-3 ml-0.5" /> {task.attachments.length}
            </span>
          )}
          <select
            aria-label="تغيير حالة المهمة"
            value={task.status}
            onChange={e => onStatusChange(e.target.value as TaskStatus)}
            className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 outline-none cursor-pointer"
          >
            <option value="NON_COMMENCE">في الانتظار</option>
            <option value="EN_COURS">قيد الإنجاز</option>
            <option value="TERMINE">منجز</option>
          </select>
        </div>
      </div>
    </div>
  );
};
