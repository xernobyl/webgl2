import { GL } from './gl.js'

export class Framebuffer {
  static #width
  static #height

  static #textureHDR
  static #textureHDRHalf
  static #textureHDRQuarter
  static #textureHDREighth
  static #textureDepth

  static #framebuffer
  static #framebufferHalf
  static #framebufferQuarter
  static #framebufferEighth

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
  
  static init(maxWidth, maxHeight) {
    console.debug(maxWidth, maxHeight, Framebuffer.#width, Framebuffer.#height)

    if (maxWidth <= Framebuffer.#width && maxHeight <= Framebuffer.#height) {
      console.debug('Framebuffer resize: Ignoring')
      return true
    }

    const isNew = Framebuffer.#width === undefined

    if (isNew) {
      console.debug('Framebuffer resize: New')

      Framebuffer.#framebuffer = GL.gl.createFramebuffer()
      Framebuffer.#framebufferHalf = GL.gl.createFramebuffer()
      Framebuffer.#framebufferQuarter = GL.gl.createFramebuffer()
      Framebuffer.#framebufferEighth = GL.gl.createFramebuffer()
    } else {
      console.debug('Framebuffer resize: Resizing')

      GL.gl.deleteTexture(Framebuffer.#textureHDR)
      GL.gl.deleteTexture(Framebuffer.#textureHDRHalf)
      GL.gl.deleteTexture(Framebuffer.#textureHDRQuarter)
      GL.gl.deleteTexture(Framebuffer.#textureHDREighth)
      GL.gl.deleteTexture(Framebuffer.#textureDepth)
    }

    Framebuffer.#textureHDR = GL.gl.createTexture()
    Framebuffer.#textureHDRHalf = GL.gl.createTexture()
    Framebuffer.#textureHDRQuarter = GL.gl.createTexture()
    Framebuffer.#textureHDREighth = GL.gl.createTexture()
    Framebuffer.#textureDepth = GL.gl.createTexture()

    Framebuffer.#width = maxWidth
    Framebuffer.#height = maxHeight

    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.#textureHDR)
    GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, GL.gl.R11F_G11F_B10F, maxWidth, maxHeight)
    Framebuffer.#setTextureParams(GL.gl.CLAMP_TO_EDGE, GL.gl.LINEAR)

    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.#textureHDRHalf)
    GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, GL.gl.R11F_G11F_B10F, Math.ceil(maxWidth / 2), Math.ceil(maxHeight / 2))
    Framebuffer.#setTextureParams(GL.gl.CLAMP_TO_EDGE, GL.gl.LINEAR)
    
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.#textureHDRQuarter)
    GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, GL.gl.R11F_G11F_B10F, Math.ceil(maxWidth / 4), Math.ceil(maxHeight / 4))
    Framebuffer.#setTextureParams(GL.gl.CLAMP_TO_EDGE, GL.gl.LINEAR)

    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.#textureHDREighth)
    GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, GL.gl.R11F_G11F_B10F, Math.ceil(maxWidth / 8), Math.ceil(maxHeight / 8))
    Framebuffer.#setTextureParams(GL.gl.CLAMP_TO_EDGE, GL.gl.LINEAR)
    
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, Framebuffer.#textureDepth)
    GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, GL.gl.DEPTH_COMPONENT24, maxWidth, maxHeight)
    Framebuffer.#setTextureParams(GL.gl.CLAMP_TO_EDGE, GL.gl.NEAREST)

    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebuffer)
    GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.COLOR_ATTACHMENT0, GL.gl.TEXTURE_2D, Framebuffer.#textureHDR, 0)
    GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.DEPTH_ATTACHMENT, GL.gl.TEXTURE_2D, Framebuffer.#textureDepth, 0)
    if (!Framebuffer.#checkFramebufferStatus()) {
      return false
    }
    GL.gl.drawBuffers([GL.gl.COLOR_ATTACHMENT0])

    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebufferHalf)
    GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.COLOR_ATTACHMENT0, GL.gl.TEXTURE_2D, Framebuffer.#textureHDRHalf, 0)
    if (!Framebuffer.#checkFramebufferStatus()) {
      return false
    }
    GL.gl.drawBuffers([GL.gl.COLOR_ATTACHMENT0])

    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebufferQuarter)
    GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.COLOR_ATTACHMENT0, GL.gl.TEXTURE_2D, Framebuffer.#textureHDRQuarter, 0)
    if (!Framebuffer.#checkFramebufferStatus()) {
      return false
    }
    GL.gl.drawBuffers([GL.gl.COLOR_ATTACHMENT0])

    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebufferEighth)
    GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.COLOR_ATTACHMENT0, GL.gl.TEXTURE_2D, Framebuffer.#textureHDREighth, 0)
    if (!Framebuffer.#checkFramebufferStatus()) {
      return false
    }
    GL.gl.drawBuffers([GL.gl.COLOR_ATTACHMENT0])

    return true
  }

  static bind(width, height) {
    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, Framebuffer.#framebuffer)
    GL.gl.viewport(0, 0, width, height)
    GL.gl.scissor(0, 0, width, height)
    GL.gl.enable(GL.gl.SCISSOR_TEST)
  }

  static get width() {
    return Framebuffer.#width
  }

  static get height() {
    return Framebuffer.#height
  }

  static get textureHDR() {
    return Framebuffer.#textureHDR
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
