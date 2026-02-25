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
  const base: Exercise[] = [
    // --- ÉCHAUFFEMENT -10 ANS ---
    { id: 'u10_e1', name: "La ronde des articulations", phase: "echauffement", theme: "Mobilisation", duration: 5, description: "Les enfants forment un cercle. L'entraîneur nomme une articulation et les enfants font des rotations douces.", material: "Aucun" },
    { id: 'u10_e2', name: "Le chat et la souris", phase: "echauffement", theme: "Jeu de jambes", duration: 8, description: "Chat vs souris, déplacements uniquement en pas chassés latéraux.", material: "Aucun" },
    { id: 'u10_e3', name: "Jacques a dit... version ping !", phase: "echauffement", theme: "Coordination", duration: 5, description: "Mimer les positions : base, coup droit, revers, service. Ceux qui bougent sans 'Jacques a dit' font 3 flexions.", material: "Aucun" },
    { id: 'u10_e4', name: "La balle voyageuse", phase: "echauffement", theme: "Habileté", duration: 5, description: "Balle posée sur raquette. Marcher, puis trottiner sans faire tomber la balle.", material: "Raquette, Balle" },
    { id: 'u10_e5', name: "Le relais raquette-balle", phase: "echauffement", theme: "Coordination", duration: 8, description: "2 équipes en relais. Traverser la salle en portant la balle sur la raquette, contourner un plot.", material: "Plots, Raquettes, Balles" },
    { id: 'u10_e6', name: "1, 2, 3 Soleil Pongiste", phase: "echauffement", theme: "Position de base", duration: 5, description: "Jeu classique mais figé en position de base ping-pong.", material: "Aucun" },
    { id: 'u10_e7', name: "Le miroir magique", phase: "echauffement", theme: "Gestes techniques", duration: 5, description: "Par 2, reproduire en miroir les gestes du partenaire.", material: "Aucun" },
    { id: 'u10_e8', name: "La chenille folle", phase: "echauffement", theme: "Cardio", duration: 5, description: "File indienne, le premier fait un mouvement, tous suivent.", material: "Aucun" },
    { id: 'u10_e9', name: "Attrape-balle réflexes", phase: "echauffement", theme: "Réflexes", duration: 5, description: "Par 2, un lâche la balle, l'autre l'attrape avant le 2ème rebond.", material: "Balles" },
    { id: 'u10_e10', name: "Le parcours du petit pongiste", phase: "echauffement", theme: "Motricité", duration: 10, description: "Circuit 5 ateliers : slalom pas chassés, sauter lattes, ramper, équilibre, course navette.", material: "Plots, Lattes, Filet" },
    { id: 'u10_e11', name: "Balle brûlante adaptée", phase: "echauffement", theme: "Toucher de balle", duration: 5, description: "Jongler sur raquette. Signal BRÛLANT = lancer haut, GLACÉ = immobiliser la balle.", material: "Raquette, Balle" },
    { id: 'u10_e12', name: "La statue musicale pongiste", phase: "echauffement", theme: "Position de base", duration: 5, description: "Musique = déplacement libre. Musique stop = se figer dans la position demandée.", material: "Musique" },
    { id: 'u10_e13', name: "Le dribble pongiste", phase: "echauffement", theme: "Habileté", duration: 5, description: "Dribbler la balle au sol avec la raquette. Objectif : 20 dribbles.", material: "Raquette, Balle" },
    { id: 'u10_e14', name: "Les lapins sauteurs", phase: "echauffement", theme: "Cardio", duration: 5, description: "Sauts latéraux par-dessus une ligne. 10 sauts + récup.", material: "Aucun" },
    { id: 'u10_e15', name: "Jonglage progression 3 niveaux", phase: "echauffement", theme: "Habileté", duration: 5, description: "Étoile : 10 touches CD. Lune : 10 touches CD/RV alternés. Soleil : tourner la raquette.", material: "Raquette, Balle" },

    // --- RÉGULARITÉ -10 ANS ---
    { id: 'u10_r1', name: "Le ping-pong des prénoms", phase: "regularite", theme: "Régularité ludique", duration: 10, description: "Échanges en CD, dire une lettre de son prénom à chaque frappe.", material: "Balles" },
    { id: 'u10_r2', name: "Le compteur magique", phase: "regularite", theme: "Régularité", duration: 10, description: "Compter les échanges à voix haute. Bronze = 10, Argent = 20, Or = 30.", material: "Balles" },
    { id: 'u10_r3', name: "Coup droit croisé guidé", phase: "regularite", theme: "Coup droit", duration: 10, description: "Balles régulières sur le CD, renvoyer en croisé.", material: "Balles" },
    { id: 'u10_r4', name: "Revers croisé guidé", phase: "regularite", theme: "Revers", duration: 10, description: "Balles régulières sur le RV, renvoyer en croisé.", material: "Balles" },
    { id: 'u10_r5', name: "La machine à laver", phase: "regularite", theme: "Régularité alternée", duration: 10, description: "Un joueur joue CD croisé, l'autre RV croisé. Faire tourner la balle.", material: "Balles" },
    { id: 'u10_r6', name: "Le mur invisible", phase: "regularite", theme: "Contrôle", duration: 8, description: "Fil tendu à 10 cm au-dessus du filet. Balles doivent passer entre le filet et le fil.", material: "Fil/Élastique" },
    { id: 'u10_r7', name: "Les zones colorées", phase: "regularite", theme: "Placement", duration: 10, description: "Feuilles de couleur dans les coins. Viser la couleur annoncée.", material: "Feuilles de couleur" },
    { id: 'u10_r8', name: "Le métronome humain", phase: "regularite", theme: "Rythme", duration: 8, description: "Frapper la balle sur le clap de l'entraîneur.", material: "Aucun" },
    { id: 'u10_r9', name: "Régularité par équipe", phase: "regularite", theme: "Régularité collective", duration: 10, description: "2 équipes, additionner les échanges de toutes les paires.", material: "Balles" },
    { id: 'u10_r10', name: "Le ping-pong des chiffres", phase: "regularite", theme: "Régularité ludique", duration: 8, description: "Compter en frappant. Multiple de 3 = dire PING au lieu du chiffre.", material: "Balles" },
    { id: 'u10_r11', name: "Service et 1 retour", phase: "regularite", theme: "Service + Régularité", duration: 10, description: "Service + retour + 3ème balle. Si les 3 dans la table = 1 point.", material: "Balles" },
    { id: 'u10_r12', name: "Le tunnel CD/RV", phase: "regularite", theme: "Alternance", duration: 10, description: "Alterner 1 CD et 1 RV, balle envoyée toujours au même endroit.", material: "Balles" },

    // --- TECHNIQUE -10 ANS ---
    { id: 'u10_t1', name: "Le geste fantôme CD", phase: "technique", theme: "Coup droit", duration: 5, description: "Sans balle, décomposition CD en 4 temps.", material: "Aucun" },
    { id: 'u10_t2', name: "Le geste fantôme Revers", phase: "technique", theme: "Revers", duration: 5, description: "Sans balle, décomposition RV en 4 temps.", material: "Aucun" },
    { id: 'u10_t3', name: "Le service cuillère", phase: "technique", theme: "Service", duration: 10, description: "Service de base : balle paume ouverte, lancer 16 cm, frapper en cuillère.", material: "Balles" },
    { id: 'u10_t4', name: "Le service marteau", phase: "technique", theme: "Service", duration: 10, description: "Service en prise marteau naturelle. Frapper par-dessus.", material: "Gobelets, Balles" },
    { id: 'u10_t5', name: "La prise de raquette magique", phase: "technique", theme: "Prise en main", duration: 5, description: "Apprendre la prise : pouce/index encadrent, 3 doigts enroulent.", material: "Raquette" },
    { id: 'u10_t6', name: "Le bowling pongiste", phase: "technique", theme: "Précision", duration: 10, description: "3 gobelets sur la table adverse. Servir ou frapper pour les renverser.", material: "Gobelets, Balles" },
    { id: 'u10_t7', name: "La cible royale", phase: "technique", theme: "Précision", duration: 10, description: "Cible concentriques sur la table. Centre = 5 pts, anneau = 3 pts.", material: "Scotch couleur" },
    { id: 'u10_t8', name: "Le retour de service enfant", phase: "technique", theme: "Retour", duration: 10, description: "Services simples de l'entraîneur, juste remettre dans la table.", material: "Balles" },

    // --- DÉPLACEMENT -10 ANS ---
    { id: 'u10_d1', name: "Les pas chassés arc-en-ciel", phase: "deplacement", theme: "Pas chassés", duration: 8, description: "5 cerceaux de couleurs en ligne. Se déplacer vers la couleur annoncée.", material: "Cerceaux couleur" },
    { id: 'u10_d2', name: "Le crabe pongiste", phase: "deplacement", theme: "Latéral", duration: 5, description: "Déplacement latéral comme un crabe, position basse, raquette devant.", material: "Aucun" },
    { id: 'u10_d3', name: "Touche-cônes express", phase: "deplacement", theme: "Réactivité", duration: 8, description: "2 cônes aux extrémités. Pas chassé vers le cône pointé, toucher, revenir.", material: "Cônes" },
    { id: 'u10_d4', name: "Le gardien de but pongiste", phase: "deplacement", theme: "Réactivité", duration: 8, description: "Balles lancées à la main. Bloquer avec la raquette comme un gardien.", material: "Balles" },

    // --- MATCHS -10 ANS ---
    { id: 'u10_m1', name: "Le roi de la table", phase: "matchs", theme: "Match ludique", duration: 15, description: "Le roi reste, challengers font la queue. 1 point joué, gagnant reste roi.", material: "Balles" },
    { id: 'u10_m2', name: "Le tournoi des étoiles", phase: "matchs", theme: "Tournoi", duration: 15, description: "Matchs de 5 points. Chaque victoire = 1 étoile autocollant.", material: "Autocollants" },
    { id: 'u10_m3', name: "Le tour de table chinoise", phase: "matchs", theme: "Jeu collectif", duration: 10, description: "File des deux côtés. Jouer un coup et courir de l'autre côté.", material: "Balles" },

    // --- RETOUR AU CALME -10 ANS ---
    { id: 'u10_rc1', name: "Les échanges tout doux", phase: "retour-au-calme", theme: "Retour au calme", duration: 5, description: "Échanges le plus lentement possible. Balle doit à peine franchir le filet.", material: "Balles" },
    { id: 'u10_rc2', name: "Étirements du petit champion", phase: "retour-au-calme", theme: "Étirement", duration: 5, description: "6 étirements de 20 sec : épaules, triceps, ischio, quad, mollets, poignets.", material: "Aucun" },
    { id: 'u10_rc3', name: "Le quiz ping-pong", phase: "retour-au-calme", theme: "Théorie", duration: 5, description: "Questions sur les règles du ping.", material: "Aucun" },
    { id: 'u10_rc4', name: "La balle en équilibre zen", phase: "retour-au-calme", theme: "Concentration", duration: 3, description: "Balle posée sur raquette, rester parfaitement immobile.", material: "Raquette, Balle" },
    { id: 'u10_rc5', name: "Le cercle des applaudissements", phase: "retour-au-calme", theme: "Cohésion", duration: 3, description: "Chaque enfant reçoit un compliment personnalisé de l'entraîneur.", material: "Aucun" }
  ];

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
            echauffement: [],
            regularite: [INITIAL_EXERCISES[15]],
            technique: [INITIAL_EXERCISES[27]],
            deplacement: [INITIAL_EXERCISES[35]],
            schema: [],
            matchs: [INITIAL_EXERCISES[39]],
            cognitif: [],
            'retour-au-calme': [INITIAL_EXERCISES[42]]
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