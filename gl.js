export class GL {
  static #canvas
  static #gl
  static #frame = 0
  static #time = 0.0        // milliseconds
  static #timeOffset = 0.0  // milliseconds
  static #cbLoad = null
  static #cbLoop = null
  static #cbResize = null

  static #createCanvas() {
    GL.#canvas = document.createElement('canvas')
  
    Object.assign(document.body.style, {
      margin: '0',
      padding: '0',
      overflow: 'hidden',
      position: 'fixed',
      width: '100vw',
      height: '100vh'
    })
    
    Object.assign(GL.#canvas.style, {
      display: 'block',
      width: '100%',
      height: '100%'
    })
  }

  static #createContext() {
    GL.#gl = GL.#canvas.getContext('webgl2', { alpha: false, depth: false, stencil: false, antialias: false })
    if (GL.#gl === null) {
      throw new Error('WebGL 2.0 not supported, apparently 🤷')
    }
  
    const ext = GL.#gl.getExtension('EXT_color_buffer_float')
    if (!ext) {
      throw new Error('Floating-point rendering not supported! We kind of need that')
    }
  
    console.log(GL.#gl.getSupportedExtensions())
  }

  static #onResize() {
    const dpr = devicePixelRatio || 1
    const width = Math.floor(innerWidth * dpr)
    const height = Math.floor(innerHeight * dpr)
  
    if (GL.#canvas.width !== width || GL.#canvas.height !== height) {
      GL.#canvas.width = width
      GL.#canvas.height = height
    }

    if (GL.#cbResize !== null) {
      GL.#cbResize()
    }
  }

  static #renderLoop(frameTime) {
    if (GL.#frame === 0) {
      GL.#timeOffset = frameTime
    }
    
    // const oldTime = time
    GL.#time = frameTime - GL.#timeOffset
    // const dt = (frameTime - oldTime)

    GL.#cbLoop()

    ++GL.#frame
    requestAnimationFrame(GL.#renderLoop)
  }

  static #onLoad() {
    GL.#createCanvas()
    GL.#createContext()

    GL.#onResize()
    addEventListener('resize', GL.#onResize)

    document.body.appendChild(GL.#canvas)
    
    requestAnimationFrame(GL.#renderLoop)
  }
  
  static init(load, loop, resize) {
    GL.#cbLoad = load
    GL.#cbLoop = loop
    GL.#cbResize = resize
    addEventListener('load', GL.#onLoad)
  }

  static get gl() {
    return GL.#gl
  }

  static get canvas() {
    return GL.#canvas
  }

  static get frame() {
    return GL.#frame
  }

  static get time() {
    return GL.#time
  }
  
  static get timeOffset() {
    return GL.#timeOffset
  }
}
