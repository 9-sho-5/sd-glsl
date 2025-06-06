import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

// シーン・カメラ・レンダラー
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2, 2, 2); // 斜め上から見下ろす
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === 粒子配置（立方体グリッド） ===
const GRID = 20; // 20×20×20 の小粒子で構成
const SPACING = 0.1;
const COUNT = GRID ** 3;

const positions = new Float32Array(COUNT * 3);
const uvs = new Float32Array(COUNT * 2);

let i = 0;
for (let xi = 0; xi < GRID; xi++) {
  for (let yi = 0; yi < GRID; yi++) {
    for (let zi = 0; zi < GRID; zi++) {
      const x = (xi - GRID / 2) * SPACING;
      const y = (yi - GRID / 2) * SPACING;
      const z = (zi - GRID / 2) * SPACING;

      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      uvs[i * 2 + 0] = xi / GRID;
      uvs[i * 2 + 1] = yi / GRID;

      i++;
    }
  }
}

// ジオメトリに属性追加
const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

// Uniforms（時間用）
const uniforms = {
  uTime: { value: 0.0 },
};

// ShaderMaterial 読み込み（GLSL別ファイル）
const material = new THREE.ShaderMaterial({
  vertexShader: await fetch("vertex.glsl").then((res) => res.text()),
  fragmentShader: await fetch("fragment.glsl").then((res) => res.text()),
  uniforms,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const points = new THREE.Points(geometry, material);
scene.add(points);

// アニメーションループ
const clock = new THREE.Clock();
function animate() {
  uniforms.uTime.value = clock.getElapsedTime();

  // オブジェクトのゆるやかな回転（任意）
  points.rotation.y += 0.002;
  points.rotation.x += 0.001;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// リサイズ対応
window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});
