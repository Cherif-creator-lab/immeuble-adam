export type PaymentStatus = 'PAID' | 'UNPAID' | 'LITIGATION' | 'EXEMPT';

export type PaymentMethod = 'VIREMENT' | 'CHEQUE' | 'ESPECES' | 'VERSEMENT' | 'PRELEVEMENT';

export type ExpenseType = 'ORDINAIRE' | 'EXCEPTIONNEL_RESERVE';

export type TaskStatus = 'NON_COMMENCE' | 'EN_COURS' | 'TERMINE';

export type TaskPriority = 'BASSE' | 'MOYENNE' | 'HAUTE' | 'URGENT';

export type LitigationStatus = 
  | 'MISE_EN_DEMEURE'
  | 'AVOCAT'
  | 'INJONCTION_PAYER'
  | 'JUGEMENT'
  | 'EXECUTION'
  | 'ACCORD_AMIABLE';

export interface BudgetItem {
  id: string;
  code: string;
  name: string;
  monthlyBudget: number;
  annualBudget: number;
  category: string;
  description?: string;
  isReserve?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size?: number;
  type: string;
  dataUrl: string; // base64 or object URL
  uploadedAt: string;
}

export interface Expense {
  id: string;
  date: string;
  budgetId: string;
  budgetName: string;
  type: ExpenseType;
  amount: number;
  beneficiary: string;
  paymentMethod: PaymentMethod;
  invoiceNumber?: string;
  notes?: string;
  attachments?: Attachment[];
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  apartmentId: number;
  year: number;
  month: number; // 1 to 12
  amount: number;
  paidDate: string;
  paymentMethod: PaymentMethod;
  receiptNumber: string;
  notes?: string;
  collectedBy: string;
}

export interface LitigationCase {
  apartmentId: number;
  ownerName: string;
  status: LitigationStatus;
  unpaidMonthsCount: number;
  totalDebt: number; // in DH
  courtFeesEngaged: number;
  lawyer: string;
  caseReference: string;
  lastActionDate: string;
  nextStep: string;
  notes: string;
}

export interface Apartment {
  id: number;
  number: string;
  floor: number; // 0 = RDC, 1 = 1er, etc.
  ownerName: string;
  phone: string;
  email?: string;
  surfaceM2?: number;
  isRented: boolean;
  tenantName?: string;
  monthlyDue: number; // 300 DH
  isLitigation: boolean;
  notes?: string;
}

export interface AGTask {
  id: string;
  title: string;
  description: string;
  agReference: string;
  category: 'EQUIPEMENT' | 'SECURITE' | 'ELECTRICITE' | 'ENTRETIEN' | 'GESTION' | 'TRAVAUX';
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string;
  provider: string;
  providerPhone?: string;
  estimatedBudget: number; // Devis engagé (DH)
  finalInvoice: number; // Facture finale (DH)
  attachments: Attachment[];
  notes?: string;
  completionDate?: string;
  createdAt: string;
}

export interface ExtraIncome {
  id: string;
  date: string;
  source: string; // e.g. "Loyer Appartement Syndic", "Recouvrement Jugement", etc.
  amount: number;
  paymentMethod: PaymentMethod;
  receiptNumber?: string;
  notes?: string;
}

export interface CoProprieteState {
  name: string;
  address: string;
  city: string;
  syndicPro: string;
  syndicManager: string;
  syndicContact: string;
  councilVP: string;
  councilVPContact: string;
  initialBankBalance: number;
  monthlyDuePerApt: number;
  totalApartments: number;
  bankAccountRib: string;
  bankName: string;
  fiscalYear: string;
  agDate: string;
  syndicApartmentRent?: number;
  monthlyOperatingBudget?: number;
}
