layout(location = 0) out lowp vec4 frag_color;
uniform sampler2D screen;
in vec2 p;

void main() {
  frag_color = vec4(sRGB(texture(screen, p).rgb), 1.0);
}
