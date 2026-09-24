import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getMonthName, getLitigationStatusBadge } from '../utils/formatters';
import {
  Wallet,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  PlusCircle,
  Building,
  Gavel,
  ShieldCheck,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onOpenAddExpense: () => void;
  onOpenAddPayment: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenAddExpense,
  onOpenAddPayment
}) => {
  const {
    residenceInfo,
    selectedMonth,
    selectedYear,
    budgetItems,
    expenses,
    payments,
    apartments,
    agTasks,
    litigationCases,
    currentBankBalance,
    totalEncaissements,
    totalDecaissements,
    recoveryRateCurrentMonth,
    paidCountCurrentMonth,
    unpaidCountCurrentMonth,
    budgetAlerts
  } = useApp();

  const monthName = getMonthName(selectedMonth);

  const currentMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === selectedYear && d.getMonth() + 1 === selectedMonth;
  });

  const monthOrdExpenses = currentMonthExpenses
    .filter(e => e.type === 'ORDINAIRE')
    .reduce((s, e) => s + Number(e.amount), 0);

  const monthSpecExpenses = currentMonthExpenses
    .filter(e => e.type === 'EXCEPTIONNEL_RESERVE')
    .reduce((s, e) => s + Number(e.amount), 0);

  const monthTotalExpenses = monthOrdExpenses + monthSpecExpenses;

  const currentMonthPayments = payments.filter(
    p => p.year === selectedYear && p.month === selectedMonth
  );
  const monthTotalEncaissements = currentMonthPayments.reduce((s, p) => s + Number(p.amount), 0);

  const completedTasks = agTasks.filter(t => t.status === 'TERMINE');
  const inProgressTasks = agTasks.filter(t => t.status === 'EN_COURS');

  const monthlyChartData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
    const mExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === selectedYear && d.getMonth() + 1 === m;
    });

    const totalDepenses = mExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const ordDepenses = mExpenses.filter(e => e.type === 'ORDINAIRE').reduce((sum, e) => sum + Number(e.amount), 0);
    const mPayments = payments.filter(p => p.year === selectedYear && p.month === m);
    const totalRecettes = mPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      name: getMonthName(m).slice(0, 5),
      fullMonth: getMonthName(m),
      budgetPrevu: 6000,
      depensesReelles: totalDepenses,
      depensesOrdinaires: ordDepenses,
      recettesCotisations: totalRecettes
    };
  });

  const categorySpendingData = budgetItems.map(b => {
    const actual = currentMonthExpenses
      .filter(e => e.budgetId === b.id)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    return {
      name: b.name.split('(')[0].trim(),
      prevu: b.monthlyBudget,
      reel: actual,
      isExceeded: actual > b.monthlyBudget
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>شركة التسيير العقاري المهني &bull; {residenceInfo.syndicPro}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              لوحة القيادة والمؤشرات المالية &bull; {monthName} {selectedYear}
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              تتبع مباشر لحركة الحساب البنكي، الميزانية السنوية (72,000 درهم)، استخلاص الـ 20 شقة ومتابعة قرارات الجمع العام الـ 9.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onOpenAddPayment}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              تسجيل مساهمة شقة
            </button>
            <button
              onClick={onOpenAddExpense}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/20 transition active:scale-95 backdrop-blur-sm"
            >
              <PlusCircle className="w-4 h-4" />
              تسجيل نفقة / فاتورة
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold px-4 py-2.5 rounded-xl shadow transition active:scale-95"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              التقرير الشهري PDF
            </button>
          </div>
        </div>
      </div>

      {/* Budget Overrun Alert Banner */}
      {budgetAlerts.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border-r-4 border-rose-500 p-4 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>تنبيه الشفافية : تسجيل تجاوز في الميزانية خلال شهر {monthName} {selectedYear}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1 text-xs">
            {budgetAlerts.map(alert => (
              <div
                key={alert.budgetId}
                className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 flex justify-between items-center"
              >
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">{alert.name}</span>
                  <span className="text-[11px] text-slate-500">
                    المقرر : {formatCurrency(alert.monthlyBudget)} &bull; الفعلي : <strong className="text-rose-600">{formatCurrency(alert.monthlyActual)}</strong>
                  </span>
                </div>
                <span className="bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 px-2 py-0.5 rounded font-bold text-[11px]">
                  +{formatCurrency(alert.exceededBy)} ({alert.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Bank Balance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">الرصيد البنكي المتوفر</span>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(currentBankBalance)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> الرصيد الافتتاحي: {formatCurrency(residenceInfo.initialBankBalance)}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500">
            <span>مجموع المداخيل: <strong className="text-emerald-600">{formatCurrency(totalEncaissements)}</strong></span>
            <span>المصاريف: <strong className="text-rose-600">{formatCurrency(totalDecaissements)}</strong></span>
          </div>
        </div>

        {/* Card 2: Recovery rate */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">نسبة الاستخلاص {monthName}</span>
            <div className="p-2 bg-blue-100 dark:bg-blue-950/60 text-blue-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {recoveryRateCurrentMonth} %
              </span>
              <span className="text-xs font-medium text-slate-500">
                ({paidCountCurrentMonth} / {paidCountCurrentMonth + unpaidCountCurrentMonth} شقة مؤدية)
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  recoveryRateCurrentMonth >= 80 ? 'bg-emerald-500' : recoveryRateCurrentMonth >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${recoveryRateCurrentMonth}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px]">
            <span className="text-emerald-600 font-medium">{monthTotalEncaissements} د.م محصلة</span>
            <span className="text-rose-600 font-medium">{unpaidCountCurrentMonth} في الانتظار</span>
          </div>
        </div>

        {/* Card 3: Month expenses */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">مصاريف شهر {monthName}</span>
            <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-xl">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(monthTotalExpenses)}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>الميزانية المقررة : {formatCurrency(6000)}</span>
              <span className={monthTotalExpenses > 6000 ? 'text-rose-600 font-bold' : 'text-emerald-600'}>
                {monthTotalExpenses > 6000 ? 'تجاوز' : 'متوازن'}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500">
            <span>العادية : <strong>{formatCurrency(monthOrdExpenses)}</strong></span>
            <span>الاستثنائية : <strong>{formatCurrency(monthSpecExpenses)}</strong></span>
          </div>
        </div>

        {/* Card 4: AG Tasks */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">قرارات الجمع العام 12/08</span>
            <div className="p-2 bg-purple-100 dark:bg-purple-950/60 text-purple-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {completedTasks.length} / {agTasks.length}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {Math.round((completedTasks.length / agTasks.length) * 100)}% منجز
              </span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-blue-600">
                <Clock className="w-3.5 h-3.5" /> {inProgressTasks.length} قيد الإنجاز
              </span>
              <span className="flex items-center gap-1 text-rose-600 font-medium">
                <Gavel className="w-3.5 h-3.5" /> {litigationCases.length} نزاعات
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px]">
            <span className="text-slate-500">كراء شقة السنديك (21) :</span>
            <span className="font-bold text-emerald-600">+1,600 د.م/شهر</span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                الميزانية المقررة (6,000 د.م/شهر) مقابل المصاريف والمداخيل ({selectedYear})
              </h2>
              <p className="text-xs text-slate-500">
                مقارنة شهرية بين المداخيل والمصاريف الفعلية
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
              الميزانية السنوية : 72,000 درهم
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#33415520" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [`${formatCurrency(value)}`, '']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    direction: 'rtl'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="budgetPrevu" name="الميزانية المقررة (د.م)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recettesCotisations" name="المداخيل المستخلصة" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="depensesReelles" name="مجموع المصاريف" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              استهلاك البنود ({monthName})
            </h2>
            <button
              onClick={() => onNavigate('expenses')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center"
            >
              التفاصيل <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
            </button>
          </div>

          <div className="space-y-3.5 pt-2 max-h-[290px] overflow-y-auto pl-1">
            {categorySpendingData.map((item, idx) => {
              const pct = item.prevu > 0 ? Math.min(Math.round((item.reel / item.prevu) * 100), 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[160px]">
                      {item.name}
                    </span>
                    <span className="font-medium text-slate-500">
                      <strong className={item.isExceeded ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}>
                        {item.reel} د.م
                      </strong>{' '}
                      / {item.prevu} د.م
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.isExceeded
                          ? 'bg-rose-500'
                          : pct >= 90
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Status of the 20 Apartments Grid */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>نظرة عامة على استخلاص الـ 20 شقة &bull; شهر {monthName} {selectedYear}</span>
            </h2>
            <p className="text-xs text-slate-500">
              أخضر = مساهمة مؤداة (300 د.م) | أحمر = غير مؤداة / متأخرة | أزرق = شقة السنديك المكراة
            </p>
          </div>
          <button
            onClick={() => onNavigate('apartments')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center self-start sm:self-auto"
          >
            الجدول السنوي الكامل <ChevronLeft className="w-4 h-4 mr-1" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2.5 pt-2">
          {apartments.map(apt => {
            const isPaid = payments.some(
              p => p.apartmentId === apt.id && p.year === selectedYear && p.month === selectedMonth
            );
            const isCommon = apt.monthlyDue === 0;

            let bgColor = 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200';
            let statusText = 'غير مؤداة';

            if (isCommon) {
              bgColor = 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-200';
              statusText = 'السنديك';
            } else if (isPaid) {
              bgColor = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200';
              statusText = 'مؤداة';
            }

            return (
              <div
                key={apt.id}
                onClick={() => onNavigate('apartments')}
                className={`p-2.5 rounded-2xl border text-center cursor-pointer transition hover:scale-105 ${bgColor}`}
              >
                <div className="text-xs font-extrabold">{apt.number}</div>
                <div className="text-[10px] font-medium truncate opacity-90">{apt.ownerName.split(' ')[0]}</div>
                <div className="mt-1 text-[9px] font-bold uppercase tracking-wider py-0.5 rounded bg-white/70 dark:bg-slate-900/70">
                  {statusText}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
