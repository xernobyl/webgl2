import { GL } from './gl.js'
import { StaticGeometry } from './staticgeometry.js'

export class Cube {
  static #vao
  static #elementOffset

  static init() {
    const vertexBuffer = new Int8Array([
      1,1,1,0,0,1,1,1,-1,1,1,0,0,1,0,1,-1,-1,1,0,0,1,0,0,1,-1,1,0,0,1,1,0,1,1,1,1,0,0,0,1,1,-1,1,1,0,0,0,0,1,-1,-1,1,0,0,1,0,1,1,-1,1,0,0,1,1,1,1,1,0,1,0,1,0,1,1,-1,0,1,0,1,1,-1,1,-1,0,1,0,0,1,-1,1,1,0,1,0,0,0,-1,1,1,-1,0,0,1,1,-1,1,-1,-1,0,0,0,1,-1,-1,-1,-1,0,0,0,0,-1,-1,1,-1,0,0,1,0,-1,-1,-1,0,-1,0,0,0,1,-1,-1,0,-1,0,1,0,1,-1,1,0,-1,0,1,1,-1,-1,1,0,-1,0,0,1,1,-1,-1,0,0,-1,0,0,-1,-1,-1,0,0,-1,1,0,-1,1,-1,0,0,-1,1,1,1,1,-1,0,0,-1,0,1])
    const indicesBuffer = new Uint8Array([
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
      // outlines
      0, 1, 0, 3, 0, 7, 1, 2, 2, 5, 5, 6, 6, 7, 10, 11, 13, 14, 15, 16, 20, 21, 22, 23
    ])

    Cube.#vao = GL.gl.createVertexArray()
    GL.gl.bindVertexArray(Cube.#vao)

    const vertexOffet = StaticGeometry.addVertices(GL.gl, vertexBuffer)
    Cube.#elementOffset = StaticGeometry.addElements(GL.gl, indicesBuffer)

    GL.gl.vertexAttribPointer(0, 3, GL.gl.BYTE, false, 8, vertexOffet + 0)
    GL.gl.enableVertexAttribArray(0)
    GL.gl.vertexAttribPointer(1, 3, GL.gl.BYTE, false, 8, vertexOffet + 3)
    GL.gl.enableVertexAttribArray(1)
    GL.gl.vertexAttribPointer(2, 2, GL.gl.BYTE, false, 8, vertexOffet + 6)
    GL.gl.enableVertexAttribArray(2)
  }

  static draw() {
    GL.gl.bindVertexArray(Cube.#vao)
    GL.gl.drawElements(GL.gl.TRIANGLES, 36, GL.gl.UNSIGNED_BYTE, Cube.#elementOffset)
  }

  static drawOutlines() {
    GL.gl.bindVertexArray(Cube.#vao)
    GL.gl.drawElements(GL.gl.LINES, 24, GL.gl.UNSIGNED_BYTE, Cube.#elementOffset + 36)
  }
}
