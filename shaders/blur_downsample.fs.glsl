uniform sampler2D color;
uniform vec2 halfPixel;

void main() {
  downsampleBlur(color, uv, halfPixel);
}
