layout(location = 0) out lowp vec4 fragColor;
uniform sampler2D samplerCurrent;
uniform sampler2D samplerMotion;
uniform sampler2D samplerPrevious;
uniform vec2 iTexel;
in vec2 p;

float luma(vec3 col) {
  return dot(col, vec3(0.2126,  0.7152, 0.0722));
}

void main() {
  vec3 current = texture(samplerCurrent, p).rgb;
  vec2 motion = texture(samplerMotion, p).xy;
  vec3 previous = texture(samplerPrevious, p + motion).rgb;

  // Neighborhood clamping
  vec3 minCol = current;
  vec3 maxCol = current;

  for (float y = -1.0; y <= 1.0; y += 1.0) {
    for (float x = -1.0; x <= 1.0; x += 1.0) {
      vec2 c = p + iTexel * vec2(x, y);
      minCol = min(minCol, texture(samplerCurrent, c).rgb);
      maxCol = max(maxCol, texture(samplerCurrent, c).rgb);
    }
  }

  previous = clamp(previous, minCol, maxCol);

  float b = 7.0 / 8.0;

  fragColor = vec4(mix(current, previous, b), 0.0);
}
