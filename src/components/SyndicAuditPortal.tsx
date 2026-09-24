import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDateFr, getMonthName } from '../utils/formatters';
import { generateMonthlyReportPDF } from '../utils/pdfGenerator';
import { Expense, AGTask, BudgetItem, ExpenseType, PaymentMethod, TaskStatus } from '../types';
import {
  ShieldCheck,
  Building2,
  Wallet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  FileText,
  DollarSign,
  Hammer,
  Eye,
  Edit,
  Trash2,
  Plus,
  RotateCcw,
  X,
  Check,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

export const SyndicAuditPortal: React.FC = () => {
  const {
    residenceInfo,
    updateResidenceInfo,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    currentBankBalance,
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    budgetItems,
    updateBudgetItem,
    agTasks,
    addAGTask,
    updateAGTask,
    deleteAGTask,
    apartments,
    payments,
    budgetAlerts
  } = useApp();

  const [activeTab, setActiveTab] = useState<'depenses' | 'travaux' | 'budget' | 'banque'>('depenses');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'TERMINE' | 'EN_COURS' | 'NON_COMMENCE'>('ALL');

  // Modals state
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<AGTask | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingBudgetItem, setEditingBudgetItem] = useState<BudgetItem | null>(null);
  const [isEditBankOpen, setIsEditBankOpen] = useState(false);

  const [editFinancialForm, setEditFinancialForm] = useState({
    monthlyOperatingBudget: residenceInfo.monthlyOperatingBudget ?? 6000,
    syndicApartmentRent: residenceInfo.syndicApartmentRent ?? 1600,
    initialBankBalance: residenceInfo.initialBankBalance ?? 6580,
    bankName: residenceInfo.bankName,
    bankAccountRib: residenceInfo.bankAccountRib
  });

  const monthName = getMonthName(selectedMonth);

  // Filter expenses for selected month
  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
  });

  const totalSpentThisMonth = currentMonthExpenses.reduce((s, e) => s + Number(e.amount), 0);
  
  // Current month financial calculations
  const monthlyOperatingBudget = residenceInfo.monthlyOperatingBudget ?? 6000;
  const monthlySyndicRent = residenceInfo.syndicApartmentRent ?? 1600;
  const totalExpectedMonthlyIncome = monthlyOperatingBudget + monthlySyndicRent; // 7,600 DH
  const netMonthBalance = totalExpectedMonthlyIncome - totalSpentThisMonth;

  // Filtered expenses list
  const filteredExpenses = currentMonthExpenses.filter(exp => {
    if (filterCategory !== 'ALL' && exp.budgetId !== filterCategory) return false;
    return true;
  });

  // Completed & in progress tasks
  const completedTasks = agTasks.filter(t => t.status === 'TERMINE');
  const inProgressTasks = agTasks.filter(t => t.status === 'EN_COURS');
  const waitingTasks = agTasks.filter(t => t.status === 'NON_COMMENCE');

  const filteredTasks = agTasks.filter(t => {
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    return true;
  });

  const handleDownloadPDF = () => {
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
      {/* Top Banner: Espace Propriétaire / Contrôle Syndic */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full text-xs font-bold text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>فضاء تتبع ومراقبة السنديك &bull; جميع المعلومات قابلة للتعديل والتحيين</span>
            </div>

            {/* Month selector */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="bg-slate-800/90 p-1.5 rounded-2xl flex items-center gap-2 border border-slate-700">
                <span className="text-xs font-semibold text-slate-300 pr-2">الشهر :</span>
                <select
                  aria-label="اختيار الشهر المراد مراقبته"
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(Number(e.target.value))}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-1 px-3 rounded-xl outline-none cursor-pointer transition"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                    <option key={m} value={m}>{getMonthName(m)} {selectedYear}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              تتبع أشغال ومصاريف السنديك &bull; إقامة آدم 168
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              تحكم كامل في تتبع مصاريف السنديك وتعديل الفواتير، مراقبة تنفيذ <strong>القرارات الـ 9 للجمع العام</strong> والتحقق من <strong>الميزانية التقديرية (6,000 درهم/شهرياً)</strong>.
            </p>
          </div>

          {/* 3 Main Audit Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* Card 1: Spent by Syndic this month */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="flex justify-between items-start">
                <span className="text-xs text-emerald-200 font-bold">💸 مصاريف شهر {monthName}</span>
                <span className="text-[10px] bg-rose-500/30 text-rose-200 px-2 py-0.5 rounded font-bold">
                  {currentMonthExpenses.length} فواتير
                </span>
              </div>
              <div className="text-2xl font-black text-rose-300 mt-1">
                {formatCurrency(totalSpentThisMonth)}
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                الميزانية المعتمدة : 6,000 درهم/شهر
              </div>
            </div>

            {/* Card 2: AG Works Completion */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <span className="text-xs text-emerald-200 font-bold block">🛠️ قرارات الجمع العام الـ 9</span>
              <div className="text-2xl font-black text-white mt-1">
                {completedTasks.length} / {agTasks.length} منجزة
              </div>
              <div className="text-[11px] text-emerald-300 font-bold mt-1">
                {inProgressTasks.length} قيد الإنجاز &bull; {waitingTasks.length} في الانتظار
              </div>
            </div>

            {/* Card 3: Bank Balance */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <div className="flex justify-between items-start">
                <span className="text-xs text-emerald-200 font-bold">🏦 الرصيد المالي بالبنك</span>
                <button
                  onClick={() => {
                    setEditFinancialForm({
                      monthlyOperatingBudget: monthlyOperatingBudget,
                      syndicApartmentRent: monthlySyndicRent,
                      initialBankBalance: residenceInfo.initialBankBalance,
                      bankName: residenceInfo.bankName,
                      bankAccountRib: residenceInfo.bankAccountRib
                    });
                    setIsEditBankOpen(true);
                  }}
                  className="text-[10px] text-emerald-300 hover:underline flex items-center gap-1 font-bold"
                >
                  <Edit className="w-3 h-3" /> تعديل
                </button>
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {formatCurrency(currentBankBalance)}
              </div>
              <div className="text-[11px] text-emerald-200/80 mt-1 flex items-center justify-between">
                <span>{residenceInfo.bankName}</span>
                <span className="text-emerald-300 font-bold">+{formatCurrency(monthlySyndicRent)} كراء شقة 21</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                إضافة مصروف / فاتورة
              </button>
              <button
                onClick={() => setIsAddTaskOpen(true)}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                إضافة قرار / مشروع
              </button>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              تحميل تقرير التتبع (PDF شهر {monthName})
            </button>
          </div>
        </div>
      </div>

      {/* Budget Alerts Banner if over budget */}
      {budgetAlerts.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-4 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>تنبيه للملاك : تم تسجيل تجاوز في الميزانية خلال شهر {monthName}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {budgetAlerts.map(alert => (
              <div key={alert.budgetId} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900 flex justify-between">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{alert.name}</span>
                <span className="font-black text-rose-600">
                  {formatCurrency(alert.monthlyActual)} (المقرر : {formatCurrency(alert.monthlyBudget)})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('depenses')}
          className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
            activeTab === 'depenses'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>1. سجل الفواتير والمصاريف ({filteredExpenses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('travaux')}
          className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
            activeTab === 'travaux'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Hammer className="w-4 h-4" />
          <span>2. قرارات الجمع العام الـ 9 ({completedTasks.length}/9)</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
            activeTab === 'budget'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. البنود الـ 9 المقررة (6,000 د.م/ش)</span>
        </button>

        <button
          onClick={() => setActiveTab('banque')}
          className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition ${
            activeTab === 'banque'
              ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>4. حساب الشهر والبنك (+{formatCurrency(totalExpectedMonthlyIncome)})</span>
        </button>
      </div>

      {/* TAB 1: DÉPENSES & FACTURES DU MOIS (EDITABLE) */}
      {activeTab === 'depenses' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                سجل الفواتير والمصاريف المؤداة &bull; {monthName} {selectedYear}
              </h2>
              <p className="text-xs text-slate-500">
                يمكنك تعديل أي مبلغ أو مستفيد أو إضافة مصاريف جديدة مباشرة.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                aria-label="تصفية حسب نوع المصروف"
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
              >
                <option value="ALL">جميع البنود ({currentMonthExpenses.length})</option>
                {budgetItems.map(b => (
                  <option key={b.id} value={b.id}>{b.name.split('(')[0]}</option>
                ))}
              </select>

              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة
              </button>
            </div>
          </div>

          {/* List of expenses with Edit & Delete actions */}
          <div className="space-y-3">
            {filteredExpenses.map(exp => (
              <div
                key={exp.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-300 dark:hover:border-slate-600 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      {exp.budgetName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        exp.type === 'ORDINAIRE'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {exp.type === 'ORDINAIRE' ? 'الميزانية العادية' : 'أشغال استثنائية / الجمع العام'}
                    </span>
                  </div>

                  <div className="text-slate-600 dark:text-slate-400 text-[11px]">
                    المستفيد : <strong className="text-slate-800 dark:text-slate-200">{exp.beneficiary}</strong> &bull; التاريخ : {formatDateFr(exp.date)} &bull; طريقة الأداء : {exp.paymentMethod}
                  </div>

                  {exp.notes && (
                    <div className="text-slate-500 italic text-[11px]">
                      ملاحظة / وصل : {exp.notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
                  <div className="text-left">
                    <div className="text-base font-black text-rose-600 dark:text-rose-400">
                      -{formatCurrency(exp.amount)}
                    </div>
                    {exp.invoiceNumber && (
                      <span className="text-[10px] font-mono text-slate-400 block">
                        رقم الوصل: {exp.invoiceNumber}
                      </span>
                    )}
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1 border-r sm:border-r border-slate-200 dark:border-slate-700 pr-2">
                    <button
                      onClick={() => setEditingExpense(exp)}
                      className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl transition"
                      title="تعديل المصروف"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`هل تريد حذف مصروف "${exp.budgetName}" بمبلغ ${formatCurrency(exp.amount)} ؟`)) {
                          deleteExpense(exp.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition"
                      title="حذف المصروف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredExpenses.length === 0 && (
              <p className="text-xs text-slate-400 italic text-center py-8">
                لا توجد مصاريف مسجلة لهذا البند في شهر {monthName} {selectedYear}.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LES 9 TRAVAUX ET DÉCISIONS DU PV DE L'AG (EDITABLE) */}
      {activeTab === 'travaux' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                تتبع إنجاز القرارات الـ 9 للجمع العام (12/08/2026)
              </h2>
              <p className="text-xs text-slate-500">
                يمكنك الضغط على أي قرار لتعديل حالته، الفاتورة النهائية، أو اسم المقاول.
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  filterStatus === 'ALL' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                الكل ({agTasks.length})
              </button>
              <button
                onClick={() => setFilterStatus('TERMINE')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  filterStatus === 'TERMINE' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                المنجزة ({completedTasks.length})
              </button>
              <button
                onClick={() => setFilterStatus('EN_COURS')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                  filterStatus === 'EN_COURS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                قيد الإنجاز ({inProgressTasks.length})
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map(task => (
              <div
                key={task.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 hover:border-emerald-500 transition shadow-sm"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {task.agReference}
                  </span>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        task.status === 'TERMINE'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : task.status === 'EN_COURS'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {task.status === 'TERMINE' ? '✅ منجز ومطابق' : task.status === 'EN_COURS' ? '⏳ قيد الإنجاز' : '⏱️ في الانتظار'}
                    </span>

                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-1 text-slate-400 hover:text-emerald-600 transition"
                      title="تعديل هذا المشروع"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white">{task.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">{task.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">المزود : <strong className="text-slate-800 dark:text-slate-200">{task.provider}</strong></span>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block">{task.finalInvoice > 0 ? 'الفاتورة المؤداة' : 'التقدير المعتمد'}</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs">
                      {task.finalInvoice > 0 ? formatCurrency(task.finalInvoice) : formatCurrency(task.estimatedBudget)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GRILLE DES 9 POSTES BUDGÉTAIRES (EDITABLE) */}
      {activeTab === 'budget' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                الميزانية التقديرية المعتمدة (المجموع : {formatCurrency(budgetItems.reduce((s, b) => s + b.monthlyBudget, 0))}/شهرياً)
              </h2>
              <p className="text-xs text-slate-500">
                توزيع البنود الـ 9 المقررة لمصاريف التسيير العادية. يمكنك تعديل أي ميزانية تقديرية بالضغط على زر التعديل.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {budgetItems.map(item => {
              const spentThisMonth = currentMonthExpenses
                .filter(e => e.budgetId === item.id)
                .reduce((s, e) => s + Number(e.amount), 0);

              const isExceeded = spentThisMonth > item.monthlyBudget;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border space-y-2 text-xs transition ${
                    isExceeded
                      ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {item.name}
                    </span>
                    <button
                      onClick={() => setEditingBudgetItem(item)}
                      className="text-slate-400 hover:text-emerald-600 p-1"
                      title="تعديل الميزانية المخصصة"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">المقرر : <strong>{formatCurrency(item.monthlyBudget)}/شهر</strong></span>
                    <span className={`font-black ${isExceeded ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                      الفعلي : {formatCurrency(spentThisMonth)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: SITUATION DU MOIS EN COURS (6,000 + 1,600 - CHARGES) */}
      {activeTab === 'banque' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>💰 الوضعية المالية وحساب شهر {monthName} {selectedYear}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                تتبع المداخيل المقررة للشهر (6,000 د.م واجبات + 1,600 د.م كراء) مخصوماً منها مصاريف الشهر الحالي.
              </p>
            </div>

            <button
              onClick={() => {
                setEditFinancialForm({
                  monthlyOperatingBudget: monthlyOperatingBudget,
                  syndicApartmentRent: monthlySyndicRent,
                  initialBankBalance: residenceInfo.initialBankBalance,
                  bankName: residenceInfo.bankName,
                  bankAccountRib: residenceInfo.bankAccountRib
                });
                setIsEditBankOpen(true);
              }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
            >
              <Edit className="w-3.5 h-3.5" />
              تعديل مداخيل الشهر (6000 / 1600)
            </button>
          </div>

          {/* 3 Main Calculation Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: المداخيل المقررة للشهر الحالي */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  📈 1. المداخيل المقررة لشهر {monthName}
                </span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black">
                  + مدخول
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">ميزانية واجبات الشقق :</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{formatCurrency(monthlyOperatingBudget)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">كراء شقة السنديك (21) :</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{formatCurrency(monthlySyndicRent)}</span>
                </div>
                <div className="pt-2 border-t border-emerald-200/80 dark:border-emerald-800/80 flex justify-between items-center">
                  <span className="font-black text-emerald-900 dark:text-emerald-200">مجموع المداخيل :</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(totalExpectedMonthlyIncome)}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: مصاريف الشهر الحالي */}
            <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                  📉 2. مصاريف وفواتير شهر {monthName}
                </span>
                <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-black">
                  - مصاريف
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">عدد الفواتير المسجلة :</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{currentMonthExpenses.length} فواتير</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">المصاريف المؤداة :</span>
                  <span className="font-extrabold text-rose-600">{formatCurrency(totalSpentThisMonth)}</span>
                </div>
                <div className="pt-2 border-t border-rose-200/80 dark:border-rose-800/80 flex justify-between items-center">
                  <span className="font-black text-rose-900 dark:text-rose-200">مجموع المصاريف :</span>
                  <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                    -{formatCurrency(totalSpentThisMonth)}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: الصافي / الفائض لشهر الحالي */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              netMonthBalance >= 0 
                ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50' 
                : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300">
                  ⚖️ 3. الصافي / الفائض لشهر {monthName}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black text-white ${netMonthBalance >= 0 ? 'bg-blue-600' : 'bg-amber-600'}`}>
                  = الصافي
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">المعادلة الشهرية :</span>
                  <span className="font-bold text-[11px] text-slate-500">(المداخيل - المصاريف)</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-600 dark:text-slate-400">
                  <span>{formatCurrency(totalExpectedMonthlyIncome)} - {formatCurrency(totalSpentThisMonth)}</span>
                </div>
                <div className="pt-2 border-t border-blue-200/80 dark:border-blue-800/80 flex justify-between items-center">
                  <span className="font-black text-slate-900 dark:text-white">الفائض الصافي :</span>
                  <span className={`text-sm font-black ${netMonthBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {netMonthBalance >= 0 ? '+' : ''}{formatCurrency(netMonthBalance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 1: ADD / EDIT EXPENSE --- */}
      {(editingExpense || isAddExpenseOpen) && (
        <ExpenseModal
          expense={editingExpense}
          budgetItems={budgetItems}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onClose={() => {
            setEditingExpense(null);
            setIsAddExpenseOpen(false);
          }}
          onSave={expenseData => {
            if (editingExpense) {
              updateExpense(editingExpense.id, expenseData);
            } else {
              addExpense(expenseData);
            }
            setEditingExpense(null);
            setIsAddExpenseOpen(false);
          }}
        />
      )}

      {/* --- MODAL 2: EDIT TASK --- */}
      {(editingTask || isAddTaskOpen) && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setEditingTask(null);
            setIsAddTaskOpen(false);
          }}
          onSave={taskData => {
            if (editingTask) {
              updateAGTask(editingTask.id, taskData);
            } else {
              addAGTask(taskData);
            }
            setEditingTask(null);
            setIsAddTaskOpen(false);
          }}
        />
      )}

      {/* --- MODAL 3: EDIT BUDGET ITEM --- */}
      {editingBudgetItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-right">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">تعديل الميزانية التقديرية للبند</h3>
              <button onClick={() => setEditingBudgetItem(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم البند</label>
              <input
                type="text"
                value={editingBudgetItem.name}
                onChange={e => setEditingBudgetItem({ ...editingBudgetItem, name: e.target.value })}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">المبلغ الشهري المخصص (درهم)</label>
              <input
                type="number"
                value={editingBudgetItem.monthlyBudget}
                onChange={e => setEditingBudgetItem({ ...editingBudgetItem, monthlyBudget: Number(e.target.value), annualBudget: Number(e.target.value) * 12 })}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setEditingBudgetItem(null)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">إلغاء</button>
              <button
                onClick={() => {
                  updateBudgetItem(editingBudgetItem.id, editingBudgetItem);
                  setEditingBudgetItem(null);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                حفظ التعديل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: EDIT FINANCIAL AMOUNTS & BANK --- */}
      {isEditBankOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-right">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                تعديل مبالغ الشهر والبيانات البنكية
              </h3>
              <button onClick={() => setIsEditBankOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ميزانية التسيير الشهرية (واجبات الشقق)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={editFinancialForm.monthlyOperatingBudget}
                    onChange={e => setEditFinancialForm({ ...editFinancialForm, monthlyOperatingBudget: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold pl-12"
                    placeholder="6000"
                  />
                  <span className="absolute left-3 top-2.5 text-[11px] text-slate-400 font-bold">د.م</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  سومة كراء شقة السنديك (شقة 21)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={editFinancialForm.syndicApartmentRent}
                    onChange={e => setEditFinancialForm({ ...editFinancialForm, syndicApartmentRent: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold pl-12"
                    placeholder="1600"
                  />
                  <span className="absolute left-3 top-2.5 text-[11px] text-slate-400 font-bold">د.م</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الرصيد الافتتاحي بالبنك (رصيد الانطلاق)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={editFinancialForm.initialBankBalance}
                    onChange={e => setEditFinancialForm({ ...editFinancialForm, initialBankBalance: Number(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold pl-12"
                    placeholder="6580"
                  />
                  <span className="absolute left-3 top-2.5 text-[11px] text-slate-400 font-bold">د.م</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم البنك
                </label>
                <input
                  type="text"
                  value={editFinancialForm.bankName}
                  onChange={e => setEditFinancialForm({ ...editFinancialForm, bankName: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  رقم الحساب البنكي (RIB)
                </label>
                <input
                  type="text"
                  value={editFinancialForm.bankAccountRib}
                  onChange={e => setEditFinancialForm({ ...editFinancialForm, bankAccountRib: e.target.value })}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button onClick={() => setIsEditBankOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
                إلغاء
              </button>
              <button
                onClick={() => {
                  updateResidenceInfo({
                    monthlyOperatingBudget: editFinancialForm.monthlyOperatingBudget,
                    syndicApartmentRent: editFinancialForm.syndicApartmentRent,
                    initialBankBalance: editFinancialForm.initialBankBalance,
                    bankName: editFinancialForm.bankName,
                    bankAccountRib: editFinancialForm.bankAccountRib
                  });
                  setIsEditBankOpen(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
              >
                حفظ التعديلات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: EXPENSE MODAL (ADD / EDIT) ---
interface ExpenseModalProps {
  expense: Expense | null;
  budgetItems: BudgetItem[];
  selectedMonth: number;
  selectedYear: number;
  onClose: () => void;
  onSave: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  expense,
  budgetItems,
  selectedMonth,
  selectedYear,
  onClose,
  onSave
}) => {
  const [budgetId, setBudgetId] = useState(expense?.budgetId || budgetItems[0]?.id || 'b1');
  const [amount, setAmount] = useState<number | ''>(expense ? expense.amount : '');
  const [beneficiary, setBeneficiary] = useState(expense?.beneficiary || '');
  const [type, setType] = useState<ExpenseType>(expense?.type || 'ORDINAIRE');
  const [date, setDate] = useState(
    expense?.date || `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01`
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(expense?.paymentMethod || 'ESPECES');
  const [invoiceNumber, setInvoiceNumber] = useState(expense?.invoiceNumber || '');
  const [notes, setNotes] = useState(expense?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !beneficiary.trim()) {
      alert('يرجى ملء المبلغ والمستفيد');
      return;
    }

    const budget = budgetItems.find(b => b.id === budgetId);
    onSave({
      budgetId,
      budgetName: budget ? budget.name : 'مصاريف أخرى',
      amount: Number(amount),
      beneficiary: beneficiary.trim(),
      type,
      date,
      paymentMethod,
      invoiceNumber: invoiceNumber.trim() || undefined,
      notes: notes.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-right">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            {expense ? 'تعديل المصروف / الفاتورة' : 'إضافة مصروف جديد'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">نوع البند *</label>
            <select
              value={budgetId}
              onChange={e => setBudgetId(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
            >
              {budgetItems.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.monthlyBudget} درهم/ش)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">المبلغ المؤدى (درهم) *</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                placeholder="مثال: 800"
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-rose-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">طبيعة النفقة</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as ExpenseType)}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
              >
                <option value="ORDINAIRE">الميزانية العادية</option>
                <option value="EXCEPTIONNEL_RESERVE">أشغال الجمع العام / طوارئ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">المستفيد / الشركة أو العامل *</label>
            <input
              type="text"
              value={beneficiary}
              onChange={e => setBeneficiary(e.target.value)}
              placeholder="مثال: شركة النظافة / حارس العمارة"
              className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">تاريخ الأداء</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">طريقة الأداء</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <option value="ESPECES">نقداً (Espèces)</option>
                <option value="VIREMENT">تحويل بنكي (Virement)</option>
                <option value="PRELEVEMENT">اقتطاع آلي (Prélèvement)</option>
                <option value="CHEQUE">شيك (Chèque)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الفاتورة أو الوصل</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={e => setInvoiceNumber(e.target.value)}
              placeholder="مثال: FAC-2026-088"
              className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ملاحظات إضافية</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="وصف تفصيلي للخدمة المؤداة"
              className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold">إلغاء</button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold">
              {expense ? 'حفظ التعديلات' : 'تسجيل المصروف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: TASK MODAL (ADD / EDIT) ---
interface TaskModalProps {
  task: AGTask | null;
  onClose: () => void;
  onSave: (data: Omit<AGTask, 'id' | 'createdAt'>) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [agReference, setAgReference] = useState(task?.agReference || 'الجمع العام 12/08/2026');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'NON_COMMENCE');
  const [provider, setProvider] = useState(task?.provider || '');
  const [estimatedBudget, setEstimatedBudget] = useState<number | ''>(task ? task.estimatedBudget : '');
  const [finalInvoice, setFinalInvoice] = useState<number | ''>(task ? task.finalInvoice : 0);
  const [description, setDescription] = useState(task?.description || '');
  const [notes, setNotes] = useState(task?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('يرجى كتابة عنوان المشروع');
      return;
    }

    onSave({
      title: title.trim(),
      agReference: agReference.trim(),
      status,
      category: task?.category || 'TRAVAUX',
      priority: task?.priority || 'HAUTE',
      deadline: task?.deadline || '2026-10-30',
      provider: provider.trim() || 'في انتظار الاختيار',
      estimatedBudget: Number(estimatedBudget) || 0,
      finalInvoice: Number(finalInvoice) || 0,
      description: description.trim(),
      notes: notes.trim(),
      attachments: task?.attachments || []
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-right">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            {task ? 'تعديل قرار الجمع العام' : 'إضافة قرار / مشروع جديد'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">عنوان المشروع / القرار *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">حالة الإنجاز</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
              >
                <option value="NON_COMMENCE">⏱️ في الانتظار</option>
                <option value="EN_COURS">⏳ قيد الإنجاز</option>
                <option value="TERMINE">✅ منجز ومطابق</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">المزود / المهني المعتمد</label>
              <input
                type="text"
                value={provider}
                onChange={e => setProvider(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">التقدير المالي المعتمد (درهم)</label>
              <input
                type="number"
                value={estimatedBudget}
                onChange={e => setEstimatedBudget(Number(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-blue-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">الفاتورة النهائية المؤداة (درهم)</label>
              <input
                type="number"
                value={finalInvoice}
                onChange={e => setFinalInvoice(Number(e.target.value))}
                className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">وصف المشروع</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ملاحظات التتبع</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold">إلغاء</button>
            <button type="submit" className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-bold">
              {task ? 'حفظ التعديلات' : 'إضافة المشروع'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
