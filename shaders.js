import { GL } from './gl.js'
import { ResourceManager } from './resourcemanager.js'

const shaderTypes = {
  'fragment': 'fs',
  'vertex': 'vs',
  'geometry': 'gs'
}

export class Shaders {
  static #shaderPrograms = {
    screen: {
      'fragment': ['common', 'color', 'blur', 'screen'],
      'vertex': ['screen'],
      'uniforms': {
        'screen_size': null,
        'inverse_screen_size': null,
        'time': null,
        'screen': null,
        'bloom': null,
        'texelSize': null,
        'uAspectScale': null
      }
    },

    particles0: {
      'fragment': ['common', 'hash', 'openSimplex2', 'distance', 'particleFlat'],
      'vertex': ['common', 'hash', 'openSimplex2', 'distance', 'particleBasic'],
      'uniforms': {
        'mvp': null
      }
    },

    flat: {
      'fragment': ['common', 'hash', 'openSimplex2', 'distance', 'flat'],
      'vertex': ['common', 'hash', 'openSimplex2', 'distance', 'flat'],
      'uniforms': {
        'mvp': null,
        'mv': null
      }
    },

    color: {
      'fragment': ['common', 'hash', 'openSimplex2', 'distance', 'color'],
      'vertex': ['common', 'hash', 'openSimplex2', 'distance', 'flat'],
      'uniforms': {
        'mvp': null,
        'mv': null,
        'color': null
      }
    },

    plane: {
      'fragment': ['common', 'hash', 'openSimplex2', 'distance', 'plane'],
      'vertex': ['common', 'hash', 'openSimplex2', 'distance', 'plane'],
      'uniforms': {
        'mvp': null,
        'previousMVP': null,
        'mv': null,
        'color': null,
        'bias': null
      }
    },

    taa: {
      'fragment': ['common', 'hash', 'openSimplex2', 'distance', 'taa'],
      'vertex': ['common', 'hash', 'openSimplex2', 'distance', 'taa'],
      'uniforms': {
        'samplerCurrent': null,
        'samplerMotion': null,
        'samplerPrevious': null,
        'iTexel': null
      }
    },

    scene1: {
      'fragment': ['common', 'hash', 'openSimplex2', 'distance', 'scene1'],
      'vertex': ['common', 'hash', 'openSimplex2', 'distance', 'scene1'],
      'uniforms': {
        'inverseViewMatrix': null,
        'currentViewProjMatrix': null,
        'previousViewProjMatrix': null,
        'time': null,
        'resolution': null,
        'fov': null,
        'lightInfo': null,
        'jitter': null
      }
    },

    blur_brightness: {
      'fragment': ['openSimplex2', 'blur', 'blur_brightness'],
      'vertex': ['quad_basic'],
      'uniforms': {
        'color': null,
        'texelSize': null,
        'threshold': null,
        'uRadius': null
      }
    },

    blur_downsample: {
      'fragment': ['blur', 'blur_downsample'],
      'vertex': ['quad_basic'],
      'uniforms': {
        'color': null,
        'texelSize': null,
        'uRadius': null
      }
    },

    blur_upsample: {
      'fragment': ['blur', 'blur_upsample'],
      'vertex': ['quad_basic'],
      'uniforms': {
        'color': null,
        'texelSize': null,
        'uRadius': null
      }
    },

    lens: {
      'fragment': ['lens'],
      'vertex': ['lens'],
      'uniforms': {
        'bloom': null,
        'ar': null
      }
    }
  }

  static getShaderResources() {
    const output = {}

    for (const programName in Shaders.#shaderPrograms) {
      const program = Shaders.#shaderPrograms[programName]
      for (const type in shaderTypes) {
        if (!(type in program)) {
          continue
        }

        for (let i = 0; i < program[type].length; i++) {
          const shaderName = program[type][i]
          let resourceName
          let resourceURL

          if (i === (program[type].length - 1)) {
            resourceURL = `shaders/${shaderName}.${shaderTypes[type]}.glsl`
            resourceName = `${type}_${shaderName}`
          } else {
            resourceURL = `shaders/${shaderName}.glsl`
            resourceName = `glsl_${shaderName}`
          }

          if (resourceName in output) {
            continue
          }

          output[resourceName] = resourceURL
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

  static #getShaderSource(shaderType, shaders) {
    let source = `#version 300 es
precision highp int;
precision highp float;

`

    for (let i = 0; i < shaders.length; i++) {
      const shaderName = shaders[i]
      let resourceName

      if (i === (shaders.length - 1)) {
        resourceName = `${shaderType}_${shaderName}`
      } else {
        resourceName = `glsl_${shaderName}`
      }

      const sourceBit = ResourceManager.get(resourceName)
      if (sourceBit === null) {
        throw new Error(`resource "${resourceName}" not found`)
      }

      source += sourceBit
    }

    return source
  }

  static #compileShader(shaderSource, shaderType) {
    switch (shaderType) {
      case 'vertex':
        shaderType = GL.gl.VERTEX_SHADER
        break
      case 'geometry':
        shaderType = GL.gl.GEOMETRY_SHADER
        break
      default:
        shaderType = GL.gl.FRAGMENT_SHADER
    }

    const shader = GL.gl.createShader(shaderType)
    GL.gl.shaderSource(shader, shaderSource)
    GL.gl.compileShader(shader)

    if (!GL.gl.getShaderParameter(shader, GL.gl.COMPILE_STATUS)) {
      const shaderLines = shaderSource.split('\n')
      for (const line in shaderLines) {
        console.error(`${line}:\t${shaderLines[line]}`)
      }

      throw new Error(GL.gl.getShaderInfoLog(shader))
    }

    return shader
  }

  static init() {
    for (const programName in Shaders.#shaderPrograms) {
      const program = Shaders.#shaderPrograms[programName]
      const shaders = []

      for (const shaderType in shaderTypes) {
        if (shaderType in program) {
          const shaderSource = Shaders.#getShaderSource(shaderType, program[shaderType])
          const compiledShader = Shaders.#compileShader(shaderSource, shaderType)
          shaders.push(compiledShader)
        }
      }

      Shaders.#shaderPrograms[programName].program = Shaders.#linkProgram(shaders, programName.varyings)
      if (!Shaders.#shaderPrograms[programName].program) {
        return false
      }

      for (const uniform in Shaders.#shaderPrograms[programName].uniforms) {
        Shaders.#shaderPrograms[programName].uniforms[uniform] = GL.gl.getUniformLocation(Shaders.#shaderPrograms[programName].program, uniform)
      }
    }
  }
}
