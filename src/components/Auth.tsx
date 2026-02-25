import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Loader2, AlertCircle, PlayCircle, Sparkles } from 'lucide-react';

export default function Auth({ onAuthSuccess, launchDemoMode }: { onAuthSuccess: () => void, launchDemoMode: () => void }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabase) {
        setError("Supabase n'est pas configuré.");
        setLoading(false);
        return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Inscription réussie ! Connectez-vous.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuthSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl max-w-md w-full border border-slate-100 animate-fade-in relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex p-4 bg-slate-900 rounded-[1.5rem] mb-4 rotate-3 shadow-xl">
             <Sparkles className="text-orange-500" size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase italic">
            Ping<span className="text-orange-500">Manager</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">L'assistant IA des entraîneurs</p>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2 border border-red-100">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white outline-none text-slate-900 transition-all font-medium" placeholder="coach@exemple.com" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Mot de passe</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:bg-white outline-none text-slate-900 transition-all font-medium" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />)}
            {isSignUp ? "Créer mon compte" : "Se connecter"}
          </button>
        </form>
        <div className="mt-6 text-center space-y-6 relative z-10">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-[10px] text-slate-400 hover:text-orange-500 font-black uppercase tracking-widest transition-colors">
            {isSignUp ? "Déjà un compte ? Se connecter" : "Pas encore de compte ? S'inscrire"}
          </button>
          <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
             <button onClick={launchDemoMode} className="w-full py-4 bg-white border-2 border-orange-500 text-orange-500 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-orange-50 transition-all flex items-center justify-center gap-3 shadow-sm hover:scale-[1.02]">
                 <PlayCircle size={18} /> Explorer en mode Démo
             </button>
             <button onClick={() => onAuthSuccess()} className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">
                 Continuer hors ligne (Local)
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}