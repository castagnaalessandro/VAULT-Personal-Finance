import React from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export function RecentTransactions() {
  const transactions = useStore((state) => state.transactions);
  const removeTransaction = useStore((state) => state.removeTransaction);
  const currentView = useStore((state) => state.currentView);
  const [showAll, setShowAll] = React.useState(false);

  const isFullView = currentView === 'transactions';
  const displayedTransactions = (isFullView || showAll) ? transactions : transactions.slice(0, 5);

  return (
    <section className={cn("px-6 lg:px-6 py-4", isFullView && "flex-1")}>
      <div className={cn("glass-card rounded-[28px] p-8 space-y-6", isFullView && "h-full")}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight">
            {isFullView ? 'Storico Movimenti' : 'Movimenti Recenti'}
          </h3>
          {!isFullView && transactions.length > 5 && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
            >
              {showAll ? 'Mostra Meno' : 'Vedi Tutto'}
            </button>
          )}
        </div>

        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <p className="text-sm font-medium text-gray-500">Nessun movimento registrato.</p>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest">Inizia aggiungendo un'entrata o un'uscita</p>
            </div>
          ) : (
            displayedTransactions.map((tx) => (
              <div
                key={tx.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all",
                    tx.type === 'income' ? "bg-income/10 text-income" : "bg-expense/10 text-expense"
                  )}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white leading-none mb-1 truncate">{tx.name}</h4>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                      {new Date(tx.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <span className={cn(
                    "text-lg font-bold tabular-nums",
                    tx.type === 'income' ? "text-income" : "text-expense"
                  )}>
                    {tx.type === 'income' ? '+' : '-'}€{tx.amount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                  </span>
                  <button 
                    onClick={() => removeTransaction(tx.id)}
                    className="sm:opacity-0 group-hover:opacity-100 p-2 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all active:scale-90"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
