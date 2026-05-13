import React from 'react';
import { 
  LayoutDashboard, CalendarDays, Plus, BookOpen, GraduationCap, Filter, Settings, 
  LogOut, LogIn, CloudOff, User, Sparkles, Target, PlayCircle, Moon, Sun, AlertCircle
} from 'lucide-react';
import { View, AIConfig } from '../types';

const SidebarItem = ({ view, currentView, setView, icon: Icon, label }: any) => (
  <button
    onClick={() => setView(view)}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 group relative ${
      currentView === view 
        ? 'text-white font-bold' 
        : 'text-slate-500 hover:text-slate-200'
    }`}
  >
    {currentView === view && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full shadow-neon-purple"></div>
    )}
    <Icon size={22} className={currentView === view ? 'text-accent' : 'group-hover:scale-110 transition-transform'} />
    <span className="text-[13px] tracking-wide uppercase font-bold">{label}</span>
  </button>
);

export const Sidebar: React.FC<any> = React.memo(({ 
  view, setView, mobileMenuOpen, setMobileMenuOpen, session, 
  handleLogout, setShowAuth, isDemoMode, darkMode, 
  toggleDarkMode, hasAiKey 
}) => {
    const handleNavigation = (targetView: View) => {
        setView(targetView);
        if (mobileMenuOpen) setMobileMenuOpen(false);
    };

    return (
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#02040a] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div onClick={() => handleNavigation('dashboard')} className="p-8 mb-4 flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-neon-purple">
                <span className="text-white font-black text-xl">P</span>
            </div>
            <div className="min-w-0">
                <h1 className="text-xl font-black text-white tracking-tighter italic uppercase">Ping<span className="text-slate-400">Manager</span></h1>
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] truncate">
                    {session?.user?.email || 'JSADSARL@GMAIL.COM'}
                </p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
            <SidebarItem view="dashboard" currentView={view} setView={handleNavigation} icon={LayoutDashboard} label="Tableau de bord" />
            <SidebarItem view="calendar" currentView={view} setView={handleNavigation} icon={CalendarDays} label="Planification Annuelle" />
            <SidebarItem view="sessions" currentView={view} setView={handleNavigation} icon={Plus} label="Créer une séance" />
            <SidebarItem view="history" currentView={view} setView={handleNavigation} icon={BookOpen} label="Historique Séances" />
            <SidebarItem view="library" currentView={view} setView={handleNavigation} icon={Filter} label="Bibliothèque Exos" />
            <SidebarItem view="players" currentView={view} setView={handleNavigation} icon={GraduationCap} label="Joueurs & Progression" />
            <SidebarItem view="settings" currentView={view} setView={handleNavigation} icon={Settings} label="Paramètres" />
          </nav>

          <div className="p-6 space-y-4">
             <div className="flex flex-col gap-2">
                <button onClick={toggleDarkMode} className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest">
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    <span>{darkMode ? 'Mode Clair' : 'Mode Sombre'}</span>
                </button>
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest">
                    <LogOut size={18} />
                    <span>Déconnexion</span>
                </button>
             </div>

             <div className="p-5 rounded-[1.5rem] bg-[#0a0f24] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent/50"></div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${hasAiKey ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`}></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Assistant IA</span>
                </div>
                <p className="text-[9px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
                  {hasAiKey ? 'Prêt à vous aider.' : 'Clé API à configurer dans les paramètres.'}
                </p>
             </div>
          </div>
        </div>
      </aside>
    );
});