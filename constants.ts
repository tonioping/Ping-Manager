
import { Phase, Exercise, Session, Skill } from './types';

export const PHASES: Phase[] = [
  { id: 'echauffement', label: 'ÉCHAUFFEMENT', duration: 15, color: 'bg-orange-50 border-orange-200 text-black' },
  { id: 'regularite', label: 'RÉGULARITÉ', duration: 20, color: 'bg-sky-50 border-sky-200 text-black' },
  { id: 'technique', label: 'TECHNIQUE', duration: 25, color: 'bg-indigo-50 border-indigo-200 text-black' },
  { id: 'deplacement', label: 'DÉPLACEMENT', duration: 20, color: 'bg-fuchsia-50 border-fuchsia-200 text-black' },
  { id: 'schema', label: 'SCHÉMA DE JEU', duration: 15, color: 'bg-emerald-50 border-emerald-200 text-black' },
  { id: 'matchs', label: 'MATCHS VARIÉS', duration: 15, color: 'bg-rose-50 border-rose-200 text-black' }
];

export const THEMES: string[] = ['Coup Droit (CD)', 'Revers (RV)', 'Topspin', 'Service', 'Poussette', 'Jeu de jambes', 'Bloc', 'Contre-initiative', 'Flip', 'Remise de service', 'Incertitude'];

export const INITIAL_EXERCISES: Exercise[] = [
  // --- ÉCHAUFFEMENT ---
  { id: 'e1', name: 'Échauffement articulaire', phase: 'echauffement', theme: null, duration: 5, description: 'Rotation des poignets, épaules, chevilles, genoux et nuque.', material: 'Aucun' },
  { id: 'e2', name: 'Shadow ping', phase: 'echauffement', theme: 'Jeu de jambes', duration: 5, description: 'Mouvements spécifiques sans balle pour automatiser les placements.', material: 'Raquette' },
  
  // --- PANIER DE BALLES (NOUVEAUX) ---
  { id: 'pb1', name: 'PB - Initiation Topspin CD', phase: 'technique', theme: 'Topspin', duration: 15, description: 'Balles coupées envoyées en CD. Focus sur l\'ouverture de raquette et le frotté bas-vers-haut.', material: 'Panier de balles' },
  { id: 'pb2', name: 'PB - Liaison Pivot / Plein CD', phase: 'deplacement', theme: 'Jeu de jambes', duration: 12, description: 'Alternance rapide : une balle en pivot revers, une balle plein coup droit. Intensité maximale.', material: 'Panier de balles' },
  { id: 'pb3', name: 'PB - Travail du Flip Revers', phase: 'technique', theme: 'Flip', duration: 10, description: 'Balles courtes avec peu d\'effet envoyées en revers. Le joueur doit entrer dans la balle.', material: 'Panier de balles' },
  { id: 'pb4', name: 'PB - Incertitude Milieu / CD', phase: 'technique', theme: 'Incertitude', duration: 15, description: 'Distribution aléatoire entre le ventre (coude) et le plein CD. Travail du petit pas d\'ajustement.', material: 'Panier de balles' },
  { id: 'pb5', name: 'PB - Topspin CD sur balles coupées variées', phase: 'technique', theme: 'Topspin', duration: 15, description: 'Le coach varie la longueur de la coupe (courte, demi-longue, longue).', material: 'Panier de balles' },
  { id: 'pb6', name: 'PB - Cardio V-Inversé', phase: 'deplacement', theme: 'Jeu de jambes', duration: 10, description: 'Distribution : Plein CD -> Milieu -> Plein RV -> Milieu. Rythme soutenu pour le physique.', material: 'Panier de balles' },
  { id: 'pb7', name: 'PB - Prise d\'initiative après remise', phase: 'schema', theme: 'Remise de service', duration: 15, description: 'Balle courte (remise mima), puis balle longue coupée pour démarrage Topspin.', material: 'Panier de balles' },
  { id: 'pb8', name: 'PB - Bloc actif sur Topspin', phase: 'technique', theme: 'Bloc', duration: 12, description: 'Le coach simule des topspins rapides. Le joueur doit tenir le bloc sans reculer.', material: 'Panier de balles' },
  { id: 'pb9', name: 'PB - Contre-Top à mi-distance', phase: 'technique', theme: 'Contre-initiative', duration: 15, description: 'Balles liftées envoyées loin de la table. Le joueur doit re-toper sur la balle.', material: 'Panier de balles' },
  { id: 'pb10', name: 'PB - Séquence Service / Démarrage', phase: 'schema', theme: 'Service', duration: 20, description: 'Le joueur sert réellement, puis le coach envoie une balle panier pour simuler la remise adverse.', material: 'Panier de balles' },

  // --- RÉGULARITÉ ---
  { id: 'r1', name: 'Gammes CD/RV Diagonales', phase: 'regularite', theme: 'Coup Droit (CD)', duration: 15, description: 'Échanges en diagonale pour stabiliser le geste.', material: 'Balles' },
  { id: 'r2', name: 'Le "8" (Papillon)', phase: 'regularite', theme: 'Jeu de jambes', duration: 15, description: 'Joueur A joue ligne droite, Joueur B joue diagonale.', material: 'Balles' },
  
  // --- MATCHS ---
  { id: 'm1', name: 'Match classique', phase: 'matchs', theme: null, duration: 15, description: 'Matchs officiels en 3 sets gagnants.', material: 'Balles' },
  { id: 'm2', name: 'Montée-Descente', phase: 'matchs', theme: null, duration: 20, description: 'Rotation des tables selon les résultats.', material: 'Balles' }
];

export const EMPTY_SESSION: Session = {
    id: 0,
    name: '',
    date: new Date().toISOString().split('T')[0],
    exercises: { echauffement: [], regularite: [], technique: [], deplacement: [], schema: [], matchs: [] }
};

export const CYCLE_TYPES: Record<string, { value: string; label: string; color: string; icon: string }> = {
    'developpement': { value: 'developpement', label: 'Développement', color: 'bg-blue-500 text-white border-blue-200', icon: '📈' },
    'competition': { value: 'competition', label: 'Compétition', color: 'bg-orange-500 text-white border-orange-200', icon: '🏆' },
    'recuperation': { value: 'recuperation', label: 'Récupération', color: 'bg-emerald-500 text-white border-emerald-200', icon: '🔋' },
    'pre-saison': { value: 'pre-saison', label: 'Pré-saison', color: 'bg-purple-500 text-white border-purple-200', icon: '🏋️' }
};

export const DEFAULT_SKILLS: Skill[] = [
    { id: 's1', name: 'Service', category: 'Technique' },
    { id: 's2', name: 'Remise', category: 'Technique' },
    { id: 's3', name: 'Coup Droit', category: 'Technique' },
    { id: 's4', name: 'Revers', category: 'Technique' },
    { id: 's5', name: 'Jeu de jambes', category: 'Physique' },
    { id: 's6', name: 'Tactique', category: 'Mental' },
    { id: 's7', name: 'Mental', category: 'Mental' },
];
