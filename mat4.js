'use strict'

class Mat4 {
	constructor(
		m00 = 1.0, m10 = 0.0, m20 = 0.0, m30 = 0.0,
		m01 = 0.0, m11 = 1.0, m21 = 0.0, m31 = 0.0,
		m02 = 0.0, m12 = 0.0, m22 = 1.0, m32 = 0.0,
		m03 = 0.0, m13 = 0.0, m23 = 0.0, m33 = 1.0) {
		this.mat = new Float32Array(4 * 4)
		this.mat[0] = m00
		this.mat[1] = m10
		this.mat[2] = m20
		this.mat[3] = m30

		this.mat[4] = m01
		this.mat[5] = m11
		this.mat[6] = m21
		this.mat[7] = m31

		this.mat[8] = m02
		this.mat[9] = m12
		this.mat[10] = m22
		this.mat[11] = m32

		this.mat[12] = m03
		this.mat[13] = m13
		this.mat[14] = m23
		this.mat[15] = m33
	}

	static projection(fov, aspect, near, far) {
		let f = 1.0 / Math.tan(fov / 2.0)
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
