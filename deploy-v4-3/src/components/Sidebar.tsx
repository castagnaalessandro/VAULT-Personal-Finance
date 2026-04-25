import React from 'react';
import { LayoutDashboard, History, Target, PieChart, LogOut, X, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import { getInitials } from '../lib/auth';
import { Modal } from './Modal';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: History, label: 'Movimenti', id: 'transactions' },
  { icon: Target, label: 'Obiettivi', id: 'goals' },
  { icon: PieChart, label: 'Statistiche', id: 'stats' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const currentView = useStore((state) => state.currentView);
  const setCurrentView = useStore((state) => state.setCurrentView);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const isSyncing = useStore((state) => state.isSyncing);
  const [showCreatorModal, setShowCreatorModal] = React.useState(false);
  const [showStarModal, setShowStarModal] = React.useState(false);

  const sidebarClasses = cn(
    "fixed left-0 top-0 h-screen w-60 glass border-r border-white/5 flex flex-col p-6 z-50 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex",
    isOpen ? "translate-x-0" : "-translate-x-full"
  );

  const initials = user.uid ? getInitials(user.uid) : 'AC';

  return (
    <>
      <aside className={sidebarClasses}>
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowStarModal(true)}
                className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center hover:bg-accent/30 transition-colors"
              >
                <Star className="text-accent w-6 h-6 fill-accent/40" />
              </button>
              <span className="font-display font-bold text-xl tracking-tight uppercase">Vault</span>
              
              <button 
                onClick={() => setShowCreatorModal(true)}
                className="flex w-10 h-10 rounded-xl bg-accent items-center justify-center text-white font-black text-[10px] shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all border border-white/10 ml-2 shrink-0"
              >
                {initials}
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="lg:hidden p-2 text-gray-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as any);
                if (onClose) onClose();
              }}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group",
                currentView === item.id 
                  ? "bg-accent/10 text-accent font-medium" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                currentView === item.id ? "text-accent" : "text-gray-400 group-hover:text-white"
              )} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none">{user.name}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isSyncing ? "bg-accent animate-ping" : "bg-balance animate-pulse"
                )} />
                <span className="text-[9px] text-gray-500 uppercase text-left tracking-wider font-bold">
                  {isSyncing ? 'Syncing...' : 'Cloud Synced'}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all text-left"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      <Modal 
        isOpen={showStarModal} 
        onClose={() => setShowStarModal(false)}
        title="Vault Experience"
      >
        <div className="flex flex-col items-center text-center p-6 space-y-8">
          <div className="w-20 h-20 rounded-3xl bg-accent/20 flex items-center justify-center shadow-2xl shadow-accent/20">
            <Star className="text-accent w-10 h-10 fill-accent/40" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tight italic">Personal Finance Lifestyle</h2>
            <p className="text-gray-400 font-medium leading-relaxed">
              Risparmi, budget, obiettivi e controllo totale delle tue finanze.
            </p>
          </div>
          <button 
            onClick={() => setShowStarModal(false)}
            className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20"
          >
            Capito!
          </button>
        </div>
      </Modal>

      <Modal 
        isOpen={showCreatorModal} 
        onClose={() => setShowCreatorModal(false)}
        title="Info"
      >
        <div className="flex flex-col items-center text-center p-6 space-y-8">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
            <Star className="text-accent w-8 h-8 fill-accent/40" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black mb-4">⭐</h2>
            <p className="text-xl font-black uppercase tracking-tight">CREATED BY ALESSANDRO CASTAGNA</p>
            <p className="text-gray-500 font-medium uppercase tracking-widest text-[10px]">Secure Personal Finance Experience</p>
          </div>
          <button 
            onClick={() => setShowCreatorModal(false)}
            className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20"
          >
            Chiudi
          </button>
        </div>
      </Modal>
    </>
  );
}
