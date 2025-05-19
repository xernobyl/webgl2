import { GL } from './gl.js'

export class TextureBindingManager {
  static #maxUnits = 0
  static #units = []
  static #textureToUnit = new Map()
  static #frameCounter = 0

  static init() {
    this.#maxUnits = GL.gl.getParameter(GL.gl.MAX_TEXTURE_IMAGE_UNITS)
    this.#units = Array.from({ length: this.#maxUnits }, () => ({
      texture: null,
      locked: false,
      lastUsed: 0
    }))
    this.#textureToUnit.clear()
    this.#frameCounter = 0
  }

  static lock(texture, unit) {
    const { gl } = this
    if (unit >= this.#maxUnits) {throw new Error('Unit exceeds max texture units')}

    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    this.#units[unit] = {
      texture,
      locked: true,
      lastUsed: ++this.#frameCounter
    }
    this.#textureToUnit.set(texture, unit)
  }

  static unlock(texture) {
    const unit = this.#textureToUnit.get(texture)
    if (unit === undefined) {return}
    if (!this.#units[unit].locked) {return}

    this.#units[unit].locked = false
  }

  static bind(texture) {
    const { gl } = this

    // Already bound
    if (this.#textureToUnit.has(texture)) {
      const unit = this.#textureToUnit.get(texture)
      this.#units[unit].lastUsed = ++this.#frameCounter
      gl.activeTexture(gl.TEXTURE0 + unit)
      return unit
    }

    // Find least recently used, unlocked unit
    let bestUnit = -1
    let oldest = Infinity

    for (let i = 0; i < this.#maxUnits; i++) {
      const unit = this.#units[i]
      if (!unit.locked && (unit.texture === null || unit.lastUsed < oldest)) {
        oldest = unit.lastUsed
        bestUnit = i
      }
    }

    if (bestUnit === -1) {
      throw new Error('No available texture units to bind.')
    }

    const replacedTexture = this.#units[bestUnit].texture
    if (replacedTexture) {
      this.#textureToUnit.delete(replacedTexture)
    }

    gl.activeTexture(gl.TEXTURE0 + bestUnit)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    this.#units[bestUnit] = {
      texture,
      locked: false,
      lastUsed: ++this.#frameCounter
    }
    this.#textureToUnit.set(texture, bestUnit)

    return bestUnit
  }

  static unbindAllUnlocked() {
    const { gl } = this

    for (let i = 0; i < this.#maxUnits; i++) {
      const unit = this.#units[i]
      if (!unit.locked && unit.texture !== null) {
        gl.activeTexture(gl.TEXTURE0 + i)
        gl.bindTexture(gl.TEXTURE_2D, null)
        this.#textureToUnit.delete(unit.texture)
        this.#units[i] = {
          texture: null,
          locked: false,
          lastUsed: 0
        }
      }
    }
  }

  static reset() {
    this.#textureToUnit.clear()
    for (let i = 0; i < this.#maxUnits; i++) {
      this.#units[i] = {
        texture: null,
        locked: false,
        lastUsed: 0
      }
    }
  }
}
