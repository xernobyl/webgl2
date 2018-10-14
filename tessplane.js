'use strict'

class TessPlane {
  constructor(res) {
    const t = this.createBuffers(res)

    const vertexBuffer = new Float32Array(t[0])
    const indicesBuffer = new Uint16Array(t[1])

		this.vao = gl.createVertexArray()
		gl.bindVertexArray(this.vao)

    const vertexOffet = StaticGeometry.addVertices(vertexBuffer)
    this.elementOffset = StaticGeometry.addElements(indicesBuffer)

		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, vertexOffet + 0)
    gl.enableVertexAttribArray(0)
  }

  createBuffers(res) {
    if (res < 1) { res = 1 }

    const l = Math.sqrt(2.0) / Math.pow(3.0, 1.0 / 4.0)
    const h = Math.pow(3.0, 1.0 / 4.0) / Math.sqrt(2.0) / 2.0
    const n_strips = Math.pow(2, res - 1)

    // const line_h = h / n_strips
    const line_l = l / n_strips

    const vertexBuffer = []
    const indexBuffer = []

    // push vertices
    for (let line = 0; line <= n_strips; ++line) {
      const y = h - 2.0 * h * line / n_strips
      const n_vertices = line + 1

      for (let i = 0; i < n_vertices; ++i) {
        const x = n_vertices == 1 ? 0.0 : i / (n_vertices - 1) * line_l / (n_vertices - 1) - 0.5 * line_l / (n_vertices - 1)
        vertexBuffer.push(x, y)
      }
    }

    this.count = 0

    let ie0 = 0
    let ie1 = 1

    for (let line = 0; line < n_strips; ++line) {
      const n_triangles = line * 2 + 1
      this.count += n_triangles * 3

      for (let triangle = 0; triangle < n_triangles; ++triangle) {
        if (triangle & 1) {
          indexBuffer.push(ie1, ie0, ie0 - 1)
        }
        else {
          indexBuffer.push(ie0, ie1, ie1 + 1)
          ++ie0
          ++ie1
        }
      }

      ++ie1
    }

    return [vertexBuffer, indexBuffer]
  }

  draw() {
		gl.bindVertexArray(this.vao)
		gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_BYTE, this.elementOffset)
  }
}
