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

const SPIRAL_COUNT = 300;
const spiralGeo = new THREE.BufferGeometry();
const spiralPos = new Float32Array(SPIRAL_COUNT * 3);
const spiralPhases = new Float32Array(SPIRAL_COUNT);
const spiralSpeeds = new Float32Array(SPIRAL_COUNT);
const spiralDistances = new Float32Array(SPIRAL_COUNT);
const spiralBaseRadii = new Float32Array(SPIRAL_COUNT);
const spiralCircleDiameters = new Float32Array(SPIRAL_COUNT);

for (let i = 0; i < SPIRAL_COUNT; i++) {
  spiralPos[i * 3 + 0] = 0;
  spiralPos[i * 3 + 1] = 0;
  spiralPos[i * 3 + 2] = 0;
  spiralPhases[i] = i / SPIRAL_COUNT;
  spiralSpeeds[i] = 0.8 + Math.random() * 0.5;
  spiralDistances[i] = 0.05 + Math.random() * 0.1;
  spiralBaseRadii[i] = 0.6 + Math.random() * 0.4;
  spiralCircleDiameters[i] = 0.05 + Math.random() * 0.15;
}

spiralGeo.setAttribute("position", new THREE.BufferAttribute(spiralPos, 3));
spiralGeo.setAttribute("aPhase", new THREE.BufferAttribute(spiralPhases, 1));
spiralGeo.setAttribute("aSpeed", new THREE.BufferAttribute(spiralSpeeds, 1));
spiralGeo.setAttribute(
  "aDistance",
  new THREE.BufferAttribute(spiralDistances, 1)
);
spiralGeo.setAttribute(
  "aBaseRadius",
  new THREE.BufferAttribute(spiralBaseRadii, 1)
);
spiralGeo.setAttribute(
  "aCircleDiameter",
  new THREE.BufferAttribute(spiralCircleDiameters, 1)
);

const uniforms = {
  uTime: { value: 0.0 },
};

const vertexShader = await fetch("./vertex.glsl").then((res) => res.text());
const fragmentShader = await fetch("./fragment.glsl").then((res) => res.text());

const spiralMat = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const spiralPoints = new THREE.Points(spiralGeo, spiralMat);
scene.add(spiralPoints);

function animate() {
  uniforms.uTime.value += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
