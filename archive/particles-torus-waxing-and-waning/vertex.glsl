// === vertex.glsl ===
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
  float R = aBaseRadius;
  float r = aCircleDiameter;
  float k = R / r;

  float t = uTime + aPhase * 6.28318530718;

  float x = (R + r) * cos(t) - r * cos((1.0 + k) * t);
  float y = (R + r) * sin(t) - r * sin((1.0 + k) * t);
  float z = 0.0;

  vec3 pos = vec3(x, y, z);

  // 粒子が 3/4π (10時半) で出現し、7/4π (1時半) で消える
  float angle = atan(pos.y, pos.x);
  if (angle < 0.0) angle += 6.28318530718;

  float appearStart = 2.0 * PI / 4.0;
  float disappearEnd = 8.0 * PI / 4.0;

  // フェードイン・フェードアウト合成
  float fadeIn = smoothstep(appearStart - 0.4, appearStart, angle);      // 0 に近いほどフェードイン
  float fadeOut = 1.0 - smoothstep(disappearEnd - 0.4, disappearEnd, angle); // 1 に近いほどフェードアウト
  vAlpha = min(fadeIn, fadeOut); // 出現直後 or 消失直前では小さくなる

  vColor = vec3(1.0, 0.7 + sin(aPhase * 6.283) * 0.3, 1.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 4.0;
}
