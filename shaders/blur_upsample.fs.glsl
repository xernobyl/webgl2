uniform sampler2D color;
uniform vec2 halfPixel;

void main() {
  blurUpsample(color, uv, halfPixel);
}
