layout(location = 0) out lowp vec4 fragColor;

uniform sampler2D color;
uniform vec2 texelSize;
uniform float threshold;

in vec2 uv;

void main() {
  float threshold2 = openSimplex2_ImproveXY(vec3(uv * vec2(16.0, 9.0) / 2.0, .46546)).w * 0.5 + 0.5;
  threshold2 = 1.0 - pow(threshold2, 4.0);

  vec3 col = blurDownsampleBrightness(color, uv, texelSize, threshold2);
  fragColor = vec4(col, 0.0);
}
