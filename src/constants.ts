import { Phase, Exercise, Session, Skill, Player, Cycle, PlayerEvaluation, PhaseId } from './types';

export const PHASES: Phase[] = [
  { id: 'echauffement', label: 'ÉCHAUFFEMENT', duration: 15, color: 'bg-orange-50 border-orange-200 text-slate-900' },
  { id: 'regularite', label: 'RÉGULARITÉ', duration: 20, color: 'bg-sky-50 border-sky-200 text-slate-900' },
  { id: 'technique', label: 'TECHNIQUE', duration: 25, color: 'bg-indigo-50 border-indigo-200 text-slate-900' },
  { id: 'deplacement', label: 'DÉPLACEMENT', duration: 20, color: 'bg-fuchsia-50 border-fuchsia-200 text-slate-900' },
  { id: 'schema', label: 'SCHÉMA DE JEU', duration: 15, color: 'bg-emerald-50 border-emerald-200 text-slate-900' },
  { id: 'matchs', label: 'MATCHS VARIÉS', duration: 15, color: 'bg-rose-50 border-rose-200 text-slate-900' },
  { id: 'cognitif', label: 'DÉV. COGNITIF', duration: 15, color: 'bg-violet-50 border-violet-200 text-slate-900' },
  { id: 'retour-au-calme', label: 'RETOUR AU CALME', duration: 10, color: 'bg-slate-50 border-slate-200 text-slate-900' }
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
    { id: 'ch_e1', name: "Shadow Play - 8 Directions", phase: "echauffement", theme: "Mobilisation", duration: 10, description: "Sans balle, reproduire les gestes de base (CD, RV, Pivot) en se déplaçant sur 8 points cardinaux.", material: "Aucun" },
    { id: 'ch_e2', name: "Réveil Articulaire Dynamique", phase: "echauffement", theme: "Mobilisation", duration: 5, description: "Rotations rapides des poignets, coudes et épaules. Sauts sur place.", material: "Aucun" },
    { id: 'ch_e3', name: "Coordination Échelle de Rythme", phase: "echauffement", theme: "Motricité", duration: 10, description: "Travail d'appuis rapides au sol. Fréquence maximale des pieds.", material: "Échelle de rythme" },
    { id: 'ch_beg_e1', name: "L'Équilibre de la Perle", phase: "echauffement", theme: "Habileté", duration: 10, description: "Débutant : Se déplacer en maintenant la balle en équilibre sur la raquette.", material: "Raquette et Balle" },

    // --- RÉGULARITÉ ---
    { id: 'ch_r1', name: "100 Balles CD - Zéro Faute", phase: "regularite", theme: "Coup Droit (CD)", duration: 15, description: "Échanges en diagonale CD. Objectif : 100 échanges sans faute.", material: "Balles" },
    { id: 'ch_r2', name: "Bloc RV vs Topspin CD", phase: "regularite", theme: "Bloc", duration: 15, description: "Un joueur topspin en CD sur le revers adverse. Le bloqueur doit rester précis.", material: "Balles" },
    { id: 'ch_r3', name: "Liaison 1-1 (CD/RV)", phase: "regularite", theme: "Coordination", duration: 15, description: "Intermédiaire : Alterner 1 coup droit et 1 revers sur le revers adverse. Focus sur le transfert de poids.", material: "Balles" },
    { id: 'ch_r4', name: "Huit de Chiffre (Diagonales)", phase: "regularite", theme: "Régularité", duration: 20, description: "Intermédiaire : Joueur A joue en ligne, Joueur B joue en diagonale. Travail de placement permanent.", material: "Balles" },
    { id: 'ch_r5', name: "Le Triangle de Placement", phase: "regularite", theme: "Placement", duration: 20, description: "Intermédiaire : Joueur A distribue en RV. Joueur B alterne : 1 CD coin, 1 CD milieu, 1 CD coin. Focus sur le replacement.", material: "Balles" },
    { id: 'ch_r6', name: "Régularité Revers 'Piston'", phase: "regularite", theme: "Revers (RV)", duration: 15, description: "Intermédiaire : Échanges rapides en revers sur revers. La balle doit être longue et toucher le dernier tiers de la table.", material: "Balles" },
    { id: 'ch_r7', name: "Liaison CD/RV sur Pivot", phase: "regularite", theme: "Coordination", duration: 20, description: "Intermédiaire : 1 RV, 1 CD (pivot), 1 RV. Travail de la fluidité du haut du corps et des appuis.", material: "Balles" },
    { id: 'ch_r8', name: "Contre-Top de Contrôle", phase: "regularite", theme: "Topspin", duration: 15, description: "Intermédiaire : À mi-distance, les deux joueurs font du topspin sur topspin à vitesse modérée. Focus sur la courbe.", material: "Balles" },

    // --- TECHNIQUE ---
    { id: 'ch_t1', name: "Topspin CD sur Balle Coupée", phase: "technique", theme: "Topspin", duration: 20, description: "L'entraîneur distribue des balles coupées lourdes. Action forte de l'avant-bras.", material: "Panier de balles" },
    { id: 'ch_t2', name: "Topspin de Rotation (Sauce)", phase: "technique", theme: "Topspin", duration: 20, description: "Intermédiaire : Produire un maximum de rotation sur balle coupée lente. La balle doit 'gicler' au rebond.", material: "Balles" },
    { id: 'ch_t3', name: "Contre-Bloc Actif RV", phase: "technique", theme: "Bloc", duration: 15, description: "Intermédiaire : Sur un topspin adverse, fermer la raquette et avancer pour accélérer la balle.", material: "Balles" },
    { id: 'ch_t_p1', name: "Panier : Topspin CD (Rotation Max)", phase: "technique", theme: "Topspin", duration: 20, description: "Distribution lente de balles très coupées. Action de jambe explosive.", material: "Panier de balles" },
    { id: 'ch_t_p2', name: "Panier : Liaison RV / CD (Fréquence)", phase: "technique", theme: "Coordination", duration: 15, description: "Distribution rapide alternée RV/CD sur un point fixe.", material: "Panier de balles" },

    // --- DÉPLACEMENT ---
    { id: 'ch_d1', name: "Le 'Falkenberg' Chinois", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Séquence : 1 RV milieu, 1 CD milieu (pivot), 1 CD plein coup droit.", material: "Balles" },
    { id: 'ch_d2', name: "Déplacement en Triangle", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Intermédiaire : 1 CD au milieu, 1 CD au coin, 1 CD au milieu. Petits pas de réajustement.", material: "Balles" },
    { id: 'ch_d_p1', name: "Panier : Déplacement 'Grande Amplitude'", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Distribution alternée plein RV / plein CD. Pas chassés explosifs.", material: "Panier de balles" },

    // --- SCHÉMA DE JEU ---
    { id: 'ch_s1', name: "3ème Balle : Service / Remise / Attaque", phase: "schema", theme: "Incertitude", duration: 20, description: "Service court, remise poussette longue, attaque immédiate.", material: "Balles" },
    { id: 'ch_s2', name: "Incertitude Milieu/Côté", phase: "schema", theme: "Incertitude", duration: 20, description: "Intermédiaire : Le bloqueur distribue aléatoirement soit au milieu, soit sur le côté. Réaction visuelle.", material: "Balles" },
    { id: 'ch_s3', name: "Service Latéral / Flip RV", phase: "schema", theme: "Flip", duration: 15, description: "Intermédiaire : Service latéral sortant, remise courte, flip revers agressif pour prendre l'initiative.", material: "Balles" },

    // --- MATCHS ---
    { id: 'ch_m1', name: "Match à Handicap (9-9)", phase: "matchs", theme: "Mental", duration: 15, description: "Le set commence à 9-9. Chaque point est crucial.", material: "Balles" },
    { id: 'ch_m2', name: "Match 'Interdiction de Couper'", phase: "matchs", theme: "Tactique", duration: 20, description: "Intermédiaire : Interdiction de faire une poussette après la remise. Obligation d'attaquer ou de bloquer.", material: "Balles" },

    // --- COGNITIF ---
    { id: 'ch_c1', name: "Réaction aux Couleurs", phase: "cognitif", theme: "Réflexes", duration: 10, description: "L'entraîneur annonce une couleur juste avant de distribuer.", material: "Plots de couleurs" },
    { id: 'ch_c2', name: "Signal Sonore (Top vs Poussette)", phase: "cognitif", theme: "Réflexes", duration: 15, description: "Intermédiaire : Si le coach crie 'TOP', le joueur attaque. Sinon, il remet court.", material: "Aucun" },

    // --- RETOUR AU CALME ---
    { id: 'ch_rc1', name: "Respiration & Étirements 'Zen'", phase: "retour-au-calme", theme: "Retour au calme", duration: 10, description: "Exercices de respiration profonde.", material: "Aucun" }
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
    exercises: { echauffement: [], regularite: [], technique: [], deplacement: [], schema: [], matchs: [], cognitif: [], 'retour-au-calme': [] }
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