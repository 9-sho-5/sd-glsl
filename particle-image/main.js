import * as THREE from "https://cdn.skypack.dev/three@0.152.2";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const uniforms = {
  uTime: { value: 0.0 },
};

const vertexShader = await fetch("./vertex.glsl").then((res) => res.text());
const fragmentShader = await fetch("./fragment.glsl").then((res) => res.text());

const image = new Image();
image.src = "./image.jpg"; // 任意の画像ファイルを同ディレクトリに置く
image.onload = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const width = image.width;
  const height = image.height;
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);

  const imgData = ctx.getImageData(0, 0, width, height).data;

  const positions = [];
  const colors = [];
  const scales = [];
  const scale = 2.5; // ✅ 拡大率を調整して画像を大きく見せる
  const size = scale / Math.max(width, height);
  const density = 0.07; // スカスカ度（0〜1の間、値が小さいほど間引きが強い）

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (Math.random() > density) continue; // ランダムでスキップ（密度制御）

      const i = (y * width + x) * 4;
      const r = imgData[i] / 255;
      const g = imgData[i + 1] / 255;
      const b = imgData[i + 2] / 255;
      const a = imgData[i + 3] / 255;

      if (a > 0.1) {
        const px = (x - width / 2) * size;
        const py = -(y - height / 2) * size;
        positions.push(px, py, 0);
        colors.push(r, g, b);
        scales.push(Math.random());
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("aColor", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new THREE.Float32BufferAttribute(scales, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);
};

const clock = new THREE.Clock();
function animate() {
  uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
