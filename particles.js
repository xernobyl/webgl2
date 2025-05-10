import { GL } from './gl.js'
import { vec3 } from './gl-matrix/index.js'

export class Particles {
  constructor(nParticles) {
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

    this.vbo = GL.gl.createBuffer()
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, this.vbo)
    GL.gl.bufferData(GL.gl.ARRAY_BUFFER, buffer, GL.gl.DYNAMIC_COPY)

    this.vao = GL.gl.createVertexArray()
    GL.gl.bindVertexArray(this.vao)
    GL.gl.vertexAttribPointer(0, 3, GL.gl.FLOAT, false, 24, 0)
    GL.gl.enableVertexAttribArray(0)
    GL.gl.vertexAttribPointer(1, 3, GL.gl.FLOAT, false, 24, 12)
    GL.gl.enableVertexAttribArray(1)
  }

  draw() {
    GL.gl.bindVertexArray(this.vao)
    GL.gl.drawArrays(GL.gl.POINTS, 0, this.nParticles)
  }
}
