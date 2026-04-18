"use client";

import React from 'react';
import { Key, Save, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

interface SettingsViewProps {
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ apiKey, onSaveApiKey }) => {
  const [tempKey, setTempKey] = React.useState(apiKey);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
          Paramètres <span className="text-accent">IA</span>
        </h2>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
          Configurez votre assistant personnel
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
              PingManager utilise Google Gemini pour générer des exercices. Vous pouvez obtenir une clé API gratuite en quelques secondes sur Google AI Studio.
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
          <div className="flex items-center gap-2 px-2">
            <Key size={16} className="text-accent" />
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clé API Google Gemini</label>
          </div>
          <input 
            type="password" 
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
          />
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-2 flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" /> Votre clé est stockée localement dans votre navigateur.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <button 
            onClick={() => onSaveApiKey(tempKey)}
            className="px-12 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <Save size={18}/> Enregistrer la configuration
          </button>
        </div>
      </div>
    </div>
  );
};