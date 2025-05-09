#version 300 es
layout(location = 0) in highp vec3 position;
out highp vec3 pos;
uniform highp mat4 mvp, mv;
uniform highp vec2 bias;

void main() {
  pos = 6.0 * vec3(position.y, 0.1 * bias.y * sin(position.x * 50.0 + 6.283185307179586476925286766559 * bias.x) + 0.1 * bias.y * cos(position.y * 50.0 + 6.283185307179586476925286766559 * bias.y), position.x);
  gl_Position = mvp * vec4(pos, 1.0);
}