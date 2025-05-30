// 追加された属性とユニフォーム
attribute float aSeed;
attribute vec3 aColor;

uniform float uTime;

varying vec3 vColor;

void main() {
  vec3 pos = position;

  // 時間に応じたY方向のループ移動
  float speed = 1.0 + aSeed * 0.5;
  float range = 6.0;
  pos.y -= mod(uTime * speed + aSeed * range, range);

  // 中央で絞り、上下で広がるような形状
  float shrinkAmount = 0.8 / (1.0 + pow(pos.y / 3.0, 2.0));
  pos.x *= 1.0 - shrinkAmount;
  pos.z *= 1.0 - shrinkAmount;

  // 出口方向（Yが負）で外側へ広がる動き
  float expand = clamp(-pos.y, 0.0, 3.0);
  vec2 dir = normalize(vec2(pos.x, pos.z));
  pos.x += dir.x * expand * 0.2;
  pos.z += dir.y * expand * 0.2;

  // カラフルな色を反映
  vColor = aColor;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.5;
}
