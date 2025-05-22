const float goldenRatio = 1.618033988749;
const float pi = 3.1415926535897932384626433832795;
const float tau = 6.283185307179586476925286766559;
const float inf = 3.402823e+38;
const float epsilon = 2e-24;  // smallest half float bigger than 0

#define saturate(x) clamp(x, 0.0, 1.0)

struct BaseMaterial {
  vec3 albedo;
  float roughness;
  float metallic;
};

vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return a + b * cos(2.0 * pi * (c * t + d));
}

vec3 sRGB(vec3 linear) {
  vec3 a = 12.92 * linear;
  vec3 b = 1.055 * pow(linear, vec3(1.0 / 2.4)) - 0.055;
  vec3 c = step(vec3(0.0031308), linear);
  return mix(a, b, c);
}

vec3 sRGB(float linear) {
  float a = 12.92 * linear;
  float b = 1.055 * pow(linear, 1.0 / 2.4) - 0.055;
  float c = step(0.0031308, linear);
  return vec3(mix(a, b, c));
}

float min3(float a, float b, float c) {
  return min(a, min(b, c));
}

float min4(float a, float b, float c, float d) {
  return min(a, min(b, min(c, d)));
}
// https://colinbarrebrisebois.com/2011/03/07/gdc-2011-approximating-translucency-for-a-fast-cheap-and-convincing-subsurface-scattering-look/
float sss(vec3 V, vec3 N, vec3 L, float mDistortion, float mLTPower, float lSize, float mAmbient, float mThickness) {
  vec3 vLTLight = L + N * mDistortion;
  float fLTDot = pow(saturate(dot(V, -vLTLight)), mLTPower) * lSize;
  return (fLTDot + mAmbient) * mThickness;
  
  // fLightAttenuation * cDiffuseAlbedo * cLightDiffuse * fLT;
}

vec3 lightingModel(vec3 V, vec3 N, vec3 L, vec3 albedo, float metallic, float roughness) {
  // Half vector
  vec3 H = normalize(V + L);

  // Distribution GGX
  float a = roughness * roughness;
  float a2 = a * a;
  float NdotH = max(dot(N, H), 0.0);
  float NDF = a2 / (pi * pow(NdotH * NdotH * (a2 - 1.0) + 1.0, 2.0) + epsilon);

  // Geometry
  float NdotV = max(dot(N, V), 0.0);
  float NdotL = max(dot(N, L), 0.0);
  float k = (roughness + 1.0);
  k = (k * k) / 8.0;
  float G_V = NdotV / (NdotV * (1.0 - k) + k);
  float G_L = NdotL / (NdotL * (1.0 - k) + k);
  float G = G_V * G_L;

  // Fresnel (Schlick)
  float HdotV = max(dot(H, V), 0.0);
  vec3 F0 = mix(vec3(0.04), albedo, metallic);
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - HdotV, 5.0); // create table???

  // Specular term
  vec3 spec = (NDF * G * F) / (4.0 * NdotV * NdotL + epsilon);

  // Diffuse (Lambert)
  vec3 kD = (1.0 - F) * (1.0 - metallic);
  vec3 diffuse = (albedo / pi) * kD;

  return (diffuse + spec) * NdotL;
}

vec3 lightingModelWithSSS(vec3 V, vec3 N, vec3 L, vec3 albedo, float metallic, float roughness, vec3 lightColor, vec3 sss, float sssMix) {
  // Half vector
  vec3 H = normalize(V + L);

  // Distribution GGX
  float a = roughness * roughness;
  float a2 = a * a;
  float NdotH = max(dot(N, H), 0.0);
  float NDF = a2 / (pi * pow(NdotH * NdotH * (a2 - 1.0) + 1.0, 2.0) + epsilon);

  // Geometry
  float NdotV = max(dot(N, V), 0.0);
  float NdotL = max(dot(N, L), 0.0);
  float k = (roughness + 1.0);
  k = (k * k) / 8.0;
  float G_V = NdotV / (NdotV * (1.0 - k) + k);
  float G_L = NdotL / (NdotL * (1.0 - k) + k);
  float G = G_V * G_L;

  // Fresnel (Schlick)
  float HdotV = max(dot(H, V), 0.0);
  vec3 F0 = mix(vec3(0.04), albedo, metallic);
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - HdotV, 5.0);

  // Specular term
  vec3 spec = (NDF * G * F) / (4.0 * NdotV * NdotL + epsilon);

  // Diffuse (Lambert)
  vec3 kD = (1.0 - F) * (1.0 - metallic);
  vec3 diffuse = albedo / pi * kD;

  return (spec + diffuse - diffuse * sssMix) * lightColor * NdotL + sssMix * sss;
}
