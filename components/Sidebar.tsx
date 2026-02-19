import React from 'react';
import { 
  LayoutDashboard, CalendarDays, Plus, BookOpen, GraduationCap, Filter, CreditCard, Settings, 
  LogOut, LogIn, Cloud, CloudOff, User, Sparkles, Target, PlayCircle, Moon, Sun
} from 'lucide-react';
import { View, AIConfig } from '../types';

const SidebarItem = ({ view, currentView, setView, icon: Icon, label }: any) => (
  <button
    onClick={() => setView(view)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      currentView === view 
        ? 'bg-accent text-white shadow-lg shadow-orange-500/20 font-semibold' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} className={currentView === view ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
    <span className="text-sm tracking-wide">{label}</span>
  </button>
);

interface SidebarProps {
    view: View;
    setView: (view: View) => void;
    mobileMenuOpen: boolean;
    setMobileMenuOpen: (open: boolean) => void;
    session: any;
    handleLogout: () => void;
    setShowAuth: (show: boolean) => void;
    aiConfig: AIConfig;
    isDemoMode?: boolean;
    darkMode: boolean;
    toggleDarkMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({ view, setView, mobileMenuOpen, setMobileMenuOpen, session, handleLogout, setShowAuth, aiConfig, isDemoMode, darkMode, toggleDarkMode }) => {
    
    const handleNavigation = (targetView: View) => {
        setView(targetView);
        if (mobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    };

    return (
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary text-slate-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div 
            onClick={() => handleNavigation('dashboard')}
            className="p-6 border-b border-slate-800 flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors"
          >
            <div className="bg-accent p-2 rounded-lg"><Target className="text-white" size={24} /></div>
            <div className="min-w-0">
                <h1 className="text-2xl font-bold text-white tracking-tight italic uppercase">Ping<span className="text-accent">Manager</span></h1>
                <div className="flex items-center gap-1 text-[10px] font-black mt-1 truncate uppercase tracking-widest">
                    {isDemoMode ? (
                        <span className="text-orange-400 animate-pulse flex items-center gap-1"><PlayCircle size={10}/> Mode Démo</span>
                    ) : (
                        session ? <><User size={10} className="text-emerald-400"/> <span className="text-emerald-400 truncate">{session.user.email}</span></> : <><CloudOff size={10} className="text-slate-500"/> <span className="text-slate-500">Local</span></>
                    )}
                </div>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            <SidebarItem view="dashboard" currentView={view} setView={handleNavigation} icon={LayoutDashboard} label="Tableau de bord" />
            <SidebarItem view="calendar" currentView={view} setView={handleNavigation} icon={CalendarDays} label="Planification Annuelle" />
            <SidebarItem view="sessions" currentView={view} setView={handleNavigation} icon={Plus} label="Créer une séance" />
            <SidebarItem view="history" currentView={view} setView={handleNavigation} icon={BookOpen} label="Historique Séances" />
            <SidebarItem view="players" currentView={view} setView={handleNavigation} icon={GraduationCap} label="Joueurs & Progression" />
            <SidebarItem view="library" currentView={view} setView={handleNavigation} icon={Filter} label="Bibliothèque Exos" />
            <SidebarItem view="subscription" currentView={view} setView={handleNavigation} icon={CreditCard} label="Abonnement" />
            <SidebarItem view="settings" currentView={view} setView={handleNavigation} icon={Settings} label="Paramètres" />
          </nav>
          <div className="p-4 border-t border-slate-800 bg-slate-900/20">
             <button 
                onClick={toggleDarkMode}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all mb-2"
             >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span className="text-sm tracking-wide">{darkMode ? 'Mode Clair' : 'Mode Sombre'}</span>
             </button>

             {isDemoMode || session ? (
                <button onClick={() => { handleLogout(); if(mobileMenuOpen) setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 mb-4"><LogOut size={16} /> {isDemoMode ? 'Quitter Démo' : 'Déconnexion'}</button>
             ) : (
                <button onClick={() => { setShowAuth(true); if(mobileMenuOpen) setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-accent hover:bg-accent-hover transition-colors rounded-lg mb-4 shadow-lg"><LogIn size={16} /> Connexion Cloud</button>
             )}
             <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-accent"><Sparkles size={16} /><span className="text-xs font-bold uppercase tracking-wider">AI Powered</span></div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium uppercase tracking-tight">Boosté par {aiConfig.provider === 'openrouter' ? 'OpenRouter' : 'Gemini'}.</p>
             </div>
          </div>
        </div>
      </aside>
    );
});