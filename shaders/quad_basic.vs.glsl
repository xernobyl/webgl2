layout(location = 0) in vec4 a0;
out vec2 uv;

void main() {
  gl_Position = a0;
  uv = a0.xy * 0.5 + 0.5;
}
