precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

float rand(vec2 co) {
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  // ----------------------
  // ブロック分割（ライン高さ＋横位置）
  float blockSizeY = 0.08;
  float blockSizeX = 0.2;

  float blockY = floor(vUv.y / blockSizeY);
  float blockX = floor(vUv.x / blockSizeX);
  vec2 blockID = vec2(blockX, blockY);

  // ----------------------
  // ブロックごとの時間ゆらぎ
  float localTime = floor(uTime * (1.0 + rand(blockID * 10.0) * 3.0));
  float glitchTrigger = rand(blockID + localTime);

  bool isGlitch = glitchTrigger < 0.25; // 25%の確率で発生

  // ----------------------
  // 色ずれの強さ（発生時だけ）
  float strength = isGlitch ? (0.005 + rand(blockID + uTime) * 0.01) : 0.0;

  // 方向もノイズから導出
  vec2 offset = vec2(
    strength * sin(uTime + vUv.y * 30.0),
    strength * cos(uTime + vUv.x * 20.0)
  );

  // RGBチャンネルずらし
  float r = texture2D(uTexture, vUv + offset).r;
  float g = texture2D(uTexture, vUv).g;
  float b = texture2D(uTexture, vUv - offset).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
