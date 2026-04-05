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
    { id: 'pb_t1', name: "Top CD sur Balle Coupée (Rythme)", phase: "panier", theme: "Topspin", duration: 15, description: "Distribution régulière de balles coupées longues. Le joueur doit enchaîner les topspins avec un focus sur l'action des jambes.", material: "Panier de balles", level: 'intermediaire' },
    { id: 'pb_t2', name: "Transition RV-CD (Vitesse)", phase: "panier", theme: "Coordination", duration: 15, description: "Distribution alternée RV / CD. Focus sur la vitesse de transition et le placement de la raquette entre les deux coups.", material: "Panier de balles", level: 'avance' },
    { id: 'pb_t3', name: "Pivot Coup Droit (Explosivité)", phase: "panier", theme: "Coup Droit (CD)", duration: 15, description: "Distribution sur le revers. Le joueur doit pivoter et attaquer en coup droit. Focus sur l'explosivité du premier pas.", material: "Panier de balles", level: 'avance' },
    { id: 'pb_t4', name: "Bloc Actif Aléatoire", phase: "panier", theme: "Bloc", duration: 15, description: "Distribution rapide et aléatoire sur toute la table. Le joueur doit bloquer activement en visant des zones précises.", material: "Panier de balles", level: 'avance' },
    { id: 'pb_t5', name: "Smash sur Balle Haute", phase: "panier", theme: "Habileté", duration: 10, description: "Distribution de balles hautes et liftées. Le joueur doit finir le point avec un smash puissant et précis.", material: "Panier de balles", level: 'debutant' },
    { id: 'pb_t6', name: "Top CD en Déplacement (3 points)", phase: "panier", theme: "Jeu de jambes", duration: 20, description: "Distribution sur 3 points (RV, Milieu, CD). Le joueur doit se déplacer et toper en coup droit à chaque fois.", material: "Panier de balles", level: 'pro' },
    { id: 'pb_t7', name: "Remise Courte vs Service Court", phase: "panier", theme: "Remise de service", duration: 15, description: "Distribution de balles courtes et coupées simulant un service. Le joueur doit remettre court derrière le filet.", material: "Panier de balles", level: 'intermediaire' },
    { id: 'pb_t8', name: "Top RV sur Balle Coupée", phase: "panier", theme: "Revers (RV)", duration: 15, description: "Distribution de balles coupées sur le revers. Le joueur doit démarrer en topspin revers avec un bon engagement du poignet.", material: "Panier de balles", level: 'avance' },
    { id: 'pb_t9', name: "Contre-Top à la Table", phase: "panier", theme: "Contre-initiative", duration: 15, description: "Distribution de balles rapides et liftées. Le joueur doit contrer le topspin adverse sans reculer de la table.", material: "Panier de balles", level: 'pro' },
    { id: 'pb_t10', name: "Séquence Service-Top-Top", phase: "panier", theme: "Topspin", duration: 20, description: "Simulation de début de point : 1 remise courte, 1 démarrage sur balle coupée, 1 top sur balle liftée.", material: "Panier de balles", level: 'avance' },

    // --- TECHNIQUE ---
    { id: 'tech_beg_game1', name: "Le Sniper de Gobelets", phase: "technique", theme: "Topspin", duration: 20, description: "Placer 6 gobelets sur la ligne de fond. Le joueur a 10 balles pour en renverser le maximum en Top CD. 1 pt par gobelet.", material: "6 Gobelets", level: 'debutant' },
    { id: 'tech_beg_game2', name: "Le Top-Basket", phase: "technique", theme: "Topspin", duration: 15, description: "Placer un panier dans le coin CD adverse. Le joueur doit faire tomber 5 balles dedans en Top CD. Focus sur la courbe.", material: "Panier / Corbeille", level: 'debutant' },
    { id: 'tech_beg_game3', name: "Passage sous la Ficelle", phase: "technique", theme: "Topspin", duration: 20, description: "Tendre une ficelle à 20cm au-dessus du filet. La balle doit passer entre le filet et la ficelle en Top CD. 10 réussites.", material: "Ficelle / Élastique", level: 'debutant' },
    { id: 'tech_beg_game4', name: "Duel des Zones (A4)", phase: "technique", theme: "Topspin", duration: 20, description: "Placer 2 feuilles A4 dans les coins. L'entraîneur annonce 'Gauche' ou 'Droite' au dernier moment. Toucher la feuille = 2 pts.", material: "2 Feuilles A4", level: 'debutant' },
    { id: 'tech_beg_game5', name: "Le Top-Bowling", phase: "technique", theme: "Topspin", duration: 15, description: "Faire une pyramide de 3 balles sur la table. Le joueur doit la détruire avec un Top CD puissant. 3 essais par tour.", material: "Balles", level: 'debutant' },
    { id: 'tech_beg_game6', name: "La Cible de l'Entraîneur", phase: "technique", theme: "Topspin", duration: 15, description: "L'entraîneur déplace une boîte sur la table. Le joueur doit la toucher en Top CD pendant qu'elle bouge. Réactivité.", material: "Boîte de balles vide", level: 'debutant' },
    { id: 'tech_beg_game7', name: "Séquence 1-2-3", phase: "technique", theme: "Topspin", duration: 20, description: "Toucher dans l'ordre : Coin CD, Milieu, Coin RV (tout en Top CD). Recommencer à zéro si erreur d'ordre.", material: "Balles", level: 'debutant' },
    { id: 'tech_beg_game8', name: "Le Défi de la Ligne Blanche", phase: "technique", theme: "Topspin", duration: 15, description: "Le joueur doit toucher la ligne blanche du fond de table. 5 pts par impact direct sur la ligne. Jeu en 20 pts.", material: "Balles", level: 'debutant' },
    { id: 'tech_beg_game9', name: "Le Top-Chrono 30s", phase: "technique", theme: "Topspin", duration: 10, description: "Combien de Top CD réussis sur la table en 30 secondes ? Record du club à battre. Focus sur la régularité rapide.", material: "Chronomètre", level: 'debutant' },
    { id: 'tech_beg_game10', name: "Le Net-Top (Frôlement)", phase: "technique", theme: "Topspin", duration: 15, description: "La balle doit toucher le filet et tomber juste derrière. Apprend à 'frotter' finement la balle. 5 réussites.", material: "Balles", level: 'debutant' },

    // --- DÉPLACEMENT ---
    { id: 'ch_d_beg1', name: "Le Roi du Milieu", phase: "deplacement", theme: "Jeu de jambes", duration: 10, description: "Après CHAQUE coup joué, le joueur doit toucher la ligne centrale avec sa main libre avant de rejouer. Objectif : 20 coups sans oublier le retour.", material: "Aucun", level: 'debutant' },
    { id: 'ch_d_beg2', name: "Le Slalom des Balles", phase: "deplacement", theme: "Motricité", duration: 10, description: "Placer 3 balles espacées sur la table. Le joueur doit faire du shadow play en se déplaçant autour des balles sans les toucher.", material: "3 Balles", level: 'debutant' },
    { id: 'ch_d_beg3', name: "Le Miroir Latéral", phase: "deplacement", theme: "Réflexes", duration: 10, description: "L'entraîneur déplace sa main gauche ou droite. Le joueur doit se déplacer latéralement (pas chassés) pour rester face à la main.", material: "Aucun", level: 'debutant' },
    { id: 'ch_d_beg4', name: "L'Étoile des 4 Coins", phase: "deplacement", theme: "Vitesse", duration: 15, description: "Le joueur doit toucher les 4 coins de la table avec sa raquette dans l'ordre (CD, RV, CD, RV) le plus vite possible. Chrono sur 10 tours.", material: "Chronomètre", level: 'debutant' },
    { id: 'ch_d_beg5', name: "Le Pas Chassé Musical", phase: "deplacement", theme: "Rythme", duration: 10, description: "Se déplacer en pas chassés au rythme des tapes de balle de l'entraîneur. Si le rythme s'arrête, le joueur se fige en position d'attente.", material: "Balles", level: 'debutant' },
    { id: 'ch_d_beg6', name: "Le Garde du But", phase: "deplacement", theme: "Bloc", duration: 15, description: "L'entraîneur envoie des balles très larges. Le joueur ne doit pas croiser les pieds mais utiliser uniquement les pas chassés pour bloquer.", material: "Balles", level: 'debutant' },
    { id: 'ch_d_beg7', name: "1-2-3 Pivot", phase: "deplacement", theme: "Coup Droit (CD)", duration: 15, description: "Séquence imposée : 1 revers, 1 coup droit, 1 pivot (tourner pour jouer CD). Répéter la boucle 10 fois sans erreur d'ordre.", material: "Balles", level: 'debutant' },
    { id: 'ch_d_beg8', name: "Le Serpent de Table", phase: "deplacement", theme: "Agilité", duration: 10, description: "Le joueur longe la table en pas chassés (avant/arrière) tout en jonglant avec sa balle. Interdiction de faire tomber la balle.", material: "Raquette + Balle", level: 'debutant' },
    { id: 'ch_d_beg9', name: "Le Défi de la Ligne", phase: "deplacement", theme: "Placement", duration: 10, description: "Tracer une ligne au sol (ou utiliser le carrelage). Le joueur doit jouer ses balles en restant toujours derrière cette ligne.", material: "Scotch ou Sol", level: 'debutant' },
    { id: 'ch_d_beg10', name: "Le Roi du Ring", phase: "deplacement", theme: "Zone", duration: 15, description: "Délimiter un petit carré au sol avec du scotch. Le joueur doit jouer tous les échanges en restant dans le carré (travail de placement fin).", material: "Scotch", level: 'debutant' },
    { id: 'ch_d_lud1', name: "Le Chasseur de Zones", phase: "deplacement", theme: "Incertitude", duration: 20, description: "Distribution aléatoire sur 3 zones (RV, Milieu, CD). Le joueur doit toucher la zone annoncée par l'entraîneur au dernier moment. 10 réussites pour gagner.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_d_lud2', name: "Navette Latérale Chrono", phase: "deplacement", theme: "Vitesse", duration: 15, description: "Déplacement plein CD / plein RV. Combien de touches en 30 secondes ? Record à battre : 25 touches. Focus sur l'explosivité des appuis.", material: "Chronomètre", level: 'avance' },
    { id: 'ch_d_lud3', name: "Le Huit Explosif", phase: "deplacement", theme: "Jeu de jambes", duration: 20, description: "Parcours : RV coin -> Milieu (pivot) -> CD coin -> Milieu (RV). Dessine un 8. Le joueur doit toujours viser le revers adverse.", material: "Balles", level: 'pro' },

    // --- SCHÉMA DE JEU ---
    { id: 'ch_s_beg1', name: "Service Court - Poussette - Poussette", phase: "schema", theme: "Poussette", duration: 15, description: "Apprendre le jeu court. Service court, remise poussette, et remise poussette adverse. Focus sur le contrôle.", material: "Balles", level: 'debutant' },
    { id: 'ch_s_beg2', name: "Service Long - Bloc - Bloc", phase: "schema", theme: "Bloc", duration: 15, description: "Apprendre à tenir l'échange après un service long. Le partenaire attaque doucement, le débutant bloque.", material: "Balles", level: 'debutant' },
    { id: 'ch_s_beg3', name: "Poussette RV - Poussette RV - Top CD", phase: "schema", theme: "Coordination", duration: 20, description: "Enchaînement : 2 poussettes en revers, puis décalage pour un topspin coup droit. Transition défense/attaque.", material: "Balles", level: 'debutant' },
    { id: 'ch_s_beg4', name: "Service CD - Retour RV - Poussette CD", phase: "schema", theme: "Placement", duration: 20, description: "Travailler les angles. Service plein coup droit, retour plein revers, puis remise en poussette plein coup droit.", material: "Balles", level: 'debutant' },
    { id: 'ch_s_beg5', name: "Le Jeu des 3 Coups", phase: "schema", theme: "Tactique", duration: 20, description: "Service, remise, et première attaque. Le point s'arrête après le 3ème coup. Focus sur la qualité du démarrage.", material: "Balles", level: 'debutant' },
    { id: 'ch_s_beg6', name: "La Diagonale Infinie", phase: "schema", theme: "Régularité", duration: 15, description: "Maintenir la balle dans la diagonale CD. Au signal du coach, le joueur doit changer de ligne (jouer droit).", material: "Balles", level: 'debutant' },
    { id: 'ch_s_beg7', name: "Changement de Ligne (2-1)", phase: "schema", theme: "Placement", duration: 20, description: "2 coups en diagonale, 1 coup en ligne. Apprendre à varier les zones de jeu pour surprendre.", material: "Balles", level: 'debutant' },
    { id: 'ch_s_beg8', name: "Le Coude du Coach", phase: "schema", theme: "Placement", duration: 20, description: "Après un coup large (CD ou RV), le joueur doit viser le milieu de la table (le coude) pour gêner l'adversaire.", material: "Balles", level: 'debutant' },
    { id: 'ch_s_beg9', name: "Service Court - Remise Longue - Bloc", phase: "schema", theme: "Bloc", duration: 15, description: "Service court, l'adversaire remet long, le joueur doit bloquer la balle. Travail de la lecture de profondeur.", material: "Balles", level: 'debutant' },
    { id: 'ch_s_beg10', name: "Attaque sur Balle Haute", phase: "schema", theme: "Habileté", duration: 15, description: "Le partenaire envoie une balle haute (lob). Le débutant doit finir le point avec un geste descendant.", material: "Balles", level: 'debutant' },
    { id: 'ch_s_lud1', name: "Le Piège de la Remise Courte", phase: "schema", theme: "Remise de service", duration: 20, description: "Service court. Le relanceur doit remettre court (2 rebonds). Si la balle sort, le serveur attaque. Jeu en 7 points : bonus si la remise est 'morte'.", material: "Balles", level: 'avance' },
    { id: 'ch_s_lud5', name: "Le Duel du Premier Top", phase: "schema", theme: "Topspin", duration: 20, description: "Service libre. Le relanceur doit remettre long. Le serveur doit toper la première balle dans une zone précise. Si le top est réussi, le point continue normalement.", material: "Balles", level: 'avance' },
    { id: 'ch_s_lud6', name: "L'Incertitude du Milieu", phase: "schema", theme: "Placement", duration: 20, description: "Match à thème : Tous les coups d'attaque doivent viser le coude de l'adversaire. Si l'adversaire est forcé de se décaler, point bonus.", material: "Balles", level: 'pro' },
    { id: 'ch_s_lud4', name: "Scénario 'Fin de Set' (9-9)", phase: "schema", theme: "Mental", duration: 15, description: "Matchs commençant à 9-9. Le serveur n'a qu'un seul service. Interdiction de servir long. Focus sur la gestion du stress.", material: "Balles", level: 'intermediaire' },

    // --- MATCHS ---
    { id: 'ch_m_lud1', name: "Match 'Cibles Vivantes'", phase: "matchs", theme: "Placement", duration: 20, description: "Match classique en 11 pts. Si un joueur gagne le point en touchant un angle de table (cible imaginaire), le point compte double.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_m_lud2', name: "Match 'Service Unique'", phase: "matchs", theme: "Mental", duration: 20, description: "Match classique mais le serveur n'a droit qu'à un seul service (pas de deuxième balle). Travail de la sécurité et de la concentration.", material: "Balles", level: 'avance' },
    { id: 'ch_m_lud3', name: "Match 'Montée-Descente'", phase: "matchs", theme: "Tactique", duration: 20, description: "Sets rapides en 5 points. Le gagnant monte de table, le perdant descend. Objectif : atteindre la table n°1.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_m_lud4', name: "Match 'Zones Interdites'", phase: "matchs", theme: "Placement", duration: 20, description: "Match en 11 pts. Interdiction de jouer dans le coude (milieu de table). Si la balle rebondit au milieu, le point est perdu.", material: "Balles", level: 'avance' },
    { id: 'ch_m_lud5', name: "Match 'Bonus 3ème Balle'", phase: "matchs", theme: "Topspin", duration: 20, description: "Si le serveur gagne le point sur sa première attaque (3ème coup), il marque 3 points d'un coup.", material: "Balles", level: 'avance' },
    { id: 'ch_m_lud6', name: "Match 'Le Mur'", phase: "matchs", theme: "Bloc", duration: 15, description: "Un joueur ne peut que bloquer (pas d'attaque). L'autre doit gagner le point par l'attaque. Inversion des rôles à 5 pts.", material: "Balles", level: 'debutant' },
    { id: 'ch_m_lud7', name: "Match 'Service Secret'", phase: "matchs", theme: "Service", duration: 20, description: "Avant de servir, le serveur annonce l'effet (Coupé ou Lifté). S'il ment et gagne le point, il marque double.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_m_lud8', name: "Match 'Double Impact'", phase: "matchs", theme: "Mental", duration: 20, description: "Pour marquer 1 point au score, il faut gagner 2 échanges consécutifs. Travail de la constance mentale.", material: "Balles", level: 'pro' },
    { id: 'ch_m_lud9', name: "Match 'Vitesse Éclair'", phase: "matchs", theme: "Vitesse", duration: 15, description: "Sets très courts en 3 points gagnants. Interdiction de servir court. Jeu ultra-rapide.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_m_lud10', name: "Match 'Coopération'", phase: "matchs", theme: "Régularité", duration: 15, description: "Le point ne peut être 'fini' qu'après au moins 5 échanges de régularité. Apprend à construire avant de conclure.", material: "Balles", level: 'debutant' },
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
    { id: 'ch_c13', name: "Le Code Secret", phase: "cognitif", theme: "Mémoire", duration: 15, description: "Associer un numéro à une zone (1=CD, 2=RV, 3=Centre). L'entraîneur crie un numéro, le joueur doit viser la zone correspondante.", material: "Balles", level: 'debutant' },
    { id: 'ch_c14', name: "L'Intrus", phase: "cognitif", theme: "Perception", duration: 15, description: "L'entraîneur lance 3 balles de suite. Le joueur ne doit frapper que celle qui a une couleur différente des autres.", material: "Balles de couleurs", level: 'intermediaire' },
    { id: 'ch_c15', name: "Le Chef d'Orchestre", phase: "cognitif", theme: "Inhibition", duration: 10, description: "L'entraîneur pointe une direction, le joueur doit jouer dans la direction opposée. Travail de l'inhibition et de la réactivité.", material: "Aucun", level: 'avance' },
    { id: 'ch_c16', name: "Maths en Mouvement", phase: "cognitif", theme: "Multitâche", duration: 15, description: "Pendant l'échange, l'entraîneur donne une opération (ex: 10-3). Le joueur doit répondre tout en maintenant la régularité.", material: "Balles", level: 'intermediaire' },
    { id: 'ch_c17', name: "Le Chrono Mental", phase: "cognitif", theme: "Vitesse", duration: 10, description: "Jouer le plus de balles possible en 10 secondes. Au coup de sifflet, arrêt immédiat (freeze). Travail de la concentration intense.", material: "Sifflet", level: 'debutant' },
    { id: 'ch_c18', name: "La Séquence Infernale", phase: "cognitif", theme: "Mémoire", duration: 15, description: "L'entraîneur montre une suite de 3 gestes (ex: CD, RV, Pivot). Le joueur doit reproduire la séquence exacte en shadow play.", material: "Aucun", level: 'avance' },
    { id: 'ch_c19', name: "Couleur = Coup", phase: "cognitif", theme: "Décision", duration: 15, description: "Règle : Balle Rouge = CD, Balle Bleue = RV. L'entraîneur varie les couleurs de balles envoyées. Le joueur doit s'adapter.", material: "Balles de couleurs", level: 'intermediaire' },
    { id: 'ch_c20', name: "Le Silence", phase: "cognitif", theme: "Focus", duration: 10, description: "Match ou échange en silence total. Interdiction de faire le moindre bruit (pas de 'hop', pas de cri). Si bruit = point perdu.", material: "Aucun", level: 'debutant' },
    { id: 'ch_c21', name: "Le Décompte", phase: "cognitif", theme: "Focus", duration: 10, description: "Compter à voix haute chaque échange réussi. Si on rate, on recommence à zéro. Objectif : atteindre 20.", material: "Aucun", level: 'debutant' },
    { id: 'ch_c22', name: "Le Joker", phase: "cognitif", theme: "Stratégie", duration: 15, description: "Match en 11 pts. Chaque joueur a 1 'Joker' pour choisir son côté de service ou annuler un point adverse.", material: "Balles", level: 'debutant' },
    { id: 'ch_c23', name: "Le Topo-Top", phase: "cognitif", theme: "Réaction", duration: 10, description: "Échange en régularité. Au signal du coach, le joueur doit immédiatement attaquer en Topspin.", material: "Balles", level: 'debutant' },
    { id: 'ch_c24', name: "Le Service Météo", phase: "cognitif", theme: "Association", duration: 10, description: "Le coach crie un mot : 'Soleil' = Service CD, 'Pluie' = Service RV. Le joueur doit réagir vite.", material: "Balles", level: 'debutant' },
    { id: 'ch_c25', name: "Le Défi du Regard", phase: "cognitif", theme: "Concentration", duration: 10, description: "Le joueur doit maintenir le contact visuel avec le coach tout en renvoyant les balles. Interdiction de regarder sa raquette.", material: "Balles", level: 'debutant' },
    { id: 'ch_c26', name: "La Balle Interdite", phase: "cognitif", theme: "Inhibition", duration: 10, description: "L'entraîneur envoie 3 balles. Le joueur ne doit PAS toucher celle qui est rouge (ou marquée).", material: "Balles de couleurs", level: 'debutant' },
    { id: 'ch_c27', name: "Le Chrono des 10", phase: "cognitif", theme: "Vitesse", duration: 10, description: "Combien de temps pour envoyer 10 balles dans la zone cible ? Le joueur doit battre son propre record.", material: "Chronomètre", level: 'debutant' },
    { id: 'ch_c28', name: "Rouge = Attaque", phase: "cognitif", theme: "Association", duration: 15, description: "Balle Rouge = Attaque forte. Balle Bleue = Bloc doux. Travail de l'association couleur-intensité.", material: "Balles de couleurs", level: 'debutant' },
    { id: 'ch_c29', name: "Le Roi du Silence", phase: "cognitif", theme: "Contrôle", duration: 10, description: "Jouer un échange de 2 minutes sans faire aucun bruit. Si bruit = recommencer. Travail de la maîtrise de soi.", material: "Aucun", level: 'debutant' },
    { id: 'ch_c30', name: "Le Chef d'Orchestre (Débutant)", phase: "cognitif", theme: "Mémoire", duration: 10, description: "Le coach montre un geste (CD ou RV). Le joueur doit imiter le geste en shadow play avant de jouer la balle.", material: "Aucun", level: 'debutant' },

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