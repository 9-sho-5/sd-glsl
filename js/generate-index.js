const fs = require("fs");
const path = require("path");

const baseDir = path.resolve(__dirname, ".."); // ルートに戻る
const archiveDir = path.join(baseDir, "archive");

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
  <meta property="og:title" content="GLSL Demo Gallery" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://glsl.hoshokusunose.com/" />
  <meta
    property="og:image"
    content="https://glsl.hoshokusunose.com//ogp.png"
  />
  <meta
    property="og:description"
    content="GLSLを用いた粒子・立体・波・ワームホールなどの視覚表現デモを一覧で体験できます。"
  />
  <meta property="og:site_name" content="GLSL Demo Gallery" />
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
  <script src="./js/cube-rooom.js"></script>
  <footer>&copy; Hosho Kusunose</footer>
</body>
</html>`;

fs.writeFileSync(path.join(baseDir, "index.html"), html);
console.log("✅ index.html を自動生成しました");
