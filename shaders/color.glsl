vec3 tonemap(vec3 v) {
  /*
  ACES approximation by Krzysztof Narkowicz
  https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
  */
  const float a = 2.51f;
  const float b = 0.03f;
  const float c = 2.43f;
  const float d = 0.59f;
  const float e = 0.14f;

  v *= 0.6f;

  return clamp(( v * (a * v + b)) / (v * (c * v + d) + e), 0.0, 1.0);
}

vec3 sRGB(vec3 linear) {
  vec3 a = 12.92 * linear;
  vec3 b = 1.055 * pow(linear, vec3(1.0 / 2.4)) - 0.055;
  vec3 c = step(vec3(0.0031308), linear);
  return mix(a, b, c);
}

vec3 sRGB(float linear) {
  float a = 12.92 * linear;
  float b = 1.055 * pow(linear, 1.0 / 2.4) - 0.055;
  float c = step(0.0031308, linear);
  return vec3(mix(a, b, c));
}
