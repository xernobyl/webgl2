import { vec3 } from './gl-matrix/index.js'
import { Camera } from './camera.js'
import { Framebuffer } from './framebuffer.js'
import { Quad } from './quad.js'
import { Cube } from './cube.js'
import { TessPlane } from './tessplane.js'
import { Particles } from './particles.js'
import { MIDIManager } from './midi.js'

import { compileShader, linkProgram } from './shaders.js'
import { ResourceManager } from './resourcemanager.js'

const shaderSource = {
  vertex: {
    test: 'test.vs.glsl',
    particleBasic: 'particleBasic.vs.glsl',
    flat: 'flat.vs.glsl',
    plane: 'plane.vs.glsl'
  },
  fragment: {
    test: 'test.fs.glsl',
    particleFlat: 'particleFlat.fs.glsl',
    flat: 'flat.fs.glsl',
    color: 'color.fs.glsl',
    plane: 'plane.fs.glsl'
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
      'color': null,
      'bias': null
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
      const source = ResourceManager.get(`${shaderType}_${name}`)
      compiledShader[shaderType][name] = compileShader(gl, source, shaderType)
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
  gl.uniform2f(shaderPrograms['plane'].uniforms['bias'], MIDIManager.getSliderValue(1), MIDIManager.getSliderValue(2))
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
  console.info('Load...')

  ResourceManager.add('vertex_test', 'shaders/test.vs.glsl')
  ResourceManager.add('vertex_particleBasic', 'shaders/particleBasic.vs.glsl')
  ResourceManager.add('vertex_flat', 'shaders/flat.vs.glsl')
  ResourceManager.add('vertex_plane', 'shaders/plane.vs.glsl')
  ResourceManager.add('fragment_test', 'shaders/test.fs.glsl')
  ResourceManager.add('fragment_particleFlat', 'shaders/particleFlat.fs.glsl')
  ResourceManager.add('fragment_flat', 'shaders/flat.fs.glsl')
  ResourceManager.add('fragment_color', 'shaders/color.fs.glsl')
  ResourceManager.add('fragment_plane', 'shaders/plane.fs.glsl')
  //ResourceManager.add('fragment_colorSpace', 'shaders/colorSpace.fs.glsl')
  
  ResourceManager.onAllLoaded(() => {
    console.info('Creating canvas...')
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

    console.info('Getting context...')
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

    console.info('Compiling shaders...')
    if (!load()) {
      alert('Loading failed.\n' +
        'This shouldn\'t happen. It\'s probably a bug.')
      return
    }

    resize()
    addEventListener('resize', resize)

    document.body.appendChild(canvas)

    requestAnimationFrame(renderLoop)
  })  
})

await MIDIManager.initialize()
