export class TexturePool {
  constructor() {
    this.textures = []
  }

  getTexture(gl, width, height, format, type, internalFormat) {
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
    const newTex = this.createTexture(gl, width, height, format, type, internalFormat);
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

  createTexture(gl, width, height, format, type, internalFormat) {
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texStorage2D(gl.TEXTURE_2D, 1, internalFormat, width, height)
    // Set appropriate filtering
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    
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
