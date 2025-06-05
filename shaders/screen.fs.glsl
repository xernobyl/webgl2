layout(location = 0) out lowp vec4 fragColor;
uniform sampler2D screen;
uniform sampler2D bloom;
uniform vec2 texelSize;
uniform vec3 uCameraDir;
in vec2 p, np;

float starburst(float phi, vec3 dir) {
  float t = dot(vec3(0.0, 0.0, -1.0), dir);

  // TODO: use some tileable noise... there's a visible seam :(
  return openSimplex2_Conventional(vec3(0.0, phi * 32.0, 4.0 * t)).a * 0.25 + 0.75;
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
