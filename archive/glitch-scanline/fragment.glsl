precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

// 乱数関数
float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // ---------- ラインのYブロック処理 ----------
  float yBlockIndex = floor(vUv.y * 50.0);
  float heightRand = rand(vec2(yBlockIndex, 7.0));
  float blockSize = 0.02 + heightRand * 0.06;
  float blockY = floor(vUv.y / blockSize) * blockSize;

  // ---------- グリッジの時間変化 ----------
  float timeRand = rand(vec2(blockY, 13.0));
  float localTime = floor(uTime * (1.0 + timeRand * 4.0));

  // ---------- グリッジの出現判定 ----------
  float glitchRand = rand(vec2(blockY, localTime));
  bool isGlitch = glitchRand < 0.25;

  // ---------- 横方向のランダム制御 ----------
  float xBlockIndex = floor(vUv.x * 30.0); // 横に30分割
  float xRand = rand(vec2(xBlockIndex, blockY * 2.0));
  float glitchStart = xRand * 0.7;      // グリッジ開始位置 (0〜0.7)
  float glitchWidth = 0.1 + rand(vec2(xBlockIndex, blockY * 3.0)) * 0.3;

  // グリッジがこのピクセルにかかるか？
  bool inGlitchX = vUv.x > glitchStart && vUv.x < glitchStart + glitchWidth;
  bool applyGlitch = isGlitch && inGlitchX;

  // ---------- 歪み量・色ずれ ----------
  float shiftAmount = applyGlitch ? (rand(vec2(blockY, localTime + 1.0)) - 0.5) * 0.4 : 0.0;
  float colorShift = applyGlitch ? 0.015 : 0.0;

  vec2 uvR = vUv + vec2(shiftAmount + colorShift, 0.0);
  vec2 uvG = vUv + vec2(shiftAmount, 0.0);
  vec2 uvB = vUv + vec2(shiftAmount - colorShift, 0.0);

  float r = texture2D(uTexture, uvR).r;
  float g = texture2D(uTexture, uvG).g;
  float b = texture2D(uTexture, uvB).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
