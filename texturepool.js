import { GL } from './gl.js'

export class TexturePool {
  constructor() {
    this.textures = []
  }

  getTexture(width, height, format, type, internalFormat) {
    // Try to find existing texture
    const tex = this.textures.find(t => 
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

    // Create new texture
    const newTex = this.createTexture(width, height, format, type, internalFormat);
    newTex.inUse = true
    this.textures.push(newTex)
    return newTex
  }

  releaseTexture(texture) {
    const tex = this.textures.find(t => t === texture)
    if (tex) {
      tex.inUse = false
    }
  }

  createTexture(width, height, format, type, internalFormat) {
    const texture = GL.gl.createTexture()
    GL.gl.bindTexture(GL.gl.TEXTURE_2D, texture)
    GL.gl.texStorage2D(GL.gl.TEXTURE_2D, 1, internalFormat, width, height)
    // Set appropriate filtering
    GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MIN_FILTER, GL.gl.LINEAR)
    GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MAG_FILTER, GL.gl.LINEAR)
    GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_WRAP_S, GL.gl.CLAMP_TO_EDGE)
    GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_WRAP_T, GL.gl.CLAMP_TO_EDGE)
    
    return {
      texture,
      width,
      height,
      format,
      type,
      internalFormat,
      inUse: false
    }
  }
}
