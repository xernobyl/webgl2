const float golden_ratio = 1.618033988749;
const float pi = 3.1415926535897932384626433832795;

#define saturate(x) clamp(x, 0.0, 1.0)

vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return a + b * cos(2.0 * pi * (c * t + d));
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

float min3(float a, float b, float c) {
  return min(a, min(b, c));
}

float min4(float a, float b, float c, float d) {
  return min(a, min(b, min(c, d)));
}
