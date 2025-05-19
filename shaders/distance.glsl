// distance.glsl

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

float sdVerticalCapsule(vec3 p, float h, float r) {
  p.y -= clamp(p.y, 0.0, h);
  return length(p) - r;
}

vec3 opRep(vec3 p, vec3 c) {
  vec3 q = mod(p + 0.5 * c, c) - 0.5 * c;
  return q;
}

vec3 opLimRep(vec3 p, vec3 s, vec3 l) {
  return p - s * clamp(round(p / s), -l, l);
}

vec3 opRepMirrored(vec3 p, vec3 s) {
  vec3 id = round(p / s);
  vec3 r = p - s * id;
  return vec3(((int(id.x) & 1) == 0) ? r.x : -r.x,
              ((int(id.y) & 1) == 0) ? r.y : -r.y,
              ((int(id.z) & 1) == 0) ? r.z : -r.z);
}

/*
float repeated(vec3 p, float s) {
  vec3 id = round(p / s);
  vec3 o = sign(p - s * id);

  float d = 1e20;

  for (int k = 0; k < 2; k++) {
    for (int j = 0; j < 2; j++) {
      for (int i = 0; i < 2; i++) {
        vec3 rid = id + vec3(i, j, k) * o;
        vec3 r = p - s * rid;
        d = min(d, sdf(r));
      }
    }
  }
 
  return d;
}
*/

float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}

void opSmoothUnion(float d0, vec3 color0, float d1, vec3 color1, float k, out float f, out vec3 color) {
  float h = clamp(0.5 + 0.5 * (d1 - d0) / k, 0.0, 1.0);
  color = mix(color1, color0, h);
  f = mix(d1, d0, h) - k * h * (1.0 - h);
}

float opSmoothSubtraction(float d1, float d2, float k) {
  float h = clamp(0.5 - 0.5 * (d2 + d1) / k, 0.0, 1.0);
  return mix(d2, -d1, h) + k * h * (1.0 - h);
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
