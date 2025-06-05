layout(location = 0) out vec3 fragColor;
uniform sampler2D bloom;
in vec2 p, np;

const float pi = 3.1415926535897932384626433832795;

// Spectrum to xyz approx function from Sloan http://jcgt.org/published/0002/02/01/paper.pdf
// Inputs:  Wavelength in nanometers
float xFit_1931(float wave) {
  float t1 = (wave-442.0)*((wave<442.0)?0.0624:0.0374),
        t2 = (wave-599.8)*((wave<599.8)?0.0264:0.0323),
        t3 = (wave-501.1)*((wave<501.1)?0.0490:0.0382);
  return 0.362*exp(-0.5*t1*t1) + 1.056*exp(-0.5*t2*t2)- 0.065*exp(-0.5*t3*t3);
}

float yFit_1931(float wave) {
  float t1 = (wave-568.8)*((wave<568.8)?0.0213:0.0247),
        t2 = (wave-530.9)*((wave<530.9)?0.0613:0.0322);
  return 0.821*exp(-0.5*t1*t1) + 0.286*exp(-0.5*t2*t2);
}

float zFit_1931(float wave) {
  float t1 = (wave-437.0)*((wave<437.0)?0.0845:0.0278),
        t2 = (wave-459.0)*((wave<459.0)?0.0385:0.0725);
  return 1.217*exp(-0.5*t1*t1) + 0.681*exp(-0.5*t2*t2);
}

vec3 waveLengthToLinearRGB(float w) {
  const mat3 XYZ2RGB = mat3(3.2406255, -0.9689307,  0.0557101,
              -1.5372080,  1.8757561, -0.2040211,
              -0.4986286,  0.0415175,  1.0569959);

  vec3 xyz = vec3(xFit_1931(w), yFit_1931(w), zFit_1931(w));

  return XYZ2RGB * xyz * 0.397;
}

vec3 spectralRing(vec2 p) {
  float rad = length(p);
  float wavelength = 380.0 + 370.0 * rad; // In nanometers
  return waveLengthToLinearRGB(wavelength);
}

void main() {
    // Adjust UV coordinates to account for aspect ratio
    vec2 scaledUV = (p - 0.5) * 1.0 * 2.0;
    float brightness = 1.0;
    float totalBrightness = 0.0;

    for (float i = 1.5; i <= 5.0; i *= 1.5) {
        totalBrightness += brightness;
        fragColor += texture(bloom, 0.5 - (scaledUV / i) * 0.5).rgb * brightness;
        brightness = 0.25 * brightness;
    }

    fragColor /= totalBrightness;

    fragColor *= spectralRing(p * 2.0 - 1.0);

    fragColor += 0.5 * texture(bloom, p).rgb;

    vec2 c = p * 2.0 - 1.0;
    vec2 cs = vec2(0.5);
    vec2 cb = vec2(0.5);

    float caOffset = 0.025;

    fragColor += 0.5 * vec3(
      texture(bloom, (c * (1.0 + 0.0 * caOffset)) * cs + cs).r,
      texture(bloom, (c * (1.0 + 1.0 * caOffset)) * cb + cs).g,
      texture(bloom, (c * (1.0 + 3.0 * caOffset)) * cb + cs).b);
}