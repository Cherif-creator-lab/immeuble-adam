import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDateFr, getMonthName } from '../utils/formatters';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Trash2
} from 'lucide-react';

interface BudgetExpenseModuleProps {
  onOpenAddExpense: () => void;
}

export const BudgetExpenseModule: React.FC<BudgetExpenseModuleProps> = ({ onOpenAddExpense }) => {
  const {
    budgetItems,
    expenses,
    deleteExpense,
    selectedMonth,
    selectedYear
  } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'expenses' | 'budget_tracking'>('expenses');
  const [filterBySelectedMonthOnly, setFilterBySelectedMonthOnly] = useState<boolean>(true);

  const filteredExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    if (filterBySelectedMonthOnly) {
      if (expDate.getFullYear() !== selectedYear || expDate.getMonth() + 1 !== selectedMonth) {
        return false;
      }
    }
    if (filterType !== 'ALL' && exp.type !== filterType) return false;
    if (filterCategory !== 'ALL' && exp.budgetId !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBen = exp.beneficiary.toLowerCase().includes(q);
      const matchCat = exp.budgetName.toLowerCase().includes(q);
      const matchNotes = exp.notes?.toLowerCase().includes(q) || false;
      const matchInv = exp.invoiceNumber?.toLowerCase().includes(q) || false;
      if (!matchBen && !matchCat && !matchNotes && !matchInv) return false;
    }
    return true;
  });

  const totalOrdinaires = expenses
    .filter(e => e.type === 'ORDINAIRE')
    .reduce((s, e) => s + Number(e.amount), 0);

  const totalTravauxReserve = expenses
    .filter(e => e.type === 'EXCEPTIONNEL_RESERVE')
    .reduce((s, e) => s + Number(e.amount), 0);

  const totalAllExpenses = totalOrdinaires + totalTravauxReserve;

  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
  });

  const monthOrd = currentMonthExpenses
    .filter(e => e.type === 'ORDINAIRE')
    .reduce((s, e) => s + Number(e.amount), 0);

  const monthReserve = currentMonthExpenses
    .filter(e => e.type === 'EXCEPTIONNEL_RESERVE')
    .reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
            <DollarSign className="w-3.5 h-3.5" />
            <span>التسيير المالي وتتبع المصاريف</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            المصاريف والميزانية التقديرية (72,000 درهم)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            الفصل الواضح بين <strong>الميزانية العادية للتسيير</strong> (6,000 درهم/شهر) و <strong>صندوق الاحتياط والأشغال الاستثنائية</strong> المصادق عليها في الجمع العام.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            تسجيل مصروف جديد
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>المصاريف العادية ({getMonthName(selectedMonth)})</span>
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full text-[10px]">
              التسيير العادي
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(monthOrd)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex justify-between">
              <span>المقرر : {formatCurrency(6000)}/شهر</span>
              <span className={monthOrd > 6000 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-semibold'}>
                {monthOrd <= 6000 ? 'في حدود الميزانية' : 'تجاوز'}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            مجموع السنة : <strong>{formatCurrency(totalOrdinaires)}</strong>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>صندوق الاحتياط والأشغال ({getMonthName(selectedMonth)})</span>
            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full text-[10px]">
              قرارات الجمع العام
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {formatCurrency(monthReserve)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              مقتطع من حساب الطوارئ وأشغال الجمع العام
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            مجموع الأشغال : <strong>{formatCurrency(totalTravauxReserve)}</strong>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>مجموع المصاريف الإجمالية</span>
            <span className="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold px-2 py-0.5 rounded-full text-[10px]">
              المدفوعات
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {formatCurrency(totalAllExpenses)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              على {expenses.length} عملية مسجلة
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            هذا الشهر ({getMonthName(selectedMonth)}) : <strong>{formatCurrency(monthOrd + monthReserve)}</strong>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center space-x-2 space-x-reverse border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'expenses'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          سجل الفواتير والمصاريف ({filteredExpenses.length})
        </button>
        <button
          onClick={() => setActiveTab('budget_tracking')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'budget_tracking'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          مراقبة بنود الميزانية الـ 9 (72,000 درهم/سنة)
        </button>
      </div>

      {/* TAB 1: JOURNAL DES DÉPENSES */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="البحث عن مورد، فاتورة..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 pr-9 pl-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <select
                aria-label="تصفية حسب نوع المصروف"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-semibold"
              >
                <option value="ALL">جميع الأنواع</option>
                <option value="ORDINAIRE">الميزانية العادية</option>
                <option value="EXCEPTIONNEL_RESERVE">أشغال الجمع العام / الاحتياط</option>
              </select>

              <select
                aria-label="تصفية حسب البند"
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-semibold"
              >
                <option value="ALL">جميع بنود الميزانية</option>
                {budgetItems.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.code} - {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterBySelectedMonthOnly}
                  onChange={e => setFilterBySelectedMonthOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>عرض شهر {getMonthName(selectedMonth)} {selectedYear} فقط</span>
              </label>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-4">التاريخ</th>
                    <th className="p-4">البند المالي</th>
                    <th className="p-4">المستفيد / المورد</th>
                    <th className="p-4">الصنف</th>
                    <th className="p-4">طريقة الأداء</th>
                    <th className="p-4 text-left">المبلغ</th>
                    <th className="p-4">رقم الفاتورة</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredExpenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="p-4 text-slate-600 dark:text-slate-400 whitespace-nowrap font-medium">
                        {formatDateFr(exp.date)}
                      </td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">
                        <div>{exp.budgetName}</div>
                        {exp.notes && (
                          <div className="text-[11px] text-slate-400 font-normal line-clamp-1">
                            {exp.notes}
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-800 dark:text-slate-200">
                        {exp.beneficiary}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            exp.type === 'ORDINAIRE'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {exp.type === 'ORDINAIRE' ? 'عادي' : 'أشغال الجمع العام'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {exp.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 text-left font-extrabold text-rose-600 dark:text-rose-400 text-sm whitespace-nowrap">
                        -{formatCurrency(exp.amount)}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        {exp.invoiceNumber || '-'}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            if (window.confirm('هل تريد حذف هذه النفقة ؟')) {
                              deleteExpense(exp.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTRÔLE DES 9 POSTES */}
      {activeTab === 'budget_tracking' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                جدول البنود الـ 9 للميزانية (72,000 درهم/سنة)
              </h2>
              <p className="text-xs text-slate-500">
                مقارنة تفصيلية بين الميزانية المصادق عليها والاستهلاك الفعلي.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {budgetItems.map(item => {
                const monthSpent = currentMonthExpenses
                  .filter(e => e.budgetId === item.id)
                  .reduce((s, e) => s + Number(e.amount), 0);

                const yearSpent = expenses
                  .filter(e => {
                    const d = new Date(e.date);
                    return e.budgetId === item.id && d.getFullYear() === selectedYear;
                  })
                  .reduce((s, e) => s + Number(e.amount), 0);

                const monthPct = item.monthlyBudget > 0 ? Math.round((monthSpent / item.monthlyBudget) * 100) : 0;
                const isOverMonth = monthSpent > item.monthlyBudget;

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border transition ${
                      isOverMonth
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {item.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isOverMonth
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200'
                        }`}
                      >
                        {monthPct}% مستهلك هذا الشهر
                      </span>
                    </div>

                    <h3 className="font-extrabold text-xs text-slate-900 dark:text-white mt-2">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">شهر ({getMonthName(selectedMonth)}) :</span>
                        <span className="font-bold">
                          <strong className={isOverMonth ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}>
                            {formatCurrency(monthSpent)}
                          </strong>{' '}
                          / {formatCurrency(item.monthlyBudget)}
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOverMonth ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(monthPct, 100)}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                        <span>مجموع السنة : {formatCurrency(yearSpent)}</span>
                        <span>المقرر : {formatCurrency(item.annualBudget)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
