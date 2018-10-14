'use strict'

class Quad {
	static init() {
		const fullScreenTriangle = [
			0, 127,
			-127, -2,
			127, -2
		]

		this.vao = gl.createVertexArray()
		gl.bindVertexArray(this.vao)

		let offset = StaticGeometry.addVertices(new Int8Array(fullScreenTriangle))

		gl.vertexAttribPointer(0, 2, gl.BYTE, false, 0, offset)
		gl.enableVertexAttribArray(0)
	}

	static draw() {
		gl.bindVertexArray(this.vao)
		gl.drawArrays(gl.TRIANGLES, 0, 3)
	}
}
