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
    { id: 'ch_e4', name: "Le Miroir Tactique", phase: "echauffement", theme: "Coordination", duration: 10, description: "Par deux, un meneur et un suiveur. Le suiveur doit imiter les déplacements latéraux et les gestes du meneur le plus vite possible.", material: "Aucun", level: 'debutant' },
    { id: 'ch_e5', name: "Jonglage Multi-surfaces", phase: "echauffement", theme: "Habileté", duration: 10, description: "Jongler en alternant : bois, tranche, manche, et les deux faces de la raquette. Travail de la sensibilité de main.", material: "Raquette et Balle", level: 'intermediaire' },
    { id: 'ch_e6', name: "Déplacements en Étoile", phase: "echauffement", theme: "Vitesse", duration: 10, description: "Placer 5 balles en étoile. Le joueur doit aller toucher chaque balle et revenir au centre en pas chassés le plus vite possible.", material: "5 Balles", level: 'intermediaire' },
    { id: 'ch_e7', name: "Réveil Musculaire Spécifique", phase: "echauffement", theme: "Physique", duration: 10, description: "Fentes latérales, gainage dynamique et montées de genoux. Focus sur les muscles sollicités au ping (cuisses, sangle abdominale).", material: "Aucun", level: 'avance' },
    { id: 'ch_e8', name: "La Course aux Balles", phase: "echauffement", theme: "Vitesse", duration: 10, description: "Ludique : Disperser 20 balles sur la table. Le joueur doit les ramasser une par une et les mettre dans un panier le plus vite possible.", material: "20 Balles + Panier", level: 'debutant' },
    
    // --- RÉGULARITÉ ---
    { id: 'ch_r1', name: "100 Balles CD - Zéro Faute", phase: "regularite", theme: "Coup Droit (CD)", duration: 15, description: "Échanges en diagonale CD. Objectif : 100 échanges sans faute.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r2', name: "Bloc RV vs Topspin CD", phase: "regularite", theme: "Bloc", duration: 15, description: "Un joueur topspin en CD sur le revers adverse. Le bloqueur doit rester précis.", material: "Balles", level: 'avance' },
    { id: 'ch_r3', name: "CD/RV Alterné (1-1)", phase: "regularite", theme: "Coordination", duration: 15, description: "Alterner un coup droit et un revers sur le même point de la table. Focus sur la transition et le placement de la raquette.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r4', name: "Le Triangle de Précision", phase: "regularite", theme: "Placement", duration: 20, description: "Séquence : CD croisé, CD milieu (coude), CD ligne. Le partenaire bloque passivement.", material: "Balles", level: 'avance' },
    { id: 'ch_r5', name: "Bloc Actif vs Topspin", phase: "regularite", theme: "Bloc", duration: 15, description: "Le bloqueur doit diriger la balle activement pour faire travailler le topspineur. Travail du contrôle de balle.", material: "Balles", level: 'avance' },
    { id: 'ch_r6', name: "Poussette Longue Diagonale", phase: "regularite", theme: "Poussette", duration: 15, description: "Échanges en poussette coupée longue dans la diagonale. La balle doit rester basse et profonde.", material: "Balles", level: 'debutant' },
    { id: 'ch_r7', name: "Contre-Top Mi-distance", phase: "regularite", theme: "Topspin", duration: 20, description: "Les deux joueurs s'écartent de la table et échangent en topspin sur topspin. Focus sur la trajectoire courbe.", material: "Balles", level: 'pro' },
    { id: 'ch_r8', name: "Le '8' Tactique (Croisé/Ligne)", phase: "regularite", theme: "Placement", duration: 20, description: "Un joueur joue systématiquement croisé, l'autre joue systématiquement ligne. Travail de lecture et de placement.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r9', name: "Le Papillon (Butterfly)", phase: "regularite", theme: "Placement", duration: 20, description: "Séquence : CD croisé, RV croisé, CD ligne, RV ligne. Travail de précision extrême et de rythme.", material: "Balles", level: 'pro' },
    { id: 'ch_r10', name: "Alternance Coude/Plein CD", phase: "regularite", theme: "Incertitude", duration: 15, description: "Le partenaire distribue aléatoirement soit dans le coude, soit plein coup droit. Le joueur doit s'ajuster.", material: "Balles", level: 'avance' },
    { id: 'ch_r11', name: "Bloc RV vs Top Aléatoire", phase: "regularite", theme: "Bloc", duration: 15, description: "Le topspineur change de zone librement. Le bloqueur doit rester en revers et s'orienter vers la balle.", material: "Balles", level: 'avance' },
    { id: 'ch_r12', name: "Défense Coupée vs Topspin", phase: "regularite", theme: "Habileté", duration: 20, description: "Un joueur défend en coupe loin de la table, l'autre topspin en régularité. Travail de la sensibilité.", material: "Balles", level: 'avance' },
    { id: 'ch_r13', name: "Vitesse de Bras RV-RV", phase: "regularite", theme: "Revers (RV)", duration: 10, description: "Échanges très rapides en revers sur revers. Focus sur le relâchement du poignet et la vitesse d'exécution.", material: "Balles", level: 'pro' },
    { id: 'ch_r14', name: "Le Ping-Pong Basket", phase: "regularite", theme: "Placement", duration: 15, description: "Ludique : Placer un panier sur la table. Le joueur doit envoyer la balle dedans après un échange de régularité. 5 pts par panier.", material: "Panier", level: 'debutant' },

    // --- PANIER DE BALLES ---
    { id: 'pb_lud1', name: "Le Balayage des Angles", phase: "panier", theme: "Placement", duration: 15, description: "Distribution alternée plein CD / plein RV. Le joueur doit viser les 'petits côtés' (angles sortants). 2 pts par angle touché, 0 pt si la balle passe au milieu.", material: "Panier de balles", level: 'intermediaire' },
    { id: 'pb_lud2', name: "Le Mur du Coude", phase: "panier", theme: "Placement", duration: 15, description: "Distribution rapide. Le joueur doit viser systématiquement le coude de l'entraîneur (zone d'indécision). Objectif : 10 impacts consécutifs.", material: "Panier de balles", level: 'avance' },
    { id: 'pb_lud3', name: "L'Attaque Éclair (3ème balle)", phase: "panier", theme: "Topspin", duration: 20, description: "Simulation service. L'entraîneur donne une balle coupée longue. Le joueur doit toper fort dans une zone cible (fond de table). Bonus si la balle touche la ligne.", material: "Panier de balles + Cibles", level: 'avance' },
    { id: 'pb_lud4', name: "Le Survivant du Multi-balles", phase: "panier", theme: "Réflexes", duration: 10, description: "Distribution aléatoire et très rapide. Le joueur doit tenir 30 secondes sans faire de faute. Travail de la lucidité sous fatigue.", material: "Panier de balles", level: 'pro' },

    // --- TECHNIQUE ---
    { id: 'ch_t_lud1', name: "Le Sniper des Coins (Top CD)", phase: "technique", theme: "Topspin", duration: 20, description: "Placer 2 cibles (feuilles A4) dans les coins profonds. Le joueur doit toucher une cible en Top CD. 1 pt par cible, 5 pts si la balle sort de la table après l'impact.", material: "Cibles (A4)", level: 'intermediaire' },
    { id: 'ch_t_lud2', name: "Le Labyrinthe de Poussette", phase: "technique", theme: "Poussette", duration: 15, description: "Jeu de placement : 1 poussette courte (doit rebondir 2 fois), 1 poussette longue (doit toucher la ligne de fond). Si erreur de zone, le point va au partenaire.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t_lud4', name: "Le Piège du Coude", phase: "technique", theme: "Placement", duration: 20, description: "Exercice de match : Le serveur doit servir long dans le coude (le 'ventre') de l'adversaire. Si l'adversaire hésite entre CD et RV, point bonus.", material: "Balles", level: 'avance' },
    { id: 'ch_t_lud5', name: "Le Bowling du Ping", phase: "technique", theme: "Topspin", duration: 20, description: "Ludique : Aligner 6 gobelets en plastique sur la ligne de fond. Le joueur doit les renverser en Topspin. Strike = 10 pts.", material: "Gobelets", level: 'debutant' },
    { id: 'ch_t1', name: "Service Court Latéral-Lifté", phase: "technique", theme: "Service", duration: 15, description: "Travailler le service court avec effet latéral et lifté. La balle doit rebondir deux fois sur le camp adverse.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t2', name: "Flip Revers sur Balle Courte", phase: "technique", theme: "Flip", duration: 20, description: "Attaque de revers sur une balle courte et peu coupée. Focus sur l'engagement du poignet.", material: "Balles", level: 'avance' },
    { id: 'ch_t3', name: "Topspin CD sur Balle Coupée", phase: "technique", theme: "Topspin", duration: 20, description: "Démarrage en coup droit sur une poussette longue coupée. Utilisation des jambes pour remonter la balle.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t4', name: "Pivot Coup Droit Explosif", phase: "technique", theme: "Coup Droit (CD)", duration: 15, description: "Se décaler en pivot pour attaquer en coup droit depuis le plein revers. Focus sur la vitesse de placement.", material: "Balles", level: 'avance' },
    { id: 'ch_t5', name: "Remise de Service Poussette Active", phase: "technique", theme: "Remise de service", duration: 15, description: "Remise longue et agressive sur un service coupé. La balle doit être profonde et rapide.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t6', name: "Contre-Top CD à la Table", phase: "technique", theme: "Contre-initiative", duration: 20, description: "Contrer un topspin adverse directement au sommet du rebond. Geste court et compact.", material: "Balles", level: 'pro' },
    { id: 'ch_t7', name: "Topspin RV Ligne de Fond", phase: "technique", theme: "Revers (RV)", duration: 20, description: "Topspin de revers visant la ligne de fond adverse. Focus sur la profondeur de balle.", material: "Balles", level: 'avance' },
    { id: 'ch_t8', name: "Service Long Rapide 'Balle de Match'", phase: "technique", theme: "Service", duration: 10, description: "Service long, très rapide et rasant, visant les angles ou le coude. Effet de surprise.", material: "Balles", level: 'avance' },
    { id: 'ch_t9', name: "Flip Coup Droit (Banane CD)", phase: "technique", theme: "Flip", duration: 20, description: "Attaque de coup droit sur balle courte avec un mouvement de 'banane' pour contourner la balle.", material: "Balles", level: 'pro' },
    { id: 'ch_t10', name: "Bloc Amorti vs Topspin", phase: "technique", theme: "Bloc", duration: 15, description: "Réduire la vitesse d'un topspin puissant pour que la balle retombe juste derrière le filet.", material: "Balles", level: 'avance' },

    // --- DÉPLACEMENT ---
    { id: 'ch_d_lud1', name: "Le Chasseur de Zones", phase: "deplacement", theme: "Incertitude", duration: 20, description: "Distribution aléatoire sur 3 zones (RV, Milieu, CD). Le joueur doit toucher la zone annoncée par l'entraîneur au dernier moment. 10 réussites pour gagner.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_d_lud2', name: "Navette Latérale Chrono", phase: "deplacement", theme: "Vitesse", duration: 15, description: "Déplacement plein CD / plein RV. Combien de touches en 30 secondes ? Record à battre : 25 touches. Focus sur l'explosivité des appuis.", material: "Chronomètre", level: 'avance' },
    { id: 'ch_d_lud3', name: "Le Huit Explosif", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Parcours : RV coin -> Milieu (pivot) -> CD coin -> Milieu (RV). Dessine un 8. Le joueur doit toujours viser le revers adverse.", material: "Balles", level: 'pro' },

    // --- SCHÉMA DE JEU ---
    { id: 'ch_s_lud1', name: "Le Piège de la Remise Courte", phase: "schema", theme: "Remise de service", duration: 20, description: "Service court. Le relanceur doit remettre court (2 rebonds). Si la balle sort, le serveur attaque. Jeu en 7 points : bonus si la remise est 'morte'.", material: "Balles", level: 'avance' },
    { id: 'ch_s_lud5', name: "Le Duel du Premier Top", phase: "schema", theme: "Topspin", duration: 20, description: "Service libre. Le relanceur doit remettre long. Le serveur doit toper la première balle dans une zone précise. Si le top est réussi, le point continue normalement.", material: "Balles", level: 'avance' },
    { id: 'ch_s_lud6', name: "L'Incertitude du Milieu", phase: "schema", theme: "Placement", duration: 20, description: "Match à thème : Tous les coups d'attaque doivent viser le coude de l'adversaire. Si l'adversaire est forcé de se décaler, point bonus.", material: "Balles", level: 'pro' },
    { id: 'ch_s_lud4', name: "Scénario 'Fin de Set' (9-9)", phase: "schema", theme: "Mental", duration: 15, description: "Matchs commençant à 9-9. Le serveur n'a qu'un seul service. Interdiction de servir long. Focus sur la gestion du stress.", material: "Balles", level: 'intermediaire' },

    // --- MATCHS ---
    { id: 'ch_m_lud1', name: "Match 'Cibles Vivantes'", phase: "matchs", theme: "Placement", duration: 20, description: "Match classique en 11 pts. Si un joueur gagne le point en touchant un angle de table (cible imaginaire), le point compte double.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_m_lud2', name: "Match 'Service Unique'", phase: "matchs", theme: "Mental", duration: 20, description: "Match classique mais le serveur n'a droit qu'à un seul service (pas de deuxième balle). Travail de la sécurité et de la concentration.", material: "Balles", level: 'avance' },
    { id: 'ch_m1', name: "Match à Handicap (9-9)", phase: "matchs", theme: "Mental", duration: 15, description: "Le set commence à 9-9. Chaque point est crucial.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_m3', name: "Le Match 'Vies'", phase: "matchs", theme: "Mental", duration: 20, description: "Ludique : Chaque joueur commence avec 3 vies. Perdre un set fait perdre une vie. Le dernier survivant gagne.", material: "Balles", level: 'debutant' },

    // --- COGNITIF ---
    { id: 'ch_c1', name: "Réaction aux Couleurs", phase: "cognitif", theme: "Réflexes", duration: 10, description: "L'entraîneur annonce une couleur juste avant de distribuer.", material: "Plots de couleurs", level: 'debutant' },
    { id: 'ch_c2', name: "Calcul Mental en Échange", phase: "cognitif", theme: "Multitâche", duration: 15, description: "Pendant un échange de régularité, l'entraîneur donne un calcul simple (ex: 5+3). Le joueur doit donner la réponse avant de toucher la balle suivante.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_c3', name: "Le Signal Sonore Directionnel", phase: "cognitif", theme: "Réaction", duration: 10, description: "Le joueur est de dos. Au signal sonore (clap), il se retourne et doit bloquer une balle envoyée aléatoirement.", material: "Balles", level: 'avance' },
    { id: 'ch_c4', name: "Mémorisation de Séquence", phase: "cognitif", theme: "Mémoire", duration: 15, description: "L'entraîneur montre une séquence de 3 zones (ex: CD, RV, Milieu). Le joueur doit reproduire la séquence 5 fois de suite sans erreur.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_c5', name: "Le Miroir Inversé", phase: "cognitif", theme: "Inhibition", duration: 10, description: "L'entraîneur montre une direction avec sa main. Le joueur doit envoyer la balle dans la direction OPPOSÉE.", material: "Balles", level: 'avance' },
    { id: 'ch_c6', name: "Lecture de Rotation Flash", phase: "cognitif", theme: "Perception", duration: 15, description: "L'entraîneur sert avec beaucoup d'effet. Le joueur doit annoncer l'effet (Coupé, Lifté, Latéral) AVANT que la balle ne rebondisse sur son camp.", material: "Balles", level: 'pro' },
    { id: 'ch_c7', name: "Le Jeu des Couleurs (Plots)", phase: "cognitif", theme: "Décision", duration: 15, description: "4 plots de couleurs sur la table. L'entraîneur annonce une couleur pendant le vol de la balle. Le joueur doit viser le plot correspondant.", material: "Plots de couleurs", level: 'intermediaire' },
    { id: 'ch_c8', name: "Annonce de Zone Tardive", phase: "cognitif", theme: "Décision", duration: 15, description: "L'entraîneur annonce la zone de retour (CD ou RV) au moment précis où il touche la balle. Le joueur doit s'adapter instantanément.", material: "Balles", level: 'avance' },
    { id: 'ch_c9', name: "Le Duel des Chiffres", phase: "cognitif", theme: "Visualisation", duration: 10, description: "Des chiffres sont écrits sur les balles. Le joueur doit lire et annoncer le chiffre de la balle qu'il reçoit avant de la frapper.", material: "Balles marquées", level: 'pro' },
    { id: 'ch_c10', name: "Coordination Main-Œil Complexe", phase: "cognitif", theme: "Coordination", duration: 10, description: "Le joueur doit jongler with une balle sur la raquette tout en attrapant une autre balle lancée à la main par l'entraîneur.", material: "2 Balles", level: 'intermediaire' },
    { id: 'ch_c11', name: "Inhibition 'Stop & Go'", phase: "cognitif", theme: "Contrôle", duration: 10, description: "Échange rapide. Si l'entraîneur crie 'STOP', le joueur doit laisser passer la balle sans la toucher. Travail de l'inhibition motrice.", material: "Balles", level: 'avance' },
    { id: 'ch_c12', name: "Simon Says Ping", phase: "cognitif", theme: "Inhibition", duration: 10, description: "Ludique : Le coach donne des ordres de coups. Le joueur ne doit exécuter que si le coach dit 'Simon dit'. Sinon, il doit bloquer passivement.", material: "Balles", level: 'debutant' },

    // --- RETOUR AU CALME ---
    { id: 'ch_rc_lud1', name: "Shadow 'Slow Motion'", phase: "retour-au-calme", theme: "Technique", duration: 10, description: "Reproduire les gestes techniques (Top CD, RV) à 10% de la vitesse réelle. Focus sur la perfection du geste et la respiration.", material: "Raquette", level: 'debutant' },
    { id: 'ch_rc_lud2', name: "Le Défi de la Précision Lente", phase: "retour-au-calme", theme: "Régularité", duration: 10, description: "Échanges en poussette ou bloc très lents. La balle doit être la plus haute possible sans sortir. Objectif : faire redescendre le rythme cardiaque.", material: "Balles", level: 'debutant' },
    { id: 'ch_rc1', name: "Respiration & Étirements 'Zen'", phase: "retour-au-calme", theme: "Retour au calme", duration: 10, description: "Exercices de respiration profonde et étirements légers des avant-bras et des jambes.", material: "Aucun", level: 'debutant' },
    { id: 'ch_rc3', name: "Le Jonglage Musical", phase: "retour-au-calme", theme: "Habileté", duration: 10, description: "Ludique : Jongler en rythme avec une musique calme. S'arrêter pile quand la musique s'arrête.", material: "Musique + Raquette", level: 'debutant' }
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