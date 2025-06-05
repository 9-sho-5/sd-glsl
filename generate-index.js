const fs = require("fs");
const path = require("path");

// 除外したいファイル・ディレクトリ
const ignore = ["index.html", "style.css", "ogp.png", ".git", "node_modules"];

// kebab-case を Title Case に変換（例: particles-torus-move → Particle Torus Move）
function toTitleCase(str) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

// 対象のディレクトリを取得
const folders = fs
  .readdirSync(".")
  .filter(
    (name) =>
      fs.statSync(name).isDirectory() &&
      !ignore.includes(name) &&
      fs.existsSync(path.join(name, "index.html"))
  );

// HTMLを構成
const html = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GLSL Demo Gallery</title>
    <link rel="stylesheet" href="style.css" />
    <meta property="og:title" content="GLSL Demo Gallery" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://sd-glsl.netlify.app/" />
    <meta property="og:image" content="https://sd-glsl.netlify.app/ogp.png" />
    <meta
      property="og:description"
      content="GLSLを用いた粒子・立体・波・ワームホールなどの視覚表現デモを一覧で体験できます。"
    />
    <meta property="og:site_name" content="GLSL Demo Gallery" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body>
    <h1>GLSL Demo Gallery</h1>
    <div class="grid">
      ${folders
        .map(
          (dir) => `
      <a class="card" href="${dir}/index.html">
        <iframe class="preview" src="${dir}/index.html"></iframe>
        <div class="title">${toTitleCase(dir)}</div>
      </a>`
        )
        .join("\n")}
    </div>
  </body>
</html>`;

// 保存
fs.writeFileSync("index.html", html);
console.log("✅ index.html generated.");
