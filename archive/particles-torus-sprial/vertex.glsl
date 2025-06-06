uniform float uTime;
attribute float aPhase;
attribute float aSpeed;
attribute float aDistance;
attribute float aBaseRadius;
attribute float aCircleDiameter;

varying float vAlpha;
varying vec3 vColor;

void main() {
  float PI = 3.14159265359;
  float R = aBaseRadius - 0.1 + sin(uTime + aPhase * 6.283) * 0.05;
  float r = aCircleDiameter;
  float k = R / r;

  float t = uTime * aSpeed + aPhase * 10.0;
  float theta = t;

  float x = (R + r) * cos(theta) - r * cos((1.0 + k) * theta);
  float y = (R + r) * sin(theta) - r * sin((1.0 + k) * theta);
  float z = 0.0;

  vec3 pos = vec3(x, y, z);

  vColor = vec3(1.0);
  vAlpha = 1.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 6.0;
}
