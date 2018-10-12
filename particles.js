'use strict'

class Particles {
	constructor(nParticles) {
		this.nParticles = nParticles
		let buffer = new Float32Array(nParticles * 6)	// position + velocity

		for (let i = 1; i <= nParticles; ++i) {

			let theta = Math.random() * Math.PI * 2.0
			let phi = Math.acos(2.0 * Math.random() - 1.0)
			let r = Math.pow(1.0 - Math.random(), 1.0 / 3.0)

			let bi = (i - 1) * 6

			buffer[bi + 0] = Math.random() * 2.0 - 1.0	// r * Math.cos(theta) * Math.sin(phi)
			buffer[bi + 1] = Math.random() * 2.0 - 1.0	// r * Math.sin(theta) * Math.sin(phi)
			buffer[bi + 2] = Math.random() * 2.0 - 1.0	// r * Math.cos(phi)

			const velocity = vec3.fromValues(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0)

			buffer[bi + 3] = velocity[0]
			buffer[bi + 4] = velocity[1]
			buffer[bi + 5] = velocity[2]
		}

		this.vbo = gl.createBuffer()
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo)
		gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.DYNAMIC_COPY)

		this.vao = gl.createVertexArray()
		gl.bindVertexArray(this.vao)
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0)
		gl.enableVertexAttribArray(0)
		gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12)
		gl.enableVertexAttribArray(1)
	}

	draw() {
		gl.bindVertexArray(this.vao)
		gl.drawArrays(gl.POINTS, 0, this.nParticles)
	}
}
