precision mediump float;
varying vec3 vPosition;

void main() {
  vec3 pos = normalize(vPosition);
  vec2 uv;

  // 各面のUV座標を取得（最も支配的な軸でUVを切り替える）
  if (abs(pos.x) > abs(pos.y) && abs(pos.x) > abs(pos.z)) {
    uv = vPosition.yz;
  } else if (abs(pos.y) > abs(pos.z)) {
    uv = vPosition.xz;
  } else {
    uv = vPosition.xy;
  }

  // グリッドサイズを調整（0.25にするとマス目が大きくなる）
  vec2 grid = abs(fract(uv * 0.25) - 0.5);

  // 線の太さ調整（0.495 - 0.49 で細い黒線）
  float line = smoothstep(0.49, 0.495, max(grid.x, grid.y));

  // 色設定：面は白、線は黒
  vec3 baseColor = vec3(1.0);   // 白
  vec3 lineColor = vec3(0.8);   // 黒
  vec3 color = mix(baseColor, lineColor, line);

  gl_FragColor = vec4(color, 1.0);
}
