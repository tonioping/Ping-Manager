<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# PingManager - Assistant IA pour Entraîneurs

Application de gestion de sessions d'entraînement de tennis de table avec intégration Gemini AI.

## Déploiement Vercel

Si le déploiement automatique ne se déclenche pas ou échoue :
1. **Nettoyage Git** : Si `node_modules` est toujours visible sur GitHub, exécutez `git rm -r --cached node_modules` localement pour arrêter de le suivre.
2. **Redéploiement** : Sur Vercel, lancez un **Redeploy** sur le commit le plus récent (celui incluant le fix TypeScript et le .gitignore).

## Installation Locale

1. `npm install`
2. Configurez vos variables d'environnement dans `.env.local`
3. `npm run dev`