import { GL } from './gl.js'

import { StaticGeometry } from './staticgeometry.js'

export class Quad {
  static #vao
  
  static init() {
    const fullScreenTriangle = [
      0, 127,
      -127, -2,
      127, -2
    ]

    Quad.#vao = GL.gl.createVertexArray()
    GL.gl.bindVertexArray(Quad.#vao)
    const offset = StaticGeometry.addVertices(GL.gl, new Int8Array(fullScreenTriangle))
    GL.gl.vertexAttribPointer(0, 2, GL.gl.BYTE, false, 0, offset)
    GL.gl.enableVertexAttribArray(0)
  }

  static draw() {
    GL.gl.bindVertexArray(Quad.#vao)
    GL.gl.drawArrays(GL.gl.TRIANGLES, 0, 3)
  }
}
