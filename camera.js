'use strict'

class Camera {
	constructor(fov = Math.PI / 2.0, aspect = 1.0, near = 0.1, far = Infinity) {
		this.fov = fov
		this.aspect = aspect
		this.near = near
		this.far = far

		this.view = new Mat4()
		this.updateProjection()
	}

	lookAt(position, target, up) {
		this.view = Mat4.lookAt(position, target, up)
	}

	updateProjection() {
		if (this.far == Infinity)
			this.projection = Mat4.projectionInf(this.fov, this.aspect, this.near)
		else
			this.projection = Mat4.projection(this.fov, this.aspect, this.near, this.far)
	}
	
	update() {
		this.mvp = Mat4.mul(this.projection, this.view)
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
