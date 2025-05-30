uniform float uTime;
varying float vAlpha;
varying vec3 vColor;

void main() {
  vec3 pos = position;

  // y位置をwave化（xとzに基づく）
  float wave = sin(pos.x * 5.0 + uTime) * cos(pos.z * 5.0 + uTime);
  pos.y = wave * 0.2; // 高さ調整

  vAlpha = 0.6 + 0.4 * sin(uTime + pos.x * 2.0);
  vColor = vec3(0.2 + 0.8 * uv.x, 0.4 + 0.6 * uv.y, 1.0 - uv.y); // 色味変化

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.0;
}
