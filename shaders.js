export function linkProgram(gl, shaders, varyings) {
  const program = gl.createProgram()
  for (const shader in shaders) {
    if (!shaders[shader]) {
      console.log(shader)
    }
    else {
      gl.attachShader(program, shaders[shader])
    }
  }

  if (varyings !== undefined) {
    gl.transformFeedbackVaryings(program, varyings, gl.INTERLEAVED_ATTRIBS)
  }

  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  return program
}

export function compileShader(gl, shaderSource, shaderType) {
  if (shaderType === 'vertex') {
    shaderType = gl.VERTEX_SHADER
  } else if (shaderType === 'fragment') {
    shaderType = gl.FRAGMENT_SHADER
  }

  const shader = gl.createShader(shaderType)
  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}
