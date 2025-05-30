attribute vec3 aColor;
uniform float uTime;

varying vec3 vColor;

void main() {
  vec3 pos = position;

  // 軽い揺らぎアニメーション（任意）
  pos.z += sin(uTime + pos.x * 10.0) * 0.01;

  vColor = aColor;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.0;
}
