'use strict'

const staticGeometry = {
	add: function(id, data) {
		const SIZE_IN_MB = 16

		if (!this.vbo) {
			this.indexData = {}
			this.vbo = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
			gl.bufferData(gl.ARRAY_BUFFER, SIZE_IN_MB * 1048576, gl.STATIC_DRAW)
			this.lastOffset = 0
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
		gl.bufferSubData(gl.ARRAY_BUFFER, this.lastOffset, data)

		this.indexData[id] = {
			offset: this.lastOffset,
			size: data.byteLength
		}

		this.lastOffet += data.byteLength

		return this.indexData[id]
	},

	get: function(id) {
		return this.indexData[id]
	},

	bind: function() {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
	}
}
