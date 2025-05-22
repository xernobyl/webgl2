uniform mat4 inverseViewMatrix, currentViewProjMatrix, previousViewProjMatrix;
uniform float time;
uniform float fov;
uniform vec3 resolution;  // z = 1/length(res.xy)

layout(location = 0) out mediump vec3 outColor;
layout(location = 1) out highp vec2 outMotion;

const float loopDuration = 10.0;
const mediump uint maxIterations = 256u;
const float far = 100.0;
const float near = 0.0;

const float holeRepeat = 0.5;
const float holeRadius = 1.0 / 32.0;

float halfPixelScale;
lowp uint objectId;

vec3 light_pos;

float rdSph(vec3 p, vec4 rid) {
  vec4 h = hash4(rid);

  float radius = h.w * holeRadius;
  vec3 center = (2.0 * h.xyz - 1.0) * (0.5 * holeRepeat - radius);

  return distance(p, center) - radius;
}

float warehouse(vec3 p, bool include_lights, out uint object) {
  float objs[3];

  vec3 pillar_pos = opRep(p + vec3(-15.0, -2.5, 5.0), vec3(15.0, 0.0, 20.0));
  float main_walls = -sdBox(p + vec3(0.0, -2.5, 0.0), vec3(20.0, 5.0, 40.0));

  float pillars = sdBox(pillar_pos, vec3(0.5, 5.0, 0.5));

  float bars = min(sdBox(opRep(p + vec3(0.0, -7.0, 0.0), vec3(15.0, 1000.0, 0.0)), vec3(0.5, 0.5, 40.0)),
    sdBox(opRep(p + vec3(0.0, -7.0, 5.0), vec3(1000.0, 1000.0, 20.0)), vec3(20.0, 0.5, 0.5)));

  float bars_and_pillars = opSmoothUnion(bars, pillars, 0.25);

  float hole0 = 1e20;

  for (float i = 1.0; i < 4.0; i += 1.0) {
    vec3 id = round(p / holeRepeat);

    vec3 offset = sign(p - holeRepeat * id);
    float d = 1e20;

    // Repeat without artifacts (https://iquilezles.org/articles/sdfrepetition/)
    for (int k = 0; k < 2; k++) {
      for (int j = 0; j < 2; j++) {
        for (int i = 0; i < 2; i++) {
          vec3 rid = id + vec3(i, j, k) * offset; // nearest object center
          vec3 r = p - holeRepeat * rid;
          d = min(d, rdSph(r, vec4(rid, i)));
        }
      }
    }

    //hole0 = min(hole0, d);
    bars_and_pillars = opSmoothSubtraction(d, bars_and_pillars, 4.0 * holeRadius);
  }



  float rebar = min4(sdVerticalCapsule(pillar_pos + vec3(-0.5 / 1.5, 10.0, 0.5 / 1.5), 100.0, 0.02),
               sdVerticalCapsule(pillar_pos + vec3(0.5 / 1.5, 10.0, 0.5 / 1.5), 100.0, 0.02),
               sdVerticalCapsule(pillar_pos + vec3(-0.5 / 1.5, 10.0, -0.5 / 1.5), 100.0, 0.02),
               sdVerticalCapsule(pillar_pos + vec3(0.5 / 1.5, 10.0, -0.5 / 1.5), 100.0, 0.02));

  bars_and_pillars = opSmoothSubtraction(hole0, bars_and_pillars, 1.0 / 32.0);

  float room = opSmoothUnion(main_walls, bars_and_pillars, 1.0 / 16.0);



  float pipes = min(sdVerticalCapsule(p.xzy - vec3(18.0, -50.0, 6.0), 200.0, 0.10),
                    sdVerticalCapsule(p.xzy - vec3(18.0, -50.0, 5.6), 200.0, 0.10));

  objs[0] = room;
  objs[1] = rebar;
  objs[2] = pipes;

  float min_dist = objs[0];
  object = 1u;

  for (uint i = 1u; i < 3u; i++) {
    if (objs[i] < min_dist) {
      min_dist = objs[i];
      object = i + 1u;
    }
  }

  if (include_lights) {
    float light_objs[1];

    light_objs[0] = sdSphere(p - light_pos, 0.125);

    for (uint i = 0u; i < 1u; ++i) {
      if (light_objs[i] < min_dist) {
        min_dist = light_objs[i];
        object = i + 4u;
      }
    }
  }

  return min_dist;
}

float scene(vec3 p) {
  //return sdBox(p, vec3(1.0));

  return warehouse(p, true, objectId);
}

float sceneNoLights(vec3 p) {
  uint objectId;
  return warehouse(p, false, objectId);
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

vec3 colorize(float t) {
  return palette(t, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,0.7,0.4),vec3(0.0,0.15,0.20));
}

float calcSoftshadow(in vec3 ro, in vec3 rd, float error, in float mint, in float tmax, in float w) {
  float res = 1.0;
  float t = mint;
  float ph = 1e10; // big, such that y = 0 on the first iteration

  for (lowp uint i = 0u; i < 32u; i++) {
    float h = sceneNoLights(ro + rd * t);

    float y = h*h/(2.0*ph);
    float d = sqrt(h*h-y*y);
    res = min( res, d/(w*max(0.0,t-y)) );
    ph = h;

    t += h;

    if (res <= error || t > tmax) {
      break;
    }

  }

  res = saturate(res);
  return res * res * (3.0 - 2.0 * res);
}

vec3 render(vec2 uv, vec3 rayOrigin, vec3 cx, vec3 cy, vec3 cz, float zoom, out vec3 pos) {
  vec3 rayDir = normalize(uv.x * cx + uv.y * cy - zoom * cz);
  vec3 rayPos = rayOrigin;

  objectId = 0u;

  // doesn't seem to create any sort of effect in the final image
  float noiz = halfPixelScale * (2.0 * hash1(vec3(uv, time)) - 1.0);
  float totalDistance = near + noiz;

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

  vec3 lightColor = colorize(time / 10.0) * (sin(time * tau * 50.0) * 2.5 + 7.5);

  if (objectId == 0u) {
    return vec3(1.0, 0.0, 0.0);
  }

  if (objectId == 4u) {
    return lightColor / (0.125 * 0.125);
  }

  BaseMaterial material;

  if (objectId == 1u) {
    material.albedo = vec3(0.5, 0.5, 0.5);
    material.roughness = 0.95;
    material.metallic = 0.0;
  }

  if (objectId == 2u) {
    material.albedo = vec3(185.0 / 255.0, 71.0 / 255.0, 0.0);
    material.roughness = 0.25;
    material.metallic = 0.75;
  }

  if (objectId == 3u) {
    material.albedo = vec3(0.0, 0.0, 1.0);
    material.roughness = 0.75;
    material.metallic = 0.0;
  }

  vec3 N = sceneNormal(rayPos, totalDistance);
  vec3 L = normalize(light_pos - rayPos);
  float d = distance(rayPos, light_pos);

  vec3 lightValue = lightColor / (/*epsilon +*/ d * d);
  lightValue *= calcSoftshadow(rayPos, L, totalDistance * halfPixelScale * 2.0, 0.25, d, 0.01);

  vec3 color = lightingModel(-rayDir, N, L, material.albedo, material.metallic, material.roughness) * lightValue;

  return color;
}

void main() {
  light_pos = vec3(0.0, 2.0 + sin(time * tau / 2.0) * 0.5, 0.0);

  // Move to uniforms?

  float thf = tan(fov * 0.5);
  float zoom = 1.0 / thf;
  halfPixelScale = thf * resolution.z;  // half a pixel at distance

  // Could come from the vertex shader
  vec2 uv = gl_FragCoord.xy * 2.0 - resolution.xy;
  uv *= resolution.z;

  // Extract the camera's right, up, and forward vectors, and position from the inverse view matrix
  vec3 cx = inverseViewMatrix[0].xyz;
  vec3 cy = inverseViewMatrix[1].xyz;
  vec3 cz = inverseViewMatrix[2].xyz;
  vec3 rayOrigin = inverseViewMatrix[3].xyz;

  vec3 pos;
  outColor = render(uv, rayOrigin, cx, cy, cz, zoom, pos);

  // Motion for TAA
  vec4 currentClipPos = currentViewProjMatrix * vec4(pos, 1.0);
  vec2 currentNDC = currentClipPos.xy / currentClipPos.w;
  vec2 currentSS = currentNDC * 0.5 + 0.5;

  vec4 previousClipPos = previousViewProjMatrix * vec4(pos, 1.0);
  vec2 previousNDC = previousClipPos.xy / previousClipPos.w;
  vec2 previousSS = previousNDC * 0.5 + 0.5;

  outMotion = previousSS - currentSS;
}
