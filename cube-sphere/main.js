import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 球体に詰めるための設定
const GRID_SIZE = 32;
const SPACING = 0.16;
const RADIUS = (GRID_SIZE * SPACING) / 2;
const CUBE_SIZE = 0.1;

const baseGeometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
const edgeGeometry = new THREE.EdgesGeometry(baseGeometry);

const group = new THREE.Group();
scene.add(group);

for (let x = -GRID_SIZE / 2; x <= GRID_SIZE / 2; x++) {
  for (let y = -GRID_SIZE / 2; y <= GRID_SIZE / 2; y++) {
    for (let z = -GRID_SIZE / 2; z <= GRID_SIZE / 2; z++) {
      const dx = x * SPACING;
      const dy = y * SPACING;
      const dz = z * SPACING;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist <= RADIUS) {
        // 黒の立方体（面）
        const cubeMaterial = new THREE.MeshBasicMaterial({
          color: 0x000000,
          depthWrite: true,
          depthTest: true,
        });
        const cube = new THREE.Mesh(baseGeometry, cubeMaterial);
        cube.position.set(dx, dy, dz);
        group.add(cube);

        // ランダム色のエッジ（線）
        const color = new THREE.Color(
          Math.random(),
          Math.random(),
          Math.random()
        );
        const edgeMaterial = new THREE.LineBasicMaterial({
          color: color,
          transparent: false,
          depthWrite: true,
          depthTest: true,
        });
        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        edges.position.set(dx, dy, dz);
        group.add(edges);
      }
    }
  }
}

// アニメーション
function animate() {
  group.rotation.y += 0.003;
  group.rotation.x += 0.002;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// リサイズ対応
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
