import { vec3 } from './gl-matrix/index.js'
import { Camera } from './camera.js'
import { Framebuffer } from './framebuffer.js'
import { Quad } from './quad.js'
import { Cube } from './cube.js'
import { TessPlane } from './tessplane.js'
import { Particles } from './particles.js'

import { compileShader, linkProgram } from './shaders.js'

const shaderSource = {
  vertex: {
    test:
`#version 300 es
layout(location = 0) in vec2 a0;
out vec2 p;
uniform highp vec2 screen_size;
uniform highp vec2 inverse_screen_size;
uniform highp float time;
uniform sampler2D screen;

void main()
{
  gl_Position = vec4(a0, 0.0, 1.0);
  p = (a0.xy * 0.5 + 0.5 ) * vec2(textureSize(screen, 0)) / screen_size;
}`,

    particleBasic:
`#version 300 es
layout(location = 0) in highp vec3 position;
layout(location = 1) in highp vec3 velocity;
out highp float point_size;
flat out int id;
uniform highp mat4 mvp;
//in highp int gl_VertexID;

void main()
{
  gl_Position = mvp * vec4(position, 1.0);
  point_size = gl_Position.w * 1.25;//32.0 / (position.z * 0.5 + 0.5 + 1.0);
  gl_PointSize = point_size;
  id = int(position.x * position.y * position.z * 12345934.0);//gl_VertexID
  //id = gl_VertexID;
}`,

    flat:
`#version 300 es
layout(location = 0) in highp vec3 position;
layout(location = 1) in highp vec3 normal;
layout(location = 2) in highp vec2 uv;
out highp vec3 n;
uniform highp mat4 mvp, mv;

void main()
{
  gl_Position = mvp * vec4(position, 1.0);
  n = (mv * vec4(normal, 0.0)).xyz;
}`,

    plane:
`#version 300 es
layout(location = 0) in highp vec3 position;
out highp vec3 pos;
uniform highp mat4 mvp, mv;

void main()
{
  pos = 6.0 * vec3(position.y, 0.05 * sin(position.x * 50.0) + 0.05 * cos(position.y * 50.0), position.x);
  gl_Position = mvp * vec4(pos, 1.0);
}`
  },

  fragment: {
    test:
`#version 300 es
precision highp int;
precision highp float;
layout(location = 0) out lowp vec4 frag_color;
uniform highp vec2 screen_size;
uniform highp vec2 inverse_screen_size;
uniform highp float time;
uniform sampler2D screen;
in vec2 p;

void main()
{
  frag_color = texture(screen, p);
}`,

    particleFlat:
`#version 300 es
precision highp int;
precision highp float;
layout(location = 0) out lowp vec4 frag_color;
in highp float point_size;
flat in int id;

vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d){return a + b * cos(6.283185307179586 * (c * t + d));}

void main() {
  highp float alpha = 0.5 * clamp(min(1.0, point_size * 0.5 - length(gl_PointCoord * point_size - point_size * 0.5)), 0.0, 1.0);
  if (alpha <= 0.0)
    discard;
  vec3 col = vec3(1.0) - palette(float(id) / 50000.0, vec3(${Math.random()}, ${Math.random()}, ${Math.random()}),
    vec3(${Math.random()},${Math.random()},${Math.random()}),
    vec3(${Math.random()},${Math.random()},${Math.random()}),
    vec3(${Math.random()},${Math.random()},${Math.random()}));
  frag_color = vec4(col * alpha, alpha);
}`,

    flat:
`#version 300 es
layout(location = 0) out lowp vec4 frag_color;
precision highp int;
precision highp float;
in vec3 n;

void main()
{
  frag_color = vec4(normalize(n) * 0.5 + 0.5, 0.0);
}`,

    color:
`#version 300 es
layout(location = 0) out lowp vec4 frag_color;
precision highp int;
precision highp float;
in vec3 n;
uniform vec4 color;

void main()
{
  frag_color = color;
}`,

    plane:
`#version 300 es
layout(location = 0) out lowp vec4 frag_color;
precision highp int;
precision highp float;
in vec3 pos;

const float PI = 3.1415926535897932384626433832795;

void main()
{
  if (pos.x > 1.0 || pos.y > 1.0 || pos.z > 1.0 || pos.x < -1.0 || pos.y < -1.0 || pos.z < -1.0)
    discard;

  vec2 t = vec2(cos(pos.z * 50.0 / PI / 2.0), -sin(pos.x * 50.0 / PI / 2.0));
    vec3 n = normalize(vec3(t.x, 1.0 - dot(t, t), t.y));

    frag_color = vec4(clamp(dot(n, vec3(0.0, 1.0, 0.0)) * vec3(1.0, 0.5, 0.125), vec3(0.0, 0.0, 0.0), vec3(1.0, 1.0, 1.0)) + vec3(0.125, 0.125, 0.25), 0.0);
}`,

    colorSpace:
`#version 300 es
precision highp float;
vec3 LinearTosRGB(vec3 c)
{
  return vec3(
    c.r <= 0.0031308 ? 12.92 * c.r : 1.055 * pow(c.r, 1.0 / 2.4) - 0.055,
    c.g <= 0.0031308 ? 12.92 * c.g : 1.055 * pow(c.g, 1.0 / 2.4) - 0.055,
    c.b <= 0.0031308 ? 12.92 * c.b : 1.055 * pow(c.b, 1.0 / 2.4) - 0.055);
}

vec3 sRGBToLinear(vec3 c)
{
  return vec3(
    c.r <= 0.04045 ? c.r / 12.92 : pow(c.r / 1.055 + 0.055 / 1.055, 2.4),
    c.g <= 0.04045 ? c.g / 12.92 : pow(c.g / 1.055 + 0.055 / 1.055, 2.4),
    c.b <= 0.04045 ? c.b / 12.92 : pow(c.b / 1.055 + 0.055 / 1.055, 2.4));
}`
  }
}

const shaderPrograms = {
  test: {
    'fragment': ['test'],
    'vertex': ['test'],
    'uniforms': {
      'screen_size': null,
      'inverse_screen_size': null,
      'time': null,
      'screen': null
    }
  },

  particles0: {
    'fragment': ['particleFlat'],
    'vertex': ['particleBasic'],
    'uniforms': {
      'mvp': null
    }
  },

  flat: {
    'fragment': ['flat'],
    'vertex': ['flat'],
    'uniforms': {
      'mvp': null,
      'mv': null
    }
  },

  color: {
    'fragment': ['color'],
    'vertex': ['flat'],
    'uniforms': {
      'mvp': null,
      'mv': null,
      'color': null
    }
  },

  plane: {
    'fragment': ['plane'],
    'vertex': ['plane'],
    'uniforms': {
      'mvp': null,
      'mv': null,
      'color': null
    }
  }

  /*'flow0': {
    'vertex': ['flow0'],
    'uniforms': {
      'mvp': null,
      'mv': null,
    },
    'varyings': ['position', 'velocity']
  }*/
}

let canvas = null
let gl = null
let frame = 0
let time = 0.0        // milliseconds
let timeOffset = 0.0  // milliseconds

/*
const pointLights = []

function createLightClusters(camera) {
  const x = 16
  const y = 9
  const z = 32

  for (let i in pointLights) {
    let r = pointLights[i].color.max()
  }
}
*/

let particles = null
let plane = null

function load() {
  const compiledShader = { vertex: {}, fragment: {} }

  for (const shaderType in shaderSource) {
    for (const name in shaderSource[shaderType]) {
      compiledShader[shaderType][name] = compileShader(gl, shaderSource[shaderType][name], shaderType)
    }
  }

  for (const program in shaderPrograms) {
    const shaders = []
    for (const shaderType in shaderSource) {
      for (const shader in shaderPrograms[program][shaderType]) {
        shaders.push(compiledShader[shaderType][shaderPrograms[program][shaderType][shader]])
      }
    }

    shaderPrograms[program].program = linkProgram(gl, shaders, program.varyings)
    if (!shaderPrograms[program].program) {
      return false
    }

    for (const uniform in shaderPrograms[program].uniforms) {
      shaderPrograms[program].uniforms[uniform] = gl.getUniformLocation(shaderPrograms[program].program, uniform)
    }
  }

  Quad.init(gl)
  Cube.init(gl)
  plane = new TessPlane(gl, 9)
  particles = new Particles(gl, 50000)

  /*
  for (let i = 0; i < 4096; ++i) {
    pointLights.push({
      position: vec3.fromValues(Math.random() * 100.0 - 50.0, Math.random() * 50.0, Math.random() * 100.0 - 50.0),
      color: vec3.fromValues(Math.random() * 10.0, Math.random() * 10.0, Math.random() * 10.0)
    })
  }
  */

  return true
}

const camera = new Camera(Math.PI / 2.0, 1.0, 0.1, 100.0)

function renderLoop(frameTime) {
  if (frame === 0) {
    timeOffset = frameTime
  }

  // const oldTime = time
  time = frameTime - timeOffset
  // const dt = (frameTime - oldTime)

  //

  camera.aspect = canvas.offsetWidth / canvas.offsetHeight
  //camera.focalLength = 8.0
  camera.updateProjection()
  camera.lookAt(
    vec3.fromValues(Math.cos(time / 1000.0 * 0.1) * 2.5, 1.25, Math.sin(time / 1000.0 * 0.1) * 2.5),
    vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.0, 1.0, 0.0)
  )
  //camera.lookAt(vec3.fromValues(0.0, 0.0, -5.0), vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.0, 1.0, 0.0))
  camera.update()

  Framebuffer.bind(gl, canvas.width, canvas.height)
  gl.clearColor(1.0, 1.0, 1.0, 0.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  gl.useProgram(shaderPrograms['plane'].program)
  gl.uniformMatrix4fv(shaderPrograms['plane'].uniforms['mvp'], false, camera.mvp)
  gl.uniformMatrix4fv(shaderPrograms['plane'].uniforms['mv'], false, camera.view)
  plane.draw(gl)
  gl.disable(gl.CULL_FACE)

  gl.useProgram(shaderPrograms['color'].program)
  gl.uniformMatrix4fv(shaderPrograms['color'].uniforms['mvp'], false, camera.mvp)
  gl.uniformMatrix4fv(shaderPrograms['color'].uniforms['mv'], false, camera.view)
  gl.uniform4f(shaderPrograms['color'].uniforms['color'], 0.0, 0.0, 0.0, 0.0)
  Cube.drawOutlines(gl)
  gl.disable(gl.DEPTH_TEST)

  gl.disable(gl.SCISSOR_TEST)

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  // gl.blendFunc(gl.ONE, gl.ONE)
  gl.useProgram(shaderPrograms['particles0'].program)
  gl.uniformMatrix4fv(shaderPrograms['particles0'].uniforms['mvp'], false, camera.mvp)
  particles.draw(gl)
  gl.disable(gl.BLEND)

  //

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.drawBuffers([gl.BACK])
  gl.viewport(0.0, 0.0, canvas.width, canvas.height)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, Framebuffer.textureHdr)

  gl.useProgram(shaderPrograms['test'].program)
  gl.uniform1f(shaderPrograms['test'].uniforms['time'], time)
  gl.uniform2f(shaderPrograms['test'].uniforms['inverse_screen_size'], 1.0 / canvas.width, 1.0 / canvas.height)
  gl.uniform2f(shaderPrograms['test'].uniforms['screen_size'], canvas.width, canvas.height)
  gl.uniform1i(shaderPrograms['test'].uniforms['screen'], 0)
  Quad.draw(gl)

  ++frame
  requestAnimationFrame(renderLoop)
}

function resize() {
  const dpr = devicePixelRatio || 1
  const width = Math.floor(innerWidth * dpr)
  const height = Math.floor(innerHeight * dpr)

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }

  Framebuffer.init(gl, canvas.width, canvas.height)
}

addEventListener('load', () => {
  canvas = document.createElement('canvas')

  Object.assign(document.body.style, {
    margin: '0',
    padding: '0',
    overflow: 'hidden',
    position: 'fixed',
    width: '100vw',
    height: '100vh'
  })
  
  Object.assign(canvas.style, {
    display: 'block',
    width: '100%',
    height: '100%'
  })

  gl = canvas.getContext('webgl2', { alpha: false, depth: false, stencil: false, antialias: false })
  if (gl === null) {
    alert('WebGL 2.0 not supported apparently. Weird.\n')
    return
  }

  const ext = gl.getExtension('EXT_color_buffer_float')
  if (!ext) {
    console.error('Floating-point rendering not supported! We kind of want that.')
    return
  }

  console.log(gl.getSupportedExtensions())

  resize()
  addEventListener('resize', resize)

  document.body.appendChild(canvas)

  if (!load()) {
    alert('Loading failed.\n' +
      'This shouldn\'t happen. It\'s probably a bug.')
    return
  }

  requestAnimationFrame(renderLoop)
})
