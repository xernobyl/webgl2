#version 300 es
precision highp int;
precision highp float;
layout(location = 0) out lowp vec4 frag_color;
uniform sampler2D screen;
in vec2 p;

vec3 sRGB(vec3 linear) {
  vec3 a = 12.92 * linear;
  vec3 b = 1.055 * pow(linear, vec3(1.0 / 2.4)) - 0.055;
  vec3 c = step(vec3(0.0031308), linear);
  return mix(a, b, c);
}

void main() {
  frag_color = vec4(sRGB(texture(screen, p).rgb), 0.0);
}