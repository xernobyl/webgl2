'use strict'

const staticGeometry = {
	addVertices: function(data) {
		const SIZE_IN_MB = 16

		if (this.vbo === undefined) {
			this.vbo = gl.createBuffer()
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
			gl.bufferData(gl.ARRAY_BUFFER, SIZE_IN_MB * 1048576, gl.STATIC_DRAW)
			this.lastOffset = 0
		}
		else {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
		}

		gl.bufferSubData(gl.ARRAY_BUFFER, this.lastOffset, data)

		let offset = this.lastOffset
		this.lastOffset += data.byteLength

		if (SIZE_IN_MB * 1048576 < this.lastOffset)
			console.log('WARNING: INCREASE MAX SIZE TO ' + this.lastOffset)

		return offset
	},

	bindVertices: function() {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
	},

	addElements: function(data) {
		const ELEMENT_SIZE_IN_MB = 2
				
		if (this.ebo === undefined) {
			this.ebo = gl.createBuffer()
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo)
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ELEMENT_SIZE_IN_MB * 1048576, gl.STATIC_DRAW)
			this.lastElementOffset = 0
		}
		else {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo)
		}

		gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, this.lastElementOffset, data)

		let offset = this.lastElementOffset
		this.lastElementOffset += data.byteLength

		if (ELEMENT_SIZE_IN_MB * 1048576 < this.lastElementOffset)
			console.log('WARNING: INCREASE MAX SIZE TO ' + this.lastElementOffset)

		return offset
	},

	bindElements: function() {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo)
	},
}
