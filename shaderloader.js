export class ShaderLoader {
  /**
   * Load a shader from a URL
   * @param {WebGLRenderingContext} gl - WebGL context
   * @param {string} vertexShaderUrl - URL to vertex shader
   * @param {string} fragmentShaderUrl - URL to fragment shader
   * @returns {Promise<WebGLProgram>} Compiled and linked shader program
   */
  static async loadShaderProgram(gl, vertexShaderUrl, fragmentShaderUrl) {
    try {
      const [vertexSource, fragmentSource] = await Promise.all([
        ShaderLoader._loadShaderFile(vertexShaderUrl),
        ShaderLoader._loadShaderFile(fragmentShaderUrl)
      ])

      const vertexShader = ShaderLoader._compileShader(gl, gl.VERTEX_SHADER, vertexSource)
      const fragmentShader = ShaderLoader._compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)

      return ShaderLoader._linkProgram(gl, vertexShader, fragmentShader)
    } catch (error) {
      console.error('Shader loading failed:', error)
      throw error
    }
  }

  static async _loadShaderFile(url) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load shader: ${response.statusText}`)
    }
    return await response.text()
  }

  static _compileShader(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader)
      gl.deleteShader(shader)
      throw new Error(`Shader compilation error: ${info}`)
    }

    return shader
  }

  static _linkProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program)
      gl.deleteProgram(program)
      throw new Error(`Program linking error: ${info}`)
    }

    return program
  }
}
