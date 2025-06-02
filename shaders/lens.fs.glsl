layout(location = 0) out vec3 fragColor;
uniform sampler2D bloom;
uniform float ar;
in vec2 uv;

const float pi = 3.1415926535897932384626433832795;

void main() {
    // Adjust UV coordinates to account for aspect ratio
    vec2 scaledUV = (uv - 0.5) * 1.0 * 2.0;

    // Chromatic Aberration Ghost
    float brightness = 1.0;
    float totalBrightness = 0.0;

    for (float i = 1.0; i <= 5.0; i *= 1.5) {
        totalBrightness += brightness;
        fragColor += texture(bloom, 0.5 + (scaledUV / i) * 0.5).rgb * brightness;
        brightness = 0.25 * brightness;
    }

    // brightness = 1.0 * 0.125;

    for (float i = 1.5; i <= 5.0; i *= 1.5) {
        totalBrightness += brightness;
        fragColor += texture(bloom, 0.5 - (scaledUV / i) * 0.5).rgb * brightness;
        brightness = 0.25 * brightness;
    }

    fragColor /= totalBrightness;

    // Flares
    /*for (float ph = pi / 3.0; ph < pi + pi / 3.0; ph += pi / 2.0) {
      vec2 dir = vec2(cos(ph) * ar, sin(ph));
      for (float o = -1.0; o <= 1.0; o += 2.0 / 4.0) {
        fragColor += 0.5 / 4.0 * texture(bloom, uv + 0.025 * o * dir).rgb;
      }
    }*/
}