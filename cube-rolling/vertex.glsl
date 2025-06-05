uniform float uTime;
varying vec3 vColor;

void main() {
  vColor = vec3(
    sin(position.x + uTime) * 0.5 + 0.5,
    sin(position.y + uTime + 2.0) * 0.5 + 0.5,
    sin(position.z + uTime + 4.0) * 0.5 + 0.5
  );

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
