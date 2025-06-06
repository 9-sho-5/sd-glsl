import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(2, 2, 3); // 右斜め上から見る位置
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const edges = new THREE.EdgesGeometry(geometry);
const material = new THREE.LineBasicMaterial({ vertexColors: true });

const colors = [];
const position = edges.attributes.position;
for (let i = 0; i < position.count; i++) {
  const angle = (i / position.count) * Math.PI * 2.0;
  colors.push(
    1.0, // 赤固定
    0.8 + 0.2 * Math.sin(angle), // ピンクのバリエーション
    0.9 + 0.1 * Math.cos(angle) // ピンクのバリエーション
  );
}
edges.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

const cube = new THREE.LineSegments(edges, material);
scene.add(cube);

let uTime = 0.0;

function animate() {
  uTime += 0.03;

  const speed = 1.0;
  const interval = Math.PI / 2;
  const steps = Math.floor((uTime * speed) / interval);
  const t = (uTime * speed) % interval;
  const pauseRatio = 0.1;

  let rotation;
  if (t < interval * pauseRatio) {
    rotation = steps * interval;
  } else {
    rotation =
      steps * interval -
      ((t - interval * pauseRatio) / (interval * (1.0 - pauseRatio))) *
        interval;
  }

  // 回転
  cube.rotation.z = rotation;

  // 💡 90度（1面）ごとに上下動を1回
  cube.position.y = Math.abs(Math.sin(rotation * 2)) * 0.2;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
