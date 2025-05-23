/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import { GL } from './gl.js'
import { Shaders } from './shaders.js'
import { Quad } from './quad.js'

export class Framebuffer {
  static #width
  static #height

  static #textureHDR = []
  static #textureMotion
  static #textureHDRHalf
  static #textureHDRQuarter
  static #textureHDREighth
  static #textureDepth

  static #framebuffer = []
  static #framebufferNoMotion = []
  static #framebufferHalf
  static #framebufferQuarter
  static #framebufferEighth

  static #frameCounter = 0

  static #setTextureParams(wrap, filter) {
    GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_WRAP_S, wrap)
    GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_WRAP_T, wrap)
    GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MIN_FILTER, filter)
    GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MAG_FILTER, filter)
  }

  static #checkFramebufferStatus() {
    const status = GL.gl.checkFramebufferStatus(GL.gl.DRAW_FRAMEBUFFER)

    switch (status) {
      case GL.gl.FRAMEBUFFER_COMPLETE:
        return true

      case GL.gl.FRAMEBUFFER_UNSUPPORTED:
        throw new Error('FRAMEBUFFER_UNSUPPORTED')

      case GL.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
        throw new Error('FRAMEBUFFER_INCOMPLETE_ATTACHMENT')

      case GL.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
        throw new Error('FRAMEBUFFER_INCOMPLETE_DIMENSIONS')

      case GL.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
        throw new Error('FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT')
    }

    throw new Error(`unexpected checkFramebufferStatus: ${status}`)
  }

  static init(width, height) {
    if (width <= 0.0 || height <= 0.0 || width === Framebuffer.#width && height === Framebuffer.#height) {
      console.debug('Framebuffer resize: Ignoring')
      return true
    }

    const isNew = Framebuffer.#width === undefined

    if (isNew) {
      console.debug('Framebuffer resize: New')

      for (let i = 0; i < 3; i++) {
        Framebuffer.#framebuffer[i] = GL.gl.createFramebuffer()
      }

      for (let i = 0; i < 3; i++) {
        Framebuffer.#framebufferNoMotion[i] = GL.gl.createFramebuffer()
      }

      Framebuffer.#framebufferHalf = GL.gl.createFramebuffer()
      Framebuffer.#framebufferQuarter = GL.gl.createFramebuffer()
      Framebuffer.#framebufferEighth = GL.gl.createFramebuffer()
    } else {
      console.debug('Framebuffer resize: Resizing')

      for (let i = 0; i < 3; i++) {
        GL.gl.deleteTexture(Framebuffer.#textureHDR[i])
      }

      GL.gl.deleteTexture(Framebuffer.#textureMotion)
      GL.gl.deleteTexture(Framebuffer.#textureHDRHalf)
      GL.gl.deleteTexture(Framebuffer.#textureHDRQuarter)
      GL.gl.deleteTexture(Framebuffer.#textureHDREighth)
      GL.gl.deleteTexture(Framebuffer.#textureDepth)
    }

    for (let i = 0; i < 3; i++) {
      Framebuffer.#textureHDR[i] = GL.gl.createTexture()
    }

    Framebuffer.#textureMotion = GL.gl.createTexture()
    Framebuffer.#textureHDRHalf = GL.gl.createTexture()
    Framebuffer.#textureHDRQuarter = GL.gl.createTexture()
    Framebuffer.#textureHDREighth = GL.gl.createTexture()
    Framebuffer.#textureDepth = GL.gl.createTexture()

    Framebuffer.#width = width
    Framebuffer.#height = height

    console.debug(`Framebuffer: ${width} × ${height}`)

    for (let i = 0; i < 3; i++) {
      GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.#textureHDR[i])
      GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, GL.gl.R11F_G11F_B10F, width, height)
      Framebuffer.#setTextureParams(GL.gl.CLAMP_TO_EDGE, GL.gl.LINEAR)
    }

    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.#textureMotion)
    GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, GL.gl.RG16F, width, height)
    Framebuffer.#setTextureParams(GL.gl.CLAMP_TO_EDGE, GL.gl.LINEAR)

    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.#textureHDRHalf)
    GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, GL.gl.R11F_G11F_B10F, Math.ceil(width / 2), Math.ceil(height / 2))
    Framebuffer.#setTextureParams(GL.gl.CLAMP_TO_EDGE, GL.gl.LINEAR)

    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.#textureHDRQuarter)
    GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, GL.gl.R11F_G11F_B10F, Math.ceil(width / 4), Math.ceil(height / 4))
    Framebuffer.#setTextureParams(GL.gl.CLAMP_TO_EDGE, GL.gl.LINEAR)

    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.#textureHDREighth)
    GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, GL.gl.R11F_G11F_B10F, Math.ceil(width / 8), Math.ceil(height / 8))
    Framebuffer.#setTextureParams(GL.gl.CLAMP_TO_EDGE, GL.gl.LINEAR)

    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.#textureDepth)
    GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, GL.gl.DEPTH_COMPONENT24, width, height)
    Framebuffer.#setTextureParams(GL.gl.CLAMP_TO_EDGE, GL.gl.NEAREST)

    for (let i = 0; i < 3; i++) {
      GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebuffer[i])
      GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.COLOR_ATTACHMENT0, GL.gl.TEXTURE_2D, Framebuffer.#textureHDR[i], 0)
      GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.COLOR_ATTACHMENT1, GL.gl.TEXTURE_2D, Framebuffer.#textureMotion, 0)
      GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.DEPTH_ATTACHMENT, GL.gl.TEXTURE_2D, Framebuffer.#textureDepth, 0)
      if (!Framebuffer.#checkFramebufferStatus()) {
        return false
      }
    }

    for (let i = 0; i < 3; i++) {
      GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebufferNoMotion[i])
      GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.COLOR_ATTACHMENT0, GL.gl.TEXTURE_2D, Framebuffer.#textureHDR[i], 0)
      if (!Framebuffer.#checkFramebufferStatus()) {
        return false
      }
    }

    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebufferHalf)
    GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.COLOR_ATTACHMENT0, GL.gl.TEXTURE_2D, Framebuffer.#textureHDRHalf, 0)
    if (!Framebuffer.#checkFramebufferStatus()) {
      return false
    }

    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebufferQuarter)
    GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.COLOR_ATTACHMENT0, GL.gl.TEXTURE_2D, Framebuffer.#textureHDRQuarter, 0)
    if (!Framebuffer.#checkFramebufferStatus()) {
      return false
    }

    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebufferEighth)
    GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.COLOR_ATTACHMENT0, GL.gl.TEXTURE_2D, Framebuffer.#textureHDREighth, 0)
    if (!Framebuffer.#checkFramebufferStatus()) {
      return false
    }

    return true
  }

  static beginRenderPass() {
    this.#frameCounter = (this.#frameCounter + 1) % 3

    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebuffer[this.#frameCounter])
    GL.gl.drawBuffers([GL.gl.COLOR_ATTACHMENT0, GL.gl.COLOR_ATTACHMENT1])
    GL.gl.viewport(0, 0, Framebuffer.#width, Framebuffer.#height)
    GL.gl.clear(GL.gl.DEPTH_BUFFER_BIT)
  }

  static endRenderPass() {

  }

  static runTemporalAAPass() {
    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebufferNoMotion[(this.#frameCounter + 2) % 3])
    GL.gl.invalidateFramebuffer(GL.gl.DRAW_FRAMEBUFFER, [GL.gl.COLOR_ATTACHMENT0])
    GL.gl.drawBuffers([GL.gl.COLOR_ATTACHMENT0])
    GL.gl.viewport(0, 0, Framebuffer.#width, Framebuffer.#height)

    GL.gl.activeTexture(GL.gl.TEXTURE0)
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.textureHDR)
    GL.gl.activeTexture(GL.gl.TEXTURE1)
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.textureMotion)
    GL.gl.activeTexture(GL.gl.TEXTURE2)
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.textureAccum)

    Shaders.useProgram('taa')
    GL.gl.uniform1i(Shaders.uniform('taa', 'samplerCurrent'), 0)
    GL.gl.uniform1i(Shaders.uniform('taa', 'samplerMotion'), 1)
    GL.gl.uniform1i(Shaders.uniform('taa', 'samplerPrevious'), 2)
    GL.gl.uniform2f(Shaders.uniform('taa', 'iTexel'), 1.0 / Framebuffer.width, 1.0 / Framebuffer.height)
    Quad.draw()
  }

  static runBlurPasses(nPasses = 3) {
    const knee = 0.1
    const threshold = 0.9

    nPasses = Math.max(0, Math.min(nPasses, 3))

    const sizeDivisors = [2, 4, 8]

    const tex = [
      Framebuffer.textureHDR,
      Framebuffer.#textureHDRHalf,
      Framebuffer.#textureHDRQuarter,
      Framebuffer.#textureHDREighth
    ]
    const fbo = [
      Framebuffer.#framebufferHalf,
      Framebuffer.#framebufferQuarter,
      Framebuffer.#framebufferEighth
    ]

    // Brightness pass + Downsample
    const iw = Math.ceil(Framebuffer.#width / 2)
    const ih = Math.ceil(Framebuffer.#height / 2)

    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, fbo[0])
    GL.gl.invalidateFramebuffer(GL.gl.DRAW_FRAMEBUFFER, [GL.gl.COLOR_ATTACHMENT0])
    GL.gl.viewport(0, 0, iw, ih)
    GL.gl.drawBuffers([GL.gl.COLOR_ATTACHMENT0])

    GL.gl.activeTexture(GL.gl.TEXTURE0)
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, tex[0])

    Shaders.useProgram('blur_brightness_pass')
    GL.gl.uniform1i(Shaders.uniform('blur_brightness_pass', 'color'), 0)
    GL.gl.uniform2f(Shaders.uniform('blur_brightness_pass', 'halfPixel'), 0.5 / iw, 0.5 / ih)
    GL.gl.uniform1f(Shaders.uniform('blur_brightness_pass', 'threshold'), threshold)
    GL.gl.uniform1f(Shaders.uniform('blur_brightness_pass', 'knee'), knee)
    Quad.draw()

    // Downsample passes
    for (let i = 1; i <= nPasses; ++i) {
      const w = Math.ceil(Framebuffer.#width  / sizeDivisors[i - 1])
      const h = Math.ceil(Framebuffer.#height / sizeDivisors[i - 1])

      GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, fbo[i])
      GL.gl.viewport(0, 0, w, h)
      GL.gl.invalidateFramebuffer(GL.gl.DRAW_FRAMEBUFFER, [GL.gl.COLOR_ATTACHMENT0])
      GL.gl.drawBuffers([GL.gl.COLOR_ATTACHMENT0])

      GL.gl.bindTexture(GL.gl.TEXTURE_2D, tex[i - 1])

      Shaders.useProgram('blur_downsample')
      GL.gl.uniform1i(Shaders.uniform('blur_downsample', 'color'), 0)
      GL.gl.uniform2f(Shaders.uniform('blur_downsample', 'halfPixel'), 0.5 / w, 0.5 / h)
      Quad.draw()
    }

    // Upsample passes
    for (let i = nPasses - 1; i >= 0; --i) {
      const w = Math.ceil(Framebuffer.#width  / sizeDivisors[i])
      const h = Math.ceil(Framebuffer.#height / sizeDivisors[i])

      GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, fbo[i])
      GL.gl.invalidateFramebuffer(GL.gl.DRAW_FRAMEBUFFER, [GL.gl.COLOR_ATTACHMENT0])
      GL.gl.drawBuffers([GL.gl.COLOR_ATTACHMENT0])
      GL.gl.viewport(0, 0, w, h)

      GL.gl.bindTexture(GL.gl.TEXTURE_2D, tex[i + 1])

      Shaders.useProgram('blur_upsample')
      GL.gl.uniform1i(Shaders.uniform('blur_upsample', 'color'), 0)
      GL.gl.uniform2f(Shaders.uniform('blur_upsample', 'halfPixel'), 0.5 / w, 0.5 / h)
      Quad.draw()
    }
  }


  static get width() {
    return Framebuffer.#width
  }

  static get height() {
    return Framebuffer.#height
  }

  static get textureHDR() {
    return Framebuffer.#textureHDR[this.#frameCounter]
  }

  static get textureAccum() {
    return Framebuffer.#textureHDR[(this.#frameCounter + 1) % 3]
  }

  static get textureTAA() {
    return Framebuffer.#textureHDR[(this.#frameCounter + 2) % 3]
  }

  static get textureMotion() {
    return Framebuffer.#textureMotion
  }

  static get textureHDRHalf() {
    return Framebuffer.#textureHDRHalf
  }

  static get textureHDRQuarter() {
    return Framebuffer.#textureHDRQuarter
  }

  static get textureHDREighth() {
    return Framebuffer.#textureHDREighth
  }

  static get textureDepth() {
    return Framebuffer.#textureDepth
  }
}
