import { GL } from './gl.js'
import { ResourceManager } from './resourcemanager.js'

const shaderTypes = {
  'fragment': 'fs',
  'vertex': 'vs'
}

const shaderHeader =
`#version 300 es
precision highp int;
precision highp float;`

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
        'samplerCurrent': null,
        'samplerMotion': null,
        'samplerPrevious': null,
        'iTexel': null
      }
    },

    scene1: {
      'fragment': ['scene1'],
      'vertex': ['scene1'],
      'uniforms': {
        'inverseViewMatrix': null,
        'time': null
      }
    }
  }

  static getShaderResources() {
    const output = {}

    for (const programName in Shaders.#shaderPrograms) {
      const program = Shaders.#shaderPrograms[programName]
      for (const type in shaderTypes) {
        program[`${type}UrL`] = []
        for (const shaderName of program[type]) {
          const url = `shaders/${shaderName}.${shaderTypes[type]}.glsl`
          output[`${type}_${shaderName}`] = url
        }
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
    shaderSource = `${shaderHeader}\n\n${shaderSource}`

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

    for (const programName in Shaders.#shaderPrograms) {
      const program = Shaders.#shaderPrograms[programName]
      for (const shaderType in shaderTypes) {
        for (const shaderName of program[shaderType]) {
          if (shaderName in compiledShader[shaderType]) {
            continue
          }

          compiledShader[shaderType][shaderName] = Shaders.#compileShader(ResourceManager.get(`${shaderType}_${shaderName}`), shaderType)
        }
      }
    }
    
    for (const program in Shaders.#shaderPrograms) {
      const shaders = []
      for (const shaderType in shaderTypes) {
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
