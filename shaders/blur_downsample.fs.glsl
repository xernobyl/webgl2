layout(location = 0) out lowp vec4 frag_color;

uniform sampler2D color;
uniform vec2 halfPixel;

in vec2 uv;

void main() {
  vec3 col = blurDownsample(color, uv, halfPixel);
  frag_color = vec4(col, 0.0);
}
