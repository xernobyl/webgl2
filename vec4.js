'use strict'

class Vec4 extends Float32Array {
	constructor(x, y, z, w) {
		super(3)
		this.x = x
		this.y = y
		this.z = z
		this.w = w
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

	get w() {
		return this[3]
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

	set w(w) {
		this[3] = w
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

	get xw() {
		return Vec2(this.x, this.w)
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

	get yw() {
		return Vec2(this.y, this.w)
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

	get zw() {
		return Vec2(this.z, this.w)
	}

	get wx() {
		return Vec2(this.w, this.x)
	}

	get wy() {
		return Vec2(this.w, this.y)
	}

	get wz() {
		return Vec2(this.w, this.z)
	}

	get ww() {
		return Vec2(this.w, this.w)
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

	get xxw() {
		return Vec3(this.x, this.x, this.w)
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

	get xyw() {
		return Vec3(this.x, this.y, this.w)
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

	get xzw() {
		return Vec3(this.x, this.z, this.w)
	}

	get xwx() {
		return Vec3(this.x, this.w, this.x)
	}

	get xwy() {
		return Vec3(this.x, this.w, this.y)
	}

	get xwz() {
		return Vec3(this.x, this.w, this.z)
	}

	get xww() {
		return Vec3(this.x, this.w, this.w)
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

	get yxw() {
		return Vec3(this.y, this.x, this.w)
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

	get yyw() {
		return Vec3(this.y, this.y, this.w)
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

	get yzw() {
		return Vec3(this.y, this.z, this.w)
	}

	get ywx() {
		return Vec3(this.y, this.w, this.x)
	}

	get ywy() {
		return Vec3(this.y, this.w, this.y)
	}

	get ywz() {
		return Vec3(this.y, this.w, this.z)
	}

	get yww() {
		return Vec3(this.y, this.w, this.w)
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

	get zxw() {
		return Vec3(this.z, this.x, this.w)
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

	get zyw() {
		return Vec3(this.z, this.y, this.w)
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

	get zzw() {
		return Vec3(this.z, this.z, this.w)
	}

	get zwx() {
		return Vec3(this.z, this.w, this.x)
	}

	get zwy() {
		return Vec3(this.z, this.w, this.y)
	}

	get zwz() {
		return Vec3(this.z, this.w, this.z)
	}

	get zww() {
		return Vec3(this.z, this.w, this.w)
	}

	get wxx() {
		return Vec3(this.w, this.x, this.x)
	}

	get wxy() {
		return Vec3(this.w, this.x, this.y)
	}

	get wxz() {
		return Vec3(this.w, this.x, this.z)
	}

	get wxw() {
		return Vec3(this.w, this.x, this.w)
	}

	get wyx() {
		return Vec3(this.w, this.y, this.x)
	}

	get wyy() {
		return Vec3(this.w, this.y, this.y)
	}

	get wyz() {
		return Vec3(this.w, this.y, this.z)
	}

	get wyw() {
		return Vec3(this.w, this.y, this.w)
	}

	get wzx() {
		return Vec3(this.w, this.z, this.x)
	}

	get wzy() {
		return Vec3(this.w, this.z, this.y)
	}

	get wzz() {
		return Vec3(this.w, this.z, this.z)
	}

	get wzw() {
		return Vec3(this.w, this.z, this.w)
	}

	get wwx() {
		return Vec3(this.w, this.w, this.x)
	}

	get wwy() {
		return Vec3(this.w, this.w, this.y)
	}

	get wwz() {
		return Vec3(this.w, this.w, this.z)
	}

	get www() {
		return Vec3(this.w, this.w, this.w)
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

	get xxxw() {
		return Vec4(this.x, this.x, this.x, this.w)
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

	get xxyw() {
		return Vec4(this.x, this.x, this.y, this.w)
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

	get xxzw() {
		return Vec4(this.x, this.x, this.z, this.w)
	}

	get xxwx() {
		return Vec4(this.x, this.x, this.w, this.x)
	}

	get xxwy() {
		return Vec4(this.x, this.x, this.w, this.y)
	}

	get xxwz() {
		return Vec4(this.x, this.x, this.w, this.z)
	}

	get xxww() {
		return Vec4(this.x, this.x, this.w, this.w)
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

	get xyxw() {
		return Vec4(this.x, this.y, this.x, this.w)
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

	get xyyw() {
		return Vec4(this.x, this.y, this.y, this.w)
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

	get xyzw() {
		return Vec4(this.x, this.y, this.z, this.w)
	}

	get xywx() {
		return Vec4(this.x, this.y, this.w, this.x)
	}

	get xywy() {
		return Vec4(this.x, this.y, this.w, this.y)
	}

	get xywz() {
		return Vec4(this.x, this.y, this.w, this.z)
	}

	get xyww() {
		return Vec4(this.x, this.y, this.w, this.w)
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

	get xzxw() {
		return Vec4(this.x, this.z, this.x, this.w)
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

	get xzyw() {
		return Vec4(this.x, this.z, this.y, this.w)
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

	get xzzw() {
		return Vec4(this.x, this.z, this.z, this.w)
	}

	get xzwx() {
		return Vec4(this.x, this.z, this.w, this.x)
	}

	get xzwy() {
		return Vec4(this.x, this.z, this.w, this.y)
	}

	get xzwz() {
		return Vec4(this.x, this.z, this.w, this.z)
	}

	get xzww() {
		return Vec4(this.x, this.z, this.w, this.w)
	}

	get xwxx() {
		return Vec4(this.x, this.w, this.x, this.x)
	}

	get xwxy() {
		return Vec4(this.x, this.w, this.x, this.y)
	}

	get xwxz() {
		return Vec4(this.x, this.w, this.x, this.z)
	}

	get xwxw() {
		return Vec4(this.x, this.w, this.x, this.w)
	}

	get xwyx() {
		return Vec4(this.x, this.w, this.y, this.x)
	}

	get xwyy() {
		return Vec4(this.x, this.w, this.y, this.y)
	}

	get xwyz() {
		return Vec4(this.x, this.w, this.y, this.z)
	}

	get xwyw() {
		return Vec4(this.x, this.w, this.y, this.w)
	}

	get xwzx() {
		return Vec4(this.x, this.w, this.z, this.x)
	}

	get xwzy() {
		return Vec4(this.x, this.w, this.z, this.y)
	}

	get xwzz() {
		return Vec4(this.x, this.w, this.z, this.z)
	}

	get xwzw() {
		return Vec4(this.x, this.w, this.z, this.w)
	}

	get xwwx() {
		return Vec4(this.x, this.w, this.w, this.x)
	}

	get xwwy() {
		return Vec4(this.x, this.w, this.w, this.y)
	}

	get xwwz() {
		return Vec4(this.x, this.w, this.w, this.z)
	}

	get xwww() {
		return Vec4(this.x, this.w, this.w, this.w)
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

	get yxxw() {
		return Vec4(this.y, this.x, this.x, this.w)
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

	get yxyw() {
		return Vec4(this.y, this.x, this.y, this.w)
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

	get yxzw() {
		return Vec4(this.y, this.x, this.z, this.w)
	}

	get yxwx() {
		return Vec4(this.y, this.x, this.w, this.x)
	}

	get yxwy() {
		return Vec4(this.y, this.x, this.w, this.y)
	}

	get yxwz() {
		return Vec4(this.y, this.x, this.w, this.z)
	}

	get yxww() {
		return Vec4(this.y, this.x, this.w, this.w)
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

	get yyxw() {
		return Vec4(this.y, this.y, this.x, this.w)
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

	get yyyw() {
		return Vec4(this.y, this.y, this.y, this.w)
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

	get yyzw() {
		return Vec4(this.y, this.y, this.z, this.w)
	}

	get yywx() {
		return Vec4(this.y, this.y, this.w, this.x)
	}

	get yywy() {
		return Vec4(this.y, this.y, this.w, this.y)
	}

	get yywz() {
		return Vec4(this.y, this.y, this.w, this.z)
	}

	get yyww() {
		return Vec4(this.y, this.y, this.w, this.w)
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

	get yzxw() {
		return Vec4(this.y, this.z, this.x, this.w)
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

	get yzyw() {
		return Vec4(this.y, this.z, this.y, this.w)
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

	get yzzw() {
		return Vec4(this.y, this.z, this.z, this.w)
	}

	get yzwx() {
		return Vec4(this.y, this.z, this.w, this.x)
	}

	get yzwy() {
		return Vec4(this.y, this.z, this.w, this.y)
	}

	get yzwz() {
		return Vec4(this.y, this.z, this.w, this.z)
	}

	get yzww() {
		return Vec4(this.y, this.z, this.w, this.w)
	}

	get ywxx() {
		return Vec4(this.y, this.w, this.x, this.x)
	}

	get ywxy() {
		return Vec4(this.y, this.w, this.x, this.y)
	}

	get ywxz() {
		return Vec4(this.y, this.w, this.x, this.z)
	}

	get ywxw() {
		return Vec4(this.y, this.w, this.x, this.w)
	}

	get ywyx() {
		return Vec4(this.y, this.w, this.y, this.x)
	}

	get ywyy() {
		return Vec4(this.y, this.w, this.y, this.y)
	}

	get ywyz() {
		return Vec4(this.y, this.w, this.y, this.z)
	}

	get ywyw() {
		return Vec4(this.y, this.w, this.y, this.w)
	}

	get ywzx() {
		return Vec4(this.y, this.w, this.z, this.x)
	}

	get ywzy() {
		return Vec4(this.y, this.w, this.z, this.y)
	}

	get ywzz() {
		return Vec4(this.y, this.w, this.z, this.z)
	}

	get ywzw() {
		return Vec4(this.y, this.w, this.z, this.w)
	}

	get ywwx() {
		return Vec4(this.y, this.w, this.w, this.x)
	}

	get ywwy() {
		return Vec4(this.y, this.w, this.w, this.y)
	}

	get ywwz() {
		return Vec4(this.y, this.w, this.w, this.z)
	}

	get ywww() {
		return Vec4(this.y, this.w, this.w, this.w)
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

	get zxxw() {
		return Vec4(this.z, this.x, this.x, this.w)
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

	get zxyw() {
		return Vec4(this.z, this.x, this.y, this.w)
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

	get zxzw() {
		return Vec4(this.z, this.x, this.z, this.w)
	}

	get zxwx() {
		return Vec4(this.z, this.x, this.w, this.x)
	}

	get zxwy() {
		return Vec4(this.z, this.x, this.w, this.y)
	}

	get zxwz() {
		return Vec4(this.z, this.x, this.w, this.z)
	}

	get zxww() {
		return Vec4(this.z, this.x, this.w, this.w)
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

	get zyxw() {
		return Vec4(this.z, this.y, this.x, this.w)
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

	get zyyw() {
		return Vec4(this.z, this.y, this.y, this.w)
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

	get zyzw() {
		return Vec4(this.z, this.y, this.z, this.w)
	}

	get zywx() {
		return Vec4(this.z, this.y, this.w, this.x)
	}

	get zywy() {
		return Vec4(this.z, this.y, this.w, this.y)
	}

	get zywz() {
		return Vec4(this.z, this.y, this.w, this.z)
	}

	get zyww() {
		return Vec4(this.z, this.y, this.w, this.w)
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

	get zzxw() {
		return Vec4(this.z, this.z, this.x, this.w)
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

	get zzyw() {
		return Vec4(this.z, this.z, this.y, this.w)
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

	get zzzw() {
		return Vec4(this.z, this.z, this.z, this.w)
	}

	get zzwx() {
		return Vec4(this.z, this.z, this.w, this.x)
	}

	get zzwy() {
		return Vec4(this.z, this.z, this.w, this.y)
	}

	get zzwz() {
		return Vec4(this.z, this.z, this.w, this.z)
	}

	get zzww() {
		return Vec4(this.z, this.z, this.w, this.w)
	}

	get zwxx() {
		return Vec4(this.z, this.w, this.x, this.x)
	}

	get zwxy() {
		return Vec4(this.z, this.w, this.x, this.y)
	}

	get zwxz() {
		return Vec4(this.z, this.w, this.x, this.z)
	}

	get zwxw() {
		return Vec4(this.z, this.w, this.x, this.w)
	}

	get zwyx() {
		return Vec4(this.z, this.w, this.y, this.x)
	}

	get zwyy() {
		return Vec4(this.z, this.w, this.y, this.y)
	}

	get zwyz() {
		return Vec4(this.z, this.w, this.y, this.z)
	}

	get zwyw() {
		return Vec4(this.z, this.w, this.y, this.w)
	}

	get zwzx() {
		return Vec4(this.z, this.w, this.z, this.x)
	}

	get zwzy() {
		return Vec4(this.z, this.w, this.z, this.y)
	}

	get zwzz() {
		return Vec4(this.z, this.w, this.z, this.z)
	}

	get zwzw() {
		return Vec4(this.z, this.w, this.z, this.w)
	}

	get zwwx() {
		return Vec4(this.z, this.w, this.w, this.x)
	}

	get zwwy() {
		return Vec4(this.z, this.w, this.w, this.y)
	}

	get zwwz() {
		return Vec4(this.z, this.w, this.w, this.z)
	}

	get zwww() {
		return Vec4(this.z, this.w, this.w, this.w)
	}

	get wxxx() {
		return Vec4(this.w, this.x, this.x, this.x)
	}

	get wxxy() {
		return Vec4(this.w, this.x, this.x, this.y)
	}

	get wxxz() {
		return Vec4(this.w, this.x, this.x, this.z)
	}

	get wxxw() {
		return Vec4(this.w, this.x, this.x, this.w)
	}

	get wxyx() {
		return Vec4(this.w, this.x, this.y, this.x)
	}

	get wxyy() {
		return Vec4(this.w, this.x, this.y, this.y)
	}

	get wxyz() {
		return Vec4(this.w, this.x, this.y, this.z)
	}

	get wxyw() {
		return Vec4(this.w, this.x, this.y, this.w)
	}

	get wxzx() {
		return Vec4(this.w, this.x, this.z, this.x)
	}

	get wxzy() {
		return Vec4(this.w, this.x, this.z, this.y)
	}

	get wxzz() {
		return Vec4(this.w, this.x, this.z, this.z)
	}

	get wxzw() {
		return Vec4(this.w, this.x, this.z, this.w)
	}

	get wxwx() {
		return Vec4(this.w, this.x, this.w, this.x)
	}

	get wxwy() {
		return Vec4(this.w, this.x, this.w, this.y)
	}

	get wxwz() {
		return Vec4(this.w, this.x, this.w, this.z)
	}

	get wxww() {
		return Vec4(this.w, this.x, this.w, this.w)
	}

	get wyxx() {
		return Vec4(this.w, this.y, this.x, this.x)
	}

	get wyxy() {
		return Vec4(this.w, this.y, this.x, this.y)
	}

	get wyxz() {
		return Vec4(this.w, this.y, this.x, this.z)
	}

	get wyxw() {
		return Vec4(this.w, this.y, this.x, this.w)
	}

	get wyyx() {
		return Vec4(this.w, this.y, this.y, this.x)
	}

	get wyyy() {
		return Vec4(this.w, this.y, this.y, this.y)
	}

	get wyyz() {
		return Vec4(this.w, this.y, this.y, this.z)
	}

	get wyyw() {
		return Vec4(this.w, this.y, this.y, this.w)
	}

	get wyzx() {
		return Vec4(this.w, this.y, this.z, this.x)
	}

	get wyzy() {
		return Vec4(this.w, this.y, this.z, this.y)
	}

	get wyzz() {
		return Vec4(this.w, this.y, this.z, this.z)
	}

	get wyzw() {
		return Vec4(this.w, this.y, this.z, this.w)
	}

	get wywx() {
		return Vec4(this.w, this.y, this.w, this.x)
	}

	get wywy() {
		return Vec4(this.w, this.y, this.w, this.y)
	}

	get wywz() {
		return Vec4(this.w, this.y, this.w, this.z)
	}

	get wyww() {
		return Vec4(this.w, this.y, this.w, this.w)
	}

	get wzxx() {
		return Vec4(this.w, this.z, this.x, this.x)
	}

	get wzxy() {
		return Vec4(this.w, this.z, this.x, this.y)
	}

	get wzxz() {
		return Vec4(this.w, this.z, this.x, this.z)
	}

	get wzxw() {
		return Vec4(this.w, this.z, this.x, this.w)
	}

	get wzyx() {
		return Vec4(this.w, this.z, this.y, this.x)
	}

	get wzyy() {
		return Vec4(this.w, this.z, this.y, this.y)
	}

	get wzyz() {
		return Vec4(this.w, this.z, this.y, this.z)
	}

	get wzyw() {
		return Vec4(this.w, this.z, this.y, this.w)
	}

	get wzzx() {
		return Vec4(this.w, this.z, this.z, this.x)
	}

	get wzzy() {
		return Vec4(this.w, this.z, this.z, this.y)
	}

	get wzzz() {
		return Vec4(this.w, this.z, this.z, this.z)
	}

	get wzzw() {
		return Vec4(this.w, this.z, this.z, this.w)
	}

	get wzwx() {
		return Vec4(this.w, this.z, this.w, this.x)
	}

	get wzwy() {
		return Vec4(this.w, this.z, this.w, this.y)
	}

	get wzwz() {
		return Vec4(this.w, this.z, this.w, this.z)
	}

	get wzww() {
		return Vec4(this.w, this.z, this.w, this.w)
	}

	get wwxx() {
		return Vec4(this.w, this.w, this.x, this.x)
	}

	get wwxy() {
		return Vec4(this.w, this.w, this.x, this.y)
	}

	get wwxz() {
		return Vec4(this.w, this.w, this.x, this.z)
	}

	get wwxw() {
		return Vec4(this.w, this.w, this.x, this.w)
	}

	get wwyx() {
		return Vec4(this.w, this.w, this.y, this.x)
	}

	get wwyy() {
		return Vec4(this.w, this.w, this.y, this.y)
	}

	get wwyz() {
		return Vec4(this.w, this.w, this.y, this.z)
	}

	get wwyw() {
		return Vec4(this.w, this.w, this.y, this.w)
	}

	get wwzx() {
		return Vec4(this.w, this.w, this.z, this.x)
	}

	get wwzy() {
		return Vec4(this.w, this.w, this.z, this.y)
	}

	get wwzz() {
		return Vec4(this.w, this.w, this.z, this.z)
	}

	get wwzw() {
		return Vec4(this.w, this.w, this.z, this.w)
	}

	get wwwx() {
		return Vec4(this.w, this.w, this.w, this.x)
	}

	get wwwy() {
		return Vec4(this.w, this.w, this.w, this.y)
	}

	get wwwz() {
		return Vec4(this.w, this.w, this.w, this.z)
	}

	get wwww() {
		return Vec4(this.w, this.w, this.w, this.w)
	}

	static dot(a, b) {
		return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w
	}

	static cross3(a, b) {
		return Vec4(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x, a.w * b.w)
	}

	static add(a, b) {
		return Vec4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w)
	}

	static sub(a, b) {
		return Vec4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w)
	}

	static mul(a, b) {
		return Vec4(a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w)
	}

	static div(a, b) {
		return Vec4(a.x / b.x, a.y / b.y, a.z / b.z, a.w / b.w)
	}

	min() {
		if (this.x < this.y) {
			if (this.x < this.z) {
				return this.x < this.w ? this.x : this.w
			}
			else {
				return this.z < this.w ? this.z : this.w
			}
		}
		else {
			if (this.y < this.z) {
				return this.y < this.w ? this.y : this.w
			}
			else {
				return this.z < this.w ? this.z : this.w
			}
		}
	}

	static min(v) {
		return v.min()
	}

	max() {
		if (this.x > this.y) {
			if (this.x > this.z) {
				return this.x > this.w ? this.x : this.w
			}
			else {
				return this.z > this.w ? this.z : this.w
			}
		}
		else {
			if (this.y > this.z) {
				return this.y > this.w ? this.y : this.w
			}
			else {
				return this.z > this.w ? this.z : this.w
			}
		}
	}

	static max(v) {
		return v.max()
	}
}
