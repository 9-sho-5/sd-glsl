uniform float uTime;

varying float vAlpha;
varying vec3 vColor;

void main() {
  float PI = 3.14159265359;
  float R = 1.0;
  float r = 0.4;

  float u = uv.x * 2.0 * PI;
  float v = uv.y * 2.0 * PI;

  float x = (R + r * cos(v)) * cos(u);
  float y = (R + r * cos(v)) * sin(u);
  float z = r * sin(v);

  vec3 pos = vec3(x, y, z);

  // 回転
  float angle = uTime * 0.5;
  mat3 rotY = mat3(
    cos(angle), 0.0, sin(angle),
    0.0,        1.0, 0.0,
   -sin(angle), 0.0, cos(angle)
  );
  pos = rotY * pos;

  vColor = color;
  vAlpha = 1.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.0;
}
