layout(location = 0) out mediump vec3 outColor;
layout(location = 1) out highp vec2 outMotion;

in vec3 n;
uniform vec3 color;

void main() {
  outColor = color;
  outMotion = vec2(0.0);
}
