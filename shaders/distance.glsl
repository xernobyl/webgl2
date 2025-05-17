// distance.glsl

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

void opSmoothUnion(float d0, vec3 color0, float d1, vec3 color1, float k, out float f, out vec3 color) {
  float h = clamp(0.5 + 0.5 * (d1 - d0) / k, 0.0, 1.0);
  color = mix(color1, color0, h);
  f = mix(d1, d0, h) - k * h * (1.0 - h);
}

vec3 rotatePoint3D(vec3 point, vec3 axis, float angle) {
  // Rodrigues' rotation formula
  return point * cos(angle) +
    cross(axis, point) * sin(angle) +
    axis * dot(axis, point) * (1.0 - cos(angle));
}

vec3 rotateNormalMap(vec3 normal, vec3 dir) {
  /*const vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 axis = normalize(cross(up, dir));
  float angle = acos(clamp(dot(up, dir), -1.0, 1.0));

  return rotatePoint3D(normal, axis, angle);*/
  
  if (dir.y >= 1.0) {
    return vec3(0.0, 1.0, 0.0);
  }
  
  const vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 axis = normalize(vec3(dir.z, 0.0, -dir.x));
  
  float sa = sqrt(1.0 - dir.y * dir.y);

  return normal * dir.y +
    cross(axis, normal) * sa +
    axis * dot(axis, normal) * (1.0 - dir.y);
}
