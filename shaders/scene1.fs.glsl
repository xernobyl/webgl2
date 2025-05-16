uniform mat4 inverseViewMatrix;
uniform float time;
uniform vec2 resolution;

layout(location = 0) out mediump vec4 outColor;
layout(location = 1) out highp vec2 outMotion;

const float loop_duration = 30.0;
float sTime;

const float n_slices = 16.0;
const float slices = 2.0 * pi / n_slices;
const float tunnel_radius = 4.0;
const float depth_spacing = 2.0 * tunnel_radius * sin(pi / n_slices);
const float depth_loop = depth_spacing * 96.0;
  

vec3 albedo;
uint material = 0u;

vec3 colorize(float l) {
  return 1.0 / 256.0 * palette(l, vec3(0.5, 0.5, 0.5),vec3(0.5, 0.5, 0.5),vec3(1.0, 1.0, 1.0),vec3(0.00, 0.1, 0.2));
}

float sdBox( vec3 p, vec3 b )
{
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

void opSmoothUnion(float d0, vec3 color0, float d1, vec3 color1, float k, out float f, out vec3 color) {
    float h = clamp(0.5 + 0.5 * (d1 - d0) / k, 0.0, 1.0);
    color = mix(color1, color0, h);
    f = mix(d1, d0, h) - k * h * (1.0 - h);
}

float min_smooth(float d0, float d1, float k) {
    float h = clamp(0.5 + 0.5 * (d1 - d0) / k, 0.0, 1.0);
    return mix(d1, d0, h) - k * h * (1.0 - h);
}

void min_smooth(float d0, vec3 color0, float d1, vec3 color1, out float f, out vec3 color) {
  opSmoothUnion(d0, color0, d1, color1, 0.25, f, color);
}

void min_col(float f0, vec3 c0, float f1, vec3 c1, out float fo, out vec3 co) {
  if (f0 < f1) {
    co = c0;
    fo = f0;
  }
  else {
    co = c1;
    fo = f1;
  }
}

void min_material(float f0, uint m0, float f1, uint m1, out float fo, out uint mo) {
  if (f0 < f1) {
    mo = m0;
    fo = f0;
  }
  else {
    mo = m1;
    fo = f1;
  }
}

float tunnel_thing(vec3 p, float depth_offset, float angular_offset, out vec3 color) {
  
  // calc center of tunnel segment
  float theta = length(p.xy);
  theta = clamp(round(theta * 4.0 / tunnel_radius) * 0.25 * tunnel_radius, tunnel_radius, 1024.0 * tunnel_radius);
  float alpha = atan(p.y, p.x);
  //float alpha = atan(p.y, abs(p.x));
  alpha = round((alpha + angular_offset) / slices) * slices - angular_offset;
  float z = round((p.z + depth_offset) / depth_spacing) * depth_spacing - depth_offset;
  vec3 center = vec3(theta * cos(alpha), theta * sin(alpha), z);
  
  float l = hash1(0.05 * vec3(center.xy, fract(center.z / depth_loop) * depth_loop));
  
  color = colorize(theta / golden_ratio + l + sTime / loop_duration);
  
  float sphere_radius = 0.3333333333 * depth_spacing * (0.5 + 0.5 * sin(sTime * 2.0 * pi * 4.0 / loop_duration + l * 2.0 * pi));
  return distance(p, center) - sphere_radius;
}

float scene(vec3 p) {
  vec3 c0, c1, c2, c3, c4, c5, c6;
  
  float f0 = tunnel_thing(p, 0.0, 0.25 * pi / n_slices, c0);
  float f1 = tunnel_thing(p, 0.0, 1.25 * pi / n_slices, c1);

  float f2 = tunnel_thing(p, 0.5 * depth_spacing, 0.75 * pi / n_slices, c2);
  float f3 = tunnel_thing(p, 0.5 * depth_spacing, 1.75 * pi / n_slices, c3);

  float t0, t1, f;
  vec3 tc0, tc1;
    
  min_smooth(f0, c0, f1, c1, t0, tc0);
  min_smooth(f2, c2, f3, c3, t1, tc1);
  
  
  min_smooth(t0, tc0, t1, tc1, f, albedo);
        
  return f;
}

vec3 scene_normal(vec3 p, float scale) {
  float h = 0.0005 * scale;
  const vec2 k = vec2(1.0, -1.0);
  return normalize(k.xyy * scene(p + k.xyy * h) + 
                   k.yyx * scene(p + k.yyx * h) + 
                   k.yxy * scene(p + k.yxy * h) + 
                   k.xxx * scene(p + k.xxx * h));
}

void main() {
  sTime = fract(time / loop_duration) * loop_duration;

  // camera movement	
  float p0 = sTime * 2.0 * pi * 3.0 / loop_duration;
  float p1 = sTime * 2.0 * pi * 2.0 / loop_duration;
  
  vec3 up = vec3(sin(p1), cos(p1), 0.0);
  
  float dist = 3.0;
  float z_pos = sTime / loop_duration * depth_loop;
  
  // Extract the camera's right, up, and forward vectors from the inverse view matrix
  vec3 cu = normalize(vec3(inverseViewMatrix[0][0], inverseViewMatrix[0][1], inverseViewMatrix[0][2])); // Right vector
  vec3 cv = normalize(vec3(inverseViewMatrix[1][0], inverseViewMatrix[1][1], inverseViewMatrix[1][2])); // Up vector
  vec3 cw = normalize(vec3(inverseViewMatrix[2][0], inverseViewMatrix[2][1], inverseViewMatrix[2][2])); // Forward vector

  // Extract the camera's position (ray origin) from the inverse view matrix
  vec3 ray_origin = vec3(inverseViewMatrix[3]);
  
  int object = 0;
  vec2 uv = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;
  vec3 ray_dir = normalize(uv.x * cu + uv.y * cv + 1.5 * cw);
  vec3 ray_pos = ray_origin;
  float total_distance = 0.0;
  const float max_dist = 1000000.0;
  
  for (int it = 0; it < 512; ++it) {
    float step_size = scene(ray_pos);
    total_distance += step_size;
    ray_pos = ray_origin + total_distance * ray_dir;
    
    if (step_size <= 0.0001 * total_distance) {
      object = 1;
      break;
    }
    
    if (total_distance >= max_dist) {
      break;
    }
  }
  
  vec3 fog_color = vec3(0.125, 0.25, 0.5);
  
  if (object == 0) {
    outColor = vec4(sRGB(fog_color), 0.0);
    return;
  }
  
  vec3 n = scene_normal(ray_pos, total_distance);
  float l = saturate(-dot(n, ray_dir));
  
  float fog = saturate(1.0 - total_distance / 256.0);
  //fog = fog * fog;
  vec3 color = vec3(1.0 - 0.33333333333 * l) * albedo + 0.5 * (1.0 - saturate(sqrt(l)));
  color = mix(fog_color, color, fog);
  outColor = vec4(sRGB(mix(albedo * (1.0 - l), fog_color, 1.0 - fog)), 0.0);
}
