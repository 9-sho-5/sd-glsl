import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const COUNT = 10000;
const positions = new Float32Array(COUNT * 3);
const seeds = new Float32Array(COUNT);

const a = 0.05; // 喉の最小半径（より細く）
const b = 2.0; // 喉の鋭さ（より急）
const scale = 24.0; // 上下の広がり
const height = 7.0; // Y方向の高さ

for (let i = 0; i < COUNT; i++) {
  const y = (Math.random() - 0.5) * height;

  // 半径の最大値を決定（今のr）
  const rMax = scale * a * Math.sqrt(1.0 + (y * y) / (b * b));

  // ✅ 中心から外周までのランダムな距離（均等に分布）
  const r = Math.sqrt(Math.random()) * rMax; // √で均等な密度に近づける
  const theta = Math.random() * Math.PI * 2;

  const x = r * Math.cos(theta);
  const z = r * Math.sin(theta);

  positions.set([x, y, z], i * 3);
  seeds[i] = Math.random();
}

const geometry = new THREE.BufferGeometry();
const colors = new Float32Array(COUNT * 3);

for (let i = 0; i < COUNT; i++) {
  // 位置・半径はそのまま

  // ✅ カラフルな色を粒子ごとに割り当てる（HSV風 or sin波でもOK）
  const hue = Math.random(); // 0.0〜1.0
  const r = Math.sin(hue * Math.PI * 2) * 0.5 + 0.5;
  const g = Math.sin(hue * Math.PI * 2 + 2.0) * 0.5 + 0.5;
  const b = Math.sin(hue * Math.PI * 2 + 4.0) * 0.5 + 0.5;
  colors.set([r, g, b], i * 3);
}
geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

const uniforms = {
  uTime: { value: 0.0 },
};

const vertexShader = await fetch("./vertex.glsl").then((res) => res.text());
const fragmentShader = await fetch("./fragment.glsl").then((res) => res.text());

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const points = new THREE.Points(geometry, material);

// ✅ グループ化して回転適用
const wormholeGroup = new THREE.Group();
wormholeGroup.add(points);
scene.add(wormholeGroup);

// ✅ ワームホールをX軸120°、Y軸60°回転
wormholeGroup.rotation.x = THREE.MathUtils.degToRad(110);
wormholeGroup.rotation.y = THREE.MathUtils.degToRad(0);
wormholeGroup.rotation.z = THREE.MathUtils.degToRad(30);

// animate
const clock = new THREE.Clock();
function animate() {
  uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
