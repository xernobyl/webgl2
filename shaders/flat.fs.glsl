layout(location = 0) out mediump vec4 fragColor;
in vec3 n;

void main() {
  fragColor = vec4(normalize(n) * 0.5 + 0.5, 0.0);
}
