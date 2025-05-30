import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

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

// パーティクル数（100x100 = 10,000）
const PARTICLE_COUNT = 10000;
const positions = new Float32Array(PARTICLE_COUNT * 3);
const uvs = new Float32Array(PARTICLE_COUNT * 2);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 2;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 2;

  uvs[i * 2 + 0] = Math.random();
  uvs[i * 2 + 1] = Math.random();
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

const uniforms = {
  uTime: { value: 0.0 },
};

const material = new THREE.ShaderMaterial({
  vertexShader: await fetch("./vertex.glsl").then((r) => r.text()),
  fragmentShader: await fetch("./fragment.glsl").then((r) => r.text()),
  uniforms,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
}
animate();
