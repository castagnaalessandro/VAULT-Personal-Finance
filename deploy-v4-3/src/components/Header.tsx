import React from 'react';
import { Plus, Menu } from 'lucide-react';
import { useStore } from '../store/useStore';

interface HeaderProps {
  onMenuClick: () => void;
  onAddClick: () => void;
}

export function Header({ onMenuClick, onAddClick }: HeaderProps) {
  const user = useStore((state) => state.user);

  return (
    <header className="flex items-center justify-between p-6 lg:px-6 lg:py-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden w-12 h-12 glass rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-none mb-2">
            Benvenuto, <span className="text-white">{user.name}</span>
          </h2>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Overview</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onAddClick}
          className="bg-accent hover:bg-accent/90 text-white text-[10px] sm:text-xs font-bold px-4 sm:px-6 py-3 rounded-2xl transition-all shadow-lg shadow-accent/20 uppercase tracking-widest flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuovo Movimento</span>
          <span className="sm:hidden">Nuovo</span>
        </button>
      </div>
    </header>
  );
}
