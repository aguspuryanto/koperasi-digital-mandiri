
export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  LOAN_DISBURSEMENT = 'LOAN_DISBURSEMENT',
  LOAN_REPAYMENT = 'LOAN_REPAYMENT'
}

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ACTIVE = 'ACTIVE',
  PAID_OFF = 'PAID_OFF'
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedDate: string;
  balance: number;
  status: 'active' | 'inactive';
}

export interface SavingsTransaction {
  id: string;
  memberId: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
}

export interface Loan {
  id: string;
  memberId: string;
  principal: number;
  interestRate: number; // yearly percentage
  tenureMonths: number;
  status: LoanStatus;
  appliedDate: string;
  approvedDate?: string;
  disbursedDate?: string;
  monthlyInstallment: number;
  remainingBalance: number;
}

export interface CoA {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  details: {
    coaCode: string;
    debit: number;
    credit: number;
  }[];
}

export interface AppState {
  currentUser: {
    id: string;
    role: UserRole;
    name: string;
  } | null;
  members: Member[];
  loans: Loan[];
  savingsTransactions: SavingsTransaction[];
  coa: CoA[];
  journal: JournalEntry[];
}
