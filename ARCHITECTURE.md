# 🏛️ Architecture Technique — Superpowers Community Edition (SPCE)

Ce document détaille l'architecture logicielle, la structure des composants, les flux de données temps réel et le système d'extensions de **Superpowers Community Edition (v1.0.0)**.

---

## 🧭 1. Vue d'ensemble & Philosophie

Superpowers est un environnement de développement de jeux 2D et 3D en temps réel et collaboratif, basé sur les technologies web (HTML5, WebGL, TypeScript, Node.js, Socket.IO, Three.js).

### Principes fondateurs :
1. **Collaboration temps réel native :** Toute action effectuée dans l'éditeur (glisser un asset, déplacer une entité 3D, taper une ligne de code) est propagée immédiatement à tous les développeurs connectés via WebSockets.
2. **Architecture Client-Serveur unifiée :** L'éditeur peut tourner dans un simple navigateur web (`http://localhost:4237`) ou encapsulé dans un shell de bureau Electron (`app/`).
3. **Système tout-plugin :** Le moteur ne fait quasiment rien en dur dans son noyau : les scènes, sprites, modèles 3D, scripts, sons, tilemaps et composants physiques sont tous des **plugins** modulaires.
4. **Moteur d'exécution orienté Composants (ECS-like) :** Le moteur runtime (`SupEngine`) repose sur une hiérarchie d'Acteurs (`Sup.Actor`) recevant des Composants (`Sup.ActorComponent`) et des Comportements (`Sup.Behavior`).

```
                               ┌────────────────────────┐
                               │  Navigateur / Electron │
                               │  (SupClient / Editors) │
                               └───────────▲────────────┘
                                           │ WebSocket (Socket.IO)
                                           ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Superpowers Server (Node.js)                    │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │     ProjectServer     │  │          RemoteProjectClient          │  │
│  │  (Gestion des salles, │◄─┤ (Réception des commandes, validation, │  │
│  │   sauvegarde disque)  │  │  diffusion temps réel aux abonnés)    │  │
│  └───────────┬───────────┘  └───────────────────────────────────────┘  │
│              │                                                         │
│              ▼ Fichiers projets JSON / Raw Assets                      │
│     [ projects/<id>/ ]                                                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 2. Organisation du Monorepo

Le dépôt est structuré en **3 piliers majeurs** :

```
superpowers-ce/
├── app/                  # Application Desktop (Electron)
├── core/                 # Serveur collaboratif, Noyau et Système de Jeu (Three.js)
├── demos/                # Projets complets, ressources brutes et tutoriels de jeux
├── docs/                 # Site statique GitHub Pages (Handbook moteur + Démos)
├── scripts/              # Générateurs de documentation et de tutoriels statiques
├── ROADMAP.md            # Feuille de route globale et futurs jalons
├── MODERNIZATION_PLAN.md # Checklist de modernisation par étapes
└── ARCHITECTURE.md       # Ce document d'architecture technique
```

---

## 🖥️ 3. L'Application Desktop (`app/`)

L'application de bureau fournit un launcher natif léger encapsulant Chromium et Node.js grâce à **Electron**.

### Composants clés :
- **Processus Principal (`src/main/`) :**
  - Gère le cycle de vie de l'application, les fenêtres, le menu système et les arguments de ligne de commande (comme `--core-path`).
- **Processus de Rendu (`src/renderer/`) :**
  - **Gestionnaire de serveurs (`sidebar/`) :** Permet de démarrer le serveur local en arrière-plan (`localServer.ts`) ou de se connecter à des serveurs distants via leur adresse IP/domaine.
  - **Barre d'onglets (`tabs/`) :** Gère le multi-fenêtrage interne pour afficher simultanément l'accueil, les réglages, et plusieurs projets dans des balises `<webview>`.
  - **Accueil (`home/`) :** Affiche les actualités, le logo et les raccourcis vers les ressources communautaires.

---

## ⚙️ 4. Le Cœur Collaboratif (`core/`)

Le sous-dossier `core/` contient le moteur serveur, la librairie cliente partagée et le système de jeu.

### 4.1. `SupCore` (Modèle de données partagé)
`SupCore` contient les structures de données communes au client et au serveur :
- **`SupCore.Data.Base.Asset` :** Classe de base pour tout type d'asset (ex: Scène, Sprite, Script). Chaque modification passe par des méthodes de commandes client/serveur.
- **`SupCore.Data.Base.Resource` :** Données globales partagées du projet (paramètres du jeu, configuration des inputs, etc.).
- **`SupCore.projects` :** Schéma de persistance des métadonnées de projets (`manifest.json`, `entries.json`).

### 4.2. `server/` (Serveur Node.js & Socket.IO)
- **`ProjectServer.ts` :**
  - Charge le projet depuis le disque (`projects/<project-id>/`).
  - Maintient l'état en mémoire des assets modifiés.
  - **Temporisation d'écriture (Debounce) :** Pour optimiser les performances disque, les modifications reçues par Socket.IO sont mises en cache mémoire et ne sont écrites sur disque que toutes les 60 secondes maximum (ou lors de la fermeture).
- **`RemoteProjectClient.ts` :**
  - Gère la session de chaque utilisateur connecté.
  - Reçoit les actions (`editAsset`, `createAsset`, etc.), vérifie les droits et les diffuse instantanément à tous les autres clients abonnés à cet asset via `socket.broadcast`.

### 4.3. `SupClient` (Interface & Widgets Client)
- Fournit l'infrastructure d'interface partagée pour tous les éditeurs :
  - Connexion WebSocket au serveur (`SupClient.connect`).
  - Arbre d'assets avec glisser-déposer (`SupClient.tableTree`).
  - Internationalisation et traduction dynamique (`SupClient.i18n`).
  - Gestion des raccourcis clavier et boîtes de dialogue modales.

---

## 🎮 5. Le Système de Jeu (`systems/game/`)

C'est le moteur 2D/3D basé sur **Three.js** qui anime les jeux Superpowers.

```
core/systems/game/
├── SupEngine/          # Moteur de rendu WebGL et composants de scène
├── SupRuntime/         # Runtime du lecteur de jeu (player standalone et preview)
└── plugins/            # Tous les types de ressources et éditeurs visuels
    ├── common/         # Utilitaires (textEditor, gameSettings)
    ├── default/        # Composants de base (scene, sprite, model, tileMap, sound, typescript...)
    ├── extra/          # Moteurs physiques (cannonjs pour la 3D, p2js pour la 2D, tweenjs)
    ├── florentpoujol/  # Extensions Florent Poujol (accès direct Three.js, ftext, mouseInput, dom)
    └── sparedray/      # Pathfinding A* (easystarjs)
```

### 5.1. `SupEngine` (Le Moteur d'Entités)
- Repose sur une scène Three.js.
- Chaque objet dans la scène est un `SupEngine.Actor`.
- Les acteurs possèdent une transformation spatiale (position 3D, rotation quaternion, échelle) et une liste de composants (`SupEngine.ActorComponent`) :
  - `SpriteRenderer` (affichage 2D animé).
  - `ModelRenderer` (affichage de maillage 3D OBJ / texture).
  - `Camera` (perspective ou orthographique avec zoom 2D).
  - `ArcadeBody2D` / `CannonBody3D` (physique et boîtes de collision).
  - `TextRenderer` / `FTextRenderer` (affichage de texte).

### 5.2. `SupRuntime` (Le Runtime d'Exécution)
- Package le jeu pour être exécuté dans un navigateur ou exporté.
- Gère la boucle de jeu principale (`requestAnimationFrame`) :
  1. Lecture des entrées clavier / souris / manettes (`Sup.Input`).
  2. Mise à jour des comportements (`behavior.update()`).
  3. Calculs physiques (tick d'intégration).
  4. Rendu de la scène Three.js (`render()`).

---

## 🔌 6. Anatomie d'un Plugin Superpowers

Chaque fonctionnalité de Superpowers est un plugin autonome situé dans `systems/game/plugins/<auteur>/<nom-du-plugin>/`.

Un plugin standard contient généralement :
1. **`data/` (Modèle & Données temps réel) :**
   - Définit la classe d'asset héritant de `SupCore.Data.Base.Asset`.
   - Définit les messages de synchronisation réseau (ex: `server_changeSpeed`, `client_changeSpeed`).
2. **`editors/` (Interface de l'éditeur visuel) :**
   - Code HTML/Pug, feuilles Stylus/CSS et contrôleurs TypeScript de la fenêtre d'édition (ex: l'éditeur de sprites avec timeline, ou l'éditeur de scène 3D).
3. **`components/` (Composant Three.js / SupEngine) :**
   - Le code qui tourne dans le moteur de rendu pour afficher ou manipuler l'élément.
4. **`typescriptAPI/` (Définitions de code pour le développeur de jeu) :**
   - Expose l'API accessible aux scripts du jeu (ex: `new Sup.SpriteRenderer(actor, "MonSprite")`).
   - Fournit les fichiers de déclarations TypeScript (`.d.ts`) pour l'autocomplétion.
5. **`public/` :**
   - Contient les ressources statiques compilées et les fichiers de traduction (`public/locales/<lang>/<plugin>.json`).

---

## 🔄 7. Flux d'une Action Collaborative (Exemple type)

Prenons l'exemple d'un développeur déplaçant un Actor 3D dans l'éditeur de scène :

```
1. Développeur A déplace la souris dans l'Éditeur de Scène (UI).
2. L'éditeur appelle :
     projectClient.editAsset(sceneId, "setNodeProperty", nodeId, "position", newPos)
3. Le message transite via WebSocket Socket.IO vers le serveur.
4. Le serveur (RemoteProjectClient) valide la commande et applique la modification
   sur l'instance SceneAsset en mémoire vive.
5. Le serveur marque l'asset comme "dirty" pour la prochaine écriture différée sur disque.
6. Le serveur émet l'événement Socket.IO à tous les clients abonnés à cette scène.
7. L'Éditeur du Développeur B reçoit "setNodeProperty" et applique la nouvelle position
   immédiatement dans sa vue 3D Three.js sans recharger la page.
```

---

## 📚 8. Documentation & Déploiement Statique (`docs/`)

Le dossier `docs/` est configuré pour servir le site web et la documentation complète via **GitHub Pages** :
- **`docs/index.html`** : Point d'entrée bilingue (anglais / français).
- **`docs/learn/`** : Documentation technique du moteur, générée à partir des fichiers Markdown de `docs/handbook/pages/` par `scripts/generate_docs.js`.
- **`docs/tutorials/`** : Recueil autonome des tutoriels pas-à-pas des 5 jeux démos, généré à partir de `demos/tutorials/` par `scripts/generate_tutorials.js`.
- **`docs/.nojekyll`** : Assure que GitHub Pages sert directement les dossiers sans traitement Jekyll.

---

## 🚀 9. Chaîne d'Outils & Compilation

- **TypeScript :** Compile le code source TypeScript en JavaScript ES5/ES6.
- **Gulp :** Orchestre la compilation des fichiers Pug (templates HTML), Stylus (CSS) et TypeScript pour chaque plugin via `pluginGulpfile.js`.
- **Browserify :** Regroupe les modules CommonJS pour exécution côté navigateur client.
- **Commandes principales :**
  - `npm run setup` : Installe toutes les dépendances du monorepo.
  - `npm run build` : Compile le cœur, les 41 plugins et l'application desktop.
  - `npm run build:docs` : Régénère l'intégralité de la documentation et des tutoriels statiques.
  - `npm start` : Démarre l'application de bureau Electron avec le serveur local.
  - `npm run start:server` : Démarre le serveur seul pour développement via navigateur web sur le port `4237`.
