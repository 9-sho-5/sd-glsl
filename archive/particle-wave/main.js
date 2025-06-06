import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

// シーン・カメラ・レンダラー設定
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2.5, 4); // 斜め上から
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === 平面グリッドに粒子を配置 ===
const COUNT_X = 100;
const COUNT_Z = 100;
const TOTAL = COUNT_X * COUNT_Z;

const positions = new Float32Array(TOTAL * 3);
const uvs = new Float32Array(TOTAL * 2);

let index = 0;
for (let i = 0; i < COUNT_X; i++) {
  for (let j = 0; j < COUNT_Z; j++) {
    const x = (i - COUNT_X / 2) * 0.05;
    const z = (j - COUNT_Z / 2) * 0.05;
    const y = 0;

    positions[index * 3 + 0] = x;
    positions[index * 3 + 1] = y;
    positions[index * 3 + 2] = z;

    uvs[index * 2 + 0] = i / COUNT_X;
    uvs[index * 2 + 1] = j / COUNT_Z;

    index++;
  }
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

const uniforms = {
  uTime: { value: 0.0 },
};

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

// アニメーション
const clock = new THREE.Clock();
function animate() {
  uniforms.uTime.value = clock.getElapsedTime();
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
