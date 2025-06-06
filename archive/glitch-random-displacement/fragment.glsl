precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

// ランダム生成
float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  // ブロック単位でランダムな歪みを加える
  float blockSize = 0.05;
  vec2 block = floor(vUv / blockSize);

  float noise = rand(block + floor(uTime * 3.0));
  bool isGlitch = noise < 0.3;

  // 各チャンネル用のランダムシフト（XとYに少しずつ違いをつける）
  float strength = isGlitch ? 0.02 : 0.0;

  vec2 rShift = vec2(
    (rand(block + vec2(1.0, 2.0) + uTime) - 0.5) * strength,
    (rand(block + vec2(2.0, 1.0) + uTime) - 0.5) * strength
  );
  vec2 gShift = vec2(
    (rand(block + vec2(3.0, 4.0) + uTime) - 0.5) * strength,
    (rand(block + vec2(4.0, 3.0) + uTime) - 0.5) * strength
  );
  vec2 bShift = vec2(
    (rand(block + vec2(5.0, 6.0) + uTime) - 0.5) * strength,
    (rand(block + vec2(6.0, 5.0) + uTime) - 0.5) * strength
  );

  float r = texture2D(uTexture, vUv + rShift).r;
  float g = texture2D(uTexture, vUv + gShift).g;
  float b = texture2D(uTexture, vUv + bShift).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
