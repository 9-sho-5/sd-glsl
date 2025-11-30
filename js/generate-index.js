const fs = require("fs");
const path = require("path");

const baseDir = path.resolve(__dirname, ".."); // ルートに戻る
const archiveDir = path.join(baseDir, "archive");

// コマンドライン引数
const command = process.argv[2];

// create コマンド: テンプレートからデモを作成
if (command === "create") {
  const demoName = process.argv[3];
  if (!demoName) {
    console.error("❌ デモ名を指定してください: npm run generate create <demo-name>");
    process.exit(1);
  }

  const demoDir = path.join(archiveDir, demoName);
  if (fs.existsSync(demoDir)) {
    console.error(`❌ ${demoName} は既に存在します`);
    process.exit(1);
  }

  fs.mkdirSync(demoDir, { recursive: true });

  const indexHtml = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${demoName}</title>
    <style>
      body { margin: 0; overflow: hidden; }
    </style>
  </head>
  <body>
    <script type="module" src="main.js"></script>
  </body>
</html>
`;

  const vertexGlsl = `varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

  const fragmentGlsl = `uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec3 color = vec3(uv, 0.5 + 0.5 * sin(uTime));
  gl_FragColor = vec4(color, 1.0);
}
`;

  const mainJs = `import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const uniforms = {
  uTime: { value: 0.0 },
  uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
};

const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({
  vertexShader: await fetch("./vertex.glsl").then((r) => r.text()),
  fragmentShader: await fetch("./fragment.glsl").then((r) => r.text()),
  uniforms,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

window.addEventListener("mousemove", (e) => {
  uniforms.uMouse.value.x = e.clientX / window.innerWidth;
  uniforms.uMouse.value.y = 1.0 - e.clientY / window.innerHeight;
});

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}
animate();
`;

  fs.writeFileSync(path.join(demoDir, "index.html"), indexHtml);
  fs.writeFileSync(path.join(demoDir, "vertex.glsl"), vertexGlsl);
  fs.writeFileSync(path.join(demoDir, "fragment.glsl"), fragmentGlsl);
  fs.writeFileSync(path.join(demoDir, "main.js"), mainJs);

  console.log(`✅ ${demoName} を作成しました → archive/${demoName}/`);
  process.exit(0);
}

// index.html 生成
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
