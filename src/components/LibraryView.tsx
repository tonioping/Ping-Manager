"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Clock, Box, Info, ChevronRight, Tag, Wrench, BarChart, Plus, Edit3, Trash2, X, Save } from 'lucide-react';
import { Exercise, PhaseId, ExerciseLevel } from '../types';
import { PHASES, THEMES, LEVELS } from '../constants';
import { InfoBubble } from './InfoBubble';

interface LibraryViewProps {
  exercises: Exercise[];
  onSaveExercise: (exercise: Exercise) => void;
  onDeleteExercise: (id: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ exercises, onSaveExercise, onDeleteExercise }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Chargement initial des filtres depuis le localStorage
  const [selectedPhase, setSelectedPhase] = useState<string>(() => localStorage.getItem('lib_filter_phase') || 'all');
  const [selectedTheme, setSelectedTheme] = useState<string>(() => localStorage.getItem('lib_filter_theme') || 'all');
  const [selectedLevel, setSelectedLevel] = useState<string>(() => localStorage.getItem('lib_filter_level') || 'all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>(() => localStorage.getItem('lib_filter_material') || 'all');
  
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Sauvegarde des filtres lors de chaque changement
  useEffect(() => {
    localStorage.setItem('lib_filter_phase', selectedPhase);
    localStorage.setItem('lib_filter_theme', selectedTheme);
    localStorage.setItem('lib_filter_level', selectedLevel);
    localStorage.setItem('lib_filter_material', selectedMaterial);
  }, [selectedPhase, selectedTheme, selectedLevel, selectedMaterial]);

  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           ex.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPhase = selectedPhase === 'all' || ex.phase === selectedPhase;
      const matchesTheme = selectedTheme === 'all' || ex.theme === selectedTheme;
      const matchesLevel = selectedLevel === 'all' || ex.level === selectedLevel;
      const matchesMaterial = selectedMaterial === 'all' || 
                             (selectedMaterial === 'panier' ? ex.material === 'Panier de balles' : ex.material !== 'Panier de balles');
      
      return matchesSearch && matchesPhase && matchesTheme && matchesLevel && matchesMaterial;
    });
  }, [exercises, searchTerm, selectedPhase, selectedTheme, selectedLevel, selectedMaterial]);

  const handleAdd = () => {
    setEditingExercise({
      id: crypto.randomUUID(),
      name: '',
      phase: 'technique',
      theme: '',
      duration: 15,
      description: '',
      material: 'Balles',
      level: 'intermediaire'
    });
    setShowModal(true);
  };

  const handleEdit = (ex: Exercise) => {
    setEditingExercise({ ...ex });
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Supprimer l'exercice "${name}" ?`)) {
      onDeleteExercise(id);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExercise) {
      onSaveExercise(editingExercise);
      setShowModal(false);
      setEditingExercise(null);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedPhase('all');
    setSelectedTheme('all');
    setSelectedLevel('all');
    setSelectedMaterial('all');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
            Bibliothèque <span className="text-accent">d'exercices</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
            {filteredExercises.length} fiches techniques filtrées sur {exercises.length}
          </p>
        </div>
        <button 
          onClick={handleAdd}
          className="px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
        >
          <Plus size={18} /> Nouvel Exercice
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un exercice, un mot-clé..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-accent/20 outline-none font-bold text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phase de séance</label>
            <select 
              value={selectedPhase} 
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="all">Toutes les phases</option>
              {PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Niveau requis</label>
            <select 
              value={selectedLevel} 
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="all">Tous les niveaux</option>
              {LEVELS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Thème technique</label>
            <select 
              value={selectedTheme} 
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="all">Tous les thèmes</option>
              {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Matériel requis</label>
            <select 
              value={selectedMaterial} 
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
            >
              <option value="all">Tout matériel</option>
              <option value="panier">Panier de balles uniquement</option>
              <option value="standard">Balles standards</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredExercises.map(ex => (
          <div key={ex.id} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col relative">
            <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(ex)} className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-accent rounded-xl transition-all shadow-sm"><Edit3 size={16}/></button>
              <button onClick={() => handleDelete(ex.id, ex.name)} className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl transition-all shadow-sm"><Trash2 size={16}/></button>
            </div>

            <div className="flex justify-between items-start mb-6 pr-16">
              <div className="flex flex-wrap gap-2">
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${PHASES.find(p => p.id === ex.phase)?.color || 'bg-slate-100'}`}>
                  {PHASES.find(p => p.id === ex.phase)?.label}
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${LEVELS.find(l => l.id === ex.level)?.color || 'bg-slate-100'}`}>
                  <BarChart size={10} /> {LEVELS.find(l => l.id === ex.level)?.label}
                </div>
                {ex.theme && (
                  <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Tag size={10} /> {ex.theme}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-black text-accent uppercase tracking-widest bg-orange-50 dark:bg-orange-900/20 px-3 py-1.5 rounded-xl">
                <Clock size={14} /> {ex.duration} min
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 group-hover:text-accent transition-colors">
              {ex.name}
            </h3>
            
            <div className="flex-1 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Info size={12} /> Description & Consignes
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                  {ex.description}
                </p>
              </div>

              <div className="flex items-center gap-6 px-2">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  <Wrench size={14} className="text-accent" /> 
                  <span className="text-slate-400">Matériel :</span> {ex.material}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && editingExercise && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter dark:text-white">
                {exercises.find(e => e.id === editingExercise.id) ? 'Modifier' : 'Nouvel'} Exercice
              </h3>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-2xl transition-all shadow-sm"><X size={24} className="text-slate-400"/></button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nom de l'exercice</label>
                  <input 
                    type="text" 
                    required
                    value={editingExercise.name} 
                    onChange={e => setEditingExercise({...editingExercise, name: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phase</label>
                  <select 
                    value={editingExercise.phase} 
                    onChange={e => setEditingExercise({...editingExercise, phase: e.target.value as PhaseId})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    {PHASES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Niveau</label>
                  <select 
                    value={editingExercise.level} 
                    onChange={e => setEditingExercise({...editingExercise, level: e.target.value as ExerciseLevel})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    {LEVELS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Durée (min)</label>
                  <input 
                    type="number" 
                    required
                    value={editingExercise.duration} 
                    onChange={e => setEditingExercise({...editingExercise, duration: parseInt(e.target.value)})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Description & Consignes</label>
                <textarea 
                  required
                  value={editingExercise.description} 
                  onChange={e => setEditingExercise({...editingExercise, description: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-accent/20 min-h-[120px] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Thème</label>
                  <select 
                    value={editingExercise.theme || ''} 
                    onChange={e => setEditingExercise({...editingExercise, theme: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="">Aucun thème</option>
                    {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Matériel</label>
                  <input 
                    type="text" 
                    value={editingExercise.material} 
                    onChange={e => setEditingExercise({...editingExercise, material: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Ex: Panier de balles, Plots..."
                  />
                </div>
              </div>

              <div className="pt-6 flex justify-center">
                <button type="submit" className="px-12 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                  <Save size={18}/> Enregistrer l'exercice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredExercises.length === 0 && (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
          <div className="inline-flex p-8 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-200 dark:text-slate-700 mb-6">
            <Search size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Aucun exercice trouvé</h3>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Ajustez vos filtres ou créez un nouvel exercice.</p>
          <button 
            onClick={resetFilters}
            className="mt-8 px-8 py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-xs tracking-widest uppercase hover:scale-105 transition-all shadow-xl"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};