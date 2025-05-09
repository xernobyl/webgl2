#version 300 es
precision highp int;
precision highp float;
layout(location = 0) out lowp vec4 frag_color;
uniform highp vec2 screen_size;
uniform highp vec2 inverse_screen_size;
uniform highp float time;
uniform sampler2D screen;
in vec2 p;

void main() {
  frag_color = texture(screen, p);
}