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
    { id: 'ch_e1', name: "Shadow Play - 8 Directions", phase: "echauffement", theme: "Mobilisation", duration: 10, description: "Sans balle, reproduire les gestes de base (CD, RV, Pivot) en se déplaçant sur 8 points cardinaux. Focus sur le transfert de poids.", material: "Aucun" },
    { id: 'ch_e2', name: "Réveil Articulaire Dynamique", phase: "echauffement", theme: "Mobilisation", duration: 5, description: "Rotations rapides des poignets, coudes et épaules. Sauts sur place avec rotations du bassin.", material: "Aucun" },
    { id: 'ch_e3', name: "Coordination Échelle de Rythme", phase: "echauffement", theme: "Motricité", duration: 10, description: "Travail d'appuis rapides au sol. Fréquence maximale des pieds pour préparer les déplacements latéraux.", material: "Échelle de rythme" },
    { id: 'ch_e4', name: "Shadow Play - Pivot Explosif", phase: "echauffement", theme: "Jeu de jambes", duration: 5, description: "Focus spécifique sur le saut de pivot pour libérer le coup droit depuis le milieu de table.", material: "Aucun" },

    // --- RÉGULARITÉ ---
    { id: 'ch_r1', name: "100 Balles CD - Zéro Faute", phase: "regularite", theme: "Coup Droit (CD)", duration: 15, description: "Échanges en diagonale CD. L'objectif est d'atteindre 100 échanges sans faute. Discipline mentale absolue.", material: "Balles" },
    { id: 'ch_r2', name: "Bloc RV vs Topspin CD", phase: "regularite", theme: "Bloc", duration: 15, description: "Un joueur topspin en CD sur le revers adverse. Le bloqueur doit rester précis et varier la longueur.", material: "Balles" },
    { id: 'ch_r3', name: "Triangle de Régularité (RV-CD-CD)", phase: "regularite", theme: "Liaison", duration: 20, description: "1 RV milieu, 1 CD milieu, 1 CD plein coup droit. Rythme constant, placement précis dans les coins.", material: "Balles" },
    { id: 'ch_r4', name: "Bloc Actif vs Topspin Aléatoire", phase: "regularite", theme: "Bloc", duration: 15, description: "Le bloqueur doit diriger la balle activement vers les zones libres pendant que l'attaquant varie ses placements.", material: "Balles" },
    { id: 'ch_r5', name: "Poussette Longue - Tenue de Balle", phase: "regularite", theme: "Poussette", duration: 10, description: "Échanges de poussettes longues et tendues. Interdiction de démarrer. Focus sur l'effet coupé et la profondeur.", material: "Balles" },

    // --- TECHNIQUE ---
    { id: 'ch_t1', name: "Topspin CD sur Balle Coupée", phase: "technique", theme: "Topspin", duration: 20, description: "L'entraîneur distribue des balles coupées lourdes. Action forte de l'avant-bras et des jambes. Focus sur le 'frotté'.", material: "Panier de balles" },
    { id: 'ch_t2', name: "Service 'Ghost' Court", phase: "technique", theme: "Service", duration: 15, description: "Service coupé très court qui doit revenir vers le filet. Travail de la finesse du toucher.", material: "Balles" },
    { id: 'ch_t3', name: "Flip Banane (Chiquita)", phase: "technique", theme: "Flip", duration: 20, description: "Remise de service court en revers avec une action latérale du poignet pour surprendre l'adversaire.", material: "Panier de balles" },
    { id: 'ch_t4', name: "Contre-Topspin à Mi-Distance", phase: "technique", theme: "Contre-initiative", duration: 20, description: "Répondre à un topspin adverse par un topspin agressif loin de la table. Engagement total du corps.", material: "Balles" },
    { id: 'ch_t5', name: "Service Marteau & Placement", phase: "technique", theme: "Service", duration: 15, description: "Service 'Tomahawk' avec variations d'effets latéraux. Focus sur le masquage du geste.", material: "Balles" },
    { id: 'ch_t6', name: "Démarrage RV sur Balle Coupée", phase: "technique", theme: "Revers (RV)", duration: 20, description: "Ouverture en topspin revers sur balle coupée. Action de poignet rapide et stable.", material: "Panier de balles" },

    // --- DÉPLACEMENT ---
    { id: 'ch_d1', name: "Le 'Falkenberg' Chinois", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Séquence : 1 RV milieu, 1 CD milieu (pivot), 1 CD plein coup droit. Intensité maximale.", material: "Balles" },
    { id: 'ch_d2', name: "Déplacement en 'V' Inversé", phase: "deplacement", theme: "Vitesse", duration: 15, description: "Alternance balle courte au filet et balle longue au fond. Avancer et reculer sans perdre l'équilibre.", material: "Balles" },
    { id: 'ch_d3', name: "Le Grand Huit (8)", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Déplacement en forme de 8 couvrant toute la table. Focus sur les petits pas d'ajustement.", material: "Balles" },
    { id: 'ch_d4', name: "Pas de Géant - Couverture Totale", phase: "deplacement", theme: "Vitesse", duration: 15, description: "Balle plein RV puis plein CD. Utilisation de grands pas chassés explosifs.", material: "Panier de balles" },
    { id: 'ch_d5', name: "Pivot & Replacement Rapide", phase: "deplacement", theme: "Jeu de jambes", duration: 15, description: "Enchaînement pivot CD suivi d'un replacement immédiat pour couvrir le plein CD.", material: "Balles" },

    // --- SCHÉMA DE JEU ---
    { id: 'ch_s1', name: "3ème Balle : Service / Remise / Attaque", phase: "schema", theme: "Incertitude", duration: 20, description: "Service court, remise poussette longue, attaque immédiate en topspin.", material: "Balles" },
    { id: 'ch_s2', name: "Transition Court-Long", phase: "schema", theme: "Tactique", duration: 15, description: "Remise courte dans le service, puis bloc actif sur le premier démarrage adverse.", material: "Balles" },
    { id: 'ch_s3', name: "Schéma 2-1 (2 RV, 1 CD Pivot)", phase: "schema", theme: "Tactique", duration: 20, description: "Fixation en revers puis accélération décisive en pivot coup droit.", material: "Balles" },
    { id: 'ch_s4', name: "Service Court / Remise Longue / Contre", phase: "schema", theme: "Contre-initiative", duration: 20, description: "Provoquer l'attaque adverse pour mieux la contrer en bloc actif ou contre-top.", material: "Balles" },
    { id: 'ch_s5', name: "5ème Balle : Enchaînement Attaque", phase: "schema", theme: "Tactique", duration: 20, description: "Service, 3ème balle placée, 5ème balle pour conclure le point.", material: "Balles" },

    // --- MATCHS ---
    { id: 'ch_m1', name: "Match à Handicap (9-9)", phase: "matchs", theme: "Mental", duration: 15, description: "Le set commence à 9-9. Chaque point est crucial. Gestion du stress.", material: "Balles" },
    { id: 'ch_m2', name: "Le Roi de la Table", phase: "matchs", theme: "Compétition", duration: 20, description: "Matchs de 2 minutes. Le gagnant monte de table, le perdant descend.", material: "Balles" },
    { id: 'ch_m3', name: "Match de 1 Point (Mort Subite)", phase: "matchs", theme: "Mental", duration: 10, description: "Un seul point décide du vainqueur. Concentration maximale dès la première balle.", material: "Balles" },
    { id: 'ch_m4', name: "Service Interdit (Jeu de Remise)", phase: "matchs", theme: "Tactique", duration: 15, description: "L'engagement se fait par une poussette. Focus sur la construction du point sans l'avantage du service.", material: "Balles" },

    // --- COGNITIF ---
    { id: 'ch_c1', name: "Réaction aux Couleurs", phase: "cognitif", theme: "Réflexes", duration: 10, description: "L'entraîneur annonce une couleur juste avant de distribuer. Placement obligatoire en zone.", material: "Plots de couleurs" },
    { id: 'ch_c2', name: "Lecture d'Effet au Panier", phase: "cognitif", theme: "Réflexes", duration: 15, description: "L'entraîneur varie les effets sans prévenir. Le joueur doit identifier et adapter sa remise instantanément.", material: "Panier de balles" },

    // --- RETOUR AU CALME ---
    { id: 'ch_rc1', name: "Respiration & Étirements 'Zen'", phase: "retour-au-calme", theme: "Retour au calme", duration: 10, description: "Exercices de respiration profonde et étirements statiques.", material: "Aucun" },
    { id: 'ch_rc2', name: "Visualisation de la Victoire", phase: "retour-au-calme", theme: "Mental", duration: 5, description: "Analyse mentale de la séance et visualisation de gestes parfaits réussis.", material: "Aucun" }
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