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

  const points = []
  for (let i = 1; i <= count; i++) {
    const x = halton(i, base1)
    const y = halton(i, base2)
    points.push(x, y)
  }

  return points
}
