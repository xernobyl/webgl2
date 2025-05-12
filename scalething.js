import { GL } from './gl.js'

export class ScaleThing {
  static #width
  static #height
  static #texturePing
  static #texturePong
  static #framebufferPing
  static #framebufferPong

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
    if (ScaleThing.#width === width && ScaleThing.#height === height) {
      return
    }

    if (ScaleThing.#width === undefined) {
      ScaleThing.#framebufferPing = GL.gl.createFramebuffer()
      ScaleThing.#framebufferPong = GL.gl.createFramebuffer()
    } else {
      GL.gl.deleteTexture(ScaleThing.#texturePing)
      GL.gl.deleteTexture(ScaleThing.#texturePong)
    }

    ScaleThing.#texturePing = GL.gl.createTexture()
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, ScaleThing.#texturePing)
    GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, GL.gl.R11F_G11F_B10F, width, height)
    ScaleThing.#setTextureParams(GL.gl.CLAMP_TO_EDGE, GL.gl.NEAREST)

    ScaleThing.#texturePong = GL.gl.createTexture()
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, ScaleThing.#texturePong)
    GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, GL.gl.R11F_G11F_B10F, width, height)
    ScaleThing.#setTextureParams(GL.gl.CLAMP_TO_EDGE, GL.gl.NEAREST)

    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, ScaleThing.#framebufferPing)
    GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.COLOR_ATTACHMENT0, GL.gl.TEXTURE_2D, ScaleThing.#texturePing, 0)
    if (!ScaleThing.#checkFramebufferStatus()) {
      return false
    }

    GL.gl.bindFramebuffer(GL.gl.DRAW_FRAMEBUFFER, ScaleThing.#framebufferPong)
    GL.gl.framebufferTexture2D(GL.gl.DRAW_FRAMEBUFFER, GL.gl.COLOR_ATTACHMENT0, GL.gl.TEXTURE_2D, ScaleThing.#texturePong, 0)
    if (!ScaleThing.#checkFramebufferStatus()) {
      return false
    }
  }
}
