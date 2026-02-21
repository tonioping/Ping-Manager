import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, Box, Info, ChevronRight } from 'lucide-react';
import { Exercise } from '../types';
import { PHASES } from '../constants';
import { InfoBubble } from './InfoBubble';

interface LibraryViewProps {
  exercises: Exercise[];
}

export const LibraryView: React.FC<LibraryViewProps> = ({ exercises }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           ex.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPhase = selectedPhase === 'all' || ex.phase === selectedPhase;
      return matchesSearch && matchesPhase;
    });
  }, [exercises, searchTerm, selectedPhase]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
            Bibliothèque <span className="text-accent">d'exercices</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
            {exercises.length} fiches techniques disponibles
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un exercice, un thème..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 outline-none font-bold text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setSelectedPhase('all')}
            className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${selectedPhase === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700'}`}
          >
            Tous
          </button>
          {PHASES.map(phase => (
            <button 
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border whitespace-nowrap ${selectedPhase === phase.id ? 'bg-accent text-white border-accent' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700'}`}
            >
              {phase.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredExercises.map(ex => (
          <div key={ex.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${PHASES.find(p => p.id === ex.phase)?.color || 'bg-slate-100'}`}>
                {PHASES.find(p => p.id === ex.phase)?.label}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-black text-accent uppercase tracking-widest">
                <Clock size={12} /> {ex.duration} min
              </div>
            </div>
            
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-3 group-hover:text-accent transition-colors">
              {ex.name}
            </h3>
            
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6 line-clamp-3">
              {ex.description}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Box size={12} /> {ex.material}
              </div>
              <InfoBubble content={ex.description} position="top" />
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="py-20 text-center">
          <div className="inline-flex p-6 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-300 dark:text-slate-700 mb-4">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Aucun résultat</h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Essayez d'autres mots-clés ou filtres.</p>
        </div>
      )}
    </div>
  );
};