'use strict'

class Vec2
{
	constructor(x, y) {
		this.vec = new Float64Array(2)
		this.x = x
		this.y = y
	}

	get x() {
		return this.vec[0]
	}

	get y() {
		return this.vec[1]
	}

	set x(x) {
		this.vec[0] = x
	}

	set y(y) {
		this.vec[1] = y
	}

	get xx() {
		return new Vec2(this.x, this.x)
	}

	get xy() {
		return new Vec2(this.x, this.y)
	}

	get yx() {
		return new Vec2(this.y, this.x)
	}

	get yy() {
		return new Vec2(this.y, this.y)
	}

	get xxx() {
		return new Vec3(this.x, this.x, this.x)
	}

	get xxy() {
		return new Vec3(this.x, this.x, this.y)
	}

	get xyx() {
		return new Vec3(this.x, this.y, this.x)
	}

	get xyy() {
		return new Vec3(this.x, this.y, this.y)
	}

	get yxx() {
		return new Vec3(this.y, this.x, this.x)
	}

	get yxy() {
		return new Vec3(this.y, this.x, this.y)
	}

	get yyx() {
		return new Vec3(this.y, this.y, this.x)
	}

	get yyy() {
		return new Vec3(this.y, this.y, this.y)
	}

	get xxxx() {
		return new Vec4(this.x, this.x, this.x, this.x)
	}

	get xxxy() {
		return new Vec4(this.x, this.x, this.x, this.y)
	}

	get xxyx() {
		return new Vec4(this.x, this.x, this.y, this.x)
	}

	get xxyy() {
		return new Vec4(this.x, this.x, this.y, this.y)
	}

	get xyxx() {
		return new Vec4(this.x, this.y, this.x, this.x)
	}

	get xyxy() {
		return new Vec4(this.x, this.y, this.x, this.y)
	}

	get xyyx() {
		return new Vec4(this.x, this.y, this.y, this.x)
	}

	get xyyy() {
		return new Vec4(this.x, this.y, this.y, this.y)
	}

	get yxxx() {
		return new Vec4(this.y, this.x, this.x, this.x)
	}

	get yxxy() {
		return new Vec4(this.y, this.x, this.x, this.y)
	}

	get yxyx() {
		return new Vec4(this.y, this.x, this.y, this.x)
	}

	get yxyy() {
		return new Vec4(this.y, this.x, this.y, this.y)
	}

	get yyxx() {
		return new Vec4(this.y, this.y, this.x, this.x)
	}

	get yyxy() {
		return new Vec4(this.y, this.y, this.x, this.y)
	}

	get yyyx() {
		return new Vec4(this.y, this.y, this.y, this.x)
	}

	get yyyy() {
		return new Vec4(this.y, this.y, this.y, this.y)
	}

	static dot(a, b) {
		return a.x * b.x + a.y * b.y
	}

	static cross(a, b) {
		return Vec2(a.x * b.y, -a.y * b.x)
	}

	static add(a, b) {
		return Vec2(a.x + b.x, a.y + b.y)
	}

	static sub(a, b) {
		return Vec2(a.x - b.x, a.y - b.y)
	}

	static mul(a, b) {
		return Vec2(a.x * b.x, a.y * b.y)
	}

	static div(a, b) {
		return Vec2(a.x / b.x, a.y / b.y)
	}

	min() {
		return this.x < this.y ? this.x : this.y
	}

	static min(v) {
		return v.min()
	}

	max() {
		return this.x > this.y ? this.x : this.y
	}

	static max(v) {
		return v.max()
	}
}
