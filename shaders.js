import { GL } from './gl.js'
import { ResourceManager } from './resourcemanager.js'

export class Shaders {
  static #shaderPrograms = {
    screen: {
      'fragment': ['screen'],
      'vertex': ['screen'],
      'uniforms': {
        'screen_size': null,
        'inverse_screen_size': null,
        'time': null,
        'screen': null
      }
    },

    particles0: {
      'fragment': ['particleFlat'],
      'vertex': ['particleBasic'],
      'uniforms': {
        'mvp': null
      }
    },

    flat: {
      'fragment': ['flat'],
      'vertex': ['flat'],
      'uniforms': {
        'mvp': null,
        'mv': null
      }
    },

    color: {
      'fragment': ['color'],
      'vertex': ['flat'],
      'uniforms': {
        'mvp': null,
        'mv': null,
        'color': null
      }
    },

    plane: {
      'fragment': ['plane'],
      'vertex': ['plane'],
      'uniforms': {
        'mvp': null,
        'mv': null,
        'color': null,
        'bias': null
      }
    },

    taa: {
      'fragment': ['taa'],
      'vertex': ['taa'],
      'uniforms': {
        'screen': null,
        'motion': null,
        'accum': null,
        'iTexel': null
      }
    }
  }

  static #shaderSource = {
    vertex: {
      screen: 'screen.vs.glsl',
      particleBasic: 'particleBasic.vs.glsl',
      flat: 'flat.vs.glsl',
      plane: 'plane.vs.glsl',
      taa: 'taa.vs.glsl'
    },
    fragment: {
      screen: 'screen.fs.glsl',
      particleFlat: 'particleFlat.fs.glsl',
      flat: 'flat.fs.glsl',
      color: 'color.fs.glsl',
      plane: 'plane.fs.glsl',
      taa: 'taa.fs.glsl'
    }
  }

  static getShaderResources() {
    const output = {}

    for (const type in Shaders.#shaderSource) {
      for (const name in Shaders.#shaderSource[type]) {
        output[`${type}_${name}`] = `shaders/${Shaders.#shaderSource[type][name]}`
      }
    }
    
    return output
  }

  static uniform(program, uniform) {
    return Shaders.#shaderPrograms[program].uniforms[uniform]
  }

  static useProgram(program) {
    GL.gl.useProgram(Shaders.#shaderPrograms[program].program)
  }

  static #linkProgram(shaders, varyings) {
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

  static #compileShader(shaderSource, shaderType) {
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

  static init() {
    const compiledShader = { vertex: {}, fragment: {} }
    
    for (const shaderType in Shaders.#shaderSource) {
      for (const name in Shaders.#shaderSource[shaderType]) {
        const source = ResourceManager.get(`${shaderType}_${name}`)
        compiledShader[shaderType][name] = Shaders.#compileShader(source, shaderType)
      }
    }

    for (const program in Shaders.#shaderPrograms) {
      const shaders = []
      for (const shaderType in Shaders.#shaderSource) {
        for (const shader in Shaders.#shaderPrograms[program][shaderType]) {
          shaders.push(compiledShader[shaderType][Shaders.#shaderPrograms[program][shaderType][shader]])
        }
      }

      Shaders.#shaderPrograms[program].program = Shaders.#linkProgram(shaders, program.varyings)
      if (!Shaders.#shaderPrograms[program].program) {
        return false
      }

      for (const uniform in Shaders.#shaderPrograms[program].uniforms) {
        Shaders.#shaderPrograms[program].uniforms[uniform] = GL.gl.getUniformLocation(Shaders.#shaderPrograms[program].program, uniform)
      }
    }
  }
}
