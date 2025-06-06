uniform float uTime;
varying float vAlpha;
varying vec3 vColor;

void main() {
  vec3 pos = position;

  // ゆらぎ (sin)
  pos.x += 0.05 * sin(uTime + uv.x * 10.0);
  pos.y += 0.05 * sin(uTime * 1.5 + uv.y * 10.0);
  pos.z += 0.05 * sin(uTime * 2.0 + uv.x * uv.y * 40.0);

  vAlpha = 0.5 + 0.5 * sin(uTime + uv.x * 5.0);
  vColor = vec3(uv, 1.0 - uv.y); // RGB的にバラす

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.0; // 粒子サイズ（必要に応じて拡大）
}
