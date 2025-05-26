layout(location = 0) in vec2 a0;
out vec2 p, np;

uniform vec2 uAspectScale;  // vec(ar / length(vec2(ar, 1.0))).... something like that

void main() {
  gl_Position = vec4(a0, 0.0, 1.0);
  p = a0.xy * 0.5 + 0.5;

  np = a0.xy * uAspectScale;
}
