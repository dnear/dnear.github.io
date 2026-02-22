import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useFinance } from '@/hooks/useFinance';
import { formatCurrency } from '@/lib/utils';
import { Plus, Target, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function Budgeting() {
  const { categories, budgets, addBudget, deleteBudget, getBudgetProgress } = useFinance();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryId || !amount) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Jumlah harus lebih dari 0');
      return;
    }

    addBudget({
      categoryId,
      amount: numAmount,
      period,
      startDate: new Date().toISOString().slice(0, 10),
    });

    toast.success('Budget berhasil ditambahkan!');
    setCategoryId('');
    setAmount('');
    setPeriod('monthly');
    setIsDialogOpen(false);
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'monthly': return 'Bulanan';
      case 'weekly': return 'Mingguan';
      case 'yearly': return 'Tahunan';
      default: return period;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Pengaturan Budget</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Tambah Budget Baru
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Jumlah Budget (Rp)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Periode</Label>
                <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Mingguan</SelectItem>
                    <SelectItem value="monthly">Bulanan</SelectItem>
                    <SelectItem value="yearly">Tahunan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Simpan Budget
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map(budget => {
          const category = categories.find(c => c.id === budget.categoryId);
          const progress = getBudgetProgress(budget);
          const isOverBudget = progress.percentage >= 100;
          const isNearLimit = progress.percentage >= 80 && progress.percentage < 100;

          return (
            <Card key={budget.id} className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${category?.color}20` }}
                    >
                      <Target className="w-5 h-5" style={{ color: category?.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category?.name}</h3>
                      <p className="text-sm text-gray-500">{getPeriodLabel(budget.period)}</p>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-rose-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Budget?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus budget ini?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => {
                            deleteBudget(budget.id);
                            toast.success('Budget berhasil dihapus');
                          }}
                          className="bg-rose-500 hover:bg-rose-600"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Terpakai</span>
                    <span className="font-medium">{formatCurrency(progress.spent)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Budget</span>
                    <span className="font-medium">{formatCurrency(budget.amount)}</span>
                  </div>
                  
                  <div className="relative pt-2">
                    <Progress 
                      value={Math.min(progress.percentage, 100)} 
                      className={`h-3 ${isOverBudget ? 'bg-rose-100' : isNearLimit ? 'bg-amber-100' : 'bg-emerald-100'}`}
                    />
                    <div 
                      className="absolute top-2 left-0 h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(progress.percentage, 100)}%`,
                        backgroundColor: isOverBudget ? '#EF4444' : isNearLimit ? '#F59E0B' : '#10B981'
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium" style={{ 
                      color: isOverBudget ? '#EF4444' : isNearLimit ? '#F59E0B' : '#10B981'
                    }}>
                      {progress.percentage}%
                    </span>
                    <div className="flex items-center gap-1">
                      {isOverBudget ? (
                        <>
                          <AlertCircle className="w-4 h-4 text-rose-500" />
                          <span className="text-sm text-rose-500">Over Budget!</span>
                        </>
                      ) : isNearLimit ? (
                        <>
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span className="text-sm text-amber-500">Hampir mencapai limit</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm text-emerald-500">{formatCurrency(progress.remaining)} tersisa</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <Card className="shadow-md">
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Belum ada budget</h3>
            <p className="text-gray-400 mb-4">Tambahkan budget untuk mengontrol pengeluaran Anda</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Budget
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
