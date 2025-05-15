import { mat4 } from './gl-matrix/index.js'

export class Camera {
  #jitterX
  #jitterY
  
  constructor(fov = Math.PI / 2.0, aspect = 1.0, near = 0.1, far = Infinity) {
    this.fov = fov
    this.aspect = aspect
    this.near = near
    this.far = far
      
    this.#jitterX = 0
    this.#jitterY = 0

    this.projection = mat4.create()
    this.mvp = mat4.create()
    this.view = mat4.create()
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
    mat4.lookAt(this.view, position, target, up)
  }

  updateProjection() {
    mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far)

    if (this.#jitterX !== 0 || this.#jitterY !== 0) {
      this.projection[8] += this.#jitterX * 2.0 // Column 2, row 0 (x)
      this.projection[9] += this.#jitterY * 2.0 // Column 2, row 1 (y)
    }
  }

  update() {
    mat4.multiply(this.mvp, this.projection, this.view)
  }

  /*set focalLength(mm) {
    //const half_image_circle = 21.633307652783937  // full frame - 36 * 24 mm
    const half_image_circle = 14.282944374322822  // super 35 film - 24.9 * 14 mm
    let field_of_view = 2.0 * Math.atan2(mm, half_image_circle)
    let vertical_field_of_view = field_of_view * field_of_view / (1.0 + this.aspect * this.aspect)
    let horizontal_field_of_view = this.aspect * vertical_field_of_view

    this.fov = vertical_field_of_view
  }*/

  /*get fov() {

  }

  set fov(fov) {

  }

  set aspect(aspect) {

  }

  get aspect() {

  }

  get near() {
    return near
  }

  set near(near) {
    this.near = near
  }*/
}
