import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 立方体の内部を表すボックスジオメトリ
const geometry = new THREE.BoxGeometry(70, 70, 70);
const material = new THREE.ShaderMaterial({
  vertexShader: await fetch("./vertex.glsl").then((r) => r.text()),
  fragmentShader: await fetch("./fragment.glsl").then((r) => r.text()),
  side: THREE.BackSide, // カメラが内側にあるので裏面表示
  transparent: true,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// アニメーション
function animate(time) {
  requestAnimationFrame(animate);
  const t = time * 0.0001;
  camera.rotation.y = t;
  renderer.render(scene, camera);
}
animate();
