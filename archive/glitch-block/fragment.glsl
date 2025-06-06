precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

// ランダム関数
float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // ---------- ブロック設定 ----------
  float blockX = 0.05;
  float blockY = 0.05;

  vec2 blockID = floor(vUv / vec2(blockX, blockY));
  vec2 blockUV = floor(vUv / vec2(blockX, blockY)) * vec2(blockX, blockY);

  float t = floor(uTime * 4.0); // 毎秒4回切り替え
  float g = rand(blockID + t);

  bool isGlitch = g < 0.2;

  vec2 glitchUv = vUv;

  if (isGlitch) {
    // UVのずれ
    vec2 shift = vec2(
      (rand(blockID + t + 1.0) - 0.5) * 0.1,
      (rand(blockID + t + 2.0) - 0.5) * 0.1
    );
    glitchUv += shift;

    // R, G, B それぞれ違う位置から取得してカラフルに
    float r = texture2D(uTexture, glitchUv + vec2(0.01, 0.0)).r;
    float g = texture2D(uTexture, glitchUv + vec2(-0.005, 0.005)).g;
    float b = texture2D(uTexture, glitchUv + vec2(0.0, -0.01)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  } else {
    // 通常描画
    gl_FragColor = texture2D(uTexture, vUv);
  }
}
