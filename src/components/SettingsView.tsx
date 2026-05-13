"use client";

import React, { useState, useEffect } from 'react';
import { Key, Save, ShieldCheck, Sparkles, ExternalLink, CheckCircle2, AlertCircle, Loader2, RefreshCcw, HelpCircle, Globe, Cpu } from 'lucide-react';
import { suggestExercises } from '../services/aiService';
import { AIConfig, AIProvider } from '../types';

interface SettingsViewProps {
  aiConfig: AIConfig;
  onSaveConfig: (config: AIConfig) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ aiConfig, onSaveConfig }) => {
  const [config, setConfig] = useState<AIConfig>(aiConfig);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setConfig(aiConfig);
  }, [aiConfig]);

  const handleTestKey = async () => {
    if (!config.apiKey.trim()) {
      setTestStatus('error');
      setErrorMessage('Veuillez saisir une clé avant de tester.');
      return;
    }

    setTestStatus('loading');
    try {
      await suggestExercises(config, "Test de connexion", []);
      setTestStatus('success');
      onSaveConfig(config);
    } catch (err: any) {
      setTestStatus('error');
      setErrorMessage(err.message || 'Clé invalide ou erreur réseau.');
    }
  };

  const handleReset = () => {
    const newConfig = { provider: 'google' as AIProvider, apiKey: '', model: 'gemini-1.5-flash' };
    setConfig(newConfig);
    setTestStatus('idle');
    onSaveConfig(newConfig);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
          Paramètres <span className="text-accent">IA</span>
        </h2>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
          Gestion de votre assistant intelligent
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
              <Globe size={12} /> Fournisseur
            </label>
            <select 
              value={config.provider}
              onChange={(e) => setConfig({ ...config, provider: e.target.value as AIProvider, model: e.target.value === 'google' ? 'gemini-1.5-flash' : 'google/gemini-flash-1.5' })}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="google">Google AI Studio (Direct)</option>
              <option value="openrouter">OpenRouter (Multi-modèles)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
              <Cpu size={12} /> Modèle
            </label>
            <input 
              type="text"
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              placeholder={config.provider === 'google' ? 'gemini-1.5-flash' : 'google/gemini-flash-1.5'}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-800">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl text-indigo-600 shadow-sm">
            <Sparkles size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {config.provider === 'google' ? 'Clé Google AI Studio' : 'Clé OpenRouter'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {config.provider === 'google' 
                ? "Obtenez une clé gratuite pour Gemini 1.5 Flash." 
                : "Accédez à tous les modèles (Gemini, Claude, GPT) via une seule clé."}
            </p>
            <a 
              href={config.provider === 'google' ? "https://aistudio.google.com/app/apikey" : "https://openrouter.ai/keys"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
            >
              Générer ma clé {config.provider === 'google' ? 'Gemini' : 'OpenRouter'} <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Key size={16} className="text-accent" />
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clé API</label>
            </div>
            {config.apiKey && (
              <button onClick={handleReset} className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline flex items-center gap-1">
                <RefreshCcw size={10} /> Réinitialiser
              </button>
            )}
          </div>
          <div className="relative">
            <input 
              type="password" 
              value={config.apiKey}
              onChange={(e) => {
                setConfig({ ...config, apiKey: e.target.value });
                setTestStatus('idle');
              }}
              placeholder="sk-or-v1-..."
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
              <CheckCircle2 size={14} /> Configuration valide et enregistrée !
            </div>
          )}

          {testStatus === 'error' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest px-2">
                <AlertCircle size={14} /> {errorMessage}
              </div>
            </div>
          )}

          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-2 flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" /> Votre clé est stockée localement dans votre navigateur.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <button 
            onClick={() => onSaveConfig(config)}
            className="px-12 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <Save size={18}/> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};