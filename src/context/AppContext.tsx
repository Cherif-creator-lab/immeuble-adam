import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CoProprieteState,
  BudgetItem,
  Apartment,
  AGTask,
  Expense,
  PaymentRecord,
  LitigationCase,
  ExtraIncome,
  TaskStatus
} from '../types';
import {
  initialResidenceInfo,
  initialBudgetItems,
  initialApartments,
  initialAGTasks,
  initialExpenses,
  initialPaymentRecords,
  initialLitigationCases,
  initialExtraIncomes
} from '../data/initialData';

interface AppContextType {
  residenceInfo: CoProprieteState;
  updateResidenceInfo: (info: Partial<CoProprieteState>) => void;

  budgetItems: BudgetItem[];
  addBudgetItem: (item: Omit<BudgetItem, 'id'>) => void;
  updateBudgetItem: (id: string, item: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;

  apartments: Apartment[];
  updateApartment: (id: number, data: Partial<Apartment>) => void;

  litigationCases: LitigationCase[];
  updateLitigationCase: (apartmentId: number, data: Partial<LitigationCase>) => void;
  addLitigationCase: (data: LitigationCase) => void;
  removeLitigationCase: (apartmentId: number) => void;

  agTasks: AGTask[];
  addAGTask: (task: Omit<AGTask, 'id' | 'createdAt'>) => void;
  updateAGTask: (id: string, task: Partial<AGTask>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteAGTask: (id: string) => void;

  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  payments: PaymentRecord[];
  addPayment: (payment: Omit<PaymentRecord, 'id'>) => PaymentRecord;
  deletePayment: (id: string) => void;

  extraIncomes: ExtraIncome[];
  addExtraIncome: (income: Omit<ExtraIncome, 'id'>) => void;
  deleteExtraIncome: (id: string) => void;

  // Computed Financial Metrics
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;

  totalCotisationsEncaissees: number;
  totalExtraIncomesEncaissees: number;
  totalEncaissements: number;
  totalDepensesOrdinaires: number;
  totalDepensesTravaux: number;
  totalDecaissements: number;
  currentBankBalance: number;
  
  recoveryRateCurrentMonth: number;
  paidCountCurrentMonth: number;
  unpaidCountCurrentMonth: number;
  
  budgetAlerts: Array<{
    budgetId: string;
    name: string;
    monthlyBudget: number;
    monthlyActual: number;
    annualBudget: number;
    annualActual: number;
    exceededBy: number;
    percentage: number;
  }>;

  resetToDefaultData: () => void;
  exportDataJson: () => void;
  importDataJson: (jsonData: string) => boolean;
}

const STORAGE_PREFIX = 'adam168_syndic_v6_';

// Automatically clean older cache versions from browser localStorage
try {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('adam168_') && !key.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
} catch (e) {
  console.error('Failed to cleanup old storage', e);
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // September

  // Storage getters
  const getStored = <T,>(key: string, defaultVal: T): T => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultVal;
    } catch (e) {
      console.error('Error reading localStorage', e);
      return defaultVal;
    }
  };

  const [residenceInfo, setResidenceInfo] = useState<CoProprieteState>(() =>
    getStored('residenceInfo', initialResidenceInfo)
  );

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() =>
    getStored('budgetItems', initialBudgetItems)
  );

  const [apartments, setApartments] = useState<Apartment[]>(() =>
    getStored('apartments', initialApartments)
  );

  const [litigationCases, setLitigationCases] = useState<LitigationCase[]>(() =>
    getStored('litigationCases', initialLitigationCases)
  );

  const [agTasks, setAGTasks] = useState<AGTask[]>(() =>
    getStored('agTasks', initialAGTasks)
  );

  const [expenses, setExpenses] = useState<Expense[]>(() =>
    getStored('expenses', initialExpenses)
  );

  const [payments, setPayments] = useState<PaymentRecord[]>(() =>
    getStored('payments', initialPaymentRecords)
  );

  const [extraIncomes, setExtraIncomes] = useState<ExtraIncome[]>(() =>
    getStored('extraIncomes', initialExtraIncomes)
  );

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'residenceInfo', JSON.stringify(residenceInfo));
  }, [residenceInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'budgetItems', JSON.stringify(budgetItems));
  }, [budgetItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'apartments', JSON.stringify(apartments));
  }, [apartments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'litigationCases', JSON.stringify(litigationCases));
  }, [litigationCases]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'agTasks', JSON.stringify(agTasks));
  }, [agTasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'extraIncomes', JSON.stringify(extraIncomes));
  }, [extraIncomes]);

  // Actions
  const updateResidenceInfo = (info: Partial<CoProprieteState>) => {
    setResidenceInfo(prev => ({ ...prev, ...info }));
  };

  const addBudgetItem = (item: Omit<BudgetItem, 'id'>) => {
    const newItem: BudgetItem = {
      ...item,
      id: 'b-' + Date.now()
    };
    setBudgetItems(prev => [...prev, newItem]);
  };

  const updateBudgetItem = (id: string, updated: Partial<BudgetItem>) => {
    setBudgetItems(prev => prev.map(b => (b.id === id ? { ...b, ...updated } : b)));
  };

  const deleteBudgetItem = (id: string) => {
    setBudgetItems(prev => prev.filter(b => b.id !== id));
  };

  const updateApartment = (id: number, data: Partial<Apartment>) => {
    setApartments(prev =>
      prev.map(a => {
        if (a.id === id) {
          const updated = { ...a, ...data };
          // If toggled litigation off, remove from litigation list
          if (data.isLitigation === false) {
            setLitigationCases(cases => cases.filter(c => c.apartmentId !== id));
          } else if (data.isLitigation === true && !litigationCases.some(c => c.apartmentId === id)) {
            // Add default litigation case
            setLitigationCases(cases => [
              ...cases,
              {
                apartmentId: id,
                ownerName: updated.ownerName,
                status: 'MISE_EN_DEMEURE',
                unpaidMonthsCount: 6,
                totalDebt: 1800,
                courtFeesEngaged: 300,
                lawyer: 'Cabinet Juridique COPRO SYNC',
                caseReference: `MED-${selectedYear}-${id.toString().padStart(2, '0')}`,
                lastActionDate: new Date().toISOString().split('T')[0],
                nextStep: 'Relance et sommation de payer',
                notes: 'Dossier contentieux initié.'
              }
            ]);
          }
          return updated;
        }
        return a;
      })
    );
  };

  const updateLitigationCase = (apartmentId: number, data: Partial<LitigationCase>) => {
    setLitigationCases(prev =>
      prev.map(c => (c.apartmentId === apartmentId ? { ...c, ...data } : c))
    );
  };

  const addLitigationCase = (data: LitigationCase) => {
    setLitigationCases(prev => {
      const exists = prev.some(c => c.apartmentId === data.apartmentId);
      if (exists) {
        return prev.map(c => (c.apartmentId === data.apartmentId ? { ...c, ...data } : c));
      }
      return [...prev, data];
    });
    // Ensure apartment isLitigation is true
    setApartments(prev =>
      prev.map(a => (a.id === data.apartmentId ? { ...a, isLitigation: true } : a))
    );
  };

  const removeLitigationCase = (apartmentId: number) => {
    setLitigationCases(prev => prev.filter(c => c.apartmentId !== apartmentId));
    setApartments(prev =>
      prev.map(a => (a.id === apartmentId ? { ...a, isLitigation: false } : a))
    );
  };

  const addAGTask = (task: Omit<AGTask, 'id' | 'createdAt'>) => {
    const newTask: AGTask = {
      ...task,
      id: 'ag-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAGTasks(prev => [...prev, newTask]);
  };

  const updateAGTask = (id: string, updated: Partial<AGTask>) => {
    setAGTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setAGTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            status,
            completionDate: status === 'TERMINE' ? new Date().toISOString().split('T')[0] : t.completionDate
          };
        }
        return t;
      })
    );
  };

  const deleteAGTask = (id: string) => {
    setAGTasks(prev => prev.filter(t => t.id !== id));
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: 'exp-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...e, ...updated } : e)));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addPayment = (paymentData: Omit<PaymentRecord, 'id'>): PaymentRecord => {
    // Check if a payment record already exists for this apt + year + month
    const existing = payments.find(
      p => p.apartmentId === paymentData.apartmentId && p.year === paymentData.year && p.month === paymentData.month
    );

    const newPayment: PaymentRecord = {
      ...paymentData,
      id: existing ? existing.id : 'pay-' + Date.now()
    };

    if (existing) {
      setPayments(prev => prev.map(p => (p.id === existing.id ? newPayment : p)));
    } else {
      setPayments(prev => [newPayment, ...prev]);
    }

    return newPayment;
  };

  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  const addExtraIncome = (income: Omit<ExtraIncome, 'id'>) => {
    const newIncome: ExtraIncome = {
      ...income,
      id: 'inc-' + Date.now()
    };
    setExtraIncomes(prev => [newIncome, ...prev]);
  };

  const deleteExtraIncome = (id: string) => {
    setExtraIncomes(prev => prev.filter(i => i.id !== id));
  };

  // Calculations
  const totalCotisationsEncaissees = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const totalExtraIncomesEncaissees = extraIncomes.reduce((acc, i) => acc + (Number(i.amount) || 0), 0);
  
  const totalEncaissements =
    residenceInfo.initialBankBalance + totalCotisationsEncaissees + totalExtraIncomesEncaissees;

  const totalDepensesOrdinaires = expenses
    .filter(e => e.type === 'ORDINAIRE')
    .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  const totalDepensesTravaux = expenses
    .filter(e => e.type === 'EXCEPTIONNEL_RESERVE')
    .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  const totalDecaissements = totalDepensesOrdinaires + totalDepensesTravaux;

  const currentBankBalance = totalEncaissements - totalDecaissements;

  // Monthly Recovery Rate calculation (Appt 20 is exempt since it's common property rented)
  const taxableApartments = apartments.filter(a => a.monthlyDue > 0);
  const totalTaxable = taxableApartments.length; // usually 19
  const paidThisMonth = taxableApartments.filter(a =>
    payments.some(p => p.apartmentId === a.id && p.year === selectedYear && p.month === selectedMonth)
  ).length;

  const recoveryRateCurrentMonth = totalTaxable > 0 ? Math.round((paidThisMonth / totalTaxable) * 100) : 0;
  const paidCountCurrentMonth = paidThisMonth;
  const unpaidCountCurrentMonth = totalTaxable - paidThisMonth;

  // Budget Alerts: Compare actual expenses for selected month vs monthly budget
  const budgetAlerts = budgetItems.map(b => {
    const expensesForPosteMonth = expenses
      .filter(e => {
        const expDate = new Date(e.date);
        return (
          e.budgetId === b.id &&
          expDate.getFullYear() === selectedYear &&
          expDate.getMonth() + 1 === selectedMonth
        );
      })
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const expensesForPosteYear = expenses
      .filter(e => {
        const expDate = new Date(e.date);
        return e.budgetId === b.id && expDate.getFullYear() === selectedYear;
      })
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const exceededBy = expensesForPosteMonth - b.monthlyBudget;
    const percentage = b.monthlyBudget > 0 ? Math.round((expensesForPosteMonth / b.monthlyBudget) * 100) : 0;

    return {
      budgetId: b.id,
      name: b.name,
      monthlyBudget: b.monthlyBudget,
      monthlyActual: expensesForPosteMonth,
      annualBudget: b.annualBudget,
      annualActual: expensesForPosteYear,
      exceededBy: exceededBy > 0 ? exceededBy : 0,
      percentage
    };
  }).filter(alert => alert.exceededBy > 0);

  const resetToDefaultData = () => {
    localStorage.clear();
    setResidenceInfo(initialResidenceInfo);
    setBudgetItems(initialBudgetItems);
    setApartments(initialApartments);
    setLitigationCases(initialLitigationCases);
    setAGTasks(initialAGTasks);
    setExpenses(initialExpenses);
    setPayments(initialPaymentRecords);
    setExtraIncomes(initialExtraIncomes);
    window.location.reload();
  };

  const exportDataJson = () => {
    const data = {
      exportDate: new Date().toISOString(),
      residenceInfo,
      budgetItems,
      apartments,
      litigationCases,
      agTasks,
      expenses,
      payments,
      extraIncomes
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_residence_adam168_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.residenceInfo && parsed.apartments) {
        setResidenceInfo(parsed.residenceInfo);
        if (parsed.budgetItems) setBudgetItems(parsed.budgetItems);
        if (parsed.apartments) setApartments(parsed.apartments);
        if (parsed.litigationCases) setLitigationCases(parsed.litigationCases);
        if (parsed.agTasks) setAGTasks(parsed.agTasks);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.extraIncomes) setExtraIncomes(parsed.extraIncomes);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Invalid JSON backup', e);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        residenceInfo,
        updateResidenceInfo,
        budgetItems,
        addBudgetItem,
        updateBudgetItem,
        deleteBudgetItem,
        apartments,
        updateApartment,
        litigationCases,
        updateLitigationCase,
        addLitigationCase,
        removeLitigationCase,
        agTasks,
        addAGTask,
        updateAGTask,
        updateTaskStatus,
        deleteAGTask,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        payments,
        addPayment,
        deletePayment,
        extraIncomes,
        addExtraIncome,
        deleteExtraIncome,
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        totalCotisationsEncaissees,
        totalExtraIncomesEncaissees,
        totalEncaissements,
        totalDepensesOrdinaires,
        totalDepensesTravaux,
        totalDecaissements,
        currentBankBalance,
        recoveryRateCurrentMonth,
        paidCountCurrentMonth,
        unpaidCountCurrentMonth,
        budgetAlerts,
        resetToDefaultData,
        exportDataJson,
        importDataJson
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
