'use strict'

const framebuffer = {
	init: (maxWidth = 1920, maxHeight = 1080) => {
		framebuffer.width = maxWidth
		framebuffer.height = maxHeight
		
		if (framebuffer.tex) {
			gl.deleteFramebuffer(framebuffer.framebuffer)
			gl.deleteTexture(framebuffer.tex[1])
			gl.deleteTexture(framebuffer.tex[0])
		}

		framebuffer.tex = []
		
		framebuffer.tex[0] = gl.createTexture()
		gl.bindTexture(gl.TEXTURE_2D, framebuffer.tex[0])
		//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB10_A2, maxWidth, maxHeight, 0, gl.RGBA, gl.UNSIGNED_INT_2_10_10_10_REV, null)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, maxWidth, maxHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
		//gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB16F, maxWidth, maxHeight, 0, gl.RGB, gl.HALF_FLOAT, null)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

		framebuffer.tex[1] = gl.createTexture()
		gl.bindTexture(gl.TEXTURE_2D, framebuffer.tex[1])
		//gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH32F_STENCIL8, maxWidth, maxHeight, 0, gl.DEPTH_STENCIL, gl.FLOAT_32_UNSIGNED_INT_24_8_REV, null)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, maxWidth, maxHeight, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

		framebuffer.framebuffer = gl.createFramebuffer()
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer)
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.tex[0], 0)
		//gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.TEXTURE_2D, framebuffer.tex[1], 0)
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, framebuffer.tex[1], 0)

		gl.drawBuffers([gl.COLOR_ATTACHMENT0])
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)

		switch (gl.checkFramebufferStatus(gl.FRAMEBUFFER)) {
			case gl.FRAMEBUFFER_COMPLETE:
				console.log('FRAMEBUFFER_COMPLETE')
				break

			case gl.FRAMEBUFFER_UNSUPPORTED:
				console.log('FRAMEBUFFER_UNSUPPORTED')
				break

			case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
				console.log('FRAMEBUFFER_INCOMPLETE_ATTACHMENT')
				break

			case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
				console.log('FRAMEBUFFER_INCOMPLETE_DIMENSIONS')
				break

			case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
				console.log('FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT')
				break
		}

		gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	},

	bind: () => {
		gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer)
		gl.drawBuffers([gl.COLOR_ATTACHMENT0])	// needed?
		gl.viewport(0.0, 0.0, framebuffer.width, framebuffer.height)
	}
}
