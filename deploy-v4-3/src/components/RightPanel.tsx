import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Calendar, Moon, Sun, Euro } from 'lucide-react';
import { cn } from '../lib/utils';

interface RightPanelProps {
  isMobile?: boolean;
}

export function RightPanel({ isMobile }: RightPanelProps) {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const addTransaction = useStore((state) => state.addTransaction);
  const user = useStore((state) => state.user);
  const setProfile = useStore((state) => state.setProfile);
  const transactions = useStore((state) => state.transactions);
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const balance = transactions.reduce((acc, tx) => 
    tx.type === 'income' ? acc + tx.amount : acc - tx.amount, 0
  );

  const dailyTransactions = transactions.filter(tx => {
    const d = new Date(tx.date);
    return d.getDate() === selectedDay && 
           d.getMonth() === new Date().getMonth() && 
           d.getFullYear() === new Date().getFullYear();
  });

  const handleAdd = (type: 'income' | 'expense') => {
    if (!amount || !name) return;
    addTransaction({
      name,
      amount: parseFloat(amount),
      type,
    });
    setAmount('');
    setName('');
  };

  const containerClasses = cn(
    isMobile 
      ? "grid grid-cols-1 md:grid-cols-2 gap-8 w-full" 
      : "fixed right-0 top-0 h-screen w-72 glass border-l border-white/5 p-8 space-y-10 overflow-y-auto hidden xl:block"
  );

  return (
    <aside className={containerClasses}>
      {/* Saldo Attuale */}
      <div className="space-y-4">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Il tuo Saldo</label>
        <div className="p-6 rounded-[24px] bg-gradient-to-br from-balance/20 to-accent/20 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 rounded-lg bg-balance/20 text-balance">
                <Euro className="w-4 h-4" />
             </div>
             <span className="text-xs font-bold text-gray-400 capitalize">Wallet Totale</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">€{balance.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</h2>
        </div>
      </div>

      {/* Mini Calendario - Only show simplified on mobile to save space if needed, but let's keep it */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Calendario</label>
          <Calendar className="w-4 h-4 text-gray-500" />
        </div>
        <div className="glass-card p-5 rounded-[24px] space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-bold capitalize">{new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((d, i) => (
              <span key={`${d}-${i}`} className="text-[9px] font-bold text-gray-600 text-center">{d}</span>
            ))}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const hasTransactions = transactions.some(tx => {
                const d = new Date(tx.date);
                return d.getDate() === day && 
                       d.getMonth() === new Date().getMonth() && 
                       d.getFullYear() === new Date().getFullYear();
              });

              return (
                <button 
                  key={i} 
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-medium transition-all relative",
                    day === selectedDay ? "bg-accent text-white font-bold shadow-lg shadow-accent/20" : "text-gray-500 hover:bg-white/5",
                    day === new Date().getDate() && day !== selectedDay && "border border-accent/40"
                  )}
                >
                  {day}
                  {hasTransactions && day !== selectedDay && (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedDay && dailyTransactions.length > 0 && (
            <div className="pt-4 border-t border-white/5 space-y-2 max-h-32 overflow-y-auto">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Movimenti del {selectedDay}</p>
              {dailyTransactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center text-[10px]">
                  <span className="text-white font-medium truncate max-w-[100px]">{tx.name}</span>
                  <span className={cn(
                    "font-bold",
                    tx.type === 'income' ? "text-income" : "text-expense"
                  )}>
                    {tx.type === 'income' ? '+' : '-'}€{tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Aggiunta Rapida */}
      <div id="quick-add" className="space-y-4">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Aggiunta Rapida</label>
        <div className="glass-card p-6 rounded-[24px] space-y-4">
          <input 
            type="text" 
            placeholder="Nome movimento"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/40 text-white placeholder:text-gray-600"
          />
          <input 
            type="number" 
            placeholder="Importo €"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/40 mb-2 text-white placeholder:text-gray-600"
          />
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleAdd('income')}
              className="bg-income/20 hover:bg-income hover:text-white text-income text-[10px] font-bold py-3.5 rounded-xl transition-all uppercase tracking-widest active:scale-95"
            >
              Entrata
            </button>
            <button 
              onClick={() => handleAdd('expense')}
              className="bg-expense/20 hover:bg-expense hover:text-white text-expense text-[10px] font-bold py-3.5 rounded-xl transition-all uppercase tracking-widest active:scale-95"
            >
              Uscita
            </button>
          </div>
        </div>
      </div>

      {/* Tema */}
      <div className="space-y-4">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Tema</label>
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setProfile({ theme: 'dark' })}
            className={cn(
              "flex-1 flex items-center justify-center py-3 rounded-xl transition-all active:scale-95",
              user.theme === 'dark' ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-gray-500 hover:text-accent/60"
            )}
          >
            <Moon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setProfile({ theme: 'light' })}
            className={cn(
              "flex-1 flex items-center justify-center py-3 rounded-xl transition-all active:scale-95",
              user.theme === 'light' ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-gray-500 hover:text-accent/60"
            )}
          >
            <Sun className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
