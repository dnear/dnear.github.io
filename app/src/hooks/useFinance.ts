import { useLocalStorage } from './useLocalStorage';
import type { Transaction, Category, Wallet, Budget, User, MonthlyData, CategorySummary } from '@/types';
import { useMemo, useCallback } from 'react';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Gaji', type: 'income', icon: 'Wallet', color: '#10B981' },
  { id: '2', name: 'Bonus', type: 'income', icon: 'Gift', color: '#34D399' },
  { id: '3', name: 'Investasi', type: 'income', icon: 'TrendingUp', color: '#6EE7B7' },
  { id: '4', name: 'Makanan', type: 'expense', icon: 'Utensils', color: '#EF4444' },
  { id: '5', name: 'Transportasi', type: 'expense', icon: 'Car', color: '#F87171' },
  { id: '6', name: 'Belanja', type: 'expense', icon: 'ShoppingBag', color: '#FB923C' },
  { id: '7', name: 'Hiburan', type: 'expense', icon: 'Gamepad2', color: '#FBBF24' },
  { id: '8', name: 'Kesehatan', type: 'expense', icon: 'Heart', color: '#EC4899' },
  { id: '9', name: 'Pendidikan', type: 'expense', icon: 'BookOpen', color: '#8B5CF6' },
  { id: '10', name: 'Tagihan', type: 'expense', icon: 'Receipt', color: '#6366F1' },
];

const DEFAULT_WALLETS: Wallet[] = [
  { id: '1', name: 'Dompet Cash', type: 'cash', balance: 0, icon: 'Banknote', color: '#10B981' },
  { id: '2', name: 'Rekening Digital', type: 'digital', balance: 0, icon: 'Smartphone', color: '#3B82F6' },
];

export function useFinance() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', DEFAULT_CATEGORIES);
  const [wallets, setWallets] = useLocalStorage<Wallet[]>('wallets', DEFAULT_WALLETS);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', []);
  const [user, setUser] = useLocalStorage<User>('user', { name: '' });

  // Transaction operations
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Date.now().toString() };
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update wallet balance
    setWallets(prev => prev.map(wallet => {
      if (wallet.id === transaction.walletId) {
        const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
        return { ...wallet, balance: wallet.balance + amount };
      }
      return wallet;
    }));
  }, [setTransactions, setWallets]);

  const deleteTransaction = useCallback((id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      // Revert wallet balance
      setWallets(prev => prev.map(wallet => {
        if (wallet.id === transaction.walletId) {
          const amount = transaction.type === 'income' ? -transaction.amount : transaction.amount;
          return { ...wallet, balance: wallet.balance + amount };
        }
        return wallet;
      }));
    }
  }, [transactions, setTransactions, setWallets]);

  // Category operations
  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: Date.now().toString() };
    setCategories(prev => [...prev, newCategory]);
  }, [setCategories]);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, [setCategories]);

  // Wallet operations
  const addWallet = useCallback((wallet: Omit<Wallet, 'id'>) => {
    const newWallet = { ...wallet, id: Date.now().toString() };
    setWallets(prev => [...prev, newWallet]);
  }, [setWallets]);

  const deleteWallet = useCallback((id: string) => {
    setWallets(prev => prev.filter(w => w.id !== id));
  }, [setWallets]);

  const updateWalletBalance = useCallback((id: string, amount: number) => {
    setWallets(prev => prev.map(wallet => 
      wallet.id === id ? { ...wallet, balance: wallet.balance + amount } : wallet
    ));
  }, [setWallets]);

  // Budget operations
  const addBudget = useCallback((budget: Omit<Budget, 'id'>) => {
    const newBudget = { ...budget, id: Date.now().toString() };
    setBudgets(prev => [...prev, newBudget]);
  }, [setBudgets]);

  const deleteBudget = useCallback((id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  }, [setBudgets]);

  // Calculations
  const totalIncome = useMemo(() => 
    transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalExpense = useMemo(() => 
    transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const balance = useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense]);

  const monthlyData = useMemo((): MonthlyData[] => {
    const data: Record<string, MonthlyData> = {};
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = d.toISOString().slice(0, 7);
      const monthName = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
      data[monthKey] = { month: monthName, income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      const monthKey = t.date.slice(0, 7);
      if (data[monthKey]) {
        if (t.type === 'income') {
          data[monthKey].income += t.amount;
        } else {
          data[monthKey].expense += t.amount;
        }
      }
    });

    return Object.values(data);
  }, [transactions]);

  const expenseByCategory = useMemo((): CategorySummary[] => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const total = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const categoryMap = new Map<string, number>();
    expenseTransactions.forEach(t => {
      const current = categoryMap.get(t.categoryId) || 0;
      categoryMap.set(t.categoryId, current + t.amount);
    });

    return Array.from(categoryMap.entries()).map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        categoryId,
        categoryName: category?.name || 'Unknown',
        categoryColor: category?.color || '#9CA3AF',
        amount,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      };
    }).sort((a, b) => b.amount - a.amount);
  }, [transactions, categories]);

  const getBudgetProgress = useCallback((budget: Budget) => {
    const now = new Date();
    let filteredTransactions = transactions.filter(t => 
      t.type === 'expense' && t.categoryId === budget.categoryId
    );

    if (budget.period === 'monthly') {
      filteredTransactions = filteredTransactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      });
    } else if (budget.period === 'weekly') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= weekAgo);
    } else if (budget.period === 'yearly') {
      filteredTransactions = filteredTransactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getFullYear() === now.getFullYear();
      });
    }

    const spent = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      spent,
      remaining: Math.max(0, budget.amount - spent),
      percentage: Math.min(100, Math.round((spent / budget.amount) * 100)),
    };
  }, [transactions]);

  const getRecentTransactions = useCallback((limit: number = 5) => {
    return transactions.slice(0, limit);
  }, [transactions]);

  return {
    transactions,
    categories,
    wallets,
    budgets,
    user,
    totalIncome,
    totalExpense,
    balance,
    monthlyData,
    expenseByCategory,
    addTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    addWallet,
    deleteWallet,
    updateWalletBalance,
    addBudget,
    deleteBudget,
    setUser,
    getBudgetProgress,
    getRecentTransactions,
  };
}
