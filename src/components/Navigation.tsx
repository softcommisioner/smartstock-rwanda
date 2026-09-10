import React from 'react';
import { ShieldCheck, LogOut, Clock, Lock } from 'lucide-react';
import { User, ShiftRegister } from '../types';
import { ActiveShiftBadge } from './ActiveShiftBadge';
import { useLanguage } from '../contexts/LanguageContext';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  currentShift: ShiftRegister | null;
  allUsers: User[];
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  currentShift,
  allUsers,
  isOffline,
  setIsOffline,
  onLogout
}) => {
  const { language, setLanguage, t } = useLanguage();

  if (currentUser.role === 'employee') {
    return (
      <header className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shadow-sm shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                SMARTSTOCK <span className="text-emerald-400 text-xs px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 uppercase font-mono">RWANDA</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ActiveShiftBadge currentUser={currentUser} currentShift={currentShift} allUsers={allUsers} />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 select-none">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <span className="font-extrabold text-white">SMARTSTOCK</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOffline(!isOffline)} className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-full text-xs text-slate-300">
            {isOffline ? t.common.offline : t.common.online}
          </button>
          <button onClick={onLogout} className="px-3 py-1.5 bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-full text-xs font-semibold">
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
};