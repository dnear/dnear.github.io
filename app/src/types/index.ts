export type TransactionType = 'income' | 'expense';
export type WalletType = 'cash' | 'digital';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  walletId: string;
  description: string;
  date: string;
  recordedBy: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
}

export interface User {
  name: string;
  email?: string;
  avatar?: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  percentage: number;
}
