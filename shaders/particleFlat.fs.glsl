#version 300 es
precision highp int;
precision highp float;
layout(location = 0) out lowp vec4 frag_color;
in highp float point_size;
flat in int id;

vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d){return a + b * cos(6.283185307179586 * (c * t + d));}

void main() {
  highp float alpha = 0.5 * clamp(min(1.0, point_size * 0.5 - length(gl_PointCoord * point_size - point_size * 0.5)), 0.0, 1.0);
  if (alpha <= 0.0) {
    discard;
  }
  vec3 col = vec3(1.0, 0.0, 0.0);
  frag_color = vec4(col * alpha, alpha);
}