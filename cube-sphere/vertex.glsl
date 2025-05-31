uniform float uTime;
varying float vAlpha;
varying vec3 vColor;

void main() {
  vec3 pos = position;

  // 揺らぎを削除 → 完全な球体に固定
  // pos += normalize(pos) * 0.03 * sin(uTime + pos.x * 10.0 + pos.y * 10.0); ← これを削除

  vAlpha = 1.0; // 必要に応じて透明度を固定
  vColor = normalize(pos) * 0.5 + 0.5;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.0;
}
