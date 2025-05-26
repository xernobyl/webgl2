const DEBUG = true

export class GL {
  static #canvas
  static #gl
  static #frame = 0
  static #time = 0.0        // milliseconds
  static #timeOffset = 0.0  // milliseconds
  static #frameDuration     // milliseconds
  static #cbLoad = null
  static #cbLoop = null
  static #cbResize = null
  static #aspectRatio

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
    const rect = GL.#canvas.getBoundingClientRect()
    const dpr = devicePixelRatio || 1
    const width = Math.floor(rect.width * dpr)
    const height = Math.floor(rect.height * dpr)

    GL.#aspectRatio = width / height

    if (GL.#canvas.width !== width || GL.#canvas.height !== height) {
      GL.#canvas.width = width
      GL.#canvas.height = height

      if (GL.#cbResize !== null) {
        GL.#cbResize()
      }
    }
  }

  static #logStats() {
    // console.log(`Frames: ${GL.#frame}`)
    // console.log(`FPS: ${10000.0 / GL.#frameDuration}`)
  }

  static #renderLoop(frameTime) {
    if (GL.#frame === 0) {
      GL.#timeOffset = frameTime
    }

    const previousTime = GL.#time
    GL.#time = frameTime - GL.#timeOffset
    GL.#frameDuration = (frameTime - previousTime)

    if (GL.#frame % 120 === 119) {
      GL.#logStats()
    }

    GL.#cbLoop()

    ++GL.#frame
    requestAnimationFrame(GL.#renderLoop)
  }

  static #onLoad() {


    GL.#createCanvas()
    GL.#createContext()

    if (GL.#cbLoad !== null) {
      GL.#cbLoad()
    }

    document.body.appendChild(GL.#canvas)

    GL.#onResize()
    addEventListener('resize', GL.#onResize)

    requestAnimationFrame(GL.#renderLoop)
  }

  static init(load, loop, resize) {
    GL.#cbLoad = load
    GL.#cbLoop = loop
    GL.#cbResize = resize
    //addEventListener('load', GL.#onLoad)
    GL.#onLoad()
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

  static get aspectRatio() {
    return GL.#aspectRatio
  }
}
