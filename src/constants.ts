import { Phase, Exercise, Session, Skill, Player, Cycle, PlayerEvaluation, PhaseId, ExerciseLevel } from './types';

export const PHASES: Phase[] = [
  { id: 'echauffement', label: 'ÉCHAUFFEMENT', duration: 15, color: 'bg-orange-50 border-orange-200 text-slate-900' },
  { id: 'regularite', label: 'RÉGULARITÉ', duration: 20, color: 'bg-sky-50 border-sky-200 text-slate-900' },
  { id: 'technique', label: 'TECHNIQUE', duration: 25, color: 'bg-indigo-50 border-indigo-200 text-slate-900' },
  { id: 'panier', label: 'PANIER DE BALLES', duration: 20, color: 'bg-violet-100 border-violet-300 text-slate-900' },
  { id: 'deplacement', label: 'DÉPLACEMENT', duration: 20, color: 'bg-fuchsia-50 border-fuchsia-200 text-slate-900' },
  { id: 'schema', label: 'SCHÉMA DE JEU', duration: 15, color: 'bg-emerald-50 border-emerald-200 text-slate-900' },
  { id: 'matchs', label: 'MATCHS VARIÉS', duration: 15, color: 'bg-rose-50 border-rose-200 text-slate-900' },
  { id: 'cognitif', label: 'DÉV. COGNITIF', duration: 15, color: 'bg-violet-50 border-violet-200 text-slate-900' },
  { id: 'retour-au-calme', label: 'RETOUR AU CALME', duration: 10, color: 'bg-slate-50 border-slate-200 text-slate-900' }
];

export const LEVELS: { id: ExerciseLevel; label: string; color: string }[] = [
  { id: 'debutant', label: 'Débutant', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'intermediaire', label: 'Intermédiaire', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'avance', label: 'Avancé', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'pro', label: 'Pro', color: 'bg-rose-100 text-rose-700 border-rose-200' }
];

export const THEMES: string[] = ['Coup Droit (CD)', 'Revers (RV)', 'Topspin', 'Service', 'Poussette', 'Jeu de jambes', 'Bloc', 'Contre-initiative', 'Flip', 'Remise de service', 'Incertitude', 'Coordination', 'Vitesse', 'Cognitif', 'Habileté', 'Réflexes', 'Motricité'];

export const GROUPS = [
    { id: 'debutant', label: 'Débutant', color: 'bg-emerald-100 text-slate-900 border-emerald-200' },
    { id: 'college', label: 'Collège', color: 'bg-yellow-100 text-slate-900 border-yellow-200' },
    { id: 'perfectionnement', label: 'Perfectionnement', color: 'bg-blue-100 text-slate-900 border-blue-200' },
    { id: 'competition', label: 'Compétition', color: 'bg-purple-100 text-slate-900 border-purple-200' },
    { id: 'adultes-loisir', label: 'Adultes Loisir', color: 'bg-teal-100 text-slate-900 border-teal-200' },
    { id: 'adultes-competition', label: 'Adultes Compétition', color: 'bg-rose-100 text-slate-900 border-rose-200' }
];

const generateExercises = (): Exercise[] => {
  return [
    // --- ÉCHAUFFEMENT ---
    { id: 'ch_e1', name: "Shadow Play - 8 Directions", phase: "echauffement", theme: "Mobilisation", duration: 10, description: "Sans balle, reproduire les gestes de base (CD, RV, Pivot) en se déplaçant sur 8 points cardinaux.", material: "Aucun", level: 'intermediaire' },
    { id: 'ch_e2', name: "Réveil Articulaire Dynamique", phase: "echauffement", theme: "Mobilisation", duration: 5, description: "Rotations rapides des poignets, coudes et épaules. Sauts sur place.", material: "Aucun", level: 'debutant' },
    { id: 'ch_e3', name: "Coordination Échelle de Rythme", phase: "echauffement", theme: "Motricité", duration: 10, description: "Travail d'appuis rapides au sol. Fréquence maximale des pieds.", material: "Échelle de rythme", level: 'intermediaire' },
    { id: 'ch_beg_e1', name: "L'Équilibre de la Perle", phase: "echauffement", theme: "Habileté", duration: 10, description: "Débutant : Se déplacer en maintenant la balle en équilibre sur la raquette.", material: "Raquette et Balle", level: 'debutant' },
    
    // --- PANIER DE BALLES (PRÉCISION & DÉFIS) ---
    { id: 'pb_lud1', name: "Le Balayage des Angles", phase: "panier", theme: "Placement", duration: 15, description: "Distribution alternée plein CD / plein RV. Le joueur doit viser les 'petits côtés' (angles sortants). 2 pts par angle touché, 0 pt si la balle passe au milieu.", material: "Panier de balles", level: 'intermediaire' },
    { id: 'pb_lud2', name: "Le Mur du Coude", phase: "panier", theme: "Placement", duration: 15, description: "Distribution rapide. Le joueur doit viser systématiquement le coude de l'entraîneur (zone d'indécision). Objectif : 10 impacts consécutifs.", material: "Panier de balles", level: 'avance' },
    { id: 'pb_lud3', name: "L'Attaque Éclair (3ème balle)", phase: "panier", theme: "Topspin", duration: 20, description: "Simulation service. L'entraîneur donne une balle coupée longue. Le joueur doit toper fort dans une zone cible (fond de table). Bonus si la balle touche la ligne.", material: "Panier de balles + Cibles", level: 'avance' },
    { id: 'pb_lud4', name: "Le Survivant du Multi-balles", phase: "panier", theme: "Réflexes", duration: 10, description: "Distribution aléatoire et très rapide. Le joueur doit tenir 30 secondes sans faire de faute. Travail de la lucidité sous fatigue.", material: "Panier de balles", level: 'pro' },
    { id: 'pb_lud5', name: "Top CD 'Essuie-Glace'", phase: "panier", theme: "Jeu de jambes", duration: 15, description: "Distribution : 1 CD coin, 1 CD milieu, 1 CD coin. Le joueur doit rester en coup droit tout le long. Focus sur les petits pas.", material: "Panier de balles", level: 'intermediaire' },

    // --- RÉGULARITÉ ---
    { id: 'ch_r1', name: "100 Balles CD - Zéro Faute", phase: "regularite", theme: "Coup Droit (CD)", duration: 15, description: "Échanges en diagonale CD. Objectif : 100 échanges sans faute.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r2', name: "Bloc RV vs Topspin CD", phase: "regularite", theme: "Bloc", duration: 15, description: "Un joueur topspin en CD sur le revers adverse. Le bloqueur doit rester précis.", material: "Balles", level: 'avance' },
    { id: 'ch_r4', name: "Huit de Chiffre (Classique)", phase: "regularite", theme: "Régularité", duration: 20, description: "Joueur A joue toujours en ligne, Joueur B joue toujours en diagonale. Dessine un 8 sur la table.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r9', name: "Le Papillon (Butterfly)", phase: "regularite", theme: "Placement", duration: 20, description: "Séquence : CD croisé, RV croisé, CD ligne, RV ligne. Travail de précision extrême et de rythme.", material: "Balles", level: 'pro' },

    // --- TECHNIQUE (LUDIQUE & PRÉCIS) ---
    { id: 'ch_t_lud1', name: "Le Sniper des Coins (Top CD)", phase: "technique", theme: "Topspin", duration: 20, description: "Placer 2 cibles (feuilles A4) dans les coins profonds. Le joueur doit toucher une cible en Top CD. 1 pt par cible, 5 pts si la balle sort de la table après l'impact.", material: "Cibles (A4)", level: 'intermediaire' },
    { id: 'ch_t_lud2', name: "Le Labyrinthe de Poussette", phase: "technique", theme: "Poussette", duration: 15, description: "Jeu de placement : 1 poussette courte (doit rebondir 2 fois), 1 poussette longue (doit toucher la ligne de fond). Si erreur de zone, le point va au partenaire.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t_lud3', name: "L'Essuie-Glace Infernal (Top RV)", phase: "technique", theme: "Topspin", duration: 20, description: "Top RV alterné : 1 plein Revers, 1 plein Coup Droit (ligne). Le bloqueur ne bouge pas sa raquette, c'est le joueur qui doit viser les angles sortants.", material: "Balles", level: 'avance' },
    { id: 'ch_t_lud4', name: "Le Piège du Coude", phase: "technique", theme: "Placement", duration: 20, description: "Exercice de match : Le serveur doit servir long dans le coude (le 'ventre') de l'adversaire. Si l'adversaire hésite entre CD et RV, point bonus.", material: "Balles", level: 'avance' },
    { id: 'ch_t_lud5', name: "Le Duel des Diagonales", phase: "technique", theme: "Régularité", duration: 20, description: "Match en 11 pts : Uniquement en diagonale. Si un joueur joue en ligne, il perd le point immédiatement. Travail de la tenue de balle et de l'angle.", material: "Balles", level: 'debutant' },

    // --- DÉPLACEMENT ---
    { id: 'ch_d_beg1', name: "Pas Chassés de Base", phase: "deplacement", theme: "Jeu de jambes", duration: 15, description: "Déplacement latéral simple entre deux plots. Focus sur la flexion des jambes et le non-croisement des pieds.", material: "Plots", level: 'debutant' },
    { id: 'ch_d_int1', name: "Déplacement en Triangle", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Séquence : RV coin, CD milieu, CD coin. Travail de la liaison et du replacement central.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_d_adv1', name: "Pas Croisés (Grande Amplitude)", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Distribution alternée plein RV / plein CD. Utilisation obligatoire du pas croisé pour couvrir la distance.", material: "Balles", level: 'avance' },
    { id: 'ch_d1', name: "Le 'Falkenberg' Chinois", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Séquence : 1 RV milieu, 1 CD milieu (pivot), 1 CD plein coup droit.", material: "Balles", level: 'pro' },

    // --- SCHÉMA DE JEU (SCÉNARISÉS) ---
    { id: 'ch_s_lud1', name: "Le Piège de la Remise Courte", phase: "schema", theme: "Remise de service", duration: 20, description: "Service court. Le relanceur doit remettre court (2 rebonds). Si la balle sort, le serveur attaque. Jeu en 7 points : bonus si la remise est 'morte'.", material: "Balles", level: 'avance' },
    { id: 'ch_s_lud2', name: "La Forteresse du Bloqueur", phase: "schema", theme: "Bloc", duration: 20, description: "Joueur A attaque librement. Joueur B doit bloquer uniquement dans le revers de A. Si B réussit 3 blocs, il gagne le point. Si A trouve un angle sortant, il gagne.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_s_lud3', name: "Le Contre-Attaquant du Pivot", phase: "schema", theme: "Contre-initiative", duration: 20, description: "Service long dans le revers. Le serveur doit pivoter immédiatement pour toper CD. L'adversaire doit bloquer en ligne. Travail de la vitesse de décision.", material: "Balles", level: 'pro' },
    { id: 'ch_s_lud4', name: "Scénario 'Fin de Set' (9-9)", phase: "schema", theme: "Mental", duration: 15, description: "Matchs commençant à 9-9. Le serveur n'a qu'un seul service. Interdiction de servir long. Focus sur la gestion du stress et le placement de sécurité.", material: "Balles", level: 'intermediaire' },

    // --- MATCHS ---
    { id: 'ch_m1', name: "Match à Handicap (9-9)", phase: "matchs", theme: "Mental", duration: 15, description: "Le set commence à 9-9. Chaque point est crucial.", material: "Balles", level: 'intermediaire' },

    // --- COGNITIF ---
    { id: 'ch_c1', name: "Réaction aux Couleurs", phase: "cognitif", theme: "Réflexes", duration: 10, description: "L'entraîneur annonce une couleur juste avant de distribuer.", material: "Plots de couleurs", level: 'debutant' },

    // --- RETOUR AU CALME ---
    { id: 'ch_rc1', name: "Respiration & Étirements 'Zen'", phase: "retour-au-calme", theme: "Retour au calme", duration: 10, description: "Exercices de respiration profonde.", material: "Aucun", level: 'debutant' }
  ];
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
            echauffement: [],
            regularite: [INITIAL_EXERCISES[2]],
            technique: [INITIAL_EXERCISES[4]],
            panier: [],
            deplacement: [INITIAL_EXERCISES[6]],
            schema: [],
            matchs: [INITIAL_EXERCISES[10]],
            cognitif: [],
            'retour-au-calme': [INITIAL_EXERCISES[13]]
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
        objectives: 'Gagner en régularité on les premières balles d\'attaque.',
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
    exercises: { echauffement: [], regularite: [], technique: [], panier: [], deplacement: [], schema: [], matchs: [], cognitif: [], 'retour-au-calme': [] }
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