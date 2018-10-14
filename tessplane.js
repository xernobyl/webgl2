'use strict'

class TessPlane {
  constructor(res) {
    const t = this.createBuffers(res)
    this.count = t[1].length

    console.log(t)

    this.vao = gl.createVertexArray()
		gl.bindVertexArray(this.vao)

    const vertexOffet = StaticGeometry.addVertices(new Float32Array(t[0]))
    this.elementOffset = StaticGeometry.addElements(new Uint16Array(t[1]))

		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, vertexOffet)
    gl.enableVertexAttribArray(0)
  }

  createBuffers(res) {
    if (res < 1) { res = 1 }

    const n_strips = Math.pow(2, res - 1)
    const edge_length = Math.sqrt(2.0) / Math.pow(3.0, 1.0 / 4.0)
    const line_edge = edge_length / n_strips
    const height = Math.pow(3.0, 1.0 / 4.0) / Math.sqrt(2.0)

    const vertexBuffer = []

    for (let line = 0; line <= n_strips; ++line) {
      const y = 0.5 * height - (line / n_strips) * height
      const n_vertices = line + 1

      for (let i = 0; i < n_vertices; ++i) {
        const x = n_vertices == 1 ? 0.0 : i / (n_vertices - 1) * line_edge * (n_vertices - 1) - 0.5 * line_edge * (n_vertices - 1)
        vertexBuffer.push(x, y)
      }
    }

    let ie0 = 0
    let ie1 = 1
    const indexBuffer = []

    for (let line = 0; line < n_strips; ++line) {
      const n_triangles = line * 2 + 1

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
		gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, this.elementOffset)
  }
}
