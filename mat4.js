'use strict'

class Mat4 {
	constructor() {
		this.mat = new Float64Buffer(4 * 4)
		this.mat[0 + 0 * 4] = 1.0
		this.mat[1 + 0 * 4] = 0.0
		this.mat[2 + 0 * 4] = 0.0
		this.mat[3 + 0 * 4] = 0.0

		this.mat[0 + 1 * 4] = 0.0
		this.mat[1 + 1 * 4] = 1.0
		this.mat[2 + 1 * 4] = 0.0
		this.mat[3 + 1 * 4] = 0.0

		this.mat[0 + 2 * 4] = 0.0
		this.mat[1 + 2 * 4] = 0.0
		this.mat[2 + 2 * 4] = 1.0
		this.mat[3 + 2 * 4] = 0.0

		this.mat[0 + 3 * 4] = 0.0
		this.mat[1 + 3 * 4] = 0.0
		this.mat[2 + 3 * 4] = 0.0
		this.mat[3 + 3 * 4] = 1.0
	}

	static projection(fov, ar) {
		
	}
}
