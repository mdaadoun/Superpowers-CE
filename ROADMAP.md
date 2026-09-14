# 🗺️ Superpowers Community Edition (CE) — Project Roadmap & Maintenance Strategy

**Current Version:** `1.0.0`  
**Repository:** [github.com/mdaadoun/Superpowers-CE](https://github.com/mdaadoun/Superpowers-CE)  
**Status:** Active Maintenance & Modernization  

---

## 🧭 Vision & Core Philosophy

Superpowers was ahead of its time: a real-time collaborative, browser-and-desktop game engine written in TypeScript with an integrated scene editor, code editor, asset pipeline, and server-client architecture.

**Superpowers Community Edition (CE)** exists to preserve, modernize, and extend this unique engine:
1. **Zero-Setup Real-Time Pair Programming:** Work on games with teammates without dealing with Git merge conflicts or complex setups.
2. **Three.js First:** Focus exclusively on high-performance 2D and 3D web-native games.
3. **Self-Contained & Offline Capable:** No obsolete external services (Freenode IRC removed, self-hosted documentation, offline project storage).
4. **Developer Quality of Life:** Modern build speeds (<5s builds), current TypeScript standards, and contemporary asset formats (glTF/GLB).

---

## 📊 Milestone Overview

```
Phase 1 & 2: Consolidation & Decoupling  [COMPLETED - v1.0.0]
  ├── Monorepo Assembly (Core + App + Docs)
  ├── Deprecated Systems Purged (Love2D, Web Maker)
  ├── Community Plugins Integrated (FlorentPoujol, SparedRay)
  ├── IRC Decoupled & Offline-by-Default
  └── Static GitHub Pages Site & Docs Deployed

Phase 3: Developer Experience & Toolchain Modernization [v1.1.0 - NEXT]
  ├── Replace Gulp + Browserify with esbuild / Vite
  ├── Upgrade TypeScript 3.3 -> 5.x
  └── Modern Package Manager (npm workspaces / pnpm)

Phase 4: Modern 3D Pipeline & Three.js Bridge [v1.2.0]
  ├── Native glTF / GLB 3D Model Support
  ├── Three.js Incremental Upgrade (r73 -> Modern r160+)
  └── Modern WebGL 2 & Color Space Pipeline

Phase 5: Collaborative IDE & Editor Enhancements [v1.3.0]
  ├── Monaco Editor (VS Code core) Upgrade
  ├── Modern Asset Importers (Audio, Texture compression)
  └── Enhanced Scene Viewport Controls (Gizmos, Grid, Snapping)

Phase 6: Deployment, Exporting & Cross-Platform [v2.0.0]
  ├── One-Click Web / PWA Exporter
  ├── Updated Electron Desktop Packager (Windows / macOS / Linux)
  └── Headless Server Docker Image & Cloud Hosting Scripts
```

---

## 📋 Detailed Phase Breakdown

### Phase 1 & 2: Monorepo Foundation & Decoupling ✅ *(Done - v1.0.0)*
- [x] Consolidate fragmented repositories (`superpowers-core`, `superpowers-game`, `superpowers-app`, `superpowers-common-plugins`, `superpowers-html5.com`, `docs.superpowers-html5.com`) into a unified monorepo.
- [x] Remove legacy systems: `systems/love2d` and `systems/web`.
- [x] Inline `plugins/common` without Git submodules.
- [x] Integrate key community plugins:
  - `florentpoujol/threejs`
  - `florentpoujol/fmouseinput`
  - `florentpoujol/ftext`
  - `florentpoujol/flang`
  - `florentpoujol/dom`
  - `sparedray/easystarjs`
- [x] Neutralize IRC auto-connection (`irc.freenode.net`) and make presence offline by default.
- [x] Fix Electron sandbox requirements for Linux distributions (`--no-sandbox`).
- [x] Compile and deploy static landing site and offline documentation under `docs/` for GitHub Pages.

---

### Phase 3: Developer Experience & Toolchain Modernization 🎯 *(v1.1.0)*

#### Objectives
Reduce build times from **~100 seconds to under 5 seconds**, update TypeScript compiler dependencies, and eliminate deprecation warnings.

- [ ] **Replace Gulp + Browserify with `esbuild`:**
  - The current plugin build process executes Gulp and Browserify across 41 individual folders.
  - Transition to an `esbuild` orchestrator script that bundles runtime code, editors, and background workers in parallel.
- [ ] **TypeScript 5.x Upgrade:**
  - Modernize from TypeScript `3.3.3333` (2019) to `5.x`.
  - Update `@types/node` and express definitions.
  - Enable strict null checking incrementally where appropriate.
- [ ] **Modernize Root Workspace Structure:**
  - Use npm workspaces (`workspaces: ["core", "app"]`) to eliminate duplicated dependencies across sub-projects.
- [ ] **Deprecation Cleanup:**
  - Replace deprecated `fs.Stats` calls in build tools.
  - Eliminate circular dependency warnings from older Pug/Stylus build passes.

---

### Phase 4: Modern 3D Pipeline & Three.js Bridge 🎨 *(v1.2.0)*

#### Objectives
Bring Superpowers' 3D capabilities up to contemporary standards by upgrading the rendering foundation and supporting industry-standard 3D formats.

- [ ] **glTF 2.0 & GLB Native Importer:**
  - Current format support relies on custom `.supModel` and basic OBJ.
  - Implement a `glTF` / `GLB` asset editor and importer supporting PBR materials, skinning, and skeletal animations directly from Blender.
- [ ] **Three.js Upgrade Path:**
  - Superpowers currently uses Three.js **r73/r74**.
  - Modern Three.js has shifted from legacy `Geometry` to `BufferGeometry`, updated light attenuation, sRGB encoding, and WebGL 2 contexts.
  - Implement an upgrade abstraction in `SupEngine` allowing modern Three.js features without breaking existing game behavior scripts.
- [ ] **PBR (Physically Based Rendering) Materials:**
  - Support roughness/metallic maps, normal maps, ambient occlusion, and environment lighting (HDRI / skyboxes).
- [ ] **Audio Engine Refresh:**
  - Update Web Audio API handlers to comply with modern browser autoplay policies and resume-on-user-interaction requirements.

---

### Phase 5: Collaborative IDE & Editor Enhancements 💻 *(v1.3.0)*

#### Objectives
Improve the developer authoring experience inside both the desktop app and web IDE.

- [ ] **Code Editor Upgrade:**
  - Evaluate replacing CodeMirror with the **Monaco Editor** (the engine powering VS Code) to provide richer IntelliSense, code folding, multi-cursor editing, and TypeScript language server diagnostics.
- [ ] **Transform Gizmos & Viewport Usability:**
  - Improve 3D translate/rotate/scale gizmos with snapping increments (grid snap, degree snap).
  - Add camera framing (`F` key to focus on selected actor).
  - Add multi-selection of actors in the scene tree.
- [ ] **Integrated Asset Store / Library:**
  - Built-in panel to download free public domain game assets (Kenney.nl assets, OpenGameArt, Superpowers Asset Packs) directly into the project tree.
- [ ] **In-App Local Chat / Notes:**
  - Replace the removed external IRC with an internal, project-scoped collaboration chat stored on the local Superpowers server so co-developers can communicate directly in the project without third-party services.

---

### Phase 6: Deployment, Exporting & Ecosystem 🚀 *(v2.0.0)*

#### Objectives
Ensure games created with Superpowers CE can be packaged and distributed anywhere with one click.

- [ ] **One-Click Web & PWA Exporter:**
  - Export self-contained single-folder web builds ready for Itch.io, Newgrounds, GitHub Pages, or Netlify.
  - Support Progressive Web App (PWA) manifest generation for offline mobile play.
- [ ] **Desktop Game Exporters:**
  - Modern Electron / Tauri export pipelines for Windows (`.exe`, installer), macOS (`.dmg`), and Linux (`AppImage`, `.deb`).
- [ ] **Headless Docker Server:**
  - Provide an official `Dockerfile` and `docker-compose.yml` for hosting a 24/7 Superpowers collaborative server on VPS providers (DigitalOcean, Hetzner, AWS) with automatic SSL/TLS via Let's Encrypt.
- [ ] **Continuous Integration (CI):**
  - GitHub Actions workflow to build, lint, and test all 41 plugins and both desktop/core packages on every pull request.

---

## 🛠️ Maintenance & Contribution Guidelines

### Branching Strategy
- `main`: Stable release branch. Ready for production and GitHub Pages.
- `develop` (or feature branches): Active work on modernizations, plugins, and upgrades.

### Issue Triaging Priority
1. **Critical:** Build breaks, crash on launch, server synchronization failures.
2. **High:** Electron compatibility on new OS versions (Ubuntu 24+, macOS Sonoma+, Windows 11).
3. **Medium:** Three.js and asset importer modernizations.
4. **Low:** Visual tweaks, non-breaking cosmetic improvements.

---

*Superpowers Community Edition is maintained by the community for game developers who love collaborative, open-source tools.*
