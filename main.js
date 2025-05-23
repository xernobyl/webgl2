/* eslint-disable max-lines-per-function */
import { vec2, vec3 } from './gl-matrix/index.js'
import { Camera } from './camera.js'
import { Framebuffer } from './framebuffer.js'
import { Quad } from './quad.js'
import { Cube } from './cube.js'
import { TessPlane } from './tessplane.js'
import { Particles } from './particles.js'
import { MIDIManager } from './midi.js'
import { Shaders } from './shaders.js'
import { ResourceManager } from './resourcemanager.js'
import { GL } from './gl.js'
import { haltonSequence2D } from './utils.js'

const jitterSize = 8

export class App {
  static #particles = null
  static #plane = null
  static #camera = new Camera(Math.PI / 2.0, 1.0, 0.1, 100.0)
  static #frameBufferScale = 1.0
  static #jitterPattern

  static set frameBufferScale(value) {
    App.#frameBufferScale = value
    App.#resize()
  }

  static get frameBufferScale() {
    return App.#frameBufferScale
  }

  static #getJitterOffset() {
    const x = App.#jitterPattern[(GL.frame % jitterSize) * 2 + 0]
    const y = App.#jitterPattern[(GL.frame % jitterSize) * 2 + 1]

    return [x / Framebuffer.width, y / Framebuffer.height]
  }

  static #load() {
    console.log('Compiling shaders...')
    Shaders.init()
    console.log('LOADING THINGS')

    Quad.init()
    Cube.init()
    App.#plane = new TessPlane(9)
    App.#particles = new Particles(50000)

    App.#jitterPattern = haltonSequence2D(jitterSize)

    return true
  }

  static #loop() {
    // Updates //

    App.#camera.aspect = GL.aspectRatio
    // App.#camera.fov = Math.PI / 2.0 + Math.PI / 4.0 * Math.sin(GL.time / 1000.0)
    App.#camera.fov = Math.PI * 0.5 * (1.0 - MIDIManager.getSliderValue(4))

    const [jitterX, jitterY] = App.#getJitterOffset()
    App.#camera.setJitter(jitterX, jitterY)

    const phase = GL.time * 0.0005 //MIDIManager.getSliderValue(1) * Math.PI * 2.0
    const rad = 7.5 //MIDIManager.getSliderValue(2) * 20.0
    const height = 1.5  //MIDIManager.getSliderValue(3) * 10.0 - 5.0

    const camPos = vec3.fromValues(Math.cos(phase) * rad, height, Math.sin(phase) * rad)

    App.#camera.lookAt(
      camPos,
      vec3.fromValues(0.0, 0.0, 0.0),
      vec3.fromValues(0.0, 1.0, 0.0)
    )

    App.#camera.update()

    // Render //

    // 1st pass

    Framebuffer.beginRenderPass()

    const inverseResolution = 1.0 / vec2.length(vec2.fromValues(Framebuffer.width, Framebuffer.height))

    Shaders.useProgram('scene1')
    GL.gl.uniform1f(Shaders.uniform('scene1', 'time'), GL.time / 1000.0)
    GL.gl.uniform3f(Shaders.uniform('scene1', 'resolution'), Framebuffer.width, Framebuffer.height, inverseResolution)
    GL.gl.uniform1f(Shaders.uniform('scene1', 'fov'), App.#camera.fov)
    GL.gl.uniformMatrix4fv(Shaders.uniform('scene1', 'inverseViewMatrix'), false, App.#camera.inverseView)
    GL.gl.uniformMatrix4fv(Shaders.uniform('scene1', 'currentViewProjMatrix'), false, App.#camera.viewProjection)
    GL.gl.uniformMatrix4fv(Shaders.uniform('scene1', 'previousViewProjMatrix'), false, App.#camera.previousViewProjection)

    Quad.draw()

    /*
    // draw plane

    GL.gl.enable(GL.gl.DEPTH_TEST)
    GL.gl.enable(GL.gl.CULL_FACE)
    Shaders.useProgram('plane')
    GL.gl.uniformMatrix4fv(Shaders.uniform('plane', 'mvp'), false, App.#camera.viewProjection)
    GL.gl.uniformMatrix4fv(Shaders.uniform('plane', 'mv'), false, App.#camera.view)
    GL.gl.uniform2f(Shaders.uniform('plane', 'bias'), MIDIManager.getSliderValue(1), MIDIManager.getSliderValue(2))
    App.#plane.draw()
    GL.gl.disable(GL.gl.CULL_FACE)
    GL.gl.disable(GL.gl.DEPTH_TEST)

    // draw cube

    Shaders.useProgram('color')
    GL.gl.uniformMatrix4fv(Shaders.uniform('color', 'mvp'), false, App.#camera.viewProjection)
    GL.gl.uniformMatrix4fv(Shaders.uniform('color', 'mv'), false, App.#camera.view)
    GL.gl.uniform3f(Shaders.uniform('color', 'color'), 1.0, 0.0, 0.0)
    Cube.drawOutlines()
    */

    // draw particles

    /*
    GL.gl.enable(GL.gl.BLEND)
    GL.gl.blendFunc(GL.gl.ONE, GL.gl.ONE_MINUS_SRC_ALPHA)
    // gl.blendFunc(gl.ONE, gl.ONE)
    Shaders.useProgram('particles0')
    GL.gl.uniformMatrix4fv(Shaders.uniform('particles0', 'mvp'), false, App.#camera.mvp)
    App.#particles.draw()
    GL.gl.disable(GL.gl.BLEND)
    */

    Framebuffer.endRenderPass()

    // temporal anti-aliasing
    Framebuffer.runTemporalAAPass()

    // screen pass

    GL.gl.bindFramebuffer(GL.gl.FRAMEBUFFER, null)
    GL.gl.drawBuffers([GL.gl.BACK])
    GL.gl.viewport(0.0, 0.0, GL.canvas.width, GL.canvas.height)

    GL.gl.activeTexture(GL.gl.TEXTURE0)
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.textureTAA)

    Shaders.useProgram('screen')
    GL.gl.uniform1f(Shaders.uniform('screen', 'time'), GL.time)
    GL.gl.uniform2f(Shaders.uniform('screen', 'inverse_screen_size'), 1.0 / GL.canvas.width, 1.0 / GL.canvas.height)
    GL.gl.uniform2f(Shaders.uniform('screen', 'screen_size'), GL.canvas.width, GL.canvas.height)
    GL.gl.uniform1i(Shaders.uniform('screen', 'screen'), 0)
    Quad.draw()
  }

  static #resize() {
    const scale = App.#frameBufferScale > 0.0 ? App.#frameBufferScale : 1.0
    const fbWidth = Math.ceil(GL.canvas.width / scale)
    const fbHeight = Math.ceil(GL.canvas.height / scale)

    Framebuffer.init(fbWidth, fbHeight)
  }

  static #afterLoad() {
    console.info('afterLoad()')
    if (!App.#load()) {
      alert('Loading failed.\n' +
        'This shouldn\'t happen. It\'s probably a bug.')
      return
    }

    window.registerCommand('scale', scale => App.frameBufferScale = scale)
    window.registerCommand('led', (note, state) => MIDIManager.setLED(note, state))
    window.registerCommand('start', bpm => MIDIManager.startSequencer(bpm))
    window.registerCommand('stop', () => MIDIManager.stopSequencer())
  }

  static init() {
    // Get list of used shaders
    const shaderResources = Shaders.getShaderResources()
    for (const name in shaderResources) {
      ResourceManager.add(name, shaderResources[name])
    }

    ResourceManager.onAllLoaded(() => {
      console.info('All resources loaded...')
      GL.init(App.#afterLoad, App.#loop, App.#resize)
    })
  }
}

window.getApp = () => {
  return App
}

await MIDIManager.initialize()
App.init()
