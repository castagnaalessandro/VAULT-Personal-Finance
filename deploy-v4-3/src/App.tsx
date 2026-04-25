import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricsCards } from './components/MetricsCards';
import { GoalsSection } from './components/GoalsSection';
import { ChartsSection } from './components/ChartsSection';
import { RecentTransactions } from './components/RecentTransactions';
import { RightPanel } from './components/RightPanel';
import { Modal } from './components/Modal';
import { Minus, Plus as PlusIcon, Check } from 'lucide-react';
import { cn } from './lib/utils';
import { getSession, saveSession } from './lib/auth';

export default function App() {
  const onboarded = useStore((state) => state.user.onboarded);
  const theme = useStore((state) => state.user.theme);
  const currentView = useStore((state) => state.currentView);
  const addTransaction = useStore((state) => state.addTransaction);
  const loadUser = useStore((state) => state.loadUser);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [txName, setTxName] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');

  // Ripristina la sessione al caricamento della pagina
  useEffect(() => {
    const sessionUserId = getSession();
    if (sessionUserId) {
      loadUser(sessionUserId);
    }
  }, [loadUser]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Chiamata da WelcomeScreen dopo login/registrazione avvenuta
  const handleLoginSuccess = (userId: string) => {
    saveSession(userId);
    loadUser(userId);
  };

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txName || !txAmount) return;
    addTransaction({ name: txName, amount: parseFloat(txAmount), type: txType });
    setTxName('');
    setTxAmount('');
    setIsAddTxModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      <div className="grain" />

      {!onboarded ? (
        <WelcomeScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="flex min-h-screen relative overflow-x-hidden">
          <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

          <main className="flex-1 xl:pr-72 min-h-screen flex flex-col w-full relative">
            <Header
              onMenuClick={() => setIsMobileMenuOpen(true)}
              onAddClick={() => setIsAddTxModalOpen(true)}
            />

            <div className="flex-1 pb-10">
              {currentView === 'dashboard' && (
                <>
                  <MetricsCards />
                  <GoalsSection />
                  <ChartsSection />
                  <RecentTransactions />
                </>
              )}
              {currentView === 'transactions' && <RecentTransactions />}
              {currentView === 'goals' && <GoalsSection />}
              {currentView === 'stats' && <ChartsSection />}

              <div className="xl:hidden px-6 lg:px-6 mt-10">
                <RightPanel isMobile />
              </div>

              <footer className="pt-10 pb-6 text-center">
                <p className="text-[11px] text-accent font-bold uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity">
                  Created by Alessandro Castagna
                </p>
              </footer>
            </div>
          </main>

          <RightPanel />
        </div>
      )}

      <Modal isOpen={isAddTxModalOpen} onClose={() => setIsAddTxModalOpen(false)} title="Nuovo Movimento">
        <form onSubmit={handleAddTx} className="space-y-6">
          <div className="flex p-1 bg-white/5 rounded-2xl">
            <button type="button" onClick={() => setTxType('expense')}
              className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest",
                txType === 'expense' ? "bg-expense text-white shadow-lg shadow-expense/20" : "text-gray-500 hover:text-white"
              )}>
              <Minus className="w-4 h-4" /> Uscita
            </button>
            <button type="button" onClick={() => setTxType('income')}
              className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest",
                txType === 'income' ? "bg-income text-white shadow-lg shadow-income/20" : "text-gray-500 hover:text-white"
              )}>
              <PlusIcon className="w-4 h-4" /> Entrata
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Descrizione</label>
            <input required type="text" value={txName} onChange={(e) => setTxName(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent/40"
              placeholder="es. Spesa settimanale" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Importo (€)</label>
            <input required type="number" step="0.01" value={txAmount} onChange={(e) => setTxAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent/40"
              placeholder="0.00" />
          </div>
          <button className="w-full bg-accent text-white font-bold py-5 rounded-[20px] shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <Check className="w-5 h-5" /> Conferma
          </button>
        </form>
      </Modal>
    </div>
  );
}
