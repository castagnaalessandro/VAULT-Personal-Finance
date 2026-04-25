import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'motion/react';
import { Target, Plus, Trash2, Edit2 } from 'lucide-react';
import { Modal } from './Modal';

export function GoalsSection() {
  const goals = useStore((state) => state.goals);
  const addGoal = useStore((state) => state.addGoal);
  const removeGoal = useStore((state) => state.removeGoal);
  const updateGoal = useStore((state) => state.updateGoal);
  const currentView = useStore((state) => state.currentView);
  
  const [showAll, setShowAll] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [updateAmount, setUpdateAmount] = useState('');

  const isFullView = currentView === 'goals';
  const displayedGoals = (isFullView || showAll) ? goals : goals.slice(0, 2);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName || !newGoalTarget) return;
    addGoal({
      name: newGoalName,
      target: parseFloat(newGoalTarget),
    });
    setNewGoalName('');
    setNewGoalTarget('');
    setIsAddModalOpen(false);
  };

  const handleUpdateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !updateAmount) return;
    updateGoal(selectedGoal.id, parseFloat(updateAmount));
    setUpdateAmount('');
    setIsUpdateModalOpen(false);
  };

  return (
    <section className="px-6 lg:px-6 py-2">
      <div className="glass-card rounded-[28px] p-8 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Target className="text-accent w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Obiettivi di Risparmio</h3>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs font-bold text-accent bg-accent/10 px-4 py-2 rounded-xl hover:bg-accent hover:text-white transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuovo
            </button>
            {goals.length > 2 && (
              <button 
                onClick={() => setShowAll(!showAll)}
                className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-white"
              >
                {showAll ? 'Meno' : 'Tutti'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedGoals.map((goal) => {
            const percentage = Math.min(Math.round((goal.current / goal.target) * 100), 100);
            const remaining = Math.max(goal.target - goal.current, 0);

            return (
              <div key={goal.id} className="space-y-4 group">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{goal.name}</p>
                    <h4 className="text-lg font-bold">€{goal.current.toLocaleString()} <span className="text-sm font-medium text-gray-500">di €{goal.target.toLocaleString()}</span></h4>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-bold text-accent bg-accent/10 py-1 px-3 rounded-full">{percentage}%</span>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => {
                          setSelectedGoal(goal);
                          setUpdateAmount(goal.current.toString());
                          setIsUpdateModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                       >
                         <Edit2 className="w-3.5 h-3.5" />
                       </button>
                       <button 
                        onClick={() => removeGoal(goal.id)}
                        className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                       >
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                    </div>
                  </div>
                </div>

                <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${percentage}%` }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-balance rounded-full"
                  />
                </div>

                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Mancanti: €{remaining.toLocaleString()}</span>
                  <span>Target: €{goal.target.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Nuovo Obiettivo"
      >
        <form onSubmit={handleAddGoal} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nome Obiettivo</label>
            <input 
              required
              type="text" 
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent/40"
              placeholder="es. Vacanze"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target da Raggiungere (€)</label>
            <input 
              required
              type="number" 
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent/40"
              placeholder="es. 5000"
            />
          </div>
          <button className="w-full bg-accent text-white font-bold py-5 rounded-[20px] shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Crea Obiettivo
          </button>
        </form>
      </Modal>

      <Modal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
        title="Aggiorna Progressi"
      >
        <form onSubmit={handleUpdateGoal} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Importo Attuale Accumulato (€)</label>
            <input 
              required
              type="number" 
              value={updateAmount}
              onChange={(e) => setUpdateAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-accent/40"
            />
          </div>
          <button className="w-full bg-accent text-white font-bold py-5 rounded-[20px] shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Salva Progresso
          </button>
        </form>
      </Modal>
    </section>
  );
}
