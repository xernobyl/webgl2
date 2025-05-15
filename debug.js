/* eslint-disable max-lines-per-function */
const createFloatingConsole = () => {
  const commands = new Map()

  // Attach console UI
  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.bottom = '10px'
  container.style.right = '10px'
  container.style.zIndex = '2147483647'
  document.body.appendChild(container)

  const shadow = container.attachShadow({ mode: 'open' })

  shadow.innerHTML = `
    <style>
      #console-panel {
        width: 320px;
        max-height: 240px;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.85);
        color: #0f0;
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        border-radius: 8px 8px 0 0;
        box-shadow: 0 0 10px rgba(0,0,0,0.4);
        white-space: pre-wrap;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .log { color: #0f0; }
      .warn { color: #ff5; }
      .error { color: #f55; }
      #command-input {
        width: 100%;
        border: none;
        padding: 6px;
        font-family: monospace;
        font-size: 12px;
        background: #111;
        color: #0f0;
        border-top: 1px solid #333;
        border-radius: 0 0 8px 8px;
        outline: none;
      }
    </style>
    <div id="console-panel"></div>
    <input id="command-input" placeholder="Enter command..." />
  `

  const panel = shadow.querySelector('#console-panel')
  const input = shadow.querySelector('#command-input')

  const appendEntry = (type, args) => {
    const entry = document.createElement('div')
    entry.className = type
    entry.textContent = args.map(arg => {
      try {
        return typeof arg === 'object'
          ? JSON.stringify(arg, null, 2)
          : String(arg)
      } catch {
        return '[unserializable]'
      }
    }).join(' ')
    panel.appendChild(entry)
    panel.scrollTop = panel.scrollHeight
  }

  // Patch console
  const original = {
    log: console.log,
    warn: console.warn,
    error: console.error
  }

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

  // Safe eval-ish argument parser
  const parseArgs = argsStr => {
    const wrapped = `[${argsStr}]`
    try {
      return Function(`"use strict"; return ${wrapped}`)()
    } catch {
      console.error('Failed to parse arguments')
      return []
    }
  }

  // Command parser
  const runCommand = input => {
    const match = input.trim().match(/^(\w+)\s*\((.*)\)$/)
    if (!match) {
      console.error('Invalid command format. Use funcName(arg1, arg2, ...)')
      return
    }
    // eslint-disable-next-line no-unused-vars
    const [_, name, argsStr] = match
    const fn = commands.get(name)
    if (!fn) {
      console.error(`Unknown command: ${name}`)
      return
    }
    const args = parseArgs(argsStr)
    try {
      const result = fn(...args)
      console.log(`> ${name} →`, result)
    } catch (err) {
      console.error(`Error in ${name}:`, err)
    }
  }

  // Input handling
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = input.value.trim().toLowerCase()
      if (val) {
        runCommand(val)
        input.value = ''
      }
    }
  })

  // Expose command registration globally
  window.registerCommand = (name, fn) => {
    if (typeof name !== 'string' || typeof fn !== 'function') {
      throw new Error('Usage: registerCommand("name", function)')
    }
    commands.set(name.toLowerCase(), fn)
    console.log(`Registered command: ${name}`)
  }
}

createFloatingConsole()
