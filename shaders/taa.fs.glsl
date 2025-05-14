#version 300 es
precision highp int;
precision highp float;
layout(location = 0) out lowp vec4 frag_color;
uniform sampler2D screen;
uniform sampler2D motion;
uniform sampler2D accum;
uniform vec2 iTexel;
in vec2 p;

float luma(vec3 col) {
  return dot(col, vec3(0.2126,  0.7152, 0.0722));
}

void main() {
  vec3 current = texture(screen, p).rgb;
  vec3 previous = texture(accum, p).rgb;

  // Neighborhood clamping
  vec3 minCol = current;
  vec3 maxCol = current;

  for (float y = -1.0; y <= 1.0; y += 1.0) {
    for (float x = -1.0; x <= 1.0; x += 1.0) {
      vec2 c = p + iTexel * vec2(x, y);
      minCol = min(minCol, texture(screen, c).rgb);
      maxCol = max(maxCol, texture(screen, c).rgb);
    }
  }

  previous = clamp(previous, minCol, maxCol);

  float b = 7.0 / 8.0;

  frag_color = vec4(mix(current, previous, b), 0.0);
}
