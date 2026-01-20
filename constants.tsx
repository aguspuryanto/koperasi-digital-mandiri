
import { Member, CoA, UserRole, LoanStatus, TransactionType } from './types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'MEM001',
    name: 'Budi Santoso',
    email: 'budi@example.com',
    phone: '08123456789',
    address: 'Jakarta Selatan',
    joinedDate: '2023-01-15',
    balance: 5000000,
    status: 'active'
  },
  {
    id: 'MEM002',
    name: 'Siti Aminah',
    email: 'siti@example.com',
    phone: '08129876543',
    address: 'Bandung, Jawa Barat',
    joinedDate: '2023-03-20',
    balance: 12500000,
    status: 'active'
  }
];

export const INITIAL_COA: CoA[] = [
  { code: '111', name: 'Kas/Bank', type: 'Asset', balance: 250000000 },
  { code: '112', name: 'Piutang Pinjaman', type: 'Asset', balance: 0 },
  { code: '211', name: 'Simpanan Sukarela', type: 'Liability', balance: 17500000 },
  { code: '311', name: 'Simpanan Pokok', type: 'Equity', balance: 100000000 },
  { code: '312', name: 'Simpanan Wajib', type: 'Equity', balance: 50000000 },
  { code: '411', name: 'Pendapatan Bunga Pinjaman', type: 'Revenue', balance: 0 },
  { code: '511', name: 'Beban Operasional', type: 'Expense', balance: 0 }
];

export const APP_THEME = {
  primary: 'indigo-600',
  secondary: 'slate-100',
  accent: 'emerald-500',
  danger: 'rose-500'
};
