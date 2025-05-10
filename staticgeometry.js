import { GL } from './gl.js'

export class StaticGeometry {
  static #vbo
  static #ebo
  static #lastOffset
  static #lastElementOffset
  
  static addVertices(data) {
    const SIZE_IN_MB = 16

    if (StaticGeometry.#vbo === undefined) {
      StaticGeometry.#vbo = GL.gl.createBuffer()
      GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, StaticGeometry.#vbo)
      GL.gl.bufferData(GL.gl.ARRAY_BUFFER, SIZE_IN_MB * 1048576, GL.gl.STATIC_DRAW)
      StaticGeometry.#lastOffset = 0
    }
    else {
      GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, StaticGeometry.#vbo)

      console.log('before alignment', StaticGeometry.#lastOffset)
      const alignment = data.byteLength / data.length
      StaticGeometry.#lastOffset = Math.ceil(StaticGeometry.#lastOffset / alignment) * alignment
      console.log('after alignment', StaticGeometry.#lastOffset)
    }

    GL.gl.bufferSubData(GL.gl.ARRAY_BUFFER, StaticGeometry.#lastOffset, data)

    const offset = StaticGeometry.#lastOffset
    StaticGeometry.#lastOffset += data.byteLength

    if (SIZE_IN_MB * 1048576 < StaticGeometry.#lastOffset) {
      console.log(`WARNING: INCREASE MAX SIZE TO ${StaticGeometry.#lastOffset}`)
    }

    return offset
  }

  static bindVertices() {
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, StaticGeometry.#vbo)
  }

  static addElements(data) {
    const ELEMENT_SIZE_IN_MB = 2

    if (StaticGeometry.#ebo === undefined) {
      StaticGeometry.#ebo = GL.gl.createBuffer()
      GL.gl.bindBuffer(GL.gl.ELEMENT_ARRAY_BUFFER, StaticGeometry.#ebo)
      GL.gl.bufferData(GL.gl.ELEMENT_ARRAY_BUFFER, ELEMENT_SIZE_IN_MB * 1048576, GL.gl.STATIC_DRAW)
      StaticGeometry.#lastElementOffset = 0
    }
    else {
      GL.gl.bindBuffer(GL.gl.ELEMENT_ARRAY_BUFFER, StaticGeometry.#ebo)

      console.log('before alignment', StaticGeometry.#lastElementOffset)
      const alignment = data.byteLength / data.length
      StaticGeometry.#lastElementOffset = Math.ceil(StaticGeometry.#lastElementOffset / alignment) * alignment
      console.log('after alignment', StaticGeometry.#lastElementOffset)
    }

    GL.gl.bufferSubData(GL.gl.ELEMENT_ARRAY_BUFFER, StaticGeometry.#lastElementOffset, data)

    const offset = StaticGeometry.#lastElementOffset
    StaticGeometry.#lastElementOffset += data.byteLength

    if (ELEMENT_SIZE_IN_MB * 1048576 < StaticGeometry.#lastElementOffset) {
      console.log(`WARNING: INCREASE MAX SIZE TO ${StaticGeometry.#lastElementOffset}`)
    }

    return offset
  }

  static bindElements() {
    GL.gl.bindBuffer(GL.gl.ELEMENT_ARRAY_BUFFER, StaticGeometry.#ebo)
  }
}
