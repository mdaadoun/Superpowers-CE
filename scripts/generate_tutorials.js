const fs = require("fs");
const path = require("path");
const marked = require(path.resolve(__dirname, "../docs/handbook/node_modules/marked"));
const hljs = require(path.resolve(__dirname, "../docs/handbook/node_modules/highlight.js"));

marked.setOptions({
  highlight: (code, lang) => {
    if (lang == null || !hljs.getLanguage(lang)) lang = "typescript";
    return hljs.highlight(lang, code).value;
  }
});

const tutorialsConfig = [
  {
    id: "1-super-pong",
    title: "1. Super Pong",
    gameName: "Super Pong",
    desc: "Start learning game development with a classic 2-player Pong game.",
    srcDir: path.resolve(__dirname, "../demos/tutorials/1SuperPong"),
    chapters: [
      { file: "README.md", out: "index.html", title: "Overview" },
      { file: "ch1.md", out: "ch1.html", title: "1. Introduction & Plan" },
      { file: "ch2.md", out: "ch2.html", title: "2. Preparing Superpowers" },
      { file: "ch3.md", out: "ch3.html", title: "3. Game Logic" },
      { file: "ch4.md", out: "ch4.html", title: "4. Polishing the Game" },
      { file: "ch5.md", out: "ch5.html", title: "5. Source Reference" }
    ]
  },
  {
    id: "2-super-oxo",
    title: "2. Super OXO",
    gameName: "Super OXO (Tic-Tac-Toe)",
    desc: "Learn board games and basic computer AI with Tic-Tac-Toe in 3D.",
    srcDir: path.resolve(__dirname, "../demos/tutorials/2SuperOXO"),
    chapters: [
      { file: "README.md", out: "index.html", title: "Overview" },
      { file: "ch1.md", out: "ch1.html", title: "1. Introduction & Plan" },
      { file: "ch2.md", out: "ch2.html", title: "2. Building Structure" },
      { file: "ch3.md", out: "ch3.html", title: "3. Player Actions" },
      { file: "ch4.md", out: "ch4.html", title: "4. Computer Response AI" },
      { file: "ch5.md", out: "ch5.html", title: "5. Polishing the Game" },
      { file: "ch6.md", out: "ch6.html", title: "6. Source Reference" }
    ]
  },
  {
    id: "3-super-sokoban",
    title: "3. Super Sokoban",
    gameName: "Super Sokoban",
    desc: "Build a puzzle game with tilemaps, grid movement, and level progression.",
    srcDir: path.resolve(__dirname, "../demos/tutorials/3SuperSokoban"),
    chapters: [
      { file: "README.md", out: "index.html", title: "Overview" },
      { file: "ch1.md", out: "ch1.html", title: "1. Plan the Game" },
      { file: "ch2.md", out: "ch2.html", title: "2. Shaping Structure" },
      { file: "ch3.md", out: "ch3.html", title: "3. World & Player Logic" },
      { file: "ch4.md", out: "ch4.html", title: "4. Level Scripting" },
      { file: "ch5.md", out: "ch5.html", title: "5. Polishing the Game" },
      { file: "ch6.md", out: "ch6.html", title: "6. Source Reference" }
    ]
  },
  {
    id: "4-super-asteroids",
    title: "4. Super Asteroids & Spacewar",
    gameName: "Super Asteroids & Super Spacewar",
    desc: "Recreate arcade classics with inertia physics, shooting, alien AI, and modding.",
    srcDir: path.resolve(__dirname, "../demos/tutorials/4SuperAsteroids"),
    chapters: [
      { file: "README.md", out: "index.html", title: "Overview" },
      { file: "ch1.md", out: "ch1.html", title: "1. Planning the Game" },
      { file: "ch2.md", out: "ch2.html", title: "2. Building Structure" },
      { file: "ch3.md", out: "ch3.html", title: "3. Loading Assets" },
      { file: "ch4.md", out: "ch4.html", title: "4. Game Scene & Prefabs" },
      { file: "ch5.md", out: "ch5.html", title: "5. Program Structure" },
      { file: "ch6.md", out: "ch6.html", title: "6. Alien & Asteroids" },
      { file: "ch7.md", out: "ch7.html", title: "7. Ship & Missiles" },
      { file: "ch8.md", out: "ch8.html", title: "8. Collision & Life" },
      { file: "ch9.md", out: "ch9.html", title: "9. Menu & Game Over" },
      { file: "ch10.md", out: "ch10.html", title: "10. Polishing the Game" },
      { file: "ch11.md", out: "ch11.html", title: "11. Modding the Game" },
      { file: "ch12.md", out: "ch12.html", title: "12. Source Reference" }
    ]
  },
  {
    id: "5-super-pacman",
    title: "5. Super Pacman",
    gameName: "Super Pacman",
    desc: "Complete 12-chapter guide recreating Pac-Man with mazes, ghosts AI, and sounds.",
    srcDir: path.resolve(__dirname, "../demos/tutorials/5SuperPacman"),
    chapters: [
      { file: "README.md", out: "index.html", title: "Overview" },
      { file: "ch0.md", out: "ch0.html", title: "Devlog" },
      { file: "ch1.md", out: "ch1.html", title: "1. Planning the Game" },
      { file: "ch2.md", out: "ch2.html", title: "2. Project Structure" },
      { file: "ch3.md", out: "ch3.html", title: "3. Setting Assets" },
      { file: "ch4.md", out: "ch4.html", title: "4. Designing Levels" },
      { file: "ch5.md", out: "ch5.html", title: "5. Composing Scenes" },
      { file: "ch6.md", out: "ch6.html", title: "6. Global Game Behavior" },
      { file: "ch7.md", out: "ch7.html", title: "7. Menu Behavior" },
      { file: "ch8.md", out: "ch8.html", title: "8. Level & Start" },
      { file: "ch9.md", out: "ch9.html", title: "9. Pacman Behavior" },
      { file: "ch10.md", out: "ch10.html", title: "10. Ghost & Fruit AI" },
      { file: "ch11.md", out: "ch11.html", title: "11. Polishing the Game" },
      { file: "ch12.md", out: "ch12.html", title: "12. Source Reference" }
    ]
  }
];

const outBase = path.resolve(__dirname, "../docs/tutorials");

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const sPath = path.join(src, entry.name);
    const dPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(sPath, dPath);
    } else {
      fs.copyFileSync(sPath, dPath);
    }
  }
}

// Convert markdown links like [Chapter 2](ch2.md) to ch2.html
function fixMarkdownLinks(md) {
  return md.replace(/\b(ch\w*|README)\.md(#[\w-]+)?/g, (match, p1, p2) => {
    const target = (p1 === "README") ? "index.html" : `${p1}.html`;
    return p2 ? `${target}${p2}` : target;
  });
}

function buildTutorialNav(currentTut, currentChapter) {
  let html = `<ol class="tutorials-nav">`;
  for (const tut of tutorialsConfig) {
    const isTutActive = (tut.id === currentTut.id);
    html += `<li class="tutorial-group">`;
    html += `<div class="group-title">${tut.title}</div><ol>`;
    for (const ch of tut.chapters) {
      const isActive = (isTutActive && ch.out === currentChapter.out) ? 'class="active"' : '';
      const href = isTutActive ? `${ch.out}` : `../${tut.id}/${ch.out}`;
      html += `<li><a href="${href}" ${isActive}>${ch.title}</a></li>`;
    }
    html += `</ol></li>`;
  }
  html += `</ol>`;
  return html;
}

function renderChapterPage(tut, ch, contentHtml) {
  const navHtml = buildTutorialNav(tut, ch);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf8">
  <title>${ch.title} — ${tut.gameName} — Superpowers CE Tutorials</title>
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="../styles/index.css">
  <link rel="stylesheet" href="../styles/highlight.css">
  <style>
    .tutorials-nav .group-title {
      font-weight: 700;
      color: #333;
      margin-top: 0.8em;
      margin-bottom: 0.3em;
    }
    .tutorials-nav ol {
      margin-bottom: 0.6em;
      padding-left: 1.2em;
    }
    .tutorials-top-bar {
      margin-bottom: 1.5em;
      padding: 0.6em 1em;
      background: #f0f4f8;
      border-radius: 4px;
      font-size: 0.9em;
      display: flex;
      justify-content: space-between;
    }
    .tutorials-top-bar a {
      font-weight: bold;
    }
    .page img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      margin: 1em 0;
    }
  </style>
</head>
<body>
  <nav>
    <div class="menu">
      <div style="padding: 10px 14px; font-weight: bold; border-bottom: 1px solid #ccc; font-size: 1.1em;">
        <a href="../index.html" style="color: inherit; text-decoration: none;">&larr; All Demo Tutorials</a>
      </div>
      ${navHtml}
    </div>
  </nav>
  <main>
    <header>
      <a href="../../index.html">
        <img src="../../images/icon.png">
        <span>Superpowers CE &mdash; Game Tutorials Handbook</span>
      </a>
    </header>
    <div class="page">
      <div class="tutorials-top-bar">
        <span>Game: <strong>${tut.gameName}</strong></span>
        <span><a href="../index.html">&larr; Return to Demos Hub</a></span>
      </div>
      ${contentHtml}
    </div>
  </main>
</body>
</html>`;
}

// Generate for each tutorial
for (const tut of tutorialsConfig) {
  const tutOutDir = path.join(outBase, tut.id);
  fs.mkdirSync(tutOutDir, { recursive: true });

  // Copy images
  const imgSrc = path.join(tut.srcDir, "img");
  const imgDest = path.join(tutOutDir, "img");
  if (fs.existsSync(imgSrc)) {
    copyDirRecursive(imgSrc, imgDest);
  }

  for (const ch of tut.chapters) {
    const srcFile = path.join(tut.srcDir, ch.file);
    if (!fs.existsSync(srcFile)) {
      console.warn("Missing chapter file:", srcFile);
      continue;
    }
    let rawMd = fs.readFileSync(srcFile, "utf8");
    rawMd = fixMarkdownLinks(rawMd);
    const htmlContent = marked(rawMd);
    const fullHtml = renderChapterPage(tut, ch, htmlContent);
    fs.writeFileSync(path.join(tutOutDir, ch.out), fullHtml);
  }
}

// Generate the Main Tutorials Index Page
const hubHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf8">
  <title>Demos & Tutorials Handbook — Superpowers Community Edition</title>
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="styles/index.css">
  <style>
    main { margin-left: 0 !important; max-width: 960px; margin: 0 auto; padding: 2em; }
    .hub-header { text-align: center; margin-bottom: 2.5em; }
    .hub-header h1 { font-size: 2.4em; margin-bottom: 0.3em; color: #222; }
    .hub-header p { font-size: 1.2em; color: #666; max-width: 650px; margin: 0 auto; }
    .nav-buttons { text-align: center; margin-top: 1.5em; margin-bottom: 2em; }
    .nav-buttons a {
      display: inline-block;
      padding: 0.6em 1.2em;
      margin: 0 0.5em;
      background: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .nav-buttons a.secondary {
      background: #e2e8f0;
      color: #334155;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5em;
      margin-bottom: 3em;
    }
    .card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.5em;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    }
    .card h2 { font-size: 1.4em; margin-top: 0; color: #1e293b; }
    .card p { color: #64748b; font-size: 0.95em; line-height: 1.5; flex-grow: 1; }
    .card-links { margin-top: 1.2em; }
    .card-links a.btn {
      display: block;
      text-align: center;
      padding: 0.6em 1em;
      background: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin-bottom: 0.5em;
    }
    .card-links .sub-links {
      font-size: 0.85em;
      text-align: center;
      color: #64748b;
    }
    .sources-box {
      background: #f8fafc;
      border-left: 4px solid #3b82f6;
      padding: 1.2em 1.5em;
      border-radius: 0 8px 8px 0;
      margin-top: 2em;
    }
  </style>
</head>
<body>
  <main>
    <div class="hub-header">
      <h1>Superpowers Game Demos & Tutorials</h1>
      <p>Explore step-by-step game creation tutorials, read the complete handbooks, and inspect the project sources included with Superpowers Community Edition.</p>
      <div class="nav-buttons">
        <a href="../index.html">&larr; Superpowers Home</a>
        <a href="../learn/index.html" class="secondary">Engine Documentation</a>
        <a href="https://github.com/mdaadoun/Superpowers-CE" target="_blank" class="secondary">GitHub Repository</a>
      </div>
    </div>

    <div class="cards-grid">
      ${tutorialsConfig.map(tut => `
        <div class="card">
          <div>
            <h2>${tut.title}</h2>
            <p>${tut.desc}</p>
          </div>
          <div class="card-links">
            <a href="${tut.id}/index.html" class="btn">Read Tutorial (${tut.chapters.length} chapters)</a>
            <div class="sub-links">
              <span>Project included in <code>demos/projects/</code></span>
            </div>
          </div>
        </div>
      `).join("")}
    </div>

    <div class="sources-box">
      <h3>📁 Monorepo Directory Organization</h3>
      <p>All projects, raw assets and markdown sources are structured in the repository:</p>
      <ul>
        <li><code>demos/projects/</code> — Ready-to-run Superpowers projects for each game (Super Pong, Super OXO, Super Sokoban, Super Asteroids, Super Pacman).</li>
        <li><code>demos/sources/</code> — Raw assets (spritesheets, audio files, textures, fonts).</li>
        <li><code>demos/tutorials/</code> — Markdown tutorial sources.</li>
        <li><code>docs/tutorials/</code> — This static handbook website deployed on GitHub Pages.</li>
      </ul>
    </div>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(outBase, "index.html"), hubHtml);

console.log("Static tutorials handbook generated successfully!");
