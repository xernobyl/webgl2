vec3 blurUpsample(sampler2D tex, vec2 uv, vec2 halfPixel) {
  return texture(tex, uv + vec2(-halfPixel.x * 2.0, 0.0)).rgb / 12.0 +
         texture(tex, uv + vec2(-halfPixel.x, halfPixel.y)).rgb / 6.0 +
         texture(tex, uv + vec2(0.0, halfPixel.y * 2.0)).rgb / 12.0 +
         texture(tex, uv + vec2(halfPixel.x, halfPixel.y)).rgb / 6.0 +
         texture(tex, uv + vec2(halfPixel.x * 2.0, 0.0)).rgb / 12.0 +
         texture(tex, uv + vec2(halfPixel.x, -halfPixel.y)).rgb / 6.0 +
         texture(tex, uv + vec2(0.0, -halfPixel.y * 2.0)).rgb / 12.0 +
         texture(tex, uv + vec2(-halfPixel.x, -halfPixel.y)).rgb / 6.0;
}

vec3 blurDownsample(sampler2D tex, vec2 uv, vec2 texelSize) {
  return texture(tex, uv).rgb / 2.0 +
         texture(tex, uv - texelSize.xy).rgb / 8.0 +
         texture(tex, uv + texelSize.xy).rgb / 8.0 +
         texture(tex, uv + vec2(texelSize.x, -texelSize.y)).rgb / 8.0 +
         texture(tex, uv - vec2(texelSize.x, -texelSize.y)).rgb / 8.0;
}

vec3 brightnessPass(vec3 color, float threshold, float knee) {
    float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
    return color * smoothstep(threshold - threshold * knee, threshold + threshold * knee, lum);
}

vec3 brightnessPassT(sampler2D tex, vec2 uv, float threshold, float knee) {
    return brightnessPass(texture(tex, uv).rgb, threshold, knee);
}

vec3 blurDownsampleBrightness(sampler2D tex, vec2 uv, vec2 halfPixel, float threshold, float knee) {
  return brightnessPassT(tex, uv, threshold, knee) / 2.0 +
         brightnessPassT(tex, uv - halfPixel.xy, threshold, knee) / 8.0 +
         brightnessPassT(tex, uv + halfPixel.xy, threshold, knee) / 8.0 +
         brightnessPassT(tex, uv + vec2(halfPixel.x, -halfPixel.y), threshold, knee) / 8.0 +
         brightnessPassT(tex, uv - vec2(halfPixel.x, -halfPixel.y), threshold, knee) / 8.0;
}
