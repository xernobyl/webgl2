import { GL } from './gl.js'

export class TexturePool {
  static #textures = []

  static get(width, height, format, type, internalFormat) {
    // Try to find existing texture
    const tex = TexturePool.#textures.find(t => 
      t.width === width && 
      t.height === height &&
      t.format === format &&
      t.type === type &&
      !t.inUse
    )

    if (tex) {
      tex.inUse = true
      return tex
    }

    return TexturePool.#create(width, height, format, type, internalFormat)
  }

  static release(texture) {
    const tex = TexturePool.#textures.find(t => t === texture)
    if (tex) {
      tex.inUse = false
    }
  }

  static #create(width, height, format, type, internalFormat) {
    const texture = GL.gl.createTexture()
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, texture)
    GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, internalFormat, width, height)
    TexturePool.#params(GL.gl.LINEAR, GL.gl.CLAMP_TO_EDGE)

    const newTex = {
      texture,
      width,
      height,
      format,
      type,
      internalFormat,
      inUse: true
    }

    TexturePool.#textures.push(newTex)

    return newTex
  }

  static #params(filter, wrap) {
    GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MIN_FILTER, filter)
    GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MAG_FILTER, filter)
    GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_WRAP_S, wrap)
    GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_WRAP_T, wrap)
  }
}
