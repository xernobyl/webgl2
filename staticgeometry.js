import { GL } from './gl.js'

export class StaticGeometry {
  static addVertices(data) {
    const SIZE_IN_MB = 16

    if (this.vbo === undefined) {
      this.vbo = GL.gl.createBuffer()
      GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, this.vbo)
      GL.gl.bufferData(GL.gl.ARRAY_BUFFER, SIZE_IN_MB * 1048576, GL.gl.STATIC_DRAW)
      this.lastOffset = 0
    }
    else {
      GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, this.vbo)

      console.log('before alignment', this.lastOffset)
      const alignment = data.byteLength / data.length
      this.lastOffset = Math.ceil(this.lastOffset / alignment) * alignment
      console.log('after alignment', this.lastOffset)
    }

    GL.gl.bufferSubData(GL.gl.ARRAY_BUFFER, this.lastOffset, data)

    const offset = this.lastOffset
    this.lastOffset += data.byteLength

    if (SIZE_IN_MB * 1048576 < this.lastOffset) {
      console.log(`WARNING: INCREASE MAX SIZE TO ${this.lastOffset}`)
    }

    return offset
  }

  static bindVertices() {
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, this.vbo)
  }

  static addElements(data) {
    const ELEMENT_SIZE_IN_MB = 2

    if (this.ebo === undefined) {
      this.ebo = GL.gl.createBuffer()
      GL.gl.bindBuffer(GL.gl.ELEMENT_ARRAY_BUFFER, this.ebo)
      GL.gl.bufferData(GL.gl.ELEMENT_ARRAY_BUFFER, ELEMENT_SIZE_IN_MB * 1048576, GL.gl.STATIC_DRAW)
      this.lastElementOffset = 0
    }
    else {
      GL.gl.bindBuffer(GL.gl.ELEMENT_ARRAY_BUFFER, this.ebo)

      console.log('before alignment', this.lastElementOffset)
      const alignment = data.byteLength / data.length
      this.lastElementOffset = Math.ceil(this.lastElementOffset / alignment) * alignment
      console.log('after alignment', this.lastElementOffset)
    }

    GL.gl.bufferSubData(GL.gl.ELEMENT_ARRAY_BUFFER, this.lastElementOffset, data)

    const offset = this.lastElementOffset
    this.lastElementOffset += data.byteLength

    if (ELEMENT_SIZE_IN_MB * 1048576 < this.lastElementOffset) {
      console.log(`WARNING: INCREASE MAX SIZE TO ${this.lastElementOffset}`)
    }

    return offset
  }

  static bindElements() {
    GL.gl.bindBuffer(GL.gl.ELEMENT_ARRAY_BUFFER, this.ebo)
  }
}
