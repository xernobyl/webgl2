#version 300 es
precision highp int;
precision highp float;
layout(location = 0) out lowp vec4 frag_color;
uniform sampler2D screen;
uniform sampler2D motion;
uniform sampler2D accum;
in vec2 p;

void main() {
  frag_color = texture(screen, p) * 1.0 / 16.0 + texture(accum, p) * 15.0 / 16.0;
}