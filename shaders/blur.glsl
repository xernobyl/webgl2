uniform float uRadius;

vec3 blurUpsample(sampler2D tex, vec2 uv, vec2 texelSize) {
  vec2 halfTexelSize = 0.5 * texelSize;

  return texture(tex, uv + uRadius * vec2(-texelSize.x, 0.0)).rgb / 12.0 +
         texture(tex, uv + uRadius * vec2(-halfTexelSize.x, halfTexelSize.y)).rgb / 6.0 +
         texture(tex, uv + uRadius * vec2(0.0, texelSize.y)).rgb / 12.0 +
         texture(tex, uv + uRadius * vec2(halfTexelSize.x, halfTexelSize.y)).rgb / 6.0 +
         texture(tex, uv + uRadius * vec2(texelSize.x, 0.0)).rgb / 12.0 +
         texture(tex, uv + uRadius * vec2(halfTexelSize.x, -halfTexelSize.y)).rgb / 6.0 +
         texture(tex, uv + uRadius * vec2(0.0, -texelSize.y)).rgb / 12.0 +
         texture(tex, uv + uRadius * vec2(-halfTexelSize.x, -halfTexelSize.y)).rgb / 6.0;
}

vec3 blurDownsample(sampler2D tex, vec2 uv, vec2 texelSize) {
  return texture(tex, uv).rgb / 2.0 +
         texture(tex, uv - uRadius * texelSize.xy).rgb / 8.0 +
         texture(tex, uv + uRadius * texelSize.xy).rgb / 8.0 +
         texture(tex, uv + uRadius * vec2(texelSize.x, -texelSize.y)).rgb / 8.0 +
         texture(tex, uv - uRadius * vec2(texelSize.x, -texelSize.y)).rgb / 8.0;
}

vec3 brightnessPass(vec3 color, float threshold) {
    float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
    // return color * smoothstep(threshold - threshold * knee, threshold + threshold * knee, lum);
    return lum > threshold ? color : vec3(0.0);
}

vec3 brightnessPassT(sampler2D tex, vec2 uv, float threshold) {
    return brightnessPass(texture(tex, uv).rgb, threshold);
}

vec3 blurDownsampleBrightness(sampler2D tex, vec2 uv, vec2 texelSize, float threshold) {
  return brightnessPassT(tex, uv, threshold) / 2.0 +
         brightnessPassT(tex, uv - uRadius * texelSize.xy, threshold) / 8.0 +
         brightnessPassT(tex, uv + uRadius * texelSize.xy, threshold) / 8.0 +
         brightnessPassT(tex, uv + uRadius * vec2(texelSize.x, -texelSize.y), threshold) / 8.0 +
         brightnessPassT(tex, uv - uRadius * vec2(texelSize.x, -texelSize.y), threshold) / 8.0;
}
