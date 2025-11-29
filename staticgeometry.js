import { GL } from './gl.js'

export class StaticGeometry {
  static #vbo
  static #ebo
  static #lastOffset = 0
  static #lastElementOffset = 0
  static #vboCapacity = 16 * 1048576  // Default 16MB
  static #eboCapacity = 2 * 1048576   // Default 2MB

  static get vboSize() { return this.#vboCapacity }
  static get eboSize() { return this.#eboCapacity }

  static #resizeBuffer(target, newCapacity) {
    const isVBO = target === GL.gl.ARRAY_BUFFER
    const currentBuffer = isVBO ? this.#vbo : this.#ebo
    const currentDataSize = isVBO ? this.#lastOffset : this.#lastElementOffset

    if (newCapacity < currentDataSize) {
      throw new Error(`New ${isVBO ? 'VBO' : 'EBO'} capacity (${newCapacity} bytes) ` +
                          `is smaller than existing data (${currentDataSize} bytes)`)
    }

    console.log(`Resizing ${isVBO ? 'VBO' : 'EBO'} from ${isVBO ? this.#vboCapacity : this.#eboCapacity} ` +
                   `to ${newCapacity} bytes`)

    // Create new buffer with the new capacity
    const newBuffer = GL.gl.createBuffer()
    GL.gl.bindBuffer(target, newBuffer)
    GL.gl.bufferData(target, newCapacity, GL.gl.STATIC_DRAW)

    // Copy existing data if needed
    if (currentBuffer && currentDataSize > 0) {
      GL.gl.bindBuffer(GL.gl.COPY_READ_BUFFER, currentBuffer)
      GL.gl.bindBuffer(GL.gl.COPY_WRITE_BUFFER, newBuffer)
      GL.gl.copyBufferSubData(
        GL.gl.COPY_READ_BUFFER,
        GL.gl.COPY_WRITE_BUFFER,
        0,
        0,
        currentDataSize
      )

      // Delete the old buffer
      GL.gl.deleteBuffer(currentBuffer)
    }

    // Update references
    if (isVBO) {
      this.#vbo = newBuffer
      this.#vboCapacity = newCapacity
    } else {
      this.#ebo = newBuffer
      this.#eboCapacity = newCapacity
    }
  }

  static addVertices(data) {
    // Initialize buffer if needed
    if (!this.#vbo) {
      this.#vbo = GL.gl.createBuffer()
      GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, this.#vbo)
      GL.gl.bufferData(GL.gl.ARRAY_BUFFER, this.#vboCapacity, GL.gl.STATIC_DRAW)
      this.#lastOffset = 0
    }

    // Calculate aligned offset
    const alignment = data.byteLength / data.length
    this.#lastOffset = Math.ceil(this.#lastOffset / alignment) * alignment

    // Check if resize is needed
    const requiredSize = this.#lastOffset + data.byteLength
    if (requiredSize > this.#vboCapacity) {
      const newCapacity = Math.max(
        this.#vboCapacity * 2,  // Double strategy
        Math.ceil(requiredSize / 1048576) * 1048576  // MB-aligned
      )
      this.#resizeBuffer(GL.gl.ARRAY_BUFFER, newCapacity)
    }

    // Upload data
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, this.#vbo)
    GL.gl.bufferSubData(GL.gl.ARRAY_BUFFER, this.#lastOffset, data)

    const offset = this.#lastOffset
    this.#lastOffset += data.byteLength
    return offset
  }

  static addElements(data) {
    // Initialize buffer if needed
    if (!this.#ebo) {
      this.#ebo = GL.gl.createBuffer()
      GL.gl.bindBuffer(GL.gl.ELEMENT_ARRAY_BUFFER, this.#ebo)
      GL.gl.bufferData(GL.gl.ELEMENT_ARRAY_BUFFER, this.#eboCapacity, GL.gl.STATIC_DRAW)
      this.#lastElementOffset = 0
    }

    // Calculate aligned offset
    const alignment = data.byteLength / data.length
    this.#lastElementOffset = Math.ceil(this.#lastElementOffset / alignment) * alignment

    // Check if resize is needed
    const requiredSize = this.#lastElementOffset + data.byteLength
    if (requiredSize > this.#eboCapacity) {
      const newCapacity = Math.max(
        this.#eboCapacity * 2,  // Double strategy
        Math.ceil(requiredSize / 1048576) * 1048576  // MB-aligned
      )
      this.#resizeBuffer(GL.gl.ELEMENT_ARRAY_BUFFER, newCapacity)
    }

    // Upload data
    GL.gl.bindBuffer(GL.gl.ELEMENT_ARRAY_BUFFER, this.#ebo)
    GL.gl.bufferSubData(GL.gl.ELEMENT_ARRAY_BUFFER, this.#lastElementOffset, data)

    const offset = this.#lastElementOffset
    this.#lastElementOffset += data.byteLength
    return offset
  }

  static bindVertices() {
    if (!this.#vbo) {throw new Error('VBO not initialized')}
    GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, this.#vbo)
  }

  static bindElements() {
    if (!this.#ebo) {throw new Error('EBO not initialized')}
    GL.gl.bindBuffer(GL.gl.ELEMENT_ARRAY_BUFFER, this.#ebo)
  }

  // Manual resize methods
  static resizeVBO(newSizeMB) {
    if (newSizeMB <= 0) {throw new RangeError('Size must be positive')}
    this.#resizeBuffer(GL.gl.ARRAY_BUFFER, newSizeMB * 1048576)
  }

  static resizeEBO(newSizeMB) {
    if (newSizeMB <= 0) {throw new RangeError('Size must be positive')}
    this.#resizeBuffer(GL.gl.ELEMENT_ARRAY_BUFFER, newSizeMB * 1048576)
  }
}
