import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface MetricCardProps {
  label: string;
  amount: number;
  icon: any;
  color: string;
  type: 'income' | 'expense' | 'balance';
}

function MetricCard({ label, amount, icon: Icon, color, type }: MetricCardProps) {
  return (
    <div 
      className="glass-card p-5 sm:p-6 rounded-[24px] space-y-4 flex-1 relative overflow-hidden group"
    >
      <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 opacity-20", color)}></div>
      
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{label}</label>
        <div className={cn("p-2 rounded-xl sm:p-2.5", 
          type === 'income' ? "bg-income/20 text-income" : 
          type === 'expense' ? "bg-expense/20 text-expense" : 
          "bg-balance/20 text-balance"
        )}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className={cn(
          "text-2xl sm:text-3xl font-bold tracking-tight",
          type === 'income' ? "text-income" : 
          type === 'expense' ? "text-expense" : 
          "text-balance"
        )}>
          €{amount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>
        <p className="text-[10px] text-gray-600 font-medium">Aggiornato ora</p>
      </div>
    </div>
  );
}

export function MetricsCards() {
  const transactions = useStore((state) => state.transactions);

  const stats = transactions.reduce(
    (acc, tx) => {
      if (tx.type === 'income') acc.income += tx.amount;
      else acc.expense += tx.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = stats.income - stats.expense;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 lg:px-6 py-2">
      <MetricCard 
        label="Entrate" 
        amount={stats.income} 
        icon={TrendingUp} 
        color="bg-income"
        type="income"
      />
      <MetricCard 
        label="Uscite" 
        amount={stats.expense} 
        icon={TrendingDown} 
        color="bg-expense"
        type="expense"
      />
      <MetricCard 
        label="Saldo" 
        amount={balance} 
        icon={Wallet} 
        color="bg-balance"
        type="balance"
      />
    </section>
  );
}
