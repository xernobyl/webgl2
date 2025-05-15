layout(location = 0) in vec2 a0;
out vec2 p;

void main() {
  gl_Position = vec4(a0, 0.0, 1.0);
  p = a0.xy * 0.5 + 0.5;
}
