uniform float uTime;

attribute float aSpeed;

varying float vAlpha;
varying vec3 vColor;

void main() {
  float PI = 3.14159265359;
  float R = 1.0;
  float r = 0.4;

  // 粒子ごとの速度でトーラスの周方向に回転
  float u = (uv.x - uTime * aSpeed * 0.05) * 2.0 * PI;
  float v = uv.y * 2.0 * PI;

  float x = (R + r * cos(v)) * cos(u);
  float y = (R + r * cos(v)) * sin(u);
  float z = r * sin(v);

  vec3 pos = vec3(x, y, z);

  vColor = color;
  vAlpha = 1.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.0;
}
