import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 粒子数
const COUNT = 20000;
const geometry = new THREE.BufferGeometry();

const uvs = new Float32Array(COUNT * 2);
const positions = new Float32Array(COUNT * 3);
const colors = new Float32Array(COUNT * 3);

for (let i = 0; i < COUNT; i++) {
  uvs[i * 2 + 0] = Math.random();
  uvs[i * 2 + 1] = Math.random();

  positions[i * 3 + 0] = 0; // dummy 必須
  positions[i * 3 + 1] = 0;
  positions[i * 3 + 2] = 0;

  colors[i * 3 + 0] = Math.random();
  colors[i * 3 + 1] = Math.random();
  colors[i * 3 + 2] = Math.random();
}

geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3)); // 必須
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const uniforms = {
  uTime: { value: 0.0 },
};

const vertexShader = await fetch("./vertex.glsl").then((res) => res.text());
const fragmentShader = await fetch("./fragment.glsl").then((res) => res.text());

const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

const points = new THREE.Points(geometry, material);
scene.add(points);

function animate() {
  uniforms.uTime.value += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
