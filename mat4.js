'use strict'

class Mat4 extends Float32Array{
	constructor(
		c0l0 = 1.0, c0l1 = 0.0, c0l2 = 0.0, c0l3 = 0.0,
		c1l0 = 0.0, c1l1 = 1.0, c1l2 = 0.0, c1l3 = 0.0,
		c2l0 = 0.0, c2l1 = 0.0, c2l2 = 1.0, c2l3 = 0.0,
		c3l0 = 0.0, c3l1 = 0.0, c3l2 = 0.0, c3l3 = 1.0) {
		super(16)
		this[0] = c0l0
		this[1] = c0l1
		this[2] = c0l2
		this[3] = c0l3

		this[4] = c1l0
		this[5] = c1l1
		this[6] = c1l2
		this[7] = c1l3

		this[8] = c2l0
		this[9] = c2l1
		this[10] = c2l2
		this[11] = c2l3

		this[12] = c3l0
		this[13] = c3l1
		this[14] = c3l2
		this[15] = c3l3
	}

	print() {
		console.log(this[0], this[4], this[8], this[12])
		console.log(this[1], this[5], this[9], this[13])
		console.log(this[2], this[6], this[10], this[14])
		console.log(this[3], this[7], this[11], this[15])
	}

	printTransposed() {
		console.log(this[0], this[1], this[2], this[3])
		console.log(this[4], this[5], this[6], this[7])
		console.log(this[8], this[9], this[10], this[11])
		console.log(this[12], this[13], this[14], this[15])
	}

	static projection(fov, aspect, near, far) {
		let f = 1.0 / Math.tan(fov / 2.0)
		console.log(f)
		console.log(aspect)
		console.log(f / aspect)
		let nf = 1.0 / (near - far)

		return new Mat4(
			f / aspect, 0.0, 0.0, 0.0,
			0.0, f, 0.0, 0.0,
			0.0, 0.0, (far + near) * nf, -1.0,
			0.0, 0.0, 2.0 * far * near * nf, 0.0
		)
	}

	static projectionInf(fov, aspect, near) {
		let f = 1.0 / Math.tan(fov / 2.0)
		let nf = 1.0 / (near - far)

		return new Mat4(
			f / aspect, 0.0, 0.0, 0.0,
			0.0, f, 0.0, 0.0,
			0.0, 0.0, -1.0, -1.0,
			0.0, 0.0, -2.0 * near, 0.0
		)
	}

	static mul(a, b) {
    return new Mat4(
			b[ 0] * a[ 0] + b[ 1] * a[ 4] + b[ 2] * a[ 8] + b[ 3] * a[12],
			b[ 0] * a[ 1] + b[ 1] * a[ 5] + b[ 2] * a[ 9] + b[ 3] * a[13],
			b[ 0] * a[ 2] + b[ 1] * a[ 6] + b[ 2] * a[10] + b[ 3] * a[14],
			b[ 0] * a[ 3] + b[ 1] * a[ 7] + b[ 2] * a[11] + b[ 3] * a[15],

			b[ 4] * a[ 0] + b[ 5] * a[ 4] + b[ 6] * a[ 8] + b[ 7] * a[12],
			b[ 4] * a[ 1] + b[ 5] * a[ 5] + b[ 6] * a[ 9] + b[ 7] * a[13],
			b[ 4] * a[ 2] + b[ 5] * a[ 6] + b[ 6] * a[10] + b[ 7] * a[14],
			b[ 4] * a[ 3] + b[ 5] * a[ 7] + b[ 6] * a[11] + b[ 7] * a[15],

			b[ 8] * a[ 0] + b[ 9] * a[ 4] + b[10] * a[ 8] + b[11] * a[12],
			b[ 8] * a[ 1] + b[ 9] * a[ 5] + b[10] * a[ 9] + b[11] * a[13],
			b[ 8] * a[ 2] + b[ 9] * a[ 6] + b[10] * a[10] + b[11] * a[14],
			b[ 8] * a[ 3] + b[ 9] * a[ 7] + b[10] * a[11] + b[11] * a[15],

			b[12] * a[ 0] + b[13] * a[ 4] + b[14] * a[ 8] + b[15] * a[12],
			b[12] * a[ 1] + b[13] * a[ 5] + b[14] * a[ 9] + b[15] * a[13],
			b[12] * a[ 2] + b[13] * a[ 6] + b[14] * a[10] + b[15] * a[14],
			b[12] * a[ 3] + b[13] * a[ 7] + b[14] * a[11] + b[15] * a[15]
		)
	}

	static lookAt(eye, target, up) {
		let f = Vec3.sub(target, eye).normalize()
		let s = Vec3.cross(f, up).normalize()
		let u = Vec3.cross(s, f)

		return new Mat4(
			s.x, u.x, -f.x, 0.0,
			s.y, u.y, -f.y, 0.0,
			s.z, u.z, -f.z, 0.0,
			-Vec3.dot(s, eye), -Vec3.dot(u, eye), Vec3.dot(f, eye), 1.0
		)
	}

	static translate(pos) {
		return new Mat4(
			1.0, 0.0, 0.0, 0.0,
			0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 1.0, 0.0,
			pos.x, pos.y, pos.z, 1.0
		)

		/*return new Mat4(
			1.0, 0.0, 0.0, pos.x,
			0.0, 1.0, 0.0, pos.y,
			0.0, 0.0, 1.0, pos.z,
			0.0, 0.0, 0.0, 1.0
		)*/
	}
}
