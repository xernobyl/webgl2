export class Framebuffer {
  static setTextureParams(gl, wrap, filter) {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
  }
  
  static checkFramebufferStatus(gl) {
    const status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER)

    switch (status) {
      case gl.FRAMEBUFFER_COMPLETE:
        console.log('FRAMEBUFFER_COMPLETE')
        return true

      case gl.FRAMEBUFFER_UNSUPPORTED:
        console.log('FRAMEBUFFER_UNSUPPORTED')
        return false

      case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
        console.log('FRAMEBUFFER_INCOMPLETE_ATTACHMENT')
        return false

      case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
        console.log('FRAMEBUFFER_INCOMPLETE_DIMENSIONS')
        return false

      case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
        console.log('FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT')
        return false
    }

    console.error(`unexpected checkFramebufferStatus: ${status}`)
    return false
  }
  
  static init(gl, maxWidth, maxHeight) {
    console.debug(maxWidth, maxHeight, this.width, this.height)

    if (maxWidth <= this.width && maxHeight <= this.height) {
      console.debug('Framebuffer resize: Ignoring')
      return true
    }

    const isNew = this.width === undefined

    if (isNew) {
      console.debug('Framebuffer resize: New')

      this.framebuffer = gl.createFramebuffer()
      this.framebufferHalf = gl.createFramebuffer()
      this.framebufferQuarter = gl.createFramebuffer()
      this.framebufferEighth = gl.createFramebuffer()
    } else {
      console.debug('Framebuffer resize: Resizing')

      gl.deleteTexture(this.textureHdr)
      gl.deleteTexture(this.textureHDRHalf)
      gl.deleteTexture(this.textureHDRQuarter)
      gl.deleteTexture(this.textureHDREighth)
      gl.deleteTexture(this.textureDepth)
    }

    this.textureHdr = gl.createTexture()
    this.textureHDRHalf = gl.createTexture()
    this.textureHDRQuarter = gl.createTexture()
    this.textureHDREighth = gl.createTexture()
    this.textureDepth = gl.createTexture()

    this.width = maxWidth
    this.height = maxHeight

    gl.bindTexture(gl.TEXTURE_2D, this.textureHdr)
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R11F_G11F_B10F, maxWidth, maxHeight)
    this.setTextureParams(gl, gl.CLAMP_TO_EDGE, gl.LINEAR)

    gl.bindTexture(gl.TEXTURE_2D, this.textureHDRHalf)
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R11F_G11F_B10F, Math.ceil(maxWidth / 2), Math.ceil(maxHeight / 2))
    this.setTextureParams(gl, gl.CLAMP_TO_EDGE, gl.LINEAR)
    
    gl.bindTexture(gl.TEXTURE_2D, this.textureHDRQuarter)
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R11F_G11F_B10F, Math.ceil(maxWidth / 4), Math.ceil(maxHeight / 4))
    this.setTextureParams(gl, gl.CLAMP_TO_EDGE, gl.LINEAR)

    gl.bindTexture(gl.TEXTURE_2D, this.textureHDREighth)
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.R11F_G11F_B10F, Math.ceil(maxWidth / 8), Math.ceil(maxHeight / 8))
    this.setTextureParams(gl, gl.CLAMP_TO_EDGE, gl.LINEAR)
    
    gl.bindTexture(gl.TEXTURE_2D, this.textureDepth)
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, maxWidth, maxHeight)
    this.setTextureParams(gl, gl.CLAMP_TO_EDGE, gl.NEAREST)

    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.framebuffer)
    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureHdr, 0)
    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.textureDepth, 0)
    if (!this.checkFramebufferStatus(gl)) {
      return false
    }
    gl.drawBuffers([gl.COLOR_ATTACHMENT0])

    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.framebufferHalf)
    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureHDRHalf, 0)
    if (!this.checkFramebufferStatus(gl)) {
      return false
    }
    gl.drawBuffers([gl.COLOR_ATTACHMENT0])

    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.framebufferQuarter)
    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureHDRQuarter, 0)
    if (!this.checkFramebufferStatus(gl)) {
      return false
    }
    gl.drawBuffers([gl.COLOR_ATTACHMENT0])

    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.framebufferEighth)
    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureHDREighth, 0)
    if (!this.checkFramebufferStatus(gl)) {
      return false
    }
    gl.drawBuffers([gl.COLOR_ATTACHMENT0])

    return true
  }

  static bind(gl, width, height) {
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.framebuffer)
    gl.viewport(0, 0, width, height)
    gl.scissor(0, 0, width, height)
    gl.enable(gl.SCISSOR_TEST)
  }
}
