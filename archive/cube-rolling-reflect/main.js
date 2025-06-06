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

// 立方体のジオメトリとエッジ
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

// ✅ クローンを作成して反射表現
const mirror = cube.clone();
mirror.scale.y = -1; // 上下反転
mirror.material = new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.3,
});
scene.add(mirror);

// ✅ 任意：地面をわずかに表示して視認性アップ
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0x222222,
  transparent: true,
  opacity: 0.2,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1.01;
scene.add(plane);

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

  // 回転とバウンド
  cube.rotation.z = rotation;
  cube.position.y = Math.abs(Math.sin(rotation * 2)) * 0.2;

  // ✅ ミラーも連動させる
  mirror.rotation.z = -cube.rotation.z;
  mirror.position.y = -cube.position.y - 1;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
