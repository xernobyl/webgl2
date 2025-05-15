import { vec3 } from './gl-matrix/index.js'
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
import { haltonSequence2D } from './shaders/utils.js'

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

    App.#camera.aspect = GL.canvas.offsetWidth / GL.canvas.offsetHeight
    //camera.focalLength = 8.0

    const [jitterX, jitterY] = App.#getJitterOffset()
    App.#camera.setJitter(jitterX, jitterY)

    App.#camera.lookAt(
      vec3.fromValues(Math.cos(GL.time / 1000.0 * 0.1) * 2.5, 1.25, Math.sin(GL.time / 1000.0 * 0.1) * 2.5),
      vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.0, 1.0, 0.0)
    )
    //camera.lookAt(vec3.fromValues(0.0, 0.0, -5.0), vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.0, 1.0, 0.0))
    App.#camera.update()

    // Render //

    // 1st pass

    Framebuffer.beginRenderPass()
    GL.gl.clearColor(1.0, 1.0, 1.0, 0.0)
    GL.gl.clear(GL.gl.COLOR_BUFFER_BIT | GL.gl.DEPTH_BUFFER_BIT)

    // draw plane

    GL.gl.enable(GL.gl.DEPTH_TEST)
    GL.gl.enable(GL.gl.CULL_FACE)
    Shaders.useProgram('plane')
    GL.gl.uniformMatrix4fv(Shaders.uniform('plane', 'mvp'), false, App.#camera.mvp)
    GL.gl.uniformMatrix4fv(Shaders.uniform('plane', 'mv'), false, App.#camera.view)
    GL.gl.uniform2f(Shaders.uniform('plane', 'bias'), MIDIManager.getSliderValue(1), MIDIManager.getSliderValue(2))
    App.#plane.draw()
    GL.gl.disable(GL.gl.CULL_FACE)

    // draw cube
    
    Shaders.useProgram('color')
    GL.gl.uniformMatrix4fv(Shaders.uniform('color', 'mvp'), false, App.#camera.mvp)
    GL.gl.uniformMatrix4fv(Shaders.uniform('color', 'mv'), false, App.#camera.view)
    GL.gl.uniform4f(Shaders.uniform('color', 'color'), 0.0, 0.0, 0.0, 0.0)
    Cube.drawOutlines()
    GL.gl.disable(GL.gl.DEPTH_TEST)

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

    Framebuffer.beginTemporalAAPass()

    GL.gl.activeTexture(GL.gl.TEXTURE0)
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.textureHDR)
    GL.gl.activeTexture(GL.gl.TEXTURE1)
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.textureHDR)
    GL.gl.activeTexture(GL.gl.TEXTURE2)
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.textureAccum)

    Shaders.useProgram('taa')
    GL.gl.uniform1i(Shaders.uniform('taa', 'samplerCurrent'), 0)
    GL.gl.uniform1i(Shaders.uniform('taa', 'samplerMotion'), 1)
    GL.gl.uniform1i(Shaders.uniform('taa', 'samplerPrevious'), 2)
    GL.gl.uniform2f(Shaders.uniform('taa', 'iTexel'), 1.0 / Framebuffer.width, 1.0 / Framebuffer.height)
    Quad.draw()

    Framebuffer.endTemporalAAPass()

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
