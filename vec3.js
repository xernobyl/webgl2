'use strict'

class Vec3 extends Float32Array {
	constructor(x, y, z) {
		super(3)
		this.x = x
		this.y = y
		this.z = z
	}

	get x() {
		return this[0]
	}

	get y() {
		return this[1]
	}

	get z() {
		return this[2]
	}

	set x(x) {
		this[0] = x
	}

	set y(y) {
		this[1] = y
	}

	set z(z) {
		this[2] = z
	}

	get xx() {
		return Vec2(this.x, this.x)
	}

	get xy() {
		return Vec2(this.x, this.y)
	}

	get xz() {
		return Vec2(this.x, this.z)
	}

	get yx() {
		return Vec2(this.y, this.x)
	}

	get yy() {
		return Vec2(this.y, this.y)
	}

	get yz() {
		return Vec2(this.y, this.z)
	}

	get zx() {
		return Vec2(this.z, this.x)
	}

	get zy() {
		return Vec2(this.z, this.y)
	}

	get zz() {
		return Vec2(this.z, this.z)
	}

	get xxx() {
		return Vec3(this.x, this.x, this.x)
	}

	get xxy() {
		return Vec3(this.x, this.x, this.y)
	}

	get xxz() {
		return Vec3(this.x, this.x, this.z)
	}

	get xyx() {
		return Vec3(this.x, this.y, this.x)
	}

	get xyy() {
		return Vec3(this.x, this.y, this.y)
	}

	get xyz() {
		return Vec3(this.x, this.y, this.z)
	}

	get xzx() {
		return Vec3(this.x, this.z, this.x)
	}

	get xzy() {
		return Vec3(this.x, this.z, this.y)
	}

	get xzz() {
		return Vec3(this.x, this.z, this.z)
	}

	get yxx() {
		return Vec3(this.y, this.x, this.x)
	}

	get yxy() {
		return Vec3(this.y, this.x, this.y)
	}

	get yxz() {
		return Vec3(this.y, this.x, this.z)
	}

	get yyx() {
		return Vec3(this.y, this.y, this.x)
	}

	get yyy() {
		return Vec3(this.y, this.y, this.y)
	}

	get yyz() {
		return Vec3(this.y, this.y, this.z)
	}

	get yzx() {
		return Vec3(this.y, this.z, this.x)
	}

	get yzy() {
		return Vec3(this.y, this.z, this.y)
	}

	get yzz() {
		return Vec3(this.y, this.z, this.z)
	}

	get zxx() {
		return Vec3(this.z, this.x, this.x)
	}

	get zxy() {
		return Vec3(this.z, this.x, this.y)
	}

	get zxz() {
		return Vec3(this.z, this.x, this.z)
	}

	get zyx() {
		return Vec3(this.z, this.y, this.x)
	}

	get zyy() {
		return Vec3(this.z, this.y, this.y)
	}

	get zyz() {
		return Vec3(this.z, this.y, this.z)
	}

	get zzx() {
		return Vec3(this.z, this.z, this.x)
	}

	get zzy() {
		return Vec3(this.z, this.z, this.y)
	}

	get zzz() {
		return Vec3(this.z, this.z, this.z)
	}

	get xxxx() {
		return Vec4(this.x, this.x, this.x, this.x)
	}

	get xxxy() {
		return Vec4(this.x, this.x, this.x, this.y)
	}

	get xxxz() {
		return Vec4(this.x, this.x, this.x, this.z)
	}

	get xxyx() {
		return Vec4(this.x, this.x, this.y, this.x)
	}

	get xxyy() {
		return Vec4(this.x, this.x, this.y, this.y)
	}

	get xxyz() {
		return Vec4(this.x, this.x, this.y, this.z)
	}

	get xxzx() {
		return Vec4(this.x, this.x, this.z, this.x)
	}

	get xxzy() {
		return Vec4(this.x, this.x, this.z, this.y)
	}

	get xxzz() {
		return Vec4(this.x, this.x, this.z, this.z)
	}

	get xyxx() {
		return Vec4(this.x, this.y, this.x, this.x)
	}

	get xyxy() {
		return Vec4(this.x, this.y, this.x, this.y)
	}

	get xyxz() {
		return Vec4(this.x, this.y, this.x, this.z)
	}

	get xyyx() {
		return Vec4(this.x, this.y, this.y, this.x)
	}

	get xyyy() {
		return Vec4(this.x, this.y, this.y, this.y)
	}

	get xyyz() {
		return Vec4(this.x, this.y, this.y, this.z)
	}

	get xyzx() {
		return Vec4(this.x, this.y, this.z, this.x)
	}

	get xyzy() {
		return Vec4(this.x, this.y, this.z, this.y)
	}

	get xyzz() {
		return Vec4(this.x, this.y, this.z, this.z)
	}

	get xzxx() {
		return Vec4(this.x, this.z, this.x, this.x)
	}

	get xzxy() {
		return Vec4(this.x, this.z, this.x, this.y)
	}

	get xzxz() {
		return Vec4(this.x, this.z, this.x, this.z)
	}

	get xzyx() {
		return Vec4(this.x, this.z, this.y, this.x)
	}

	get xzyy() {
		return Vec4(this.x, this.z, this.y, this.y)
	}

	get xzyz() {
		return Vec4(this.x, this.z, this.y, this.z)
	}

	get xzzx() {
		return Vec4(this.x, this.z, this.z, this.x)
	}

	get xzzy() {
		return Vec4(this.x, this.z, this.z, this.y)
	}

	get xzzz() {
		return Vec4(this.x, this.z, this.z, this.z)
	}

	get yxxx() {
		return Vec4(this.y, this.x, this.x, this.x)
	}

	get yxxy() {
		return Vec4(this.y, this.x, this.x, this.y)
	}

	get yxxz() {
		return Vec4(this.y, this.x, this.x, this.z)
	}

	get yxyx() {
		return Vec4(this.y, this.x, this.y, this.x)
	}

	get yxyy() {
		return Vec4(this.y, this.x, this.y, this.y)
	}

	get yxyz() {
		return Vec4(this.y, this.x, this.y, this.z)
	}

	get yxzx() {
		return Vec4(this.y, this.x, this.z, this.x)
	}

	get yxzy() {
		return Vec4(this.y, this.x, this.z, this.y)
	}

	get yxzz() {
		return Vec4(this.y, this.x, this.z, this.z)
	}

	get yyxx() {
		return Vec4(this.y, this.y, this.x, this.x)
	}

	get yyxy() {
		return Vec4(this.y, this.y, this.x, this.y)
	}

	get yyxz() {
		return Vec4(this.y, this.y, this.x, this.z)
	}

	get yyyx() {
		return Vec4(this.y, this.y, this.y, this.x)
	}

	get yyyy() {
		return Vec4(this.y, this.y, this.y, this.y)
	}

	get yyyz() {
		return Vec4(this.y, this.y, this.y, this.z)
	}

	get yyzx() {
		return Vec4(this.y, this.y, this.z, this.x)
	}

	get yyzy() {
		return Vec4(this.y, this.y, this.z, this.y)
	}

	get yyzz() {
		return Vec4(this.y, this.y, this.z, this.z)
	}

	get yzxx() {
		return Vec4(this.y, this.z, this.x, this.x)
	}

	get yzxy() {
		return Vec4(this.y, this.z, this.x, this.y)
	}

	get yzxz() {
		return Vec4(this.y, this.z, this.x, this.z)
	}

	get yzyx() {
		return Vec4(this.y, this.z, this.y, this.x)
	}

	get yzyy() {
		return Vec4(this.y, this.z, this.y, this.y)
	}

	get yzyz() {
		return Vec4(this.y, this.z, this.y, this.z)
	}

	get yzzx() {
		return Vec4(this.y, this.z, this.z, this.x)
	}

	get yzzy() {
		return Vec4(this.y, this.z, this.z, this.y)
	}

	get yzzz() {
		return Vec4(this.y, this.z, this.z, this.z)
	}

	get zxxx() {
		return Vec4(this.z, this.x, this.x, this.x)
	}

	get zxxy() {
		return Vec4(this.z, this.x, this.x, this.y)
	}

	get zxxz() {
		return Vec4(this.z, this.x, this.x, this.z)
	}

	get zxyx() {
		return Vec4(this.z, this.x, this.y, this.x)
	}

	get zxyy() {
		return Vec4(this.z, this.x, this.y, this.y)
	}

	get zxyz() {
		return Vec4(this.z, this.x, this.y, this.z)
	}

	get zxzx() {
		return Vec4(this.z, this.x, this.z, this.x)
	}

	get zxzy() {
		return Vec4(this.z, this.x, this.z, this.y)
	}

	get zxzz() {
		return Vec4(this.z, this.x, this.z, this.z)
	}

	get zyxx() {
		return Vec4(this.z, this.y, this.x, this.x)
	}

	get zyxy() {
		return Vec4(this.z, this.y, this.x, this.y)
	}

	get zyxz() {
		return Vec4(this.z, this.y, this.x, this.z)
	}

	get zyyx() {
		return Vec4(this.z, this.y, this.y, this.x)
	}

	get zyyy() {
		return Vec4(this.z, this.y, this.y, this.y)
	}

	get zyyz() {
		return Vec4(this.z, this.y, this.y, this.z)
	}

	get zyzx() {
		return Vec4(this.z, this.y, this.z, this.x)
	}

	get zyzy() {
		return Vec4(this.z, this.y, this.z, this.y)
	}

	get zyzz() {
		return Vec4(this.z, this.y, this.z, this.z)
	}

	get zzxx() {
		return Vec4(this.z, this.z, this.x, this.x)
	}

	get zzxy() {
		return Vec4(this.z, this.z, this.x, this.y)
	}

	get zzxz() {
		return Vec4(this.z, this.z, this.x, this.z)
	}

	get zzyx() {
		return Vec4(this.z, this.z, this.y, this.x)
	}

	get zzyy() {
		return Vec4(this.z, this.z, this.y, this.y)
	}

	get zzyz() {
		return Vec4(this.z, this.z, this.y, this.z)
	}

	get zzzx() {
		return Vec4(this.z, this.z, this.z, this.x)
	}

	get zzzy() {
		return Vec4(this.z, this.z, this.z, this.y)
	}

	get zzzz() {
		return Vec4(this.z, this.z, this.z, this.z)
	}

	normalize() {
		let l = 1.0 / this.length()
		return new Vec3(this.x * l, this.y * l, this.z * l)
	}

	negate() {
		return new Vec3(-this.x, -this.y, -this.z)
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
	}

	lengthSqr() {
		return this.x * this.x + this.y * this.y + this.z * this.z
	}

	max() {
		return this.x > this.y ? (this.x > this.z ? this.x : this.z) : (this.y > this.z ? this.y : this.z) 
	}

	min() {
		return this.x < this.y ? (this.x < this.z ? this.x : this.z) : (this.y < this.z ? this.y : this.z) 
	}

	static dot(a, b) {
		return a.x * b.x + a.y * b.y + a.z * b.z
	}

	static cross(a, b) {
		return new Vec3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x)
	}

	static add(a, b) {
		return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z)
	}

	static sub(a, b) {
		return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z)
	}

	static mul(a, b) {
		return new Vec3(a.x * b.x, a.y * b.y, a.z * b.z)
	}

	static div(a, b) {
		return new Vec3(a.x / b.x, a.y / b.y, a.z / b.z)
	}
}
