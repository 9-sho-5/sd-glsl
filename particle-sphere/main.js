import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

// シーン・カメラ・レンダラー設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Fibonacci Sphere による球体分布 ===
const PARTICLE_COUNT = 10000;
const positions = new Float32Array(PARTICLE_COUNT * 3);
const uvs = new Float32Array(PARTICLE_COUNT * 2);

const offset = 2 / PARTICLE_COUNT;
const increment = Math.PI * (3 - Math.sqrt(5)); // 黄金角 ≈ 2.399

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const y = i * offset - 1 + offset / 2;
  const r = Math.sqrt(1 - y * y);
  const phi = i * increment;

  const x = Math.cos(phi) * r;
  const z = Math.sin(phi) * r;

  positions[i * 3 + 0] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;

  uvs[i * 2 + 0] = (phi % (2 * Math.PI)) / (2 * Math.PI);
  uvs[i * 2 + 1] = (y + 1) / 2.0;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

// Uniform
const uniforms = {
  uTime: { value: 0.0 },
};

// ShaderMaterial にカスタム GLSL を適用
const material = new THREE.ShaderMaterial({
  vertexShader: await fetch("vertex.glsl").then((res) => res.text()),
  fragmentShader: await fetch("fragment.glsl").then((res) => res.text()),
  uniforms,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

// パーティクルオブジェクトをシーンに追加
const points = new THREE.Points(geometry, material);
scene.add(points);

// アニメーションループ
const clock = new THREE.Clock();
function animate() {
  uniforms.uTime.value = clock.getElapsedTime();

  // 球体の自動回転（ゆっくり）
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
