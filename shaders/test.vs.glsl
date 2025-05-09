#version 300 es
layout(location = 0) in vec2 a0;
out vec2 p;
uniform highp vec2 screen_size;
uniform highp vec2 inverse_screen_size;
uniform highp float time;
uniform sampler2D screen;

void main() {
  gl_Position = vec4(a0, 0.0, 1.0);
  p = (a0.xy * 0.5 + 0.5 ) * screen_size / vec2(textureSize(screen, 0));
}