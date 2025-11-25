import { Phase, Exercise, Session, Skill } from './types';

// Couleurs modernisées : Plus douces pour le fond, bordures claires
export const PHASES: Phase[] = [
  { id: 'echauffement', label: 'ÉCHAUFFEMENT', duration: 15, color: 'bg-orange-50 border-orange-200 text-orange-900' },
  { id: 'regularite', label: 'RÉGULARITÉ', duration: 20, color: 'bg-sky-50 border-sky-200 text-sky-900' },
  { id: 'technique', label: 'TECHNIQUE', duration: 25, color: 'bg-indigo-50 border-indigo-200 text-indigo-900' },
  { id: 'schema', label: 'SCHÉMA DE JEU', duration: 15, color: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
  { id: 'matchs', label: 'MATCHS VARIÉS', duration: 15, color: 'bg-rose-50 border-rose-200 text-rose-900' }
];

export const THEMES: string[] = ['Coup Droit (CD)', 'Revers (RV)', 'Topspin', 'Service', 'Poussette', 'Jeu de jambes', 'Bloc', 'Contre-initiative', 'Flip', 'Remise de service'];

export const INITIAL_EXERCISES: Exercise[] = [
  // --- ÉCHAUFFEMENT (E1-E10) ---
  { id: 'e1', name: 'Échauffement articulaire', phase: 'echauffement', theme: null, duration: 5, description: 'Rotation des poignets, épaules, chevilles, genoux et nuque. Mouvements doux pour lubrifier les articulations.', material: 'Aucun' },
  { id: 'e2', name: 'Jeu du loup', phase: 'echauffement', theme: 'Jeu de jambes', duration: 8, description: 'Déplacements ludiques autour des tables. Un "loup" doit toucher les autres joueurs. Favorise les pas chassés.', material: 'Plots' },
  { id: 'e3', name: 'Corde à sauter', phase: 'echauffement', theme: 'Jeu de jambes', duration: 5, description: 'Séries de sauts (pieds joints, alternés, double-under) pour activer le cardio et la tonicité des mollets.', material: 'Cordes à sauter' },
  { id: 'e4', name: 'Ombres (Shadow Play)', phase: 'echauffement', theme: 'Technique', duration: 5, description: 'Répétition des gestes techniques (Topspin CD/RV) dans le vide devant un miroir ou face au coach pour corriger la posture.', material: 'Miroir (optionnel)' },
  { id: 'e5', name: 'Jeu de la balle brûlante', phase: 'echauffement', theme: 'Réflexes', duration: 5, description: 'En cercle, se passer la balle à la main le plus vite possible sans la faire tomber.', material: 'Balles' },
  { id: 'e6', name: 'Jonglages de précision', phase: 'echauffement', theme: 'Réflexes', duration: 5, description: 'Jongler avec la tranche, alterner face coup droit/revers, jongler assis/debout. Développe le toucher.', material: 'Balles' },
  { id: 'e7', name: 'Pas chassés miroir', phase: 'echauffement', theme: 'Jeu de jambes', duration: 5, description: 'Deux joueurs face à face sans table. Le meneur fait des pas latéraux, le suiveur doit imiter instantanément.', material: 'Aucun' },
  { id: 'e8', name: 'Panier Fréquence Cardio', phase: 'echauffement', theme: 'Jeu de jambes', duration: 5, description: 'Distribution très rapide de balles simples (sans effet) pour faire monter le rythme cardiaque avant la séance.', material: 'Panier de balles' },

  // --- RÉGULARITÉ (R1-R15) ---
  { id: 'r1', name: 'Gammes CD/RV Diagonales', phase: 'regularite', theme: 'Coup Droit (CD)', duration: 15, description: 'Échanges en diagonale : 5 min CD sur CD, puis 5 min RV sur RV. Recherche de contrôle et de longueur de balle.', material: 'Balles' },
  { id: 'r2', name: 'Ligne droite (Parallèle)', phase: 'regularite', theme: 'Contre-initiative', duration: 10, description: 'Échanges en ligne droite (CD sur RV adverse ou inversement). Demande plus de précision et de placement.', material: 'Balles' },
  { id: 'r3', name: 'Le "8" (Papillon)', phase: 'regularite', theme: 'Jeu de jambes', duration: 15, description: 'Joueur A joue tout en ligne droite. Joueur B joue tout en diagonale. Oblige B à alterner CD/RV à chaque balle.', material: 'Balles' },
  { id: 'r4', name: 'Régularité Topspin sur Bloc', phase: 'regularite', theme: 'Topspin', duration: 15, description: 'A effectue des topspins contrôlés en CD. B bloque activement. Inverser les rôles après 7 min.', material: 'Balles' },
  { id: 'r5', name: 'Tournante (Groupe)', phase: 'regularite', theme: 'Jeu de jambes', duration: 15, description: 'Par groupe de 4-6. Frapper une balle et courir de l\'autre côté de la table. Développe coordination, cardio et ambiance.', material: 'Balles' },
  { id: 'r6', name: '1 RV / 1 CD (Milieu de table)', phase: 'regularite', theme: 'Jeu de jambes', duration: 12, description: 'Joueur A distribue au milieu de la table. Joueur B doit pivoter pour jouer 1 CD, puis revenir jouer 1 RV.', material: 'Balles' },
  { id: 'r7', name: 'Le "X" (Croisé contre Ligne)', phase: 'regularite', theme: 'Jeu de jambes', duration: 15, description: 'A joue croisé, B joue ligne droite. Les joueurs doivent se déplacer latéralement en permanence.', material: 'Balles' },
  { id: 'r8', name: '2 balles CD, 2 balles RV', phase: 'regularite', theme: 'Jeu de jambes', duration: 12, description: 'Séquence imposée dans la diagonale. Force à compter et à anticiper le changement de coup.', material: 'Balles' },
  { id: 'r9', name: 'Régularité "Petit Jeu"', phase: 'regularite', theme: 'Poussette', duration: 10, description: 'Échanges uniquement en poussette courte/longue. Interdiction d\'attaquer. Travail de la coupe et du toucher.', material: 'Balles' },
  { id: 'r10', name: 'Bloc CD sur Topspin RV', phase: 'regularite', theme: 'Bloc', duration: 10, description: 'Exercice spécifique croisé. Le relanceur bloque en coup droit sur le topspin revers du partenaire.', material: 'Balles' },
  { id: 'r11', name: 'Topspin CD Ligne Droite', phase: 'regularite', theme: 'Topspin', duration: 12, description: 'A effectue des topspins CD le long de la ligne. B bloque en RV. Demande un ajustement du poignet pour éviter de croiser.', material: 'Balles' },
  { id: 'r12', name: 'Topspin CD sur Bloc Aléatoire', phase: 'regularite', theme: 'Topspin', duration: 15, description: 'Le bloqueur distribue aléatoirement (Plein CD ou Milieu). L\'attaquant doit ajuster son jeu de jambes pour toujours jouer en Topspin CD.', material: 'Balles' },

  // --- TECHNIQUE (T1-T20) ---
  { id: 't1', name: 'L\'horloge en CD', phase: 'technique', theme: 'Coup Droit (CD)', duration: 15, description: 'Panier de balles. L\'entraîneur envoie sur tout le côté CD (balle courte, ventre, plein CD). Le joueur ajuste son placement.', material: 'Panier de balles' },
  { id: 't2', name: 'Topspin CD sur balle coupée', phase: 'technique', theme: 'Topspin', duration: 20, description: 'A sert coupé ou pousse long. B démarre en Topspin CD. A bloque. On joue le point ou on arrête.', material: 'Balles' },
  { id: 't3', name: 'Flip CD et RV', phase: 'technique', theme: 'Flip', duration: 15, description: 'Panier ou distribution: Balle courte variée. Le joueur doit avancer le pied et attaquer (flipper) la balle au-dessus de la table.', material: 'Panier de balles' },
  { id: 't4', name: 'Bloc Actif vs Passif', phase: 'technique', theme: 'Bloc', duration: 15, description: 'Exercice pour le bloqueur : Alterner un bloc mou (amorti) et un bloc appuyé (actif) pour casser le rythme de l\'attaquant.', material: 'Balles' },
  { id: 't5', name: 'Service court/long Précision', phase: 'technique', theme: 'Service', duration: 20, description: 'Cibles posées sur la table (feuilles A4 ou cerceaux). 10 services courts, 10 longs rapides, 10 latéraux.', material: 'Balles, cibles' },
  { id: 't6', name: 'Pivot CD', phase: 'technique', theme: 'Jeu de jambes', duration: 15, description: 'Distribution dans le coin Revers. Le joueur doit contourner son revers pour frapper fort en Coup Droit (Pivot).', material: 'Balles' },
  { id: 't7', name: 'Défense balle haute', phase: 'technique', theme: 'Contre-initiative', duration: 15, description: 'A smash, B recule et défend en balles hautes (lob). Travail du toucher de balle et du déplacement arrière.', material: 'Balles' },
  { id: 't8', name: 'La "Banane" (Chiquita)', phase: 'technique', theme: 'Flip', duration: 15, description: 'Démarrage revers avec effet latéral sur balle courte. Nécessite une grande souplesse du poignet.', material: 'Panier de balles' },
  { id: 't9', name: 'Contre-Topspin à mi-distance', phase: 'technique', theme: 'Contre-initiative', duration: 15, description: 'A toppe rotation. B, à mi-distance, re-toppe sur la balle (top sur top). Duel physique.', material: 'Balles' },
  { id: 't10', name: 'Service "Marteau" & "Pendule"', phase: 'technique', theme: 'Service', duration: 20, description: 'Apprentissage et perfectionnement des gestuelles spécifiques de service avec effets latéraux.', material: 'Balles' },
  { id: 't11', name: 'Poussette "Taillée" agressive', phase: 'technique', theme: 'Poussette', duration: 10, description: 'Sur balle coupée, pousser fort et profond en "sabreur" la balle pour empêcher le démarrage adverse.', material: 'Balles' },
  { id: 't12', name: 'Amorti (Stop-block)', phase: 'technique', theme: 'Bloc', duration: 10, description: 'Sur un topspin adverse, bloquer la balle juste derrière le filet en absorbant l\'énergie.', material: 'Balles' },
  { id: 't13', name: 'Topspin "Frappé" vs "Rotation"', phase: 'technique', theme: 'Topspin', duration: 15, description: 'Alterner un top très frotté (cloche) et un top frappé (rapide) sur la même balle de bloc.', material: 'Panier de balles' },
  { id: 't14', name: 'Ouverture Topspin CD (Panier)', phase: 'technique', theme: 'Topspin', duration: 15, description: 'Panier de balles : balles coupées longues envoyées en CD. Le joueur doit fléchir et frotter la balle vers le haut (Topspin rotation).', material: 'Panier de balles' },
  { id: 't15', name: 'Le "Hook" (Topspin Latéral)', phase: 'technique', theme: 'Topspin', duration: 15, description: 'Topspin CD avec un geste enveloppant l\'extérieur de la balle pour créer une trajectoire courbe sortante (Hook).', material: 'Balles' },
  { id: 't16', name: 'Topspin CD "Essuie-glace"', phase: 'technique', theme: 'Jeu de jambes', duration: 15, description: '1 Topspin CD coin coup droit, 1 Topspin CD milieu de table. Pas chassés rapides entre chaque coup.', material: 'Balles' },
  { id: 't17', name: 'Contre-Topspin CD à la table', phase: 'technique', theme: 'Topspin', duration: 15, description: 'Sur un topspin adverse modéré, A doit avancer et rejouer en topspin CD juste après le rebond (prise de balle tôt).', material: 'Balles' },


  // --- SCHÉMA DE JEU (S1-S15) ---
  { id: 's1', name: 'Service + Attaque 3ème balle', phase: 'schema', theme: 'Service', duration: 15, description: 'A sert (court ou long), B remet, A doit attaquer immédiatement (Topspin ou Frappe) pour finir le point.', material: 'Balles' },
  { id: 's2', name: 'Poussette + Topspin', phase: 'schema', theme: 'Topspin', duration: 15, description: 'Duel de poussettes. Dès qu\'une balle est un peu haute ou longue, le premier qui démarre en topspin prend l\'avantage.', material: 'Balles' },
  { id: 's3', name: 'Falkenberg (Classique)', phase: 'schema', theme: 'Jeu de jambes', duration: 20, description: 'Enchaînement : 1 Revers (coin RV) -> 1 Pivot CD (coin RV) -> 1 Coup Droit (coin CD). Le bloqueur distribue.', material: 'Balles' },
  { id: 's4', name: 'Service court + Poussette tendue', phase: 'schema', theme: 'Remise de service', duration: 15, description: 'A sert court. B remet court. A pousse long et rapide dans le ventre. B doit démarrer.', material: 'Balles' },
  { id: 's5', name: 'Schéma "Corbillon" (2 vs 1)', phase: 'schema', theme: 'Bloc', duration: 15, description: 'Deux joueurs bloquent et distribuent contre un seul joueur qui doit enchaîner topspins et déplacements latéraux.', material: 'Balles' },
  { id: 's6', name: 'Jeu libre après 2 balles', phase: 'schema', theme: 'Contre-initiative', duration: 15, description: 'Séquence imposée sur les 2 premières balles (ex: Service court, Remise longue), puis le point est libre.', material: 'Balles' },
  { id: 's7', name: 'Service sortant petit côté', phase: 'schema', theme: 'Service', duration: 15, description: 'Travailler le service latéral qui sort de la table sur le côté CD de l\'adversaire pour ouvrir l\'angle.', material: 'Balles' },
  { id: 's8', name: 'Remise longue dans le pivot', phase: 'schema', theme: 'Remise de service', duration: 15, description: 'Sur service court, pousser long et agressif dans le plein revers adverse pour gêner le pivot.', material: 'Balles' },
  { id: 's9', name: 'Enchaînement Topspin RV + Pivot', phase: 'schema', theme: 'Jeu de jambes', duration: 15, description: 'A démarre en RV diagonale, B bloque ligne droite, A doit pivoter et finir en CD.', material: 'Balles' },
  { id: 's10', name: 'Le "Suédois" (Libre)', phase: 'schema', theme: 'Tactique', duration: 15, description: 'Service libre, Remise libre. Celui qui a servi doit obligatoirement jouer la 3ème balle en CD. Ensuite libre.', material: 'Balles' },
  { id: 's11', name: 'Service Bombe + Frappe', phase: 'schema', theme: 'Service', duration: 10, description: 'Service long rapide (bombe). Si la remise revient, frappe sèche immédiate.', material: 'Balles' },
  { id: 's12', name: 'Service Long + Topspin CD Frappé', phase: 'schema', theme: 'Topspin', duration: 15, description: 'Service rapide long dans le revers. Si l\'adversaire remet, attaquez fort en Topspin CD frappé.', material: 'Balles' },
  { id: 's13', name: 'Remise courte + Topspin CD', phase: 'schema', theme: 'Jeu de jambes', duration: 15, description: 'B sert court. A remet court, B pousse long en CD. A doit reculer rapidement pour démarrer en Topspin CD.', material: 'Balles' },


  // --- MATCHS (M1-M10) ---
  { id: 'm1', name: 'Match classique', phase: 'matchs', theme: null, duration: 15, description: 'Matchs officiels en 3 sets gagnants de 11 points. Application stricte des règles.', material: 'Balles, feuille de score' },
  { id: 'm2', name: 'Match à thème : "Topspin obligatoire"', phase: 'matchs', theme: 'Topspin', duration: 15, description: 'Le point ne compte que s\'il a été gagné (ou provoqué la faute) par un Topspin. Incite à l\'offensive.', material: 'Balles' },
  { id: 'm3', name: 'Montante-descendante', phase: 'matchs', theme: null, duration: 20, description: 'Tables numérotées. Matchs au temps (3 min). Le gagnant monte vers la table 1, le perdant descend.', material: 'Chrono' },
  { id: 'm4', name: 'La "Brésilienne" (Table unique)', phase: 'matchs', theme: 'Réflexes', duration: 15, description: 'Tout le monde joue sur une seule table en tournante. Finale à 2 joueurs. Très ludique pour finir la séance.', material: 'Balles' },
  { id: 'm5', name: 'Match avec Handicap', phase: 'matchs', theme: 'Mental', duration: 15, description: 'Le joueur le plus fort part avec un handicap de points (ex: -4 à 0) ou joue avec sa "mauvaise" main.', material: 'Balles' },
  { id: 'm6', name: 'Sets "Sprint" (7 points)', phase: 'matchs', theme: 'Mental', duration: 10, description: 'Matchs en 7 points décisifs. Apprend à être concentré dès la première balle. Pas de droit à l\'erreur.', material: 'Balles' },
  { id: 'm7', name: 'Match "3 pts par serveur"', phase: 'matchs', theme: 'Mental', duration: 15, description: 'On sert 3 fois de suite au lieu de 2. Change la dynamique de pression sur le serveur.', material: 'Balles' },
  { id: 'm8', name: 'Set "Remontada"', phase: 'matchs', theme: 'Mental', duration: 10, description: 'Le set commence à 5-10. Le joueur mené doit remonter, le joueur en tête doit conclure sans trembler.', material: 'Balles' },
  { id: 'm9', name: 'Match "Sans effet"', phase: 'matchs', theme: 'Contrôle', duration: 15, description: 'Interdiction de couper la balle fort. Obligation de jouer en balles portées ou liftées. Favorise les longs échanges.', material: 'Balles' },
  { id: 'm10', name: 'Double surprise', phase: 'matchs', theme: 'Réflexes', duration: 15, description: 'Matchs de double où les partenaires changent à chaque set. Développe l\'adaptabilité.', material: 'Balles' },
];

export const EMPTY_SESSION: Session = {
    id: 0,
    name: '',
    date: new Date().toISOString().split('T')[0],
    exercises: { echauffement: [], regularite: [], technique: [], schema: [], matchs: [] }
};

export const CYCLE_TYPES = [
    { value: 'developpement', label: 'Développement' },
    { value: 'competition', label: 'Compétition' },
    { value: 'recuperation', label: 'Récupération' },
    { value: 'pre-saison', label: 'Pré-saison' }
];

export const DEFAULT_SKILLS: Skill[] = [
    { id: 's1', name: 'Service', category: 'Technique' },
    { id: 's2', name: 'Remise', category: 'Technique' },
    { id: 's3', name: 'Coup Droit', category: 'Technique' },
    { id: 's4', name: 'Revers', category: 'Technique' },
    { id: 's5', name: 'Jeu de jambes', category: 'Physique' },
    { id: 's6', name: 'Tactique', category: 'Mental' },
    { id: 's7', name: 'Mental', category: 'Mental' },
];