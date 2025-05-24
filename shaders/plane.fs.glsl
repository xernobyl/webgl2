layout(location = 0) out mediump vec3 outColor;
layout(location = 1) out highp vec2 outMotion;

in vec4 pos;
in vec2 vMotion;


void main() {
  if (pos.x > 1.0 || pos.y > 1.0 || pos.z > 1.0 || pos.x < -1.0 || pos.y < -1.0 || pos.z < -1.0)
    discard;

  vec2 t = vec2(cos(pos.z * 50.0 / pi / 2.0), -sin(pos.x * 50.0 / pi / 2.0));
  vec3 n = normalize(vec3(t.x, 1.0 - dot(t, t), t.y));

  outColor = clamp(dot(n, vec3(0.0, 1.0, 0.0)) * vec3(1.0, 0.5, 0.125), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)) + vec3(0.125, 0.125, 0.25);
  outMotion = vMotion * 0.5 + 0.5;
}
