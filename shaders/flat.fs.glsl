layout(location = 0) out lowp vec4 frag_color;
in vec3 n;

void main() {
  frag_color = vec4(normalize(n) * 0.5 + 0.5, 0.0);
}
