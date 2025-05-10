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
import { GL } from './gl.js'

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
}


let particles = null
let plane = null

const load = () => {
  const compiledShader = { vertex: {}, fragment: {} }

  for (const shaderType in shaderSource) {
    for (const name in shaderSource[shaderType]) {
      const source = ResourceManager.get(`${shaderType}_${name}`)
      compiledShader[shaderType][name] = compileShader(source, shaderType)
    }
  }

  for (const program in shaderPrograms) {
    const shaders = []
    for (const shaderType in shaderSource) {
      for (const shader in shaderPrograms[program][shaderType]) {
        shaders.push(compiledShader[shaderType][shaderPrograms[program][shaderType][shader]])
      }
    }

    shaderPrograms[program].program = linkProgram(shaders, program.varyings)
    if (!shaderPrograms[program].program) {
      return false
    }

    for (const uniform in shaderPrograms[program].uniforms) {
      shaderPrograms[program].uniforms[uniform] = GL.gl.getUniformLocation(shaderPrograms[program].program, uniform)
    }
  }

  console.log('LOADING THINGS')

  Quad.init()
  Cube.init()
  plane = new TessPlane(9)
  particles = new Particles(50000)

  return true
}

const camera = new Camera(Math.PI / 2.0, 1.0, 0.1, 100.0)

const loop = () => {
  camera.aspect = GL.canvas.offsetWidth / GL.canvas.offsetHeight
  //camera.focalLength = 8.0
  camera.updateProjection()
  camera.lookAt(
    vec3.fromValues(Math.cos(GL.time / 1000.0 * 0.1) * 2.5, 1.25, Math.sin(GL.time / 1000.0 * 0.1) * 2.5),
    vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.0, 1.0, 0.0)
  )
  //camera.lookAt(vec3.fromValues(0.0, 0.0, -5.0), vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.0, 1.0, 0.0))
  camera.update()

  Framebuffer.bind(GL.canvas.width, GL.canvas.height)
  GL.gl.clearColor(1.0, 1.0, 1.0, 0.0)
  GL.gl.clear(GL.gl.COLOR_BUFFER_BIT | GL.gl.DEPTH_BUFFER_BIT)

  GL.gl.enable(GL.gl.DEPTH_TEST)
  GL.gl.enable(GL.gl.CULL_FACE)
  GL.gl.useProgram(shaderPrograms['plane'].program)
  GL.gl.uniformMatrix4fv(shaderPrograms['plane'].uniforms['mvp'], false, camera.mvp)
  GL.gl.uniformMatrix4fv(shaderPrograms['plane'].uniforms['mv'], false, camera.view)
  GL.gl.uniform2f(shaderPrograms['plane'].uniforms['bias'], MIDIManager.getSliderValue(1), MIDIManager.getSliderValue(2))
  plane.draw()
  GL.gl.disable(GL.gl.CULL_FACE)

  GL.gl.useProgram(shaderPrograms['color'].program)
  GL.gl.uniformMatrix4fv(shaderPrograms['color'].uniforms['mvp'], false, camera.mvp)
  GL.gl.uniformMatrix4fv(shaderPrograms['color'].uniforms['mv'], false, camera.view)
  GL.gl.uniform4f(shaderPrograms['color'].uniforms['color'], 0.0, 0.0, 0.0, 0.0)
  Cube.drawOutlines()
  GL.gl.disable(GL.gl.DEPTH_TEST)

  GL.gl.disable(GL.gl.SCISSOR_TEST)

  GL.gl.enable(GL.gl.BLEND)
  GL.gl.blendFunc(GL.gl.ONE, GL.gl.ONE_MINUS_SRC_ALPHA)
  // gl.blendFunc(gl.ONE, gl.ONE)
  GL.gl.useProgram(shaderPrograms['particles0'].program)
  GL.gl.uniformMatrix4fv(shaderPrograms['particles0'].uniforms['mvp'], false, camera.mvp)
  particles.draw()
  GL.gl.disable(GL.gl.BLEND)

  //

  GL.gl.bindFramebuffer(GL.gl.FRAMEBUFFER, null)
  GL.gl.drawBuffers([GL.gl.BACK])
  GL.gl.viewport(0.0, 0.0, GL.canvas.width, GL.canvas.height)

  GL.gl.activeTexture(GL.gl.TEXTURE0)
  GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.textureHdr)

  GL.gl.useProgram(shaderPrograms['test'].program)
  GL.gl.uniform1f(shaderPrograms['test'].uniforms['time'], GL.time)
  GL.gl.uniform2f(shaderPrograms['test'].uniforms['inverse_screen_size'], 1.0 / GL.canvas.width, 1.0 / GL.canvas.height)
  GL.gl.uniform2f(shaderPrograms['test'].uniforms['screen_size'], GL.canvas.width, GL.canvas.height)
  GL.gl.uniform1i(shaderPrograms['test'].uniforms['screen'], 0)
  Quad.draw()
}

const resize = () => {
  Framebuffer.init(GL.canvas.width, GL.canvas.height)
}

const afterLoad = () => {
  console.info('afterLoad()')
  if (!load()) {
    alert('Loading failed.\n' +
      'This shouldn\'t happen. It\'s probably a bug.')
    return
  }
}

await MIDIManager.initialize()

ResourceManager.add('vertex_test', 'shaders/test.vs.glsl')
ResourceManager.add('vertex_particleBasic', 'shaders/particleBasic.vs.glsl')
ResourceManager.add('vertex_flat', 'shaders/flat.vs.glsl')
ResourceManager.add('vertex_plane', 'shaders/plane.vs.glsl')
ResourceManager.add('fragment_test', 'shaders/test.fs.glsl')
ResourceManager.add('fragment_particleFlat', 'shaders/particleFlat.fs.glsl')
ResourceManager.add('fragment_flat', 'shaders/flat.fs.glsl')
ResourceManager.add('fragment_color', 'shaders/color.fs.glsl')
ResourceManager.add('fragment_plane', 'shaders/plane.fs.glsl')
ResourceManager.onAllLoaded(() => {
  console.info('All resources loaded...')
  GL.init(afterLoad, loop, resize)
})
