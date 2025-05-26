layout(location = 0) out lowp vec4 frag_color;
uniform sampler2D screen;
uniform sampler2D bloom;
uniform vec2 texelSize;
in vec2 p, np;

vec3 lensGlare(sampler2D bloomTex, vec2 uv, vec2 texelSize) {
  vec3 glare = vec3(0.0);

  // Ghosts
  const float ghostCount = 4.0;
  const float ghostSpacing = 0.25;

  for (float i = ghostSpacing; i <= ghostSpacing * ghostCount; i += ghostSpacing) {
    float offset = i;
    vec2 ghostUV = mix(uv, vec2(0.5), offset); // pull towards screen center
    glare += texture(bloomTex, ghostUV).rgb * (1.0 - offset);
  }

  // Chromatic Aberration Ghost
  vec2 caOffset = texelSize * 10.0;
  glare += 0.5 * vec3(
    texture(bloomTex, uv + caOffset).r,
    texture(bloomTex, uv).g,
    texture(bloomTex, uv - caOffset)).b;

  // Streaks
  for (float i = -3.0; i <= 3.0; i += 1.0) {
    vec2 offset = vec2(i, 0.0) * texelSize * 6.0;
    glare += texture(bloomTex, uv + offset).rgb * 0.05;
  }

  return glare;
}

void main() {
  vec3 image = texture(screen, p).rgb +
               0.25 * blurUpsample(bloom, p, texelSize) +
               0.125 * lensGlare(bloom, p, texelSize);

  // ChatGPT says this vignette is legit
  float r = length(np) * 0.5;
  float vignette = pow(1.0 - r * r, 4.0);

  image *= vignette;

  frag_color = vec4(sRGB(tonemap(image)), 1.0);
}
