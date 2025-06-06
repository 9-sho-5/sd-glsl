uniform float uTime;
varying float vAlpha;
varying vec3 vColor;

void main() {
  vec3 pos = position;

  // 粒子を固定、揺らぎなし
  vAlpha = 1.0;
  vColor = vec3(uv, 1.0 - uv.y); // 色はグラデ用（任意）

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 3.5; // 粒子サイズ
}
