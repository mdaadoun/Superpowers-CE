const fs = require("fs");
const path = require("path");
const marked = require("/home/michael/SlowLifeGames/superpowers-ce/docs/handbook/node_modules/marked");
const hljs = require("/home/michael/SlowLifeGames/superpowers-ce/docs/handbook/node_modules/highlight.js");

marked.setOptions({
  highlight: (code, lang) => {
    if (lang == null || !hljs.getLanguage(lang)) lang = "typescript";
    return hljs.highlight(lang, code).value;
  }
});

const pagesDir = path.resolve("./docs/handbook/pages");
const outBase = path.resolve("./docs/learn");

const parsed = {};
for (const lang of ["en", "fr"]) {
  parsed[lang] = [];
  const catFolders = fs.readdirSync(path.join(pagesDir, lang))
    .filter(f => !f.includes(".") && fs.statSync(path.join(pagesDir, lang, f)).isDirectory())
    .sort((a, b) => parseInt(a.split("_")[0]) - parseInt(b.split("_")[0]));

  for (const catFolder of catFolders) {
    const catName = catFolder.split("_", 2)[1];
    const catPath = path.join(pagesDir, lang, catFolder);
    const files = fs.readdirSync(catPath)
      .filter(f => f.endsWith(".md"))
      .sort((a, b) => {
        if (a === "index.md") return -1;
        if (b === "index.md") return 1;
        return parseInt(a.split("_")[0]) - parseInt(b.split("_")[0]);
      });

    const catObj = { name: catName, title: "", pages: [] };

    for (const f of files) {
      const content = fs.readFileSync(path.join(catPath, f), "utf8");
      const title = content.substring(2, content.indexOf("\n")).trim();
      if (f === "index.md") {
        catObj.title = title;
      } else {
        const pageName = f.split(".", 2)[0].split("_", 2)[1];
        catObj.pages.push({
          name: pageName,
          title: title,
          html: marked(content)
        });
      }
    }
    if (!catObj.title) catObj.title = catName;
    parsed[lang].push(catObj);
  }
}

function renderPage(lang, catIndex, pageIndex) {
  const currentCat = parsed[lang][catIndex];
  const currentPage = currentCat.pages[pageIndex];

  let navHtml = "";
  for (const cat of parsed[lang]) {
    navHtml += `<li>${cat.title}</li><ol>`;
    for (const p of cat.pages) {
      const active = (cat.name === currentCat.name && p.name === currentPage.name) ? 'class="active"' : '';
      navHtml += `<li><a href="../${cat.name}/${p.name}.html" ${active}>${p.title}</a></li>`;
    }
    navHtml += `</ol>`;
  }

  const enTarget = (parsed["en"][catIndex] && parsed["en"][catIndex].pages[pageIndex])
    ? `../../en/${parsed["en"][catIndex].name}/${parsed["en"][catIndex].pages[pageIndex].name}.html`
    : `../../en/getting-started/about-superpowers.html`;

  const frTarget = (parsed["fr"][catIndex] && parsed["fr"][catIndex].pages[pageIndex])
    ? `../../fr/${parsed["fr"][catIndex].name}/${parsed["fr"][catIndex].pages[pageIndex].name}.html`
    : `../../fr/bien-demarrer/a-propos-de-superpowers.html`;

  const langSelectHtml = `
    <select onchange="window.location.href=this.value;">
      <option value="${enTarget}" ${lang === 'en' ? 'selected' : ''}>English</option>
      <option value="${frTarget}" ${lang === 'fr' ? 'selected' : ''}>Français</option>
    </select>
  `;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf8">
  <title>${currentPage.title} — Superpowers CE Documentation</title>
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="../../styles/index.css">
  <link rel="stylesheet" href="../../styles/highlight.css">
</head>
<body>
  <nav>
    <div class="menu">
      <ol>${navHtml}</ol>
    </div>
    <div class="language">
      ${langSelectHtml}
    </div>
  </nav>
  <main>
    <header>
      <a href="../../index.${lang}.html">
        <img src="../../images/icon.png">
        <span>Superpowers Community Edition &mdash; Documentation</span>
      </a>
    </header>
    <div class="page">
      ${currentPage.html}
    </div>
  </main>
</body>
</html>`;
}

for (const lang of ["en", "fr"]) {
  parsed[lang].forEach((cat, cIdx) => {
    const outDir = path.join(outBase, lang, cat.name);
    fs.mkdirSync(outDir, { recursive: true });
    cat.pages.forEach((p, pIdx) => {
      const html = renderPage(lang, cIdx, pIdx);
      fs.writeFileSync(path.join(outDir, `${p.name}.html`), html);
    });
  });
}

const learnIndex = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf8">
  <title>Superpowers CE Documentation</title>
  <script>
    var lang = (navigator.language && navigator.language.slice(0, 2) === "fr") ? "fr" : "en";
    if (lang === "fr") {
      window.location.href = "fr/bien-demarrer/a-propos-de-superpowers.html";
    } else {
      window.location.href = "en/getting-started/about-superpowers.html";
    }
  </script>
</head>
<body>
  <p>Redirecting to <a href="en/getting-started/about-superpowers.html">Documentation (English)</a> / <a href="fr/bien-demarrer/a-propos-de-superpowers.html">Documentation (Français)</a>...</p>
</body>
</html>`;
fs.writeFileSync(path.join(outBase, "index.html"), learnIndex);

console.log("Static documentation regenerated successfully with working language switch!");
