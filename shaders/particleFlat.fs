layout(location = 0) out lowp vec4 fragColor;
in highp float point_size;
flat in int id;

void main() {
  //if (length(gl_PointCoord * 2.0 - 1.0) > 1.0)
    //discard;
  highp float alpha = 0.5 * clamp(min(1.0, point_size * 0.5 - length(gl_PointCoord * point_size - point_size * 0.5)), 0.0, 1.0);
  vec3 col = vec3(1.0) - palette(fract(float(id) / 232.234643), vec3(.03453212, .2359, .34966), vec3(.745674567,.223452345,.75564), vec3(.123412345,.7385,.12354346), vec3(.23456234,.3456234,.1346));
  fragColor = vec4(col * alpha, alpha);
}
