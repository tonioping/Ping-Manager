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
    // --- DÉVELOPPEMENT COGNITIF (Nouveau) ---
    { id: 'cog1', name: 'Lecture de Couleur Flash', phase: 'cognitif', theme: 'Cognitif', duration: 10, description: 'L\'entraîneur montre un carton de couleur pendant le service. Rouge = Remise courte, Bleu = Remise longue agressive. Force la prise de décision ultra-rapide.', material: 'Cartons de couleurs' },
    { id: 'cog2', name: 'Incertitude Totale (Panier)', phase: 'cognitif', theme: 'Incertitude', duration: 15, description: 'L\'entraîneur envoie des balles n\'importe où sur la table avec des effets variés. Le joueur doit identifier l\'effet et la zone en moins de 0.2s.', material: 'Panier de balles' },
    { id: 'cog3', name: 'Calcul Mental & Topspin', phase: 'cognitif', theme: 'Cognitif', duration: 12, description: 'Le joueur doit résoudre une addition simple criée par l\'entraîneur tout en effectuant un topspin CD. Travaille la dissociation et la concentration sous effort.', material: 'Balles' },

    // --- ÉCHAUFFEMENT (Style Chinois) ---
    { id: 'chi_ech1', name: 'Shadow Play Intensif', phase: 'echauffement', theme: 'Jeu de jambes', duration: 10, description: 'Déplacements à vide (sans balle) à vitesse maximale. 30s effort / 30s repos. Focus sur la position basse et l\'explosivité des appuis.', material: 'Aucun' },
    
    // --- RÉGULARITÉ (Style Chinois) ---
    { id: 'chi_reg1', name: 'Le Mur de 100 Balles', phase: 'regularite', theme: 'Coup Droit (CD)', duration: 20, description: 'Échanges en CD diagonale. L\'objectif est d\'atteindre 100 échanges sans faute à une cadence de 80 balles/minute. Si faute, on recommence à zéro.', material: 'Balles' },

    // --- TECHNIQUE (Style Chinois) ---
    { id: 'chi_tec1', name: 'Pivot Topspin Précision', phase: 'technique', theme: 'Topspin', duration: 20, description: 'Panier de balles : 1 balle RV, 1 balle Pivot CD. L\'entraîneur exige que chaque balle touche une cible de 10x10cm dans le coin opposé.', material: 'Panier de balles, Cibles' },

    // --- DÉPLACEMENT (Style Chinois) ---
    { id: 'chi_dep1', name: 'Le Triangle de Feu', phase: 'deplacement', theme: 'Jeu de jambes', duration: 15, description: 'Panier de balles : Milieu -> CD -> RV -> Milieu. Rythme effréné. Le joueur doit rester parfaitement gainé malgré la fatigue.', material: 'Panier de balles' },

    // --- SCHÉMA DE JEU (Style Chinois) ---
    { id: 'chi_sch1', name: 'Transition Court-Long', phase: 'schema', theme: 'Remise de service', duration: 15, description: 'Service court coupé -> Remise courte -> Poussette longue -> Démarrage Topspin. Travaille la transition entre le jeu de table et le jeu lancé.', material: 'Balles' },

    // --- MATCHS (Style Chinois) ---
    { id: 'chi_mat1', name: 'Match à Handicap (8-8)', phase: 'matchs', theme: null, duration: 20, description: 'Les sets commencent à 8-8. Chaque point est crucial. Simule la pression de fin de set pour forcer la lucidité tactique.', material: 'Balles' },

    // Échauffements Enfants existants
    { id: 'kid1', name: 'Le Miroir Magique', phase: 'echauffement', theme: 'Jeu de jambes', duration: 10, description: 'Les enfants sont par deux face à face. L\'un est le meneur et fait des pas chassés, l\'autre doit l\'imiter exactement comme un miroir.', material: 'Aucun' },
    { id: 'kid2', name: 'Relais Équilibre', phase: 'echauffement', theme: 'Coordination', duration: 12, description: 'Course de relais par équipe. Chaque enfant doit parcourir une distance avec une balle en équilibre sur sa raquette sans la faire tomber.', material: 'Raquettes, Balles, Plots' },
    { id: 'kid3', name: 'La Chasse aux Trésors', phase: 'echauffement', theme: 'Vitesse', duration: 8, description: 'Disperser 50 balles au sol. Au signal, les enfants doivent ramasser le plus de balles possible et les ramener dans leur camp une par une.', material: 'Balles, Paniers' },
    { id: 'kid4', name: 'Jacques a dit (Version Ping)', phase: 'echauffement', theme: 'Coordination', duration: 10, description: 'L\'entraîneur dit "Jacques a dit : Position de base", "Coup droit", "Revers". Les enfants s\'exécutent uniquement si "Jacques a dit" est prononcé.', material: 'Raquettes' },
    { id: 'kid5', name: 'Le Slalom Géant', phase: 'echauffement', theme: 'Jeu de jambes', duration: 10, description: 'Parcours de plots en pas chassés le plus vite possible, en gardant la raquette devant soi en position de garde.', material: 'Plots' },
    { id: 'kid6', name: 'Le Chasseur de Balles', phase: 'echauffement', theme: 'Vitesse', duration: 10, description: 'L\'entraîneur lance des balles à la main dans différentes directions. L\'enfant doit essayer de les attraper avant le deuxième rebond.', material: 'Balles' },
    { id: 'kid7', name: 'La Rivière aux Crocodiles', phase: 'echauffement', theme: 'Coordination', duration: 12, description: 'Traverser la salle en marchant sur des "pierres" (plots) sans toucher le sol, tout en faisant rebondir la balle sur sa raquette.', material: 'Plots, Raquettes, Balles' },
    { id: 'kid8', name: 'Le Chef d\'Orchestre', phase: 'echauffement', theme: 'Coordination', duration: 8, description: 'Un enfant fait des gestes techniques (CD, RV, Pivot) et les autres doivent l\'imiter le plus vite possible. On change de chef toutes les 2 minutes.', material: 'Raquettes' },
    { id: 'kid9', name: 'Le Bowling Ping', phase: 'echauffement', theme: 'Coordination', duration: 15, description: 'Placer des gobelets ou des plots sur la table. L\'enfant doit les renverser en lançant la balle avec sa raquette (coup droit ou revers).', material: 'Gobelets/Plots, Balles, Raquettes' },
    { id: 'kid10', name: 'La Course aux Couleurs', phase: 'echauffement', theme: 'Vitesse', duration: 10, description: 'L\'entraîneur annonce une couleur. Les enfants doivent courir toucher le plot de cette couleur le plus vite possible et revenir en position de base.', material: 'Plots de couleurs différentes' }
  ];

  const themes = ['Coup Droit', 'Revers', 'Topspin', 'Service', 'Poussette', 'Jeu de jambes', 'Bloc', 'Flip'];
  const phases: PhaseId[] = ['echauffement', 'regularite', 'technique', 'deplacement', 'schema', 'matchs', 'cognitif'];
  
  for (let i = 1; i <= 70; i++) {
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
            regularite: [INITIAL_EXERCISES[4]],
            technique: [INITIAL_EXERCISES[2]],
            deplacement: [INITIAL_EXERCISES[3]],
            schema: [INITIAL_EXERCISES[5]],
            matchs: [INITIAL_EXERCISES[6]],
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