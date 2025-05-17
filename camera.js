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
  #mvp
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
    this.#mvp = mat4.create()
    this.#view = mat4.create()
    this.#inverseView = mat4.create()
  }

  set aspect(aspect) {
    this.#aspect = aspect
    this.#fovy = Math.sqrt(this.#fov * this.#fov / (1.0 + aspect * aspect))
  }

  set fov(fov) {
    this.#fov = fov
    this.#fovy = Math.sqrt(this.#fov * this.#fov / (1.0 + this.#aspect * this.#aspect))
  }

  get projection() {
    return this.#projection
  }
  
  get mvp() {
    return this.#mvp
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
    mat4.perspective(this.#projection, this.#fovy, this.#aspect, this.#near, this.#far)

    if (this.#jitterX !== 0 || this.#jitterY !== 0) {
      this.#projection[8] += this.#jitterX * 2.0
      this.#projection[9] += this.#jitterY * 2.0
    }
  }

  update() {
    mat4.multiply(this.#mvp, this.#projection, this.#view)
  }

  set focalLength(mm) {
    //const halfImageCircle = 21.633307652783937  // full frame - 36 * 24 mm
    const halfImageCircle = 14.282944374322822  // super 35 film - 24.9 * 14 mm
    const fieldOfView = 2.0 * Math.atan2(mm, halfImageCircle)
    const verticalFieldOfView = fieldOfView * fieldOfView / (1.0 + this.aspect * this.aspect)
    
    this.#fov = fieldOfView
    this.#fovy = verticalFieldOfView
  }
}
