# 🛠️ Plan de Modernisation Étape par Étape — Superpowers Community Edition

Ce document définit les étapes successives pour moderniser, sécuriser et faire évoluer **Superpowers Community Edition (SPCE)** de manière progressive et itérative, sans casser la compatibilité temps réel ni les plugins existants.

---

## 📊 Suivi de progression global

- [x] **Phase 1 : Assainissement & Nettoyage immédiat**
- [x] **Phase 2 : Modernisation d'Electron (Shell Desktop)**
- [ ] **Phase 3 : Modernisation de l'outillage & TypeScript**
- [ ] **Phase 4 : Rénovation de l'Éditeur de Code (IDE)**
- [ ] **Phase 5 : Évolution du moteur Three.js & formats modernes (glTF/GLB)**
- [ ] **Phase 6 : Améliorations de l'expérience utilisateur (UX/UI)**

---

## 📌 Détail des Phases & Tâches

### 🧹 Phase 1 : Assainissement & Nettoyage immédiat
*Objectif : Éliminer la dette technique morte, réduire la surface de vulnérabilités et harmoniser le monorepo sans toucher au cœur logique.*

- [x] **1.1 Purge définitive du code IRC dans `app/`**
  - [x] Supprimer la dépendance `slate-irc` et `@types/slate-irc` de `app/package.json`.
  - [x] Supprimer l'onglet / composant d'interface IRC dans `app/src/renderer/` (laisser uniquement l'interface locale/hors-ligne).
  - [x] Nettoyer les paramètres utilisateurs liés aux serveurs IRC dans les réglages du launcher.
- [x] **1.2 Harmonisation des versions du monorepo**
  - [x] Aligner `app/package.json` sur `version: 1.0.0` (actuellement `6.1.0`).
  - [x] Aligner `core/package.json` sur `version: 1.0.0`.
  - [x] Aligner les manifestes des plugins du système de jeu principal sur `1.0.0`.
- [x] **1.3 Nettoyage des scripts et résidus dépréciés**
  - [x] Vérifier et supprimer toute référence résiduelle à `love2d` ou `systems/web` dans `core/scripts/` et `registry.json`.
  - [x] Valider que `npm run build` et `npm run start:server` s'exécutent proprement sans avertissements fantômes.

---

### ⚡ Phase 2 : Modernisation d'Electron (Shell Desktop)
*Objectif : Remplacer Electron 7 (obsolète, 2019) par une version moderne, améliorer la sécurité, le support Wayland et supprimer le besoin de `--no-sandbox`.*

- [x] **2.1 Migration intermédiaire vers Electron 12 / 14**
  - [x] Mettre à jour `electron` dans `app/package.json`.
  - [x] Migrer les appels à l'ancien module `remote` vers `@electron/remote` ou via `ipcRenderer` / `contextBridge`.
  - [x] Valider la communication entre le launcher desktop et le serveur interne `core/`.
- [x] **2.2 Migration vers Electron 28+ (Dernière LTS moderne)**
  - [x] Activer et configurer `@electron/remote/main` avec isolation et permissions contrôlées.
  - [x] Configurer la compatibilité sous Linux moderne (X11 / Wayland et support AppArmor Ubuntu 24.04).
  - [x] Valider le build Gulp et TypeScript sous Electron 28.

---

### 🏗️ Phase 3 : Modernisation de l'outillage & TypeScript
*Objectif : Accélérer les temps de compilation, profiter des syntaxes modernes (async/await, optional chaining `?.`) et moderniser le pipeline Gulp.*

- [ ] **3.1 Montée en version de TypeScript (`core/` et plugins)**
  - [ ] Mettre à jour `typescript` vers une version récente (4.9+ puis 5.x).
  - [ ] Adapter les `tsconfig.json` (options `target: "ES2020"` ou `"ES2022"`, `moduleResolution: "node"`).
  - [ ] Corriger les éventuelles erreurs de typage introduites par le compilateur moderne plus strict.
- [ ] **3.2 Optimisation du pipeline de build Gulp**
  - [ ] Remplacer Jade par Pug de manière homogène.
  - [ ] Évaluer l'intégration de `esbuild` pour la compilation ultra-rapide des scripts côté client.
  - [ ] Raccourcir la durée totale de `npm run build` (de plusieurs minutes à quelques secondes).

---

### 💻 Phase 4 : Rénovation de l'Éditeur de Code (IDE)
*Objectif : Offrir une expérience d'écriture de scripts moderne avec autocomplétion intelligente et ergonomie actuelle.*

- [ ] **4.1 Audit de l'éditeur existant (`plugins/common/textEditor`)**
  - [ ] Évaluer le remplacement par **CodeMirror 6** ou **Monaco Editor** (le composant cœur de Visual Studio Code).
- [ ] **4.2 Amélioration du Language Server TypeScript intégré**
  - [ ] Fournir l'autocomplétion contextuelle en temps réel avec les types de `SupEngine` et des plugins.
  - [ ] Ajouter la coloration syntaxique moderne et le support de thèmes sombres/clairs actuels.
  - [ ] Intégrer un mini-map et la recherche multi-fichiers.

---

### 🎨 Phase 5 : Évolution du moteur Three.js & Formats modernes
*Objectif : Débloquer les capacités graphiques actuelles du WebGL et faciliter l'importation de modèles 3D.*

- [ ] **5.1 Support du format glTF / GLB**
  - [ ] Créer ou adapter un plugin d'importation glTF 2.0 pour les modèles 3D et animations squelettiques (standard de l'industrie).
  - [ ] Permettre le glisser-déposer de fichiers `.gltf` / `.glb` directement dans l'arbre des ressources.
- [ ] **5.2 Montée de version progressive de Three.js (actuellement r73)**
  - [ ] Isoler les shaders personnalisés et le renderer de `SupEngine`.
  - [ ] Mettre à niveau vers une version moderne de Three.js.
  - [ ] Conserver la rétrocompatibilité avec les composants de caméra, lumières et matériaux existants.
- [ ] **5.3 Modernisation de la physique 2D/3D**
  - [ ] Vérifier et mettre à jour les wrappers Cannon.js (3D) et ArcadePhysics2D / p2.js (2D).

---

### 🚀 Phase 6 : Améliorations de l'Expérience Utilisateur (UX/UI)
*Objectif : Rendre Superpowers CE accueillant, intuitif et immédiatement opérationnel pour les nouveaux créateurs.*

- [ ] **6.1 Hub de modèles & projets exemples intégré**
  - [ ] Ajouter un bouton dans le launcher pour importer directement les démos intégrées (`demos/projects/` : Pong, OXO, Sokoban, Asteroids, Pacman) en un clic.
- [ ] **6.2 Raccourcis & Navigation**
  - [ ] Lien direct depuis l'IDE vers la documentation locale hors-ligne (`docs/learn/`) et le recueil des tutoriels (`docs/tutorials/`).
- [ ] **6.3 Exportateur de jeu simplifié**
  - [ ] Faciliter l'export Web HTML5 en une archive ZIP propre prête pour Itch.io / GameJolt / GitHub Pages.

---

*Ce fichier est maintenu à la racine du dépôt pour cocher les cases au fur et à mesure des commits validés.*
