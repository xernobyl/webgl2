#version 300 es
layout(location = 0) in highp vec3 position;
layout(location = 1) in highp vec3 velocity;
out highp float point_size;
flat out int id;
uniform highp mat4 mvp;
//in highp int gl_VertexID;

void main() {
  gl_Position = mvp * vec4(position, 1.0);
  point_size = gl_Position.w * 1.25;//32.0 / (position.z * 0.5 + 0.5 + 1.0);
  gl_PointSize = point_size;
  id = int(position.x * position.y * position.z * 12345934.0);//gl_VertexID
  //id = gl_VertexID;
}