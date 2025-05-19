export class MIDIManager {
  static midiAccess = null
  static inputs = new Map()
  static outputs = new Map()
  
  static sliderState = new Map()
  static encoderState = new Map()

  // =====================
  // Public Methods
  // =====================

  static async initialize() {
    if (!navigator.requestMIDIAccess) {
      console.error('WebMIDI is not supported in your browser')
      return false
    }

    try {
      MIDIManager.midiAccess = await navigator.requestMIDIAccess({ sysex: false })
      MIDIManager.#setupEventListeners()
      MIDIManager.#updateDeviceLists()
      console.log('MIDI initialized successfully')
      return true
    } catch (error) {
      console.error('MIDI initialization failed:', error)
      return false
    }
  }

  static getSliderValue(slider) {
    return MIDIManager.sliderState.get(slider) || 0
  }

  static getEncoderValue(encoder) {
    return MIDIManager.encoderState.get(encoder) || 0
  }

  /**
   * Send a MIDI message to all connected output devices
   * @param {Uint8Array} message - MIDI message bytes
   */
  static sendMIDIMessage(message) {
    for (const output of MIDIManager.outputs.values()) {
      output.send(message)
    }
  }

  /**
   * Set an LED on or off using a Note On message (Mackie-style)
   * @param {number} note - The MIDI note number (button/LED ID)
   * @param {boolean} state - true = LED on, false = off
   * @param {number} [channel=1] - MIDI channel (1-16)
   */
  static setLED(note, state) {
    const channel = 1
    const status = 0x90 | ((channel - 1) & 0x0F) // Note On, channel masked
    const velocity = state ? 127 : 0
    MIDIManager.sendMIDIMessage(new Uint8Array([status, note, velocity]))
  }

  static setAllLEDs(state) {
    for (let i = 0; i < 128; i++) {
      MIDIManager.setLED(i, state)
    }
  }

  // =====================
  // Private Methods
  // =====================

  static #setupEventListeners() {
    if (!MIDIManager.midiAccess) {
      return
    }

    MIDIManager.midiAccess.onstatechange = event => {
      console.log(`Device ${event.port.name} ${event.port.state}`)
      MIDIManager.#updateDeviceLists()

      if (event.port.state === 'connected' && event.port.type === 'input') {
        event.port.onmidimessage = msg => MIDIManager.#handleMessage(msg)
      }
    }
  }

  static #updateDeviceLists() {
    MIDIManager.inputs.clear()
    MIDIManager.outputs.clear()

    if (MIDIManager.midiAccess) {
      MIDIManager.midiAccess.inputs.forEach(input => {
        MIDIManager.inputs.set(input.id, input)
        input.onmidimessage = msg => MIDIManager.#handleMessage(msg)
      })

      MIDIManager.midiAccess.outputs.forEach(output => {
        MIDIManager.outputs.set(output.id, output)
      })
    }
  }

  static #handleMessage(message) {
    const [command, data1, data2] = message.data
    const commandType = command & 0xf0
    const channel = (command & 0x0f) + 1

    switch (commandType) {
      case 0xB0: { // Control Change (Encoders)
        let value = MIDIManager.encoderState.get(data1) || 0
        value += data2 > 64 ? -data2 + 64 : data2
        console.debug('encoder', data1, value)
        MIDIManager.encoderState.set(data1, value)
        break
      }

      case 0xE0: { // Pitch Bend (Sliders)
        const value = ((data2 << 7) | data1) / 16256
        console.debug('slider', channel, value)
        MIDIManager.sliderState.set(channel, value)
        break
      }

      default:
        console.debug('ignoring midi command:', message.timeStamp, commandType, data1, data2, channel)
    }
  }
}
