import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

const scene = new THREE.Scene();
const camera = new THREE.Camera();
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const SPHERE_COUNT = 3; // 数を5に制限
const sphereData = new Float32Array(SPHERE_COUNT * 4);
for (let i = 0; i < SPHERE_COUNT; i++) {
  const t = Math.random() * 10;
  const radius = 0.1 + Math.random() * 0.3;
  const x = Math.sin(t) * 0.5;
  const y = Math.cos(t * 1.3) * 0.5;
  const z = Math.sin(t * 0.7) * 0.5;
  sphereData.set([x, y, z, radius], i * 4);
}

const uniforms = {
  uTime: { value: 0.0 },
  uResolution: {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  },
  uSpheres: { value: sphereData },
};

const vertexShader = await fetch("./vertex.glsl").then((res) => res.text());
const fragmentShader = await fetch("./fragment.glsl").then((res) => res.text());

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
});
material.defines = { SPHERE_COUNT: SPHERE_COUNT };

const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
scene.add(plane);

const clock = new THREE.Clock();
function animate() {
  uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
});
