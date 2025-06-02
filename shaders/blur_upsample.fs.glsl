layout(location = 0) out lowp vec4 fragColor;

uniform sampler2D color;
uniform vec2 texelSize;

in vec2 uv;

void main() {
  vec3 col = blurUpsample(color, uv, texelSize);
  fragColor = vec4(col, 0.0);
}
