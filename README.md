# 🐙 Superpowers Community Edition — The HTML5 2D+3D game maker: Extensible HTML5 app for real-time collaborative projects web and desktop

**Version:** `1.0.0`  
**License:** ISC & MIT (Open Source)

---

## 🌟 Overview

**Superpowers Community Edition (CE)** is a modern, unified fork of the open-source real-time collaborative game engine originally created by Sparklin Labs. 

It provides an extensible development environment where you and your team can create 2D and 3D games together in real-time over the network or locally. Whether working via the web browser or the standalone desktop application powered by Electron, all changes to code, scenes, 3D models, tilemaps, and audio sync instantly across all connected developers.

### Why Community Edition (`v1.0.0`)?

The original Superpowers project was distributed across multiple separate GitHub repositories and git submodules, included deprecated systems (such as LÖVE2D and static web makers), and relied on outdated IRC chat networks.

**Superpowers CE (`1.0.0`) consolidates and modernizes everything into one single repository:**
- **Laser-focused on Three.js Game Development:** Stripped away dead systems (`systems/love2d`, `systems/web`) to streamline build times and maintenance.
- **Unified Monorepo:** Combines `core` (collaborative server & browser IDE), `app` (Electron desktop shell), and `docs` without fragile git submodules.
- **Integrated Community Plugins:** Pre-bundles essential community extensions:
  - **Florent Poujol (`florentpoujol/`)**: `threejs` (direct Three.js r73 exposure), `fmouseinput` (rich mouse handlers), `ftext` (text asset rendering), `flang` (in-game localization & i18n), and `dom` (HTML overlay access).
  - **SparedRay (`sparedray/`)**: `easystarjs` (A* pathfinding for 2D grids and tilemaps).
- **Embedded Documentation:** Full offline documentation and tutorials included directly in the repository (`docs/handbook/` and `docs/site/`).
- **Linux & Modern Node.js Ready:** Tested with modern Node versions (18 through 24) and packaged with `--no-sandbox` support for Linux environments.

---

## 📁 Repository Structure

```
superpowers-ce/
├── app/                             # Standalone Electron desktop application shell
│   ├── src/                         # Desktop app renderer and main processes
│   ├── public/                      # Compiled desktop assets
│   └── package.json                 # App dependencies (Electron, Gulp, Pug, Stylus)
│
├── core/                            # Real-time collaborative server & web IDE
│   ├── client/                      # Web browser IDE client interface
│   ├── server/                      # Server runtime, project managers & socket services
│   ├── SupCore/                     # Shared data structures, projects & asset schemas
│   ├── SupClient/                   # Shared client widgets, tree views & dialogs
│   ├── scripts/                     # Build tools (`build.js`, `pluginGulpfile.js`)
│   │
│   └── systems/
│       └── game/                    # Three.js 2D+3D Game Engine System
│           ├── SupEngine/           # Three.js rendering engine & actor-component runtime
│           ├── SupRuntime/          # Game player web runtime
│           └── plugins/
│               ├── common/          # Inlined shared tools (textEditor, settings, etc.)
│               ├── default/         # Core assets (scene, model, sprite, tileMap, etc.)
│               ├── extra/           # Additional physics & utils (cannonjs, p2js, tweenjs)
│               ├── florentpoujol/   # Florent Poujol plugins (threejs, fmouseinput, ftext...)
│               └── sparedray/       # SparedRay plugins (easystarjs pathfinding)
│
├── docs/                            # Inlined offline documentation
│   ├── handbook/                    # Guides & tutorials from docs.superpowers-html5.com
│   └── site/                        # Reference articles & landing page from superpowers-html5.com
│
├── package.json                     # Monorepo orchestrator scripts
├── ROADMAP.md                       # Project vision, modernizations, and future milestones
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: Modern Node.js (v18, v20, v22, or v24)
- **npm**: v8 or higher
- **Git**

### 1. Installation

Clone the repository and install all dependencies across the entire monorepo:

```bash
git clone https://github.com/<your-username>/superpowers-ce.git
cd superpowers-ce

# Automatically sets up dependencies for core, app, and all plugins
npm run setup
```

### 2. Build Everything

Compile all TypeScript sources, Browserify bundles, Pug templates, and Stylus styles:

```bash
npm run build
```

*(You can also build components individually with `npm run build:core` or `npm run build:app`)*

---

## 🎮 Running Superpowers

### Option A: Standalone Desktop App (Recommended)
Run the desktop application powered by Electron:
```bash
npm run start
```

### Option B: Collaborative Web Server
Host your own collaborative server accessible by anyone on your local network or the internet:
```bash
npm run start:server
```
Open your browser at **`http://localhost:4237`**.

Connected teammates can browse to your IP address and collaborate with you on projects in real-time.

---

## 🧩 Included Plugins & Features

### Core Assets (`plugins/default/`)
- **Scene Editor:** 3D and 2D scene composition with actor-component hierarchies.
- **Model Editor:** 3D model importer and animation player.
- **Sprite & Animation:** 2D spritesheet slicing and frame-by-frame animation.
- **Tile Map:** 2D grid and orthogonal tilemap editing.
- **Arcade Physics 2D:** Lightweight 2D collision detection and physics.
- **Sound:** Audio asset management and playback.
- **TypeScript Editor:** In-browser code editor with autocompletion and diagnostics.
- **Shader Editor:** Custom GLSL shaders for materials.

### Extra Libraries (`plugins/extra/`)
- `cannonjs`: 3D physics engine.
- `p2js`: Full-featured 2D rigid-body physics.
- `tweenjs`: Easing and animation tweening.
- `socketio`: Real-time multiplayer networking for games.
- `rngjs`: Seedable random number generator.

### Community Extensions
- **`florentpoujol/threejs`**: Exposes the underlying Three.js instance (`SupEngine.THREE`, `SupWebGLRenderer`, `SupThreeScene`) directly to game scripts.
- **`florentpoujol/fmouseinput`**: World/screen raycasting, hover, and click helpers for actors.
- **`florentpoujol/ftext`**: Dynamic, scriptable 3D text generation and rendering.
- **`florentpoujol/flang`**: Localization dictionaries and multi-language switching.
- **`florentpoujol/dom`**: Full browser DOM and HTML elements access inside game behaviors.
- **`sparedray/easystarjs`**: Grid-based pathfinding for AI and navigation.

---

## 📚 Documentation & Learning

Offline guides are included in the [`docs/`](docs/) folder:
- **`docs/handbook/pages/en/1_getting-started/`**: First project, scenes, scripted behaviors, components, debugging.
- **`docs/handbook/pages/en/2_tutorials/`**: TypeScript primer, collision, raycasting, cameras, 3D models, audio.
- **`docs/handbook/pages/en/4_development/`**: Engine internals, plugin architecture, extending Superpowers.

---

## 🛠️ Contribution & Development

Contributions are welcome! Pull requests, bug fixes, modernizations, and new plugins are encouraged:
1. Fork the repo and create your feature branch: `git checkout -b feature/my-feature`
2. Commit your changes: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/my-feature`
4. Open a Pull Request.

---

## 📄 License

Superpowers Community Edition is open source software released under the **ISC License** and **MIT License** for community plugins.
