import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

// サイズ設定
const width = window.innerWidth;
const height = window.innerHeight;

// シーン構築
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// テクスチャ読み込み
const textureLoader = new THREE.TextureLoader();
textureLoader.load("./image.jpg", async (texture) => {
  texture.minFilter = THREE.LinearFilter;

  // シェーダー読み込み
  const vertexShader = await fetch("./vertex.glsl").then((res) => res.text());
  const fragmentShader = await fetch("./fragment.glsl").then((res) =>
    res.text()
  );

  const uniforms = {
    uTexture: { value: texture },
    uTime: { value: 0.0 },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // アニメーション
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    uniforms.uTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
  }
  animate();
});
