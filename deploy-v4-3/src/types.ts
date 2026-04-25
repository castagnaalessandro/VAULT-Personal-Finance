export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: TransactionType;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
}

export interface UserStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface UserProfile {
  name: string;
  theme: 'dark' | 'light';
  onboarded: boolean;
}
