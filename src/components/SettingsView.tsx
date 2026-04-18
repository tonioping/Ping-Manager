"use client";

import React, { useState } from 'react';
import { Key, Save, ShieldCheck, Sparkles, ExternalLink, CheckCircle2, AlertCircle, Loader2, RefreshCcw, HelpCircle } from 'lucide-react';
import { suggestExercises } from '../services/geminiService';

interface SettingsViewProps {
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ apiKey, onSaveApiKey }) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTestKey = async () => {
    if (!tempKey.trim()) {
      setTestStatus('error');
      setErrorMessage('Veuillez saisir une clé avant de tester.');
      return;
    }

    setTestStatus('loading');
    try {
      await suggestExercises(tempKey, "Test de connexion", []);
      setTestStatus('success');
      onSaveApiKey(tempKey);
    } catch (err: any) {
      setTestStatus('error');
      setErrorMessage(err.message || 'Clé invalide ou erreur réseau.');
    }
  };

  const handleReset = () => {
    setTempKey('');
    setTestStatus('idle');
    onSaveApiKey('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
          Paramètres <span className="text-accent">IA</span>
        </h2>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
          Gestion de votre assistant Gemini
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
        <div className="flex items-start gap-4 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-800">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl text-indigo-600 shadow-sm">
            <Sparkles size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Obtenir une clé gratuite</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              PingManager utilise Google Gemini. Obtenez une clé API gratuite sur Google AI Studio.
            </p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
            >
              Générer ma clé Gemini <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Key size={16} className="text-accent" />
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clé API Google Gemini</label>
            </div>
            {apiKey && (
              <button onClick={handleReset} className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline flex items-center gap-1">
                <RefreshCcw size={10} /> Effacer la clé
              </button>
            )}
          </div>
          <div className="relative">
            <input 
              type="password" 
              value={tempKey}
              onChange={(e) => {
                setTempKey(e.target.value);
                setTestStatus('idle');
              }}
              placeholder="AIzaSy..."
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-accent/20 pr-32"
            />
            <button 
              onClick={handleTestKey}
              disabled={testStatus === 'loading'}
              className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
            >
              {testStatus === 'loading' ? <Loader2 size={14} className="animate-spin" /> : 'Tester'}
            </button>
          </div>

          {testStatus === 'success' && (
            <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest px-2 animate-fade-in">
              <CheckCircle2 size={14} /> Clé valide et enregistrée !
            </div>
          )}

          {testStatus === 'error' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest px-2">
                <AlertCircle size={14} /> {errorMessage}
              </div>
              <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-900/20">
                <h4 className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <HelpCircle size={12} /> Pourquoi ma clé est rejetée ?
                </h4>
                <ul className="text-[10px] text-rose-500/80 space-y-1 list-disc ml-4 font-bold uppercase tracking-tight">
                  <li>La clé a été mal copiée (vérifiez les espaces)</li>
                  <li>La clé est trop récente (attendez 1 minute)</li>
                  <li>Votre compte Google Cloud a des restrictions</li>
                </ul>
              </div>
            </div>
          )}

          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-2 flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" /> Votre clé est stockée localement dans votre navigateur.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <button 
            onClick={() => onSaveApiKey(tempKey)}
            className="px-12 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <Save size={18}/> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};