// fragment.glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform float uTime;
uniform vec2 uResolution;
uniform vec4 uSpheres[SPHERE_COUNT];

#define MAX_STEPS 64
#define SURF_DIST 0.01
#define MAX_DIST 100.0

float sphere(vec3 p, vec3 c, float r) {
  return length(p - c) - r;
}

float scene(vec3 p) {
  float d = 1e5;
  float r = 0.3;

  vec3 centers[SPHERE_COUNT];
  float radii[SPHERE_COUNT];

  // 初期位置と半径を取得
  for (int i = 0; i < SPHERE_COUNT; i++) {
    vec4 sph = uSpheres[i];
    centers[i] = sph.xyz;
    radii[i] = sph.w;

    // 軽く動きを加える
    centers[i].x += sin(uTime * 0.6 + float(i)) * 0.2;
    centers[i].y += cos(uTime * 0.4 + float(i)) * 0.2;
  }

  // 衝突をチェックして押し返す（反発）
  for (int i = 0; i < SPHERE_COUNT; i++) {
    for (int j = i + 1; j < SPHERE_COUNT; j++) {
      vec3 delta = centers[j] - centers[i];
      float dist = length(delta);
      float minDist = radii[i] + radii[j];
      if (dist < minDist) {
        vec3 dir = normalize(delta);
        float overlap = minDist - dist;
        centers[i] -= 0.5 * overlap * dir;
        centers[j] += 0.5 * overlap * dir;
      }
    }
  }

  // 最小距離を計算
  for (int i = 0; i < SPHERE_COUNT; i++) {
    float dist = sphere(p, centers[i], radii[i]);
    d = min(d, dist);
  }
  return d;
}

float rayMarch(vec3 ro, vec3 rd) {
  float dO = 0.0;
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = scene(p);
    if (dS < SURF_DIST || dO > MAX_DIST) break;
    dO += dS;
  }
  return dO;
}

vec3 getNormal(vec3 p) {
  float d = scene(p);
  vec2 e = vec2(0.01, 0);
  vec3 n = d - vec3(
    scene(p - e.xyy),
    scene(p - e.yxy),
    scene(p - e.yyx)
  );
  return normalize(n);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
  vec3 ro = vec3(0.0, 0.0, 2.5);
  vec3 rd = normalize(vec3(uv, -1.5));

  float d = rayMarch(ro, rd);
  vec3 col = vec3(0.0);

  if (d < MAX_DIST) {
    vec3 p = ro + rd * d;
    vec3 n = getNormal(p);
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(n, lightDir), 0.0);
    float spec = pow(max(dot(reflect(-lightDir, n), -rd), 0.0), 32.0);
    col = mix(vec3(0.4), vec3(0.8), diff) + vec3(spec);
  }

  gl_FragColor = vec4(col, 1.0);
}
