layout(location = 0) out lowp vec4 frag_color;
uniform sampler2D screen;
uniform sampler2D bloom;
uniform vec2 halfPixel;
in vec2 p;

void main() {
  vec3 image = texture(screen, p).rgb +
               blurUpsample(bloom, p, halfPixel);

  frag_color = vec4(sRGB(tonemap(image)), 1.0);
}
