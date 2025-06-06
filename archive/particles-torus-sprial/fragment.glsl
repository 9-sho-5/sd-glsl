precision mediump float;

varying float vAlpha;
varying vec3 vColor;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
  gl_FragColor = vec4(vColor, alpha);
}
