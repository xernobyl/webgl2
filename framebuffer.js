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
  static #textureMips = []
  static #textureDepth

  static #framebuffer = []
  static #framebufferNoMotion = []
  static #framebufferMips = []

  static #frameCounter = 0
  static #mipLevels = 5

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

  static init(width, height, mipLevels) {
    if (width <= 0.0 || height <= 0.0 || width === Framebuffer.#width && height === Framebuffer.#height) {
      console.debug('Framebuffer resize: Ignoring')
      return true
    }

    const isNew = Framebuffer.#width === undefined

    if (!mipLevels) {
      mipLevels = Framebuffer.#mipLevels
    } else {
      Framebuffer.#mipLevels = mipLevels
    }

    if (isNew) {
      console.debug('Framebuffer resize: New')

      for (let i = 0; i < 3; i++) {
        Framebuffer.#framebuffer[i] = GL.gl.createFramebuffer()
      }

      for (let i = 0; i < 3; i++) {
        Framebuffer.#framebufferNoMotion[i] = GL.gl.createFramebuffer()
      }

      // Create mip framebuffers
      for (let i = 0; i < mipLevels; i++) {
        Framebuffer.#framebufferMips[i] = GL.gl.createFramebuffer()
      }
    } else {
      console.debug('Framebuffer resize: Resizing')

      for (let i = 0; i < 3; i++) {
        GL.gl.deleteTexture(Framebuffer.#textureHDR[i])
      }

      GL.gl.deleteTexture(Framebuffer.#textureMotion)

      // Delete existing mip textures
      for (let i = 0; i < Framebuffer.#textureMips.length; i++) {
        GL.gl.deleteTexture(Framebuffer.#textureMips[i])
      }

      GL.gl.deleteTexture(Framebuffer.#textureDepth)
    }

    for (let i = 0; i < 3; i++) {
      Framebuffer.#textureHDR[i] = GL.gl.createTexture()
    }

    Framebuffer.#textureMotion = GL.gl.createTexture()

    // Create mip textures
    for (let i = 0; i < mipLevels; i++) {
      Framebuffer.#textureMips[i] = GL.gl.createTexture()
    }

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

    // Initialize mip textures
    for (let i = 0; i < mipLevels; i++) {
      const scale = 1.0 / (1 << (i + 1))
      const w = Math.ceil(width * scale)
      const h = Math.ceil(height * scale)

      GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.#textureMips[i])
      GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, GL.gl.R11F_G11F_B10F, w, h)
      Framebuffer.#setTextureParams(GL.gl.CLAMP_TO_EDGE, GL.gl.LINEAR)
    }

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

    // Initialize mip framebuffers
    for (let i = 0; i < mipLevels; i++) {
      GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebufferMips[i])
      GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.COLOR_ATTACHMENT0, GL.gl.TEXTURE_2D, Framebuffer.#textureMips[i], 0)
      if (!Framebuffer.#checkFramebufferStatus()) {
        return false
      }
    }

    return true
  }

  static beginRenderPass() {
    this.#frameCounter = (this.#frameCounter + 1) % 3

    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebuffer[this.#frameCounter])
    GL.gl.drawBuffers([GL.gl.COLOR_ATTACHMENT0, GL.gl.COLOR_ATTACHMENT1])
    GL.gl.viewport(0, 0, Framebuffer.#width, Framebuffer.#height)
    // GL.gl.clear(GL.gl.DEPTH_BUFFER_BIT)
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

  static runBlurPasses(nPasses, radius) {
    if (!nPasses) {
      nPasses = Framebuffer.#mipLevels - 1
    }

    const threshold = 1.0

    nPasses = Math.max(0, Math.min(nPasses, Framebuffer.#mipLevels - 1))

    // Brightness pass + Downsample
    let pw = Framebuffer.#width
    let ph = Framebuffer.#height
    let w = Math.ceil(Framebuffer.#width / 2)
    let h = Math.ceil(Framebuffer.#height / 2)

    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebufferMips[0])
    GL.gl.invalidateFramebuffer(GL.gl.DRAW_FRAMEBUFFER, [GL.gl.COLOR_ATTACHMENT0])
    GL.gl.viewport(0, 0, w, h)
    GL.gl.drawBuffers([GL.gl.COLOR_ATTACHMENT0])

    GL.gl.activeTexture(GL.gl.TEXTURE0)
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.textureTAA)

    Shaders.useProgram('blur_brightness')
    GL.gl.uniform1i(Shaders.uniform('blur_brightness', 'color'), 0)
    GL.gl.uniform2f(Shaders.uniform('blur_brightness', 'texelSize'), 1.0 / pw, 1.0 / ph)
    GL.gl.uniform1f(Shaders.uniform('blur_brightness', 'threshold'), threshold)
    GL.gl.uniform1f(Shaders.uniform('blur_brightness', 'uRadius'), radius)
    Quad.draw()

    // Downsample passes
    for (let i = 0; i < nPasses; ++i) {
      pw = w
      ph = h
      const scale = 1.0 / (1 << (i + 2))
      w = Math.ceil(Framebuffer.#width * scale)
      h = Math.ceil(Framebuffer.#height * scale)

      GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebufferMips[i + 1])
      GL.gl.viewport(0, 0, w, h)
      GL.gl.invalidateFramebuffer(GL.gl.DRAW_FRAMEBUFFER, [GL.gl.COLOR_ATTACHMENT0])
      GL.gl.drawBuffers([GL.gl.COLOR_ATTACHMENT0])

      GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.#textureMips[i])

      Shaders.useProgram('blur_downsample')
      GL.gl.uniform1i(Shaders.uniform('blur_downsample', 'color'), 0)
      GL.gl.uniform2f(Shaders.uniform('blur_downsample', 'texelSize'), 1.0 / pw, 1.0 / ph)
      GL.gl.uniform1f(Shaders.uniform('blur_downsample', 'uRadius'), radius)
      Quad.draw()
    }

    // Upsample passes
    for (let i = nPasses - 1; i >= 0; i--) {
      pw = w
      ph = h
      const scale = 1.0 / (1 << (i + 1))
      w = Math.ceil(Framebuffer.#width * scale)
      h = Math.ceil(Framebuffer.#height * scale)

      GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebufferMips[i])
      GL.gl.invalidateFramebuffer(GL.gl.DRAW_FRAMEBUFFER, [GL.gl.COLOR_ATTACHMENT0])
      GL.gl.drawBuffers([GL.gl.COLOR_ATTACHMENT0])
      GL.gl.viewport(0, 0, w, h)

      GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.#textureMips[i + 1])

      Shaders.useProgram('blur_upsample')
      GL.gl.uniform1i(Shaders.uniform('blur_upsample', 'color'), 0)
      GL.gl.uniform2f(Shaders.uniform('blur_upsample', 'texelSize'), 1.0 / pw, 1.0 / ph)
      GL.gl.uniform1f(Shaders.uniform('blur_upsample', 'uRadius'), radius)
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

  static get textureHalf() {
    return Framebuffer.#textureMips[0]
  }

  static get textureDepth() {
    return Framebuffer.#textureDepth
  }
}
