layout(location = 0) out lowp vec4 fragColor;
uniform sampler2D screen;
uniform sampler2D bloom;
uniform vec2 texelSize;
uniform vec3 uCameraDir;
in vec2 p, np;

float hash1(vec2 p) {
  return fract(sin(p.x*0.129898 + p.y*0.78233) * 43758.5453);
}

float valueNoise(vec2 p, vec2 s) {
  vec2 cell = floor(p);
  vec2 sub = p - cell;
  vec2 cube = sub * sub * (3. - 2. * sub);
  const vec2 off = vec2(0.0, 1.0);

  return mix(mix(hash1(mod(cell + off.xx, s)), hash1(mod(cell + off.yx, s)), cube.x),
             mix(hash1(mod(cell + off.xy, s)), hash1(mod(cell + off.yy, s)), cube.x), cube.y);
}

float starburst(float phi, vec3 dir) {
  float t = dot(vec3(0.0, 0.0, -1.0), dir) * 0.5 + 0.5;

  return valueNoise(vec2(phi / tau * 1000.0, t * 76.54321), vec2(10000.0, 10000.0)) * 0.25 + 0.75;
}

void main() {
  vec2 polar = vec2(length(np), atan(np.x, np.y));

  vec3 image = 0.666666666666666666 * texture(screen, p).rgb;// +
               //blurUpsample(bloom, p, texelSize) / 32.0;

  image += 0.333333333333333333 * texture(bloom, p).rgb *
           starburst(polar.y, uCameraDir);

  // ChatGPT says this vignette is legit
  float r = length(np) * 0.5;
  float vignette = pow(1.0 - r * r, 4.0);
  image *= vignette;

  fragColor = vec4(sRGB(tonemap(image)), 1.0);
}
