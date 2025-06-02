layout(location = 0) out lowp vec4 fragColor;
in highp float point_size;
flat in int id;

void main() {
  highp float alpha = 0.5 * clamp(min(1.0, point_size * 0.5 - length(gl_PointCoord * point_size - point_size * 0.5)), 0.0, 1.0);
  if (alpha <= 0.0) {
    discard;
  }
  vec3 col = vec3(1.0, 0.0, 0.0);
  fragColor = vec4(col * alpha, alpha);
}
