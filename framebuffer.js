export class Framebuffer {
  static init(gl, maxWidth, maxHeight) {
    if (maxWidth <= this.width || maxHeight <= this.height) {
      return
    }

    const isNew = !this.width

    if (isNew) {
      this.textureHdr = gl.createTexture()
      this.textureDepth = gl.createTexture()
      this.framebuffer = gl.createFramebuffer()
    }

    this.width = maxWidth
    this.height = maxHeight

    gl.bindTexture(gl.TEXTURE_2D, this.textureHdr)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R11F_G11F_B10F, maxWidth, maxHeight, 0, gl.RGB, gl.FLOAT, null)
    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, maxWidth, maxHeight, 0, gl.RGBA, gl.FLOAT, null)
    if (isNew) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    }

    gl.bindTexture(gl.TEXTURE_2D, this.textureDepth)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, maxWidth, maxHeight, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null)
    if (isNew) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    }

    if (isNew) {
      gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.framebuffer)
      gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textureHdr, 0)
      gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.textureDepth, 0)
    }

    //gl.drawBuffers([gl.COLOR_ATTACHMENT0])
    //gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

    switch (gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER)) {
      case gl.DRAW_FRAMEBUFFER_COMPLETE:
        console.log('FRAMEBUFFER_COMPLETE')
        break

      case gl.DRAW_FRAMEBUFFER_UNSUPPORTED:
        console.log('FRAMEBUFFER_UNSUPPORTED')
        break

      case gl.DRAW_FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
        console.log('FRAMEBUFFER_INCOMPLETE_ATTACHMENT')
        break

      case gl.DRAW_FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
        console.log('FRAMEBUFFER_INCOMPLETE_DIMENSIONS')
        break

      case gl.DRAW_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
        console.log('FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT')
        break
    }

    //gl.bindTexture(gl.TEXTURE_2D, null)
    //gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null)
  }

  static bind(gl) {
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.framebuffer)
    gl.drawBuffers([gl.COLOR_ATTACHMENT0])	// needed?
    gl.viewport(0.0, 0.0, this.width, this.height)
  }
}
