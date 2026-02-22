import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { Navigation, type TabType } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { Budgeting } from '@/components/Budgeting';
import { Reports } from '@/components/Reports';
import { Settings } from '@/components/Settings';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'add':
        return (
          <div className="max-w-2xl mx-auto">
            <TransactionForm onSuccess={() => setActiveTab('list')} />
          </div>
        );
      case 'list':
        return <TransactionList />;
      case 'budget':
        return <Budgeting />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                <strong>MoneyTrack</strong> - Aplikasi Pencatatan Keuangan Pribadi
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Kelola keuangan Anda dengan mudah dan efisien
              </p>
            </div>
            <div className="text-sm text-gray-500">
              © 2024 MoneyTrack. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
