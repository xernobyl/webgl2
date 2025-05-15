layout(location = 0) in highp vec3 position;
layout(location = 1) in highp vec3 normal;
layout(location = 2) in highp vec2 uv;
out highp vec3 n;
uniform highp mat4 mvp, mv;

void main() {
  gl_Position = mvp * vec4(position, 1.0);
  n = (mv * vec4(normal, 0.0)).xyz;
}
