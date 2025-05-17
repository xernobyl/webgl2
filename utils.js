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
    points[i * 2 - 2] = halton(i, base1)
    points[i * 2 - 1] = halton(i, base2)
  }

  return points
}
