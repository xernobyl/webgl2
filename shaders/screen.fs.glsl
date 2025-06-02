layout(location = 0) out lowp vec4 fragColor;
uniform sampler2D screen;
uniform sampler2D bloom;
uniform vec2 texelSize;
in vec2 p, np;

void main() {
  vec3 image = 0.666666666666666666 * texture(screen, p).rgb;// +
               //blurUpsample(bloom, p, texelSize) / 32.0;

  vec2 c = p * 2.0 - 1.0;
  vec2 cs = vec2(0.5);
  vec2 cb = vec2(0.5);

  float caOffset = 0.025;
  image += 0.333333333333333333 * vec3(
      texture(bloom, (c * (1.0 + 0.0 * caOffset)) * cs + cs).r,
      texture(bloom, (c * (1.0 + 1.0 * caOffset)) * cb + cs).g,
      texture(bloom, (c * (1.0 + 3.0 * caOffset)) * cb + cs).b);

  // ChatGPT says this vignette is legit
  float r = length(np) * 0.5;
  float vignette = pow(1.0 - r * r, 4.0);

  image *= vignette;

  fragColor = vec4(sRGB(tonemap(image)), 1.0);
}
