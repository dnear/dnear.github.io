import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFinance } from '@/hooks/useFinance';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Printer, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

export function Reports() {
  const { 
    transactions, 
    categories, 
    wallets,
    totalIncome, 
    totalExpense, 
    balance, 
    monthlyData, 
    expenseByCategory 
  } = useFinance();
  
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = reportRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Gagal membuka window print');
      return;
    }

    const currentDate = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Keuangan - MoneyTrack</title>
          <style>
            @media print {
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
              .summary-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
              .income { color: #10B981; }
              .expense { color: #EF4444; }
              .balance { color: #3B82F6; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background-color: #f5f5f5; font-weight: bold; }
              .text-right { text-align: right; }
              .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Laporan Keuangan</h1>
            <p>MoneyTrack - Aplikasi Pencatatan Keuangan</p>
            <p>Dicetak pada: ${currentDate}</p>
          </div>
          
          <div class="summary">
            <div class="summary-card">
              <h3>Total Pemasukan</h3>
              <p class="income" style="font-size: 24px; font-weight: bold;">${formatCurrency(totalIncome)}</p>
            </div>
            <div class="summary-card">
              <h3>Total Pengeluaran</h3>
              <p class="expense" style="font-size: 24px; font-weight: bold;">${formatCurrency(totalExpense)}</p>
            </div>
            <div class="summary-card">
              <h3>Saldo Saat Ini</h3>
              <p class="balance" style="font-size: 24px; font-weight: bold;">${formatCurrency(balance)}</p>
            </div>
          </div>

          <h2>Detail Transaksi</h2>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Keterangan</th>
                <th>Kategori</th>
                <th>Dompet</th>
                <th>Pencatat</th>
                <th class="text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(t => `
                <tr>
                  <td>${formatDate(t.date)}</td>
                  <td>${t.description}</td>
                  <td>${categories.find(c => c.id === t.categoryId)?.name || '-'}</td>
                  <td>${wallets.find(w => w.id === t.walletId)?.name || '-'}</td>
                  <td>${t.recordedBy}</td>
                  <td class="text-right" style="color: ${t.type === 'income' ? '#10B981' : '#EF4444'}">
                    ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>© MoneyTrack - Aplikasi Pencatatan Keuangan Pribadi</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);

    toast.success('Laporan siap untuk dicetak');
  };

  const pieData = expenseByCategory.map(item => ({
    name: item.categoryName,
    value: item.amount,
    color: item.categoryColor,
  }));

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#6366F1', '#14B8A6'];

  return (
    <div className="space-y-6" ref={reportRef}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          Laporan Keuangan
        </h2>
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
          <Printer className="w-4 h-4 mr-2" />
          Cetak Laporan
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Total Pemasukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-rose-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              Total Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-rose-600">{formatCurrency(totalExpense)}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-500" />
              Saldo Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(balance)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Grafik Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(value) => `Rp${value/1000000}M`} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Pemasukan" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Pengeluaran" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-rose-500" />
              Distribusi Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Belum ada data pengeluaran
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rincian Pengeluaran per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenseByCategory.length > 0 ? (
              expenseByCategory.map((item) => (
                <div key={item.categoryId} className="flex items-center gap-4">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: item.categoryColor }} 
                  />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{item.categoryName}</span>
                      <span className="font-bold">{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: item.categoryColor 
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 w-12 text-right">{item.percentage}%</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                Belum ada data pengeluaran
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ringkasan Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Keterangan</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Kategori</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Dompet</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Pencatat</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map(transaction => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{formatDate(transaction.date)}</td>
                    <td className="py-3 px-4">{transaction.description}</td>
                    <td className="py-3 px-4">
                      <span 
                        className="px-2 py-1 rounded-full text-xs text-white"
                        style={{ backgroundColor: categories.find(c => c.id === transaction.categoryId)?.color || '#9CA3AF' }}
                      >
                        {categories.find(c => c.id === transaction.categoryId)?.name || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{wallets.find(w => w.id === transaction.walletId)?.name || '-'}</td>
                    <td className="py-3 px-4">{transaction.recordedBy}</td>
                    <td className={`py-3 px-4 text-right font-medium ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length > 10 && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Menampilkan 10 dari {transactions.length} transaksi
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
