import { GL } from './gl.js'

export function linkProgram(shaders, varyings) {
  const program = GL.gl.createProgram()
  for (const shader in shaders) {
    if (!shaders[shader]) {
      console.log(shader)
    }
    else {
      GL.gl.attachShader(program, shaders[shader])
    }
  }

  if (varyings !== undefined) {
    GL.gl.transformFeedbackVaryings(program, varyings, GL.gl.INTERLEAVED_ATTRIBS)
  }

  GL.gl.linkProgram(program)

  if (!GL.gl.getProgramParameter(program, GL.gl.LINK_STATUS)) {
    console.log(GL.gl.getProgramInfoLog(program))
    GL.gl.deleteProgram(program)
    return null
  }

  return program
}

export function compileShader(shaderSource, shaderType) {
  if (shaderType === 'vertex') {
    shaderType = GL.gl.VERTEX_SHADER
  } else if (shaderType === 'fragment') {
    shaderType = GL.gl.FRAGMENT_SHADER
  }

  const shader = GL.gl.createShader(shaderType)
  GL.gl.shaderSource(shader, shaderSource)
  GL.gl.compileShader(shader)

  if (!GL.gl.getShaderParameter(shader, GL.gl.COMPILE_STATUS)) {
    console.log(GL.gl.getShaderInfoLog(shader))
    console.log(shaderSource)
    GL.gl.deleteShader(shader)
    return null
  }

  return shader
}
