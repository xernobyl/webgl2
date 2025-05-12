const createFloatingConsole = () => {
  // Create shadow DOM root
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.bottom = '10px'
  container.style.right = '10px'
  container.style.zIndex = '2147483647' // Topmost
  document.body.appendChild(container)

  const shadow = container.attachShadow({ mode: 'open' })

  // Styles and structure inside shadow root
  shadow.innerHTML = `
    <style>
      #console-panel {
        width: 320px;
        max-height: 200px;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.85);
        color: #0f0;
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.4);
        white-space: pre-wrap;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .log { color: #0f0; }
      .warn { color: #ff5; }
      .error { color: #f55; }
    </style>
    <div id="console-panel"></div>
  `

  const panel = shadow.querySelector('#console-panel')

  const formatArgs = args =>
    args.map(arg => {
      try {
        return typeof arg === 'object'
          ? JSON.stringify(arg, null, 2)
          : String(arg)
      } catch {
        return '[unserializable]'
      }
    }).join(' ')

  const appendEntry = (type, args) => {
    const entry = document.createElement('div')
    entry.className = type
    entry.textContent = formatArgs(args)
    panel.appendChild(entry)
    panel.scrollTop = panel.scrollHeight
  }

  // Save original console methods
  const original = {
    log: console.log,
    warn: console.warn,
    error: console.error
  }

  // Override methods
  console.log = (...args) => {
    original.log(...args)
    appendEntry('log', args)
  }

  console.warn = (...args) => {
    original.warn(...args)
    appendEntry('warn', args)
  }

  console.error = (...args) => {
    original.error(...args)
    appendEntry('error', args)
  }
}

// Auto-run on module load
createFloatingConsole()
