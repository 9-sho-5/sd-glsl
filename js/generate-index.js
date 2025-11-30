const fs = require("fs");
const path = require("path");

const baseDir = path.resolve(__dirname, ".."); // ルートに戻る
const archiveDir = path.join(baseDir, "archive");

const command = process.argv[2];

// update-demos コマンド: 全デモのindex.htmlを更新
if (command === "update-demos") {
  const demoTemplate = (name) => `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name}</title>
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; overflow: hidden; }
      .back-btn {
        position: fixed;
        top: 16px;
        left: 16px;
        z-index: 100;
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        text-decoration: none;
        font-size: 14px;
        font-family: sans-serif;
        border-radius: 6px;
        backdrop-filter: blur(4px);
        transition: background 0.2s;
      }
      .back-btn:hover { background: rgba(0, 0, 0, 0.8); }
      @media (max-width: 600px) {
        .back-btn {
          top: 12px;
          left: 12px;
          padding: 6px 10px;
          font-size: 12px;
        }
      }
    </style>
  </head>
  <body>
    <a href="../../" class="back-btn">← Back</a>
    <script type="module" src="main.js"></script>
  </body>
</html>
`;

  const demos = fs
    .readdirSync(archiveDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(archiveDir, d.name, "index.html")))
    .map((d) => d.name);

  demos.forEach((name) => {
    const htmlPath = path.join(archiveDir, name, "index.html");
    fs.writeFileSync(htmlPath, demoTemplate(name));
  });

  console.log(`✅ ${demos.length}件のデモを更新しました`);
  process.exit(0);
}

const folders = fs
  .readdirSync(archiveDir, { withFileTypes: true })
  .filter(
    (d) =>
      d.isDirectory() &&
      fs.existsSync(path.join(archiveDir, d.name, "index.html"))
  )
  .map((d) => d.name);

const toTitleCase = (slug) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

let html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ほしょの遊び場 | GLSL</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="shortcut icon" href="./assets/images/favicon.webp" type="image/x-icon">

  <!-- GLSL Demo Gallery OGP -->
  <meta property="og:title" content="GLSL Demo Gallery" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://glsl.hoshokusunose.com/" />
  <meta property="og:image" content="https://glsl.hoshokusunose.com/ogp.png" />
  <meta property="og:description" content="GLSLを用いた粒子・立体・波・ワームホールなどの視覚表現デモを一覧で体験できます。" />
  <meta property="og:site_name" content="GLSL Demo Gallery" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
</head>
<body>
  <section id="firstview">
    <div class="lead_title">SHADER</div>
  </section>
  <section id="archive">
    <div class="container">
      <div class="archive_list">
`;

folders.forEach((folder, index) => {
  const number = `#${String(index + 1).padStart(2, "0")}`;
  const title = toTitleCase(folder);
  const href = `./archive/${folder}/index.html`;
  html += `        <a class="archive_item" href="${href}">
          <span class="number">${number}</span>
          <span class="name">${title}</span>
          <span class="skill_tag">GLSL</span>
          <span class="created_at">2025</span>
        </a>\n`;
});

html += `      </div>
    </div>
  </section>
  <div id="previewFrameContainer">
    <iframe id="previewFrame"></iframe>
  </div>
  <script src="./js/main.js"></script>
  <script type="module" src="./js/cube-room.js"></script>
  <footer>&copy; Hosho Kusunose</footer>
</body>
</html>`;

fs.writeFileSync(path.join(baseDir, "index.html"), html);
console.log("✅ index.html を自動生成しました");
