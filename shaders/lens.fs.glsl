layout(location = 0) out vec3 fragColor;
uniform sampler2D bloom;
in vec2 p, np;

const float pi = 3.1415926535897932384626433832795;

// CIE 1931 XYZ approximation from Sloan (http://jcgt.org/published/0002/02/01/paper.pdf)
float xFit_1931(float wave) {
    float t1 = (wave - 442.0) * ((wave < 442.0) ? 0.0624 : 0.0374);
    float t2 = (wave - 599.8) * ((wave < 599.8) ? 0.0264 : 0.0323);
    float t3 = (wave - 501.1) * ((wave < 501.1) ? 0.0490 : 0.0382);
    return 0.362 * exp(-0.5 * t1 * t1) + 1.056 * exp(-0.5 * t2 * t2) - 0.065 * exp(-0.5 * t3 * t3);
}

float yFit_1931(float wave) {
    float t1 = (wave - 568.8) * ((wave < 568.8) ? 0.0213 : 0.0247);
    float t2 = (wave - 530.9) * ((wave < 530.9) ? 0.0613 : 0.0322);
    return 0.821 * exp(-0.5 * t1 * t1) + 0.286 * exp(-0.5 * t2 * t2);
}

float zFit_1931(float wave) {
    float t1 = (wave - 437.0) * ((wave < 437.0) ? 0.0845 : 0.0278);
    float t2 = (wave - 459.0) * ((wave < 459.0) ? 0.0385 : 0.0725);
    return 1.217 * exp(-0.5 * t1 * t1) + 0.681 * exp(-0.5 * t2 * t2);
}

vec3 waveLengthToLinearRGB(float w) {
    const mat3 XYZ2RGB = mat3(
        3.2406255, -0.9689307,  0.0557101,
       -1.5372080,  1.8757561, -0.2040211,
       -0.4986286,  0.0415175,  1.0569959
    );
    vec3 xyz = vec3(xFit_1931(w), yFit_1931(w), zFit_1931(w));
    return XYZ2RGB * xyz * 0.3968;
}

// Spectral halo based on radial angle from center
vec3 spectralRing(vec2 p) {
  const float minAngle = 0.0;
  const float maxAngle = 1.0;

  float rad = length(p);

  float angle = rad; // np already normalized, 0 at center, 1 at corner
  float wavelength = mix(700.0, 400.0, smoothstep(minAngle, maxAngle, angle));

  return waveLengthToLinearRGB(wavelength);
}

// Off-axis ghosting from lens internal reflections
vec3 ghostFlare(vec2 uv, vec2 center) {
    vec3 result = vec3(0.0);
    vec2 delta = center - uv;
    float dist = length(delta);

    for (int i = 0; i <= 3; ++i) {
        float scale = float(i) * 0.2;
        vec2 ghostUV = fract(uv + delta * scale);
        float fade = exp(-dist * scale * 8.0);
        vec3 col = texture(bloom, ghostUV).rgb;
        result += col * fade * 0.5;
    }

    return result;
}

vec3 haloRing(vec2 p, vec2 np) {
  float r = length(p) - sqrt(2.0);
  float a = atan(p.y, p.x);
  vec3 invertedImage = texture(bloom, (r * vec2(cos(a), sin(a))) * 0.5 + 0.5).rgb;

  float l = length(np);
  float w = max(1.0 - pow(abs((l - 0.6666666666) * 5.0), 3.0), 0.0);

  return invertedImage * w;
}

void main() {
    const vec2 center = vec2(0.5);
    vec2 uv = vec2(1.0) - p;

    vec3 spectral = spectralRing(np);

    // PHYSICAL HALO COMPONENTS
    vec3 halo = 0.1 * texture(bloom, center).rgb;
    vec3 ghosts = 0.1 * ghostFlare(uv, center);
    vec3 ring = 0.1 * haloRing(p, np);

    fragColor = texture(bloom, p).rgb;
    fragColor += ghosts * (2.0 / 3.0 * spectral + 1.0 / 3.0);
    fragColor += ring * (0.5 * spectral + 0.5);
    fragColor += halo * spectral;
}
