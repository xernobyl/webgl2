// values range between -0.5 and 0.5
export function haltonSequence2D(count, base1 = 2, base2 = 3) {
  function halton(index, base) {
    let result = 0
    let f = 1 / base
    let i = index
    while (i > 0) {
      result += f * (i % base)
      i = Math.floor(i / base)
      f = f / base
    }
    return result
  }

  const points = new Array(count * 2)
  for (let i = 1; i <= count; i++) {
    points[i * 2 - 2] = halton(i, base1) - 0.5
    points[i * 2 - 1] = halton(i, base2) - 0.5
  }

  return points
}

// packed into 2x Uint8 or 1x Uint16
function encodeOctahedral(normal) {
  normal /= Math.abs(normal[0]) + Math.abs(normal[1]) + Math.abs(normal[2])
  if (normal[2] < 0.0) {
    normal[0] = (1.0 - Math.abs(normal[1])) * Math.sign(normal[0]) * 0.5 + 0.5
    normal[1] = (1.0 - Math.abs(normal[0])) * Math.sign(normal[1]) * 0.5 + 0.5
  }

  return [normal[0], normal[1]]
}
