uniform mat4 inverseViewMatrix;
uniform float time;
uniform float fov;
uniform vec2 resolution;
uniform float inverseResolution;

layout(location = 0) out mediump vec3 outColor;
layout(location = 1) out highp vec2 outMotion;

const float loopDuration = 10.0;
const mediump uint maxIterations = 256u;
const float far = 100.0;
const float near = 0.0;

float sTime;
float sPhase;
float halfPixelScale;
lowp uint objectId;

float scene(vec3 p) {
  objectId = 1u;

  return sdBox(p, vec3(1.0));
}

vec3 sceneNormal(vec3 p, float d) {
  const vec2 k = vec2(1.0, -1.0);
  const vec4 sb = vec4(2.0, tau, 1.0, pi);
  
  float h = halfPixelScale * d;

  vec4 r = hash4(p) * sb.xxxy - sb.zzzw;
  r.xyz = normalize(r.xyz);
  
  vec3 pt[4] = vec3[4](k.xyy, k.yyx, k.yxy, k.xxx);
  /*vec3 pt[4] = vec3[4](
    rotatePoint3D(k.xyy, r.xyz, r.w),
    rotatePoint3D(k.yyx, r.xyz, r.w),
    rotatePoint3D(k.yxy, r.xyz, r.w),
    rotatePoint3D(k.xxx, r.xyz, r.w));*/

  return normalize(pt[0] * scene(p + h * pt[0]) + 
                   pt[1] * scene(p + h * pt[1]) + 
                   pt[2] * scene(p + h * pt[2]) + 
                   pt[3] * scene(p + h * pt[3]));
}

vec3 render(vec2 uv, vec3 rayOrigin, vec3 cx, vec3 cy, vec3 cz, float zoom) {
  vec3 rayDir = normalize(uv.x * cx + uv.y * cy - zoom * cz);
  vec3 rayPos = rayOrigin;
  float totalDistance = near;//(0.1) - (0.1 * halfPixelScale * hash1(vec3(uv, time)));
  
  for (mediump uint it = 0u; it < maxIterations; ++it) {
    float stepSize = scene(rayPos);
    
    totalDistance += stepSize;
    rayPos = rayOrigin + totalDistance * rayDir;

    if (stepSize <= halfPixelScale * totalDistance) {
      break;
    }

    if (totalDistance >= far) {
      objectId = 0u;
      break;
    }
  }
  
  if (objectId == 0u) {
    return vec3(0.5);
  }
  
  vec3 normal = sceneNormal(rayPos, totalDistance);
  return normal * 0.5 + 0.5;
}

void main() {
  // TODO: add motion vectors (for TAA)
  outMotion = vec2(0.0, 0.0);
  
  // Move to uniforms?
  
  sPhase = time / 1000.0 * 0.1;
  float thf = tan(fov * 0.5);
  float zoom = 1.0 / thf;
  halfPixelScale = thf * inverseResolution;  // half a pixel at distance

  // Could come from the vertex shader
  vec2 uv = gl_FragCoord.xy * 2.0 - resolution;
  uv *= inverseResolution;
  
  // Extract the camera's right, up, and forward vectors, and position from the inverse view matrix
  vec3 cx = inverseViewMatrix[0].xyz; // Right vector
  vec3 cy = inverseViewMatrix[1].xyz; // Up vector
  vec3 cz = inverseViewMatrix[2].xyz; // Forward vector
  vec3 rayOrigin = inverseViewMatrix[3].xyz;                                                         // Position
 
  vec3 color = render(uv, rayOrigin, cx, cy, cz, zoom);  
  
  outColor = sRGB(color);
}
