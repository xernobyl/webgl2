uniform sampler2D color;
uniform vec2 halfPixel;
uniform float threshold;
uniform float knee;

in vec2 uv;

void main() {
  blurDownsampleBrightness(color, uv, halfPixel, threshold, knee);
}
