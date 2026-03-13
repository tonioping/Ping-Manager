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
    
    // --- PANIER DE BALLES ---
    { id: 'pb_1', name: "Topspin CD sur Balle Coupée", phase: "panier", theme: "Topspin", duration: 15, description: "Distribution de balles coupées longues. Focus sur l'action des jambes et l'ouverture de raquette.", material: "Panier de balles", level: 'intermediaire' },
    { id: 'pb_top_cd_1', name: "Top CD sur 2 points (Milieu/CD)", phase: "panier", theme: "Topspin", duration: 15, description: "Distribution alternée milieu de table et plein coup droit. Focus sur le replacement et l'équilibre.", material: "Panier de balles", level: 'intermediaire' },
    { id: 'pb_top_cd_2', name: "Top CD 3ème balle (Service/Attaque)", phase: "panier", theme: "Topspin", duration: 20, description: "Le joueur simule un service, l'entraîneur distribue une balle coupée longue. Attaque immédiate en Top CD.", material: "Panier de balles", level: 'avance' },
    { id: 'pb_top_cd_3', name: "Top CD sur Balle Haute / Lob", phase: "panier", theme: "Topspin", duration: 15, description: "Distribution de balles hautes avec beaucoup d'effet. Apprendre à smasher ou toper avec puissance.", material: "Panier de balles", level: 'intermediaire' },
    { id: 'pb_top_cd_4', name: "Top CD Angle Sortant", phase: "panier", theme: "Topspin", duration: 15, description: "Distribution plein CD. Le joueur doit trouver un angle sortant maximum (petit côté).", material: "Panier de balles", level: 'pro' },
    { id: 'pb_2', name: "Liaison RV / CD (Fréquence)", phase: "panier", theme: "Coordination", duration: 15, description: "Distribution alternée RV/CD sur un point fixe. Travail de la vitesse de bras.", material: "Panier de balles", level: 'avance' },
    { id: 'pb_3', name: "Déplacement Grande Amplitude", phase: "panier", theme: "Jeu de jambes", duration: 20, description: "Distribution alternée plein RV / plein CD. Pas chassés explosifs requis.", material: "Panier de balles", level: 'pro' },
    { id: 'pb_4', name: "Incertitude Placement (2 zones)", phase: "panier", theme: "Incertitude", duration: 15, description: "Distribution aléatoire sur le revers ou le milieu. Réaction visuelle et placement.", material: "Panier de balles", level: 'intermediaire' },
    { id: 'pb_5', name: "Topspin de Rotation (Sauce)", phase: "panier", theme: "Topspin", duration: 15, description: "Balles très coupées et lentes. Produire un maximum de rotation vers le haut.", material: "Panier de balles", level: 'avance' },
    { id: 'pb_6', name: "Multi-balles : Vitesse de réaction", phase: "panier", theme: "Réflexes", duration: 10, description: "Distribution très rapide de balles à plat. Bloc réflexe ou contre-initiative.", material: "Panier de balles", level: 'pro' },

    // --- RÉGULARITÉ ---
    { id: 'ch_r1', name: "100 Balles CD - Zéro Faute", phase: "regularite", theme: "Coup Droit (CD)", duration: 15, description: "Échanges en diagonale CD. Objectif : 100 échanges sans faute.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r2', name: "Bloc RV vs Topspin CD", phase: "regularite", theme: "Bloc", duration: 15, description: "Un joueur topspin en CD sur le revers adverse. Le bloqueur doit rester précis.", material: "Balles", level: 'avance' },
    { id: 'ch_r3', name: "Liaison 1-1 (CD/RV)", phase: "regularite", theme: "Coordination", duration: 15, description: "Intermédiaire : Alterner 1 coup droit et 1 revers sur le revers adverse. Focus sur le transfert de poids.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r4', name: "Huit de Chiffre (Classique)", phase: "regularite", theme: "Régularité", duration: 20, description: "Joueur A joue toujours en ligne, Joueur B joue toujours en diagonale. Dessine un 8 sur la table.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r4_v2', name: "Le Grand 8 (Amplitude)", phase: "regularite", theme: "Jeu de jambes", duration: 20, description: "Variante du 8 : Joueur A joue ligne/diagonale alternativement, Joueur B bloque en ligne. Force des déplacements latéraux plus larges.", material: "Balles", level: 'avance' },
    { id: 'ch_r9', name: "Le Papillon (Butterfly)", phase: "regularite", theme: "Placement", duration: 20, description: "Séquence : CD croisé, RV croisé, CD ligne, RV ligne. Travail de précision extrême et de rythme.", material: "Balles", level: 'pro' },
    { id: 'ch_r5', name: "Le Triangle de Placement", phase: "regularite", theme: "Placement", duration: 20, description: "Intermédiaire : Joueur A distribue en RV. Joueur B alterne : 1 CD coin, 1 CD milieu, 1 CD coin. Focus sur le replacement.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r6', name: "Régularité Revers 'Piston'", phase: "regularite", theme: "Revers (RV)", duration: 15, description: "Intermédiaire : Échanges rapides en revers on revers. La balle doit être longue et toucher le dernier tiers de la table.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r7', name: "Liaison CD/RV sur Pivot", phase: "regularite", theme: "Coordination", duration: 20, description: "Intermédiaire : 1 RV, 1 CD (pivot), 1 RV. Travail de la fluidité du haut du corps et des appuis.", material: "Balles", level: 'avance' },
    { id: 'ch_r8', name: "Contre-Top de Contrôle", phase: "regularite", theme: "Topspin", duration: 15, description: "Intermédiaire : À mi-distance, les deux joueurs font du topspin sur topspin à vitesse modérée. Focus sur la courbe.", material: "Balles", level: 'avance' },

    // --- TECHNIQUE ---
    { id: 'ch_t_beg1', name: "Apprentissage Geste CD", phase: "technique", theme: "Coup Droit (CD)", duration: 20, description: "Décomposition du geste de coup droit. Focus sur l'ouverture de la raquette et la fin de geste au front.", material: "Balles", level: 'debutant' },
    { id: 'ch_t_beg2', name: "Apprentissage Geste RV", phase: "technique", theme: "Revers (RV)", duration: 20, description: "Décomposition du geste de revers. Focus sur l'action du coude et l'accompagnement vers l'avant.", material: "Balles", level: 'debutant' },
    { id: 'ch_t_beg6', name: "La Poussette de Base", phase: "technique", theme: "Poussette", duration: 15, description: "Apprendre à passer sous la balle pour la renvoyer coupée. Geste court et précis.", material: "Balles", level: 'debutant' },
    { id: 'ch_t_int1', name: "Topspin CD sur Bloc", phase: "technique", theme: "Topspin", duration: 20, description: "Intermédiaire : Enchaîner des topspins CD sur un bloc passif. Focus sur le replacement et la jambe d'appui.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t_int2', name: "Topspin RV sur Bloc", phase: "technique", theme: "Topspin", duration: 20, description: "Intermédiaire : Enchaîner des topspins RV sur un bloc passif. Travail de la stabilité du coude.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t_int3', name: "Service Court Latéral-Lifté", phase: "technique", theme: "Service", duration: 15, description: "Travail du service court avec effet latéral et lifté. Focus sur le contact fin et l'accélération du poignet.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t_int4', name: "Remise Courte en Poussette", phase: "technique", theme: "Remise de service", duration: 15, description: "Apprendre à remettre court derrière le filet sur un service coupé. Focus sur l'amorti et le placement.", material: "Balles", level: 'debutant' },
    { id: 'ch_t_adv1', name: "Topspin RV sur Balle Coupée", phase: "technique", theme: "Topspin", duration: 20, description: "Ouverture en topspin revers sur une balle coupée longue. Focus sur l'action du poignet et l'engagement du corps.", material: "Balles", level: 'avance' },
    { id: 'ch_t_adv2', name: "Bloc Actif vs Topspin", phase: "technique", theme: "Bloc", duration: 15, description: "Bloquer en avançant sur un topspin adverse pour accélérer la balle. Focus sur le timing et l'inclinaison de raquette.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t_pro1', name: "Contre-Top à mi-distance", phase: "technique", theme: "Topspin", duration: 20, description: "Réaliser un topspin sur un topspin adverse loin de la table. Focus sur la puissance et la trajectoire bombée.", material: "Balles", level: 'pro' },
    { id: 'ch_t5', name: "Flip Revers (Chiquita)", phase: "technique", theme: "Flip", duration: 15, description: "Intermédiaire : Sur balle courte, passer sous la balle avec un mouvement circulaire du poignet pour attaquer en rotation.", material: "Balles", level: 'pro' },

    // --- DÉPLACEMENT ---
    { id: 'ch_d_beg1', name: "Pas Chassés de Base", phase: "deplacement", theme: "Jeu de jambes", duration: 15, description: "Déplacement latéral simple entre deux plots. Focus sur la flexion des jambes et le non-croisement des pieds.", material: "Plots", level: 'debutant' },
    { id: 'ch_d_int1', name: "Déplacement en Triangle", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Séquence : RV coin, CD milieu, CD coin. Travail de la liaison et du replacement central.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_d_adv1', name: "Pas Croisés (Grande Amplitude)", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Distribution alternée plein RV / plein CD. Utilisation obligatoire du pas croisé pour couvrir la distance.", material: "Balles", level: 'avance' },
    { id: 'ch_d_adv2', name: "Déplacement Avant/Arrière", phase: "deplacement", theme: "Jeu de jambes", duration: 15, description: "1 poussette courte (entrée dans la table), 1 topspin long (sortie de table). Focus sur l'équilibre.", material: "Balles", level: 'avance' },
    { id: 'ch_d_pro1', name: "Le 'V' (Service / Pivot)", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Simulation service court, puis pivot immédiat pour attaquer en plein CD. Déplacement explosif.", material: "Balles", level: 'pro' },
    { id: 'ch_d_int2', name: "Incertitude Latérale (2 points)", phase: "deplacement", theme: "Incertitude", duration: 15, description: "Distribution aléatoire sur 2/3 de table. Réaction visuelle et petits pas d'ajustement.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_d1', name: "Le 'Falkenberg' Chinois", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Séquence : 1 RV milieu, 1 CD milieu (pivot), 1 CD plein coup droit.", material: "Balles", level: 'pro' },

    // --- SCHÉMA DE JEU ---
    { id: 'ch_s1', name: "3ème Balle : Service / Remise / Attaque", phase: "schema", theme: "Incertitude", duration: 20, description: "Service court, remise poussette longue, attaque immédiate.", material: "Balles", level: 'avance' },

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