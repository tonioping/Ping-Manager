import { Phase, Exercise, Session, Skill, Player, Cycle, PlayerEvaluation, PhaseId } from './types';

export const PHASES: Phase[] = [
  { id: 'echauffement', label: 'ÉCHAUFFEMENT', duration: 15, color: 'bg-orange-50 border-orange-200 text-slate-900' },
  { id: 'regularite', label: 'RÉGULARITÉ', duration: 20, color: 'bg-sky-50 border-sky-200 text-slate-900' },
  { id: 'technique', label: 'TECHNIQUE', duration: 25, color: 'bg-indigo-50 border-indigo-200 text-slate-900' },
  { id: 'deplacement', label: 'DÉPLACEMENT', duration: 20, color: 'bg-fuchsia-50 border-fuchsia-200 text-slate-900' },
  { id: 'schema', label: 'SCHÉMA DE JEU', duration: 15, color: 'bg-emerald-50 border-emerald-200 text-slate-900' },
  { id: 'matchs', label: 'MATCHS VARIÉS', duration: 15, color: 'bg-rose-50 border-rose-200 text-slate-900' },
  { id: 'cognitif', label: 'DÉV. COGNITIF', duration: 15, color: 'bg-violet-50 border-violet-200 text-slate-900' }
];

export const THEMES: string[] = ['Coup Droit (CD)', 'Revers (RV)', 'Topspin', 'Service', 'Poussette', 'Jeu de jambes', 'Bloc', 'Contre-initiative', 'Flip', 'Remise de service', 'Incertitude', 'Coordination', 'Vitesse', 'Cognitif'];

export const GROUPS = [
    { id: 'debutant', label: 'Débutant', color: 'bg-emerald-100 text-slate-900 border-emerald-200' },
    { id: 'college', label: 'Collège', color: 'bg-yellow-100 text-slate-900 border-yellow-200' },
    { id: 'perfectionnement', label: 'Perfectionnement', color: 'bg-blue-100 text-slate-900 border-blue-200' },
    { id: 'competition', label: 'Compétition', color: 'bg-purple-100 text-slate-900 border-purple-200' },
    { id: 'adultes-loisir', label: 'Adultes Loisir', color: 'bg-teal-100 text-slate-900 border-teal-200' },
    { id: 'adultes-competition', label: 'Adultes Compétition', color: 'bg-rose-100 text-slate-900 border-rose-200' }
];

const generateExercises = (): Exercise[] => {
  const base: Exercise[] = [
    // --- ÉCHAUFFEMENT (STRICTEMENT HORS TABLE) ---
    { id: 'ech_art', name: 'Réveil Articulaire Complet', phase: 'echauffement', theme: 'Coordination', duration: 5, description: 'Rotation systématique : poignets, coudes, épaules, nuque, bassin, genoux et chevilles. Indispensable avant l\'effort.', material: 'Aucun' },
    { id: 'ech_sha', name: 'Shadow Play : Pas Chassés', phase: 'echauffement', theme: 'Jeu de jambes', duration: 10, description: 'Simuler des coups droits et revers en déplacement latéral sans table. Focus sur l\'équilibre et la vitesse des appuis.', material: 'Raquette' },
    { id: 'ech_lou', name: 'Le Loup Glacé', phase: 'echauffement', theme: 'Vitesse', duration: 8, description: 'Jeu de poursuite dans la salle. Les joueurs doivent se déplacer uniquement en pas chassés de pongiste.', material: 'Aucun' },
    { id: 'ech_cor', name: 'Corde à Sauter Rythmée', phase: 'echauffement', theme: 'Jeu de jambes', duration: 10, description: 'Sauts pieds joints, alternés et montées de genoux. Travaille l\'explosivité des mollets.', material: 'Corde à sauter' },
    { id: 'ech_rea', name: 'Réaction aux Signaux', phase: 'echauffement', theme: 'Vitesse', duration: 7, description: 'Sprint court au signal sonore ou visuel du coach. Travaille le temps de réaction.', material: 'Aucun' },
    { id: 'ech_mir', name: 'Le Miroir Dynamique', phase: 'echauffement', theme: 'Coordination', duration: 8, description: 'Par deux, l\'un impose des déplacements et gestes à vide, l\'autre doit copier instantanément.', material: 'Aucun' },
    { id: 'ech_gain', name: 'Gainage Actif & Fentes', phase: 'echauffement', theme: 'Coordination', duration: 10, description: 'Enchaînement de fentes latérales et gainage dynamique pour préparer le tronc et les jambes.', material: 'Aucun' },
    { id: 'ech_bal', name: 'Jonglage Multi-surfaces', phase: 'echauffement', theme: 'Coordination', duration: 10, description: 'Jongler avec la balle sur la tranche, le manche, et alterner faces CD/RV en marchant.', material: 'Raquette, Balle' },

    // --- DÉVELOPPEMENT COGNITIF ---
    { id: 'cog1', name: 'Lecture de Couleur Flash', phase: 'cognitif', theme: 'Cognitif', duration: 10, description: 'L\'entraîneur montre un carton de couleur pendant le service. Rouge = Remise courte, Bleu = Remise longue agressive.', material: 'Cartons de couleurs' },
    { id: 'cog2', name: 'Incertitude Totale (Panier)', phase: 'cognitif', theme: 'Incertitude', duration: 15, description: 'L\'entraîneur envoie des balles n\'importe où sur la table avec des effets variés.', material: 'Panier de balles' },
    { id: 'cog3', name: 'Calcul Mental & Topspin', phase: 'cognitif', theme: 'Cognitif', duration: 12, description: 'Résoudre une addition simple criée par l\'entraîneur tout en effectuant un topspin CD.', material: 'Balles' },

    // --- RÉGULARITÉ (Style Chinois) ---
    { id: 'chi_reg1', name: 'Le Mur de 100 Balles', phase: 'regularite', theme: 'Coup Droit (CD)', duration: 20, description: 'Échanges en CD diagonale. Objectif : 100 échanges sans faute à haute cadence.', material: 'Balles' },

    // --- TECHNIQUE (Style Chinois) ---
    { id: 'chi_tec1', name: 'Pivot Topspin Précision', phase: 'technique', theme: 'Topspin', duration: 20, description: 'Panier de balles : 1 balle RV, 1 balle Pivot CD sur cibles précises.', material: 'Panier de balles, Cibles' },

    // --- DÉPLACEMENT (Style Chinois) ---
    { id: 'chi_dep1', name: 'Le Triangle de Feu', phase: 'deplacement', theme: 'Jeu de jambes', duration: 15, description: 'Panier de balles : Milieu -> CD -> RV -> Milieu. Rythme effréné.', material: 'Panier de balles' },

    // --- SCHÉMA DE JEU (Style Chinois) ---
    { id: 'chi_sch1', name: 'Transition Court-Long', phase: 'schema', theme: 'Remise de service', duration: 15, description: 'Service court -> Remise courte -> Poussette longue -> Démarrage Topspin.', material: 'Balles' },

    // --- MATCHS (Style Chinois) ---
    { id: 'chi_mat1', name: 'Match à Handicap (8-8)', phase: 'matchs', theme: null, duration: 20, description: 'Les sets commencent à 8-8. Simule la pression de fin de set.', material: 'Balles' }
  ];

  const themes = ['Coup Droit', 'Revers', 'Topspin', 'Service', 'Poussette', 'Jeu de jambes', 'Bloc', 'Flip'];
  const phases: PhaseId[] = ['regularite', 'technique', 'deplacement', 'schema', 'matchs', 'cognitif'];
  
  // On génère le reste des exercices pour les autres phases
  for (let i = 1; i <= 60; i++) {
    const phase = phases[i % phases.length];
    const theme = themes[i % themes.length];
    base.push({
      id: `gen_${i}`,
      name: `${theme} - Exercice ${i}`,
      phase: phase,
      theme: theme,
      duration: 10 + (i % 15),
      description: `Description détaillée de l'exercice ${i} pour travailler le focus sur ${theme}.`,
      material: i % 3 === 0 ? 'Panier de balles' : 'Balles'
    });
  }
  return base;
};

export const INITIAL_EXERCISES: Exercise[] = generateExercises();

export const DEMO_PLAYERS: Player[] = [
    { id: 'demo_1', first_name: 'Lucas', last_name: 'Dubois', level: 'Elite', group: 'competition', hand: 'Droitier', grip: 'Europeenne', blade: 'Butterfly Viscaria', last_equipment_change: '2023-11-15' },
    { id: 'demo_2', first_name: 'Léa', last_name: 'Martin', level: 'Avance', group: 'perfectionnement', hand: 'Gaucher', grip: 'Europeenne', blade: 'Tibhar Samsonov', last_equipment_change: '2024-05-10' },
    { id: 'demo_3', first_name: 'Thomas', last_name: 'Moreau', level: 'Intermediaire', group: 'college', hand: 'Droitier', grip: 'Porte-Plume', blade: 'Stiga Clipper', last_equipment_change: '2023-01-20' },
];

export const DEMO_EVALS: PlayerEvaluation[] = [
    { player_id: 'demo_1', skill_id: 's1', score: 5, date: '2024-05-20' },
    { player_id: 'demo_1', skill_id: 's3', score: 4, date: '2024-05-20' },
    { player_id: 'demo_1', skill_id: 's5', score: 5, date: '2024-05-20' },
    { player_id: 'demo_1', skill_id: 's1', score: 4, date: '2024-04-15' },
    { player_id: 'demo_1', skill_id: 's3', score: 3, date: '2024-04-15' },
    { player_id: 'demo_1', skill_id: 's5', score: 4, date: '2024-04-15' },
    { player_id: 'demo_2', skill_id: 's4', score: 4, date: '2024-05-20' },
    { player_id: 'demo_2', skill_id: 's7', score: 2, date: '2024-05-20' },
];

export const DEMO_SESSIONS: Session[] = [
    {
        id: 9991,
        name: "Perfectionnement - Topspin Intensif",
        date: new Date().toISOString().split('T')[0],
        exercises: {
            echauffement: [INITIAL_EXERCISES[0]],
            regularite: [INITIAL_EXERCISES[8]],
            technique: [INITIAL_EXERCISES[9]],
            deplacement: [INITIAL_EXERCISES[10]],
            schema: [INITIAL_EXERCISES[11]],
            matchs: [INITIAL_EXERCISES[12]],
            cognitif: []
        }
    }
];

export const DEMO_CYCLES: Cycle[] = [
    {
        id: 8881,
        name: "Préparation Championnat",
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'competition',
        group: 'competition',
        objectives: 'Gagner en régularité sur les premières balles d\'attaque.',
        weeks: [
            { weekNumber: 1, theme: 'Volume de jeu', notes: 'Beaucoup de régularité diagonale', sessionId: 9991, sessionName: "Séance Vol. 1" },
            { weekNumber: 2, theme: 'Jeu de jambes', notes: 'Déplacements latéraux rapides', sessionId: 9991, sessionName: "Séance Vol. 2" },
            { weekNumber: 3, theme: 'Tactique Service', notes: 'Zones courtes et rentrantes' },
            { weekNumber: 4, theme: 'Matchs stress', notes: 'Gestion des points décisifs' },
        ]
    }
];

export const EMPTY_SESSION: Session = {
    id: 0,
    name: '',
    date: new Date().toISOString().split('T')[0],
    exercises: { echauffement: [], regularite: [], technique: [], deplacement: [], schema: [], matchs: [], cognitif: [] }
};

export const CYCLE_TYPES: Record<string, { value: string; label: string; color: string; icon: string }> = {
    'developpement': { value: 'developpement', label: 'Développement', color: 'bg-blue-100 text-slate-900 border-blue-200', icon: '📈' },
    'competition': { value: 'competition', label: 'Compétition', color: 'bg-orange-100 text-slate-900 border-orange-200', icon: '🏆' },
    'recuperation': { value: 'recuperation', label: 'Récupération', color: 'bg-emerald-100 text-slate-900 border-emerald-200', icon: '🔋' },
    'pre-saison': { value: 'pre-saison', label: 'Pré-saison', color: 'bg-purple-100 text-slate-900 border-purple-200', icon: '🏋️' }
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