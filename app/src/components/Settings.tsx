import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFinance } from '@/hooks/useFinance';
import { toast } from 'sonner';
import { 
  User, 
  Wallet, 
  Tag, 
  Plus, 
  Trash2, 
  Save,
  Banknote,
  Smartphone,
  Palette
} from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const CATEGORY_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981',
  '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
  '#F43F5E', '#78716C'
];

const WALLET_COLORS = [
  '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'
];

export function Settings() {
  const { user, setUser, categories, addCategory, deleteCategory, wallets, addWallet, deleteWallet } = useFinance();
  const [userName, setUserName] = useState(user.name);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');
  const [newCategoryColor, setNewCategoryColor] = useState(CATEGORY_COLORS[0]);
  const [newWalletName, setNewWalletName] = useState('');
  const [newWalletType, setNewWalletType] = useState<'cash' | 'digital'>('cash');
  const [newWalletColor, setNewWalletColor] = useState(WALLET_COLORS[0]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);

  const handleSaveUser = () => {
    setUser({ ...user, name: userName });
    toast.success('Profil berhasil diperbarui');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error('Nama kategori tidak boleh kosong');
      return;
    }

    addCategory({
      name: newCategoryName,
      type: newCategoryType,
      icon: newCategoryType === 'income' ? 'TrendingUp' : 'ShoppingBag',
      color: newCategoryColor,
    });

    toast.success('Kategori berhasil ditambahkan');
    setNewCategoryName('');
    setNewCategoryColor(CATEGORY_COLORS[0]);
    setIsCategoryDialogOpen(false);
  };

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName.trim()) {
      toast.error('Nama dompet tidak boleh kosong');
      return;
    }

    addWallet({
      name: newWalletName,
      type: newWalletType,
      balance: 0,
      icon: newWalletType === 'cash' ? 'Banknote' : 'Smartphone',
      color: newWalletColor,
    });

    toast.success('Dompet berhasil ditambahkan');
    setNewWalletName('');
    setNewWalletColor(WALLET_COLORS[0]);
    setIsWalletDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* User Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Profil Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="userName">Nama Pencatat</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Masukkan nama Anda"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSaveUser} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallets */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-600" />
              Kelola Dompet
            </CardTitle>
            <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Dompet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Dompet Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddWallet} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Nama Dompet</Label>
                    <Input
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                      placeholder="Contoh: Rekening BCA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Jenis Dompet</Label>
                    <RadioGroup 
                      value={newWalletType} 
                      onValueChange={(value) => setNewWalletType(value as 'cash' | 'digital')}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer">
                          <Banknote className="w-4 h-4 text-emerald-500" />
                          Tunai
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="digital" id="digital" />
                        <Label htmlFor="digital" className="flex items-center gap-2 cursor-pointer">
                          <Smartphone className="w-4 h-4 text-blue-500" />
                          Digital
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Warna</Label>
                    <div className="flex flex-wrap gap-2">
                      {WALLET_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewWalletColor(color)}
                          className={`w-8 h-8 rounded-full border-2 ${newWalletColor === color ? 'border-gray-800' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Tambah Dompet
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {wallets.map(wallet => (
              <div 
                key={wallet.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${wallet.color}20` }}
                  >
                    {wallet.type === 'cash' ? (
                      <Banknote className="w-5 h-5" style={{ color: wallet.color }} />
                    ) : (
                      <Smartphone className="w-5 h-5" style={{ color: wallet.color }} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{wallet.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{wallet.type === 'cash' ? 'Tunai' : 'Digital'}</p>
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
                      <AlertDialogTitle>Hapus Dompet?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus dompet ini?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => {
                          deleteWallet(wallet.id);
                          toast.success('Dompet berhasil dihapus');
                        }}
                        className="bg-rose-500 hover:bg-rose-600"
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-600" />
              Kelola Kategori
            </CardTitle>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Kategori
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Kategori Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCategory} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Nama Kategori</Label>
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Contoh: Transportasi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Jenis</Label>
                    <RadioGroup 
                      value={newCategoryType} 
                      onValueChange={(value) => setNewCategoryType(value as 'income' | 'expense')}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="income" id="cat-income" />
                        <Label htmlFor="cat-income" className="cursor-pointer">Pemasukan</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expense" id="cat-expense" />
                        <Label htmlFor="cat-expense" className="cursor-pointer">Pengeluaran</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Warna
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORY_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewCategoryColor(color)}
                          className={`w-8 h-8 rounded-full border-2 ${newCategoryColor === color ? 'border-gray-800' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Tambah Kategori
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Kategori Pemasukan</h4>
              <div className="flex flex-wrap gap-2">
                {categories.filter(c => c.type === 'income').map(category => (
                  <div 
                    key={category.id}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-sm">{category.name}</span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-gray-400 hover:text-rose-500">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kategori ini?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => {
                              deleteCategory(category.id);
                              toast.success('Kategori berhasil dihapus');
                            }}
                            className="bg-rose-500 hover:bg-rose-600"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Kategori Pengeluaran</h4>
              <div className="flex flex-wrap gap-2">
                {categories.filter(c => c.type === 'expense').map(category => (
                  <div 
                    key={category.id}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full"
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-sm">{category.name}</span>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-gray-400 hover:text-rose-500">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kategori ini?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => {
                              deleteCategory(category.id);
                              toast.success('Kategori berhasil dihapus');
                            }}
                            className="bg-rose-500 hover:bg-rose-600"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
