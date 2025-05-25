layout(location = 0) out lowp vec4 frag_color;

uniform sampler2D color;
uniform vec2 texelSize;
uniform float threshold;
uniform float knee;

in vec2 uv;

void main() {
  vec3 col = blurDownsampleBrightness(color, uv, texelSize, threshold, knee);
  frag_color = vec4(col, 0.0);
}
