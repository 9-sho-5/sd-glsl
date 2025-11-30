uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

// Simplex noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 4; i++) {
    value += amplitude * snoise(p * frequency);
    amplitude *= 0.4;
    frequency *= 2.2;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 p = (uv - 0.5) * aspect;

  float t = uTime * 0.05;

  // ゆっくりランダムに動く流体パターン
  vec2 q = vec2(
    fbm(p + vec2(t * 0.3, t * 0.2)),
    fbm(p + vec2(5.2, 1.3) + vec2(t * 0.2, t * 0.4))
  );

  vec2 r = vec2(
    fbm(p + 3.0 * q + vec2(t * 0.1, -t * 0.15)),
    fbm(p + 3.0 * q + vec2(8.3, 2.8) + vec2(-t * 0.2, t * 0.1))
  );

  float f = fbm(p + 3.0 * r + vec2(sin(t), cos(t)) * 0.2);

  // ノイズグラデーション
  float noiseGrad = snoise(p * 2.0 + t * 0.5) * 0.5 + 0.5;
  float posGrad = (uv.x + uv.y) * 0.5; // 斜めグラデーション

  // カラー
  vec3 color1 = vec3(0.05, 0.08, 0.15);
  vec3 color2 = vec3(0.12, 0.25, 0.5);
  vec3 color3 = vec3(0.25, 0.45, 0.7);
  vec3 color4 = vec3(0.5, 0.7, 0.9);
  vec3 color5 = vec3(0.85, 0.9, 0.95);

  // ノイズでグラデーション位置をずらす
  float gradPos = posGrad + noiseGrad * 0.3 + f * 0.2;

  vec3 color = mix(color1, color2, smoothstep(0.0, 0.25, gradPos));
  color = mix(color, color3, smoothstep(0.25, 0.5, gradPos));
  color = mix(color, color4, smoothstep(0.5, 0.75, gradPos));
  color = mix(color, color5, smoothstep(0.75, 1.0, gradPos));

  // ノイズディテール追加
  color += (f * 0.1 + length(q) * 0.05) * vec3(0.3, 0.4, 0.5);

  gl_FragColor = vec4(color, 1.0);
}
