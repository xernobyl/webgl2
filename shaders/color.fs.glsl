layout(location = 0) out lowp vec4 frag_color;

in vec3 n;
uniform vec4 color;

void main() {
  frag_color = color;
}
