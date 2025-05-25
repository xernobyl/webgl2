layout(location = 0) in highp vec3 position;

uniform highp mat4 mvp, previousMVP;
uniform highp vec2 bias;

out highp vec4 pos;
out vec2 vMotion;

void main() {
  pos = vec4(6.0 * vec3(position.y, 0.1 * bias.y * sin(position.x * 50.0 + 6.283185307179586476925286766559 * bias.x) + 0.1 * bias.y * cos(position.y * 50.0 + 6.283185307179586476925286766559 * bias.y), position.x), 1.0);

  vec4 currentClip = mvp * pos;
  vec2 currentNDC = currentClip.xy / currentClip.w;
  vec4 previousClip = previousMVP * pos;
  vec2 previousNDC = previousClip.xy / previousClip.w;

  vMotion = (previousNDC - currentNDC) * 0.5 + 0.5;

  gl_Position = currentClip;
}
