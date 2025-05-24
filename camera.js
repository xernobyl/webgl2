import { mat4 } from './gl-matrix/index.js'

export class Camera {
  #jitterX
  #jitterY

  #aspect
  #near
  #far
  #fov
  #fovy

  #projection
  #viewProjection
  #previousViewProjection

  #projectionNoJitter
  #viewProjectionNoJitter
  #previousViewProjectionNoJitter

  #view
  #inverseView

  constructor(fov = Math.PI / 2.0, aspect = 1.0, near = 0.1, far = Infinity) {
    this.#fov = fov
    this.aspect = aspect
    this.#near = near
    this.#far = far

    this.#jitterX = 0
    this.#jitterY = 0

    this.#projection = mat4.create()
    this.#viewProjection = mat4.create()
    this.#projectionNoJitter = mat4.create()
    this.#viewProjectionNoJitter = mat4.create()
    this.#previousViewProjectionNoJitter = mat4.create()
    this.#view = mat4.create()
    this.#inverseView = mat4.create()
    this.#previousViewProjection = mat4.create()
  }

  set aspect(aspect) {
    this.#aspect = aspect
    this.#fovy = 2.0 * Math.atan(Math.tan(this.#fov * 0.5) / Math.sqrt(1.0 + aspect * aspect))
  }

  set fov(fov) {
    this.#fov = fov
    this.#fovy = 2.0 * Math.atan(Math.tan(fov * 0.5) / Math.sqrt(1.0 + this.#aspect * this.#aspect))
  }

  get fov() {
    return this.#fov
  }

  get fovy() {
    return this.#fovy
  }

  get projection() {
    return this.#projection
  }

  get viewProjection() {
    return this.#viewProjection
  }

  get previousViewProjection() {
    return this.#previousViewProjection
  }

  get previousViewProjectionNoJitter() {
    return this.#previousViewProjectionNoJitter
  }

  get view() {
    return this.#view
  }

  get inverseView() {
    return this.#inverseView
  }

  setJitter(x, y) {
    this.#jitterX = x
    this.#jitterY = y
    this.updateProjection()
  }

  clearJitter() {
    this.#jitterX = 0
    this.#jitterY = 0
    this.updateProjection()
  }

  lookAt(position, target, up) {
    mat4.lookAt(this.#view, position, target, up)
    mat4.invert(this.#inverseView, this.#view)
  }

  updateProjection() {
    mat4.perspectiveNO(this.#projection, this.#fovy, this.#aspect, this.#near, this.#far)
    mat4.copy(this.#projectionNoJitter, this.#projection)

    if (this.#jitterX !== 0 || this.#jitterY !== 0) {
      this.#projection[8] += this.#jitterX * 2.0
      this.#projection[9] += this.#jitterY * 2.0
    }
  }

  update() {
    mat4.copy(this.#previousViewProjection, this.#viewProjection)
    mat4.copy(this.#previousViewProjectionNoJitter, this.#viewProjectionNoJitter)

    mat4.multiply(this.#viewProjection, this.#projection, this.#view)
    mat4.multiply(this.#viewProjectionNoJitter, this.#projectionNoJitter, this.#view)
  }
}
