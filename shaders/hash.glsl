// Hash without Sine
// MIT License...
/* Copyright (c)2014 David Hoskins.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

//----------------------------------------------------------------------------------------

const vec4 hashMagic = vec4(.1031, .1030, .0973, .1099);
const float hashMagic2 = 33.33;

float hash1(float p) {
  p = fract(p * hashMagic.x);
  p *= p + hashMagic2;
  p *= p + p;
  return fract(p);
}

float hash1(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * hashMagic.x);
  p3 += dot(p3, p3.yzx + hashMagic2);
  return fract((p3.x + p3.y) * p3.z);
}

float hash1(vec3 p3) {
  p3 = fract(p3 * hashMagic.x);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

float hash1(vec4 p4) {
  p4 = fract(p4 * hashMagic);
  p4 += dot(p4, p4.wzxy + hashMagic2);
  return fract((p4.x + p4.y) * (p4.z + p4.w));
}

vec2 hash2(float p) {
  vec3 p3 = fract(vec3(p) * hashMagic.xyz);
  p3 += dot(p3, p3.yzx + hashMagic2);
  return fract((p3.xx + p3.yz) * p3.zy);
}

vec2 hash2(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * hashMagic.xyz);
  p3 += dot(p3, p3.yzx + hashMagic2);
  return fract((p3.xx + p3.yz) * p3.zy);
}

vec2 hash2(vec3 p3) {
  p3 = fract(p3 * hashMagic.xyz);
  p3 += dot(p3, p3.yzx + hashMagic2);
  return fract((p3.xx + p3.yz) * p3.zy);
}

vec3 hash3(float p) {
  vec3 p3 = fract(vec3(p) * hashMagic.xyz);
  p3 += dot(p3, p3.yzx + hashMagic2);
  return fract((p3.xxy + p3.yzz) * p3.zyx); 
}

vec3 hash3(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * hashMagic.xyz);
  p3 += dot(p3, p3.yxz + hashMagic2);
  return fract((p3.xxy + p3.yzz) * p3.zyx);
}

vec3 hash3(vec3 p3) {
  p3 = fract(p3 * hashMagic.xyz);
  p3 += dot(p3, p3.yxz + hashMagic2);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}

vec4 hash4(float p) {
  vec4 p4 = fract(vec4(p) * hashMagic);
  p4 += dot(p4, p4.wzxy + hashMagic2);
  return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}

vec4 hash4(vec2 p) {
  vec4 p4 = fract(vec4(p.xyxy) * hashMagic);
  p4 += dot(p4, p4.wzxy + hashMagic2);
  return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}

vec4 hash4(vec3 p) {
  vec4 p4 = fract(vec4(p.xyzx) * hashMagic);
  p4 += dot(p4, p4.wzxy + hashMagic2);
  return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}

vec4 hash4(vec4 p4) {
  p4 = fract(p4 * hashMagic);
  p4 += dot(p4, p4.wzxy + hashMagic2);
  return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}
