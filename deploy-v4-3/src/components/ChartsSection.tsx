import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { useStore } from '../store/useStore';

const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#8B5CF6'];

export function ChartsSection() {
  const transactions = useStore((state) => state.transactions);
  const currentView = useStore((state) => state.currentView);
  const isFullView = currentView === 'stats';

  // Area Chart Data: Trend of income vs expenses grouped by last 7 days
  const now = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
  });

  const dataTrend = last7Days.map(date => {
    const dayTransactions = transactions.filter(t => 
      new Date(t.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) === date
    );
    return {
      name: date,
      income: dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      expense: dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    };
  });

  // Calculate expenses distribution for Donut chart
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);

  // Create data for donut (showing each individual expense)
  const dataPie = expenseTransactions.map(t => ({ name: t.name, value: t.amount }));
  
  // Default data if no transactions
  const displayPieData = dataPie.length > 0 ? dataPie : [
    { name: 'Esempio Casa', value: 400 },
    { name: 'Esempio Cibo', value: 300 },
    { name: 'Esempio Tech', value: 300 },
    { name: 'Esempio Altro', value: 200 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 rounded-xl border border-white/10 shadow-2xl">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3 justify-between py-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm font-medium text-white">{entry.name}</span>
              </div>
              <span className="text-sm font-bold">€{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="grid grid-cols-1 gap-6 px-6 lg:px-6 py-2">
      {/* Top Chart: Trend */}
      <div className="glass-card rounded-[28px] p-6 sm:p-8 space-y-6 min-h-[400px]">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold tracking-tight">Andamento Mensile</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Entrate, Uscite e Saldo</p>
        </div>
        
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataTrend}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
                tickFormatter={(value) => `€${value/1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorIncome)" 
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke="#EF4444" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorExpense)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Chart: Expenses Pie */}
      <div className="glass-card rounded-[28px] p-8 flex flex-col min-h-[450px]">
        <div className="flex flex-col gap-1 mb-6">
          <h3 className="text-xl font-bold tracking-tight">Percentuale Uscite</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Ripartizione per categorie</p>
        </div>

        <div className="flex-1 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={displayPieData}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {displayPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Totale</p>
             <p className="text-2xl font-bold">€{totalExpenses > 0 ? totalExpenses.toLocaleString() : '1,200'}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {displayPieData.map((entry, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm font-medium text-gray-300">{entry.name}</span>
              </div>
              <span className="text-sm font-bold">€{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
