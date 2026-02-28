import { Phase, Exercise, Session, Skill, Player, Cycle, PlayerEvaluation, PhaseId, ExerciseLevel } from './types';

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
    
    // --- ÉCHAUFFEMENT ENFANTS (-10 ANS) ---
    { id: 'ch_kid1', name: "Le Miroir Magique", phase: "echauffement", theme: "Coordination", duration: 5, description: "Par deux, l'un imite les déplacements et gestes de l'autre le plus vite possible.", material: "Aucun", level: 'debutant' },
    { id: 'ch_kid2', name: "La Chasse aux Trésors", phase: "echauffement", theme: "Vitesse", duration: 10, description: "Ramasser le plus de balles possible éparpillées au sol et les ramener dans son camp en courant.", material: "Balles et Paniers", level: 'debutant' },
    { id: 'ch_kid3', name: "Le Parcours de l'Espace", phase: "echauffement", theme: "Motricité", duration: 10, description: "Slalom entre des plots, saut au-dessus de mini-haies et passage sous un banc.", material: "Plots, Haies, Banc", level: 'debutant' },
    { id: 'ch_kid4', name: "Jacques a dit... Ping !", phase: "echauffement", theme: "Réflexes", duration: 5, description: "Le coach donne des ordres (CD, RV, Saut, Touche le sol). On n'exécute que si 'Jacques a dit' est prononcé.", material: "Aucun", level: 'debutant' },
    { id: 'ch_kid5', name: "Le Relais des Kangourous", phase: "echauffement", theme: "Physique", duration: 10, description: "Course en sautant pieds joints avec la raquette à la main. Passage de témoin (balle).", material: "Raquette et Balle", level: 'debutant' },
    { id: 'ch_kid6', name: "L'Horloge Humaine", phase: "echauffement", theme: "Orientation", duration: 5, description: "Les enfants sont au centre. Le coach crie une heure (ex: 12h = devant, 6h = derrière). Course rapide vers la zone.", material: "Plots", level: 'debutant' },
    { id: 'ch_kid7', name: "Le Gardien de But", phase: "echauffement", theme: "Réflexes", duration: 10, description: "Un enfant protège sa moitié de table avec sa raquette pendant que l'autre essaie de faire rouler la balle au fond.", material: "Balle", level: 'debutant' },
    { id: 'ch_kid8', name: "La Danse des Raquettes", phase: "echauffement", theme: "Habileté", duration: 5, description: "Faire tourner la raquette autour de sa taille, entre ses jambes, changer de main sans la faire tomber.", material: "Raquette", level: 'debutant' },

    // --- RÉGULARITÉ ---
    { id: 'ch_r1', name: "100 Balles CD - Zéro Faute", phase: "regularite", theme: "Coup Droit (CD)", duration: 15, description: "Échanges en diagonale CD. Objectif : 100 échanges sans faute.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r2', name: "Bloc RV vs Topspin CD", phase: "regularite", theme: "Bloc", duration: 15, description: "Un joueur topspin en CD sur le revers adverse. Le bloqueur doit rester précis.", material: "Balles", level: 'avance' },
    { id: 'ch_r3', name: "Liaison 1-1 (CD/RV)", phase: "regularite", theme: "Coordination", duration: 15, description: "Intermédiaire : Alterner 1 coup droit et 1 revers sur le revers adverse. Focus sur le transfert de poids.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r4', name: "Huit de Chiffre (Classique)", phase: "regularite", theme: "Régularité", duration: 20, description: "Joueur A joue toujours en ligne, Joueur B joue toujours en diagonale. Dessine un 8 sur la table.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r4_v2', name: "Le Grand 8 (Amplitude)", phase: "regularite", theme: "Jeu de jambes", duration: 20, description: "Variante du 8 : Joueur A joue ligne/diagonale alternativement, Joueur B bloque en ligne. Force des déplacements latéraux plus larges.", material: "Balles", level: 'avance' },
    { id: 'ch_r9', name: "Le Papillon (Butterfly)", phase: "regularite", theme: "Placement", duration: 20, description: "Séquence : CD croisé, RV croisé, CD ligne, RV ligne. Travail de précision extrême et de rythme.", material: "Balles", level: 'pro' },
    { id: 'ch_r5', name: "Le Triangle de Placement", phase: "regularite", theme: "Placement", duration: 20, description: "Intermédiaire : Joueur A distribue en RV. Joueur B alterne : 1 CD coin, 1 CD milieu, 1 CD coin. Focus sur le replacement.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r6', name: "Régularité Revers 'Piston'", phase: "regularite", theme: "Revers (RV)", duration: 15, description: "Intermédiaire : Échanges rapides en revers sur revers. La balle doit être longue et toucher le dernier tiers de la table.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_r7', name: "Liaison CD/RV sur Pivot", phase: "regularite", theme: "Coordination", duration: 20, description: "Intermédiaire : 1 RV, 1 CD (pivot), 1 RV. Travail de la fluidité du haut du corps et des appuis.", material: "Balles", level: 'avance' },
    { id: 'ch_r8', name: "Contre-Top de Contrôle", phase: "regularite", theme: "Topspin", duration: 15, description: "Intermédiaire : À mi-distance, les deux joueurs font du topspin sur topspin à vitesse modérée. Focus sur la courbe.", material: "Balles", level: 'avance' },

    // --- RÉGULARITÉ ENFANTS (-10 ANS) ---
    { id: 'ch_r_kid1', name: "Le Mur Infranchissable", phase: "regularite", theme: "Régularité", duration: 10, description: "Échanges libres au milieu de la table. L'objectif est de garder la balle en jeu le plus longtemps possible sans chercher à gagner le point.", material: "Balles", level: 'debutant' },
    { id: 'ch_r_kid2', name: "La Diagonale des Champions", phase: "regularite", theme: "Coup Droit (CD)", duration: 15, description: "Échanges uniquement en coup droit dans la diagonale. Compter le record de touches consécutives.", material: "Balles", level: 'debutant' },
    { id: 'ch_r_kid3', name: "Le Revers de Fer", phase: "regularite", theme: "Revers (RV)", duration: 15, description: "Échanges uniquement en revers dans la diagonale. Essayer de battre le record du groupe.", material: "Balles", level: 'debutant' },
    { id: 'ch_r_kid4', name: "Le Ping-Pong Coopératif", phase: "regularite", theme: "Coordination", duration: 10, description: "Alterner un coup droit et un revers très doucement. Le partenaire fait de même pour maintenir l'échange.", material: "Balles", level: 'debutant' },
    { id: 'ch_r_kid5', name: "La Cible Magique", phase: "regularite", theme: "Placement", duration: 15, description: "Placer une feuille de papier sur la table. Essayer de la toucher 5 fois de suite en régularité.", material: "Balles, Feuilles de papier", level: 'debutant' },
    { id: 'ch_r_kid6', name: "Le Jeu du 10", phase: "regularite", theme: "Régularité", duration: 10, description: "Réaliser 10 échanges sans faute. Si réussi, on recule d'un pas et on recommence.", material: "Balles", level: 'debutant' },
    { id: 'ch_r_kid7', name: "Le Slalom de la Balle", phase: "regularite", theme: "Placement", duration: 15, description: "Envoyer la balle alternativement à gauche, puis à droite du partenaire qui reste fixe.", material: "Balles", level: 'debutant' },
    { id: 'ch_r_kid8', name: "L'Échange au Sommet", phase: "regularite", theme: "Habileté", duration: 10, description: "Faire des échanges avec une trajectoire haute (cloches) pour apprendre à contrôler le rebond et le timing.", material: "Balles", level: 'debutant' },

    // --- TECHNIQUE ---
    { id: 'ch_t_beg1', name: "Apprentissage Geste CD", phase: "technique", theme: "Coup Droit (CD)", duration: 20, description: "Décomposition du geste de coup droit. Focus sur l'ouverture de la raquette et la fin de geste au front.", material: "Balles", level: 'debutant' },
    { id: 'ch_t_beg2', name: "Apprentissage Geste RV", phase: "technique", theme: "Revers (RV)", duration: 20, description: "Décomposition du geste de revers. Focus sur l'action du coude et l'accompagnement vers l'avant.", material: "Balles", level: 'debutant' },
    { id: 'ch_t_beg3', name: "Panier : CD sur Balle Lancée", phase: "technique", theme: "Coup Droit (CD)", duration: 15, description: "Le coach lance des balles douces à la main. Le joueur doit toucher une zone précise en coup droit.", material: "Panier de balles", level: 'debutant' },
    { id: 'ch_t_beg4', name: "Panier : RV sur Balle Lancée", phase: "technique", theme: "Revers (RV)", duration: 15, description: "Le coach lance des balles douces à la main. Le joueur doit toucher une zone précise en revers.", material: "Panier de balles", level: 'debutant' },
    { id: 'ch_t_beg5', name: "Liaison CD/RV Lente", phase: "technique", theme: "Coordination", duration: 20, description: "Alterner un coup droit et un revers sur des balles très lentes. Focus sur le passage d'une prise à l'autre.", material: "Balles", level: 'debutant' },
    { id: 'ch_t_beg6', name: "La Poussette de Base", phase: "technique", theme: "Poussette", duration: 15, description: "Apprendre à passer sous la balle pour la renvoyer coupée. Geste court et précis.", material: "Balles", level: 'debutant' },

    { id: 'ch_t_int1', name: "Topspin CD sur Bloc", phase: "technique", theme: "Topspin", duration: 20, description: "Intermédiaire : Enchaîner des topspins CD on un bloc passif. Focus sur le replacement et la jambe d'appui.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t_int2', name: "Topspin RV on Bloc", phase: "technique", theme: "Topspin", duration: 20, description: "Intermédiaire : Enchaîner des topspins RV on un bloc passif. Travail de la stabilité du coude.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t_int3', name: "Bloc Actif CD", phase: "technique", theme: "Bloc", duration: 15, description: "Intermédiaire : Sur un topspin adverse, fermer la raquette et avancer pour accélérer la balle en coup droit.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t_int4', name: "Bloc Actif RV", phase: "technique", theme: "Bloc", duration: 15, description: "Intermédiaire : Sur un topspin adverse, fermer la raquette et avancer pour accélérer la balle en revers.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t_int5', name: "Liaison Poussette / Top CD", phase: "technique", theme: "Topspin", duration: 20, description: "Intermédiaire : 1 poussette CD, puis 1 topspin CD sur balle longue. Travail de la transition défense/attaque.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t_int6', name: "Liaison Poussette / Top RV", phase: "technique", theme: "Topspin", duration: 20, description: "Intermédiaire : 1 poussette RV, puis 1 topspin RV sur balle longue. Travail de l'ouverture de raquette.", material: "Balles", level: 'intermediaire' },

    { id: 'ch_t1', name: "Topspin CD sur Balle Coupée", phase: "technique", theme: "Topspin", duration: 20, description: "L'entraîneur distribue des balles coupées lourdes. Action forte de l'avant-bras.", material: "Panier de balles", level: 'avance' },
    { id: 'ch_t2', name: "Topspin de Rotation (Sauce)", phase: "technique", theme: "Topspin", duration: 20, description: "Intermédiaire : Produire un maximum de rotation sur balle coupée lente. La balle doit 'gicler' au rebond.", material: "Balles", level: 'avance' },
    { id: 'ch_t3', name: "Contre-Bloc Actif RV", phase: "technique", theme: "Bloc", duration: 15, description: "Intermédiaire : Sur un topspin adverse, fermer la raquette et avancer pour accélérer la balle.", material: "Balles", level: 'pro' },
    { id: 'ch_t4', name: "Topspin RV sur Balle Coupée", phase: "technique", theme: "Topspin", duration: 20, description: "Intermédiaire : Action du poignet et de l'avant-bras pour remonter une balle coupée en revers. Focus sur l'ouverture de raquette.", material: "Balles", level: 'avance' },
    { id: 'ch_t5', name: "Flip Revers (Chiquita)", phase: "technique", theme: "Flip", duration: 15, description: "Intermédiaire : Sur balle courte, passer sous la balle avec un mouvement circulaire du poignet pour attaquer en rotation.", material: "Balles", level: 'pro' },
    { id: 'ch_t6', name: "Flip Coup Droit (Agressif)", phase: "technique", theme: "Flip", duration: 15, description: "Intermédiaire : Attaque de balle courte en coup droit. Action sèche du poignet vers l'avant.", material: "Balles", level: 'pro' },
    { id: 'ch_t7', name: "Bloc Amorti (Toucher)", phase: "technique", theme: "Bloc", duration: 15, description: "Intermédiaire : Absorber la vitesse du topspin adverse pour que la balle retombe juste derrière le filet.", material: "Balles", level: 'avance' },
    { id: 'ch_t8', name: "Bloc Latéral (Side-spin)", phase: "technique", theme: "Bloc", duration: 15, description: "Intermédiaire : Frotter la balle latéralement au moment du bloc pour changer sa trajectoire et surprendre l'adversaire.", material: "Balles", level: 'pro' },
    { id: 'ch_t9', name: "Topspin CD sur Bloc", phase: "technique", theme: "Topspin", duration: 20, description: "Intermédiaire : Enchaîner plusieurs topspins puissants sur un bloc adverse. Focus sur le replacement et la jambe d'appui.", material: "Balles", level: 'avance' },
    { id: 'ch_t10', name: "Topspin RV sur Bloc", phase: "technique", theme: "Topspin", duration: 20, description: "Intermédiaire : Enchaîner des topspins revers sur bloc. Travail de la stabilité du coude.", material: "Balles", level: 'avance' },
    { id: 'ch_t11', name: "Frappe Terminale (Smash)", phase: "technique", theme: "Vitesse", duration: 15, description: "Intermédiaire : Finition sur balle haute ou facile. Action de percussion maximale.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t12', name: "Poussette Active (Pression)", phase: "technique", theme: "Poussette", duration: 15, description: "Intermédiaire : Poussette longue et rapide pour empêcher l'adversaire d'attaquer facilement.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_t13', name: "Contre-Topspin à la table", phase: "technique", theme: "Topspin", duration: 20, description: "Intermédiaire : Prendre la balle au sommet du rebond pour contrer le topspin adverse sans reculer.", material: "Balles", level: 'pro' },
    { id: 'ch_t14', name: "Topspin CD Side-spin", phase: "technique", theme: "Topspin", duration: 20, description: "Intermédiaire : Topspin avec effet latéral pour faire sortir la balle de la table après le rebond.", material: "Balles", level: 'pro' },
    { id: 'ch_t_p1', name: "Panier : Topspin CD (Rotation Max)", phase: "technique", theme: "Topspin", duration: 20, description: "Distribution lente de balles très coupées. Action de jambe explosive.", material: "Panier de balles", level: 'avance' },
    { id: 'ch_t_p2', name: "Panier : Liaison RV / CD (Fréquence)", phase: "technique", theme: "Coordination", duration: 15, description: "Distribution rapide alternée RV/CD sur un point fixe.", material: "Panier de balles", level: 'avance' },

    // --- DÉPLACEMENT ---
    { id: 'ch_d_beg1', name: "Pas Chassés de Base", phase: "deplacement", theme: "Jeu de jambes", duration: 15, description: "Déplacement latéral simple entre deux plots. Focus on la flexion des jambes et le non-croisement des pieds.", material: "Plots", level: 'debutant' },
    { id: 'ch_d_beg2', name: "Le Carré Magique", phase: "deplacement", theme: "Jeu de jambes", duration: 15, description: "Déplacement en carré : Avancer, Pas chassé, Reculer, Pas chassé. Travail de l'équilibre.", material: "Plots", level: 'debutant' },
    { id: 'ch_d_beg3', name: "Déplacement CD/RV Alterné", phase: "deplacement", theme: "Coordination", duration: 20, description: "Un coup droit au milieu, un revers au milieu. Petit saut de replacement entre chaque coup.", material: "Balles", level: 'debutant' },
    { id: 'ch_d_beg4', name: "Le Miroir (Déplacement)", phase: "deplacement", theme: "Réflexes", duration: 10, description: "Suivre les déplacements latéraux du coach ou d'un partenaire sans balle. Réactivité maximale.", material: "Aucun", level: 'debutant' },
    { id: 'ch_d_beg5', name: "Slalom Raquette en Main", phase: "deplacement", theme: "Motricité", duration: 15, description: "Slalom entre des plots en gardant la balle en équilibre on la raquette. Travail de la dissociation haut/bas.", material: "Plots, Raquette, Balle", level: 'debutant' },

    { id: 'ch_d_int1', name: "Petits Pas de Réajustement", phase: "deplacement", theme: "Jeu de jambes", duration: 15, description: "Intermédiaire : Le partenaire distribue des balles légèrement décalées. Obligation de faire des micro-ajustements pour être toujours bien placé.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_d_int2', name: "Déplacement Latéral CD/CD", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Intermédiaire : Frapper un coup droit au milieu, puis un coup droit au coin. Focus on la vitesse latérale.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_d_int3', name: "Le Triangle (Intermédiaire)", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Intermédiaire : 1 RV coin, 1 CD milieu, 1 CD coin. Travail de la fluidité des appuis.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_d_int4', name: "Liaison Pivot / CD Large", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Intermédiaire : 1 CD en pivot (coin RV), puis 1 CD plein coup droit. Travail de l'amplitude.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_d_int5', name: "Déplacement Avant/Arrière (Court/Long)", phase: "deplacement", theme: "Jeu de jambes", duration: 15, description: "Intermédiaire : 1 poussette courte (avancer), 1 topspin long (reculer). Travail de la profondeur.", material: "Balles", level: 'intermediaire' },

    { id: 'ch_d1', name: "Le 'Falkenberg' Chinois", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Séquence : 1 RV milieu, 1 CD milieu (pivot), 1 CD plein coup droit.", material: "Balles", level: 'pro' },
    { id: 'ch_d2', name: "Déplacement en Triangle", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Intermédiaire : 1 CD au milieu, 1 CD au coin, 1 CD au milieu. Petits pas de réajustement.", material: "Balles", level: 'avance' },
    { id: 'ch_d_p1', name: "Panier : Déplacement 'Grande Amplitude'", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Distribution alternée plein RV / plein CD. Pas chassés explosifs.", material: "Panier de balles", level: 'pro' },

    // --- SCHÉMA DE JEU ---
    { id: 'ch_s_int1', name: "Schéma : Service Court / Remise Longue / Top CD", phase: "schema", theme: "Topspin", duration: 20, description: "Intermédiaire : Service court, remise adverse longue en CD, démarrage immédiat en topspin CD.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_s_int2', name: "Schéma : Service Long / Bloc / Contre-initiative", phase: "schema", theme: "Contre-initiative", duration: 20, description: "Intermédiaire : Service long pour provoquer l'attaque, bloc précis, puis contre-attaque on la balle suivante.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_s_int3', name: "Schéma : Poussette RV / Poussette CD / Top CD", phase: "schema", theme: "Topspin", duration: 20, description: "Intermédiaire : Duel de poussettes, puis accélération en topspin CD dès que la balle est favorable.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_s_int4', name: "Schéma : Service RV / Remise Milieu / Top RV", phase: "schema", theme: "Topspin", duration: 20, description: "Intermédiaire : Service revers, remise adverse au milieu, démarrage en topspin revers.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_s_int5', name: "Schéma : Service CD / Remise RV / Bloc CD", phase: "schema", theme: "Bloc", duration: 20, description: "Intermédiaire : Service CD, remise adverse agressive en RV, bloc de contrôle en CD.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_s_int6', name: "Schéma : Service Court CD / Remise CD / Top CD Ligne", phase: "schema", theme: "Placement", duration: 20, description: "Intermédiaire : Service court CD, remise adverse en CD, attaque en topspin CD le long de la ligne.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_s_int7', name: "Schéma : Service Long RV / Bloc RV / Top CD Pivot", phase: "schema", theme: "Topspin", duration: 20, description: "Intermédiaire : Service long revers, bloc adverse en RV, pivot rapide pour attaquer en topspin CD.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_s_int8', name: "Schéma : Poussette RV / Poussette RV / Top RV", phase: "schema", theme: "Topspin", duration: 20, description: "Intermédiaire : Échange de poussettes en revers, puis ouverture agressive en topspin revers.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_s_int9', name: "Schéma : Court-Court / Poussette Longue / Top CD", phase: "schema", theme: "Topspin", duration: 20, description: "Intermédiaire : Échange court au-dessus de la table, puis démarrage sur la première balle longue adverse.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_s_int10', name: "Schéma : Service Milieu / Remise Aléatoire / Top CD", phase: "schema", theme: "Incertitude", duration: 20, description: "Intermédiaire : Service au milieu, remise adverse libre, réaction rapide pour attaquer en coup droit.", material: "Balles", level: 'intermediaire' },

    { id: 'ch_s1', name: "3ème Balle : Service / Remise / Attaque", phase: "schema", theme: "Incertitude", duration: 20, description: "Service court, remise poussette longue, attaque immédiate.", material: "Balles", level: 'avance' },
    { id: 'ch_s2', name: "Incertitude Milieu/Côté", phase: "schema", theme: "Incertitude", duration: 20, description: "Intermédiaire : Le bloqueur distribue aléatoirement soit au milieu, soit on le côté. Réaction visuelle.", material: "Balles", level: 'avance' },
    { id: 'ch_s3', name: "Service Latéral / Flip RV", phase: "schema", theme: "Flip", duration: 15, description: "Intermédiaire : Service latéral sortant, remise courte, flip revers agressive pour prendre l'initiative.", material: "Balles", level: 'pro' },

    // --- MATCHS ---
    { id: 'ch_m1', name: "Match à Handicap (9-9)", phase: "matchs", theme: "Mental", duration: 15, description: "Le set commence à 9-9. Chaque point est crucial.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_m2', name: "Match 'Interdiction de Couper'", phase: "matchs", theme: "Tactique", duration: 20, description: "Intermédiaire : Interdiction de faire une poussette après la remise. Obligation d'attaquer ou de bloquer.", material: "Balles", level: 'avance' },

    // --- COGNITIF ---
    { id: 'ch_c1', name: "Réaction aux Couleurs", phase: "cognitif", theme: "Réflexes", duration: 10, description: "L'entraîneur annonce une couleur juste avant de distribuer.", material: "Plots de couleurs", level: 'debutant' },
    { id: 'ch_c2', name: "Signal Sonore (Top vs Poussette)", phase: "cognitif", theme: "Réflexes", duration: 15, description: "Intermédiaire : Si le coach crie 'TOP', le joueur attaque. Sinon, il remet court.", material: "Aucun", level: 'intermediaire' },

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