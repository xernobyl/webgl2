function print2(a, b) {
	console.log('get ' + a + b + '() {\n' +
		'\treturn Vec2(this.' + a + ', this.' + b + ')\n' +
		'}\n')
}

function print3(a, b, c) {
	console.log('get ' + a + b + c + '() {\n' +
		'\treturn Vec3(this.' + a + ', this.' + b + ', this.' + c + ')\n' +
		'}\n')
}

function print4(a, b, c, d) {
	console.log('get ' + a + b + c + d + '() {\n' +
		'\treturn Vec4(this.' + a + ', this.' + b + ', this.' + c + ', this.' + d + ')\n' +
		'}\n')
}

values = ['x', 'y', 'z']
//values = ['x', 'y', 'z', 'w']

for (var i in values) {
	for (var j in values) {
		print2(values[i], values[j])
	}
}

for (var i in values) {
	for (var j in values) {
		for (var k in values) {
			print3(values[i], values[j], values[k])
		}
	}
}

for (var i in values) {
	for (var j in values) {
		for (var k in values) {
			for (var l in values) {
				print4(values[i], values[j], values[k], values[l])
			}
		}
	}
}
