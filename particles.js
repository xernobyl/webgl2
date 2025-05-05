import { vec3 } from './gl-matrix/index.js'

export class Particles {
  constructor(gl, nParticles) {
    this.nParticles = nParticles
    const buffer = new Float32Array(nParticles * 6)	// position + velocity

    for (let i = 1; i <= nParticles; ++i) {
      /*
      const theta = Math.random() * Math.PI * 2.0
      const phi = Math.acos(2.0 * Math.random() - 1.0)
      const r = Math.pow(1.0 - Math.random(), 1.0 / 3.0)
      */

      const bi = (i - 1) * 6

      buffer[bi + 0] = Math.random() * 2.0 - 1.0	// r * Math.cos(theta) * Math.sin(phi)
      buffer[bi + 1] = Math.random() * 2.0 - 1.0	// r * Math.sin(theta) * Math.sin(phi)
      buffer[bi + 2] = Math.random() * 2.0 - 1.0	// r * Math.cos(phi)

      const velocity = vec3.fromValues(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0)

      const [vx, vy, vz] = velocity
      buffer[bi + 3] = vx
      buffer[bi + 4] = vy
      buffer[bi + 5] = vz
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

  draw(gl) {
    gl.bindVertexArray(this.vao)
    gl.drawArrays(gl.POINTS, 0, this.nParticles)
  }
}
