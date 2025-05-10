export class MIDIManager {
  // =====================
  // Static Properties
  // =====================
  static midiAccess = null
  static inputs = new Map()
  static outputs = new Map()
  
  // MIDI State Tracking
  static sliderState = new Map()
  static encoderState = new Map()

  // =====================
  // Public Methods
  // =====================

  /**
   * Initialize MIDI access and set up event listeners
   * @returns {Promise<boolean>} True if initialization succeeded
   */
  static async initialize() {
    if (!navigator.requestMIDIAccess) {
      console.error('WebMIDI is not supported in your browser')
      return false
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess({ sysex: false })
      this.#setupEventListeners()
      this.#updateDeviceLists()
      console.log('MIDI initialized successfully')
      return true
    } catch (error) {
      console.error('MIDI initialization failed:', error)
      return false
    }
  }

  // =====================
  // State Getters
  // =====================

  static getSliderValue(slider) {
    return this.sliderState.get(slider) || 0
  }

  static getEncoderValue(encoder) {
    return this.encoderState.get(encoder) || 0
  }

  static #setupEventListeners() {
    if (!this.midiAccess) {
      return
    }

    // Handle device connection/disconnection
    this.midiAccess.onstatechange = event => {
      console.log(`Device ${event.port.name} ${event.port.state}`)
      this.#updateDeviceLists()
      
      if (event.port.state === 'connected' && event.port.type === 'input') {
        event.port.onmidimessage = msg => this.handleMessage(msg)
      }
    }
  }

  static #updateDeviceLists() {
    this.inputs.clear()
    this.outputs.clear()

    if (this.midiAccess) {
      // Update inputs
      this.midiAccess.inputs.forEach(input => {
        this.inputs.set(input.id, input)
        input.onmidimessage = msg => this.#handleMessage(msg)
      })

      // Update outputs
      this.midiAccess.outputs.forEach(output => {
        this.outputs.set(output.id, output)
      })
    }
  }

  static #handleMessage(message) {
    const [command, data1, data2] = message.data
    const commandType = command & 0xf0
    const channel = (command & 0x0f) + 1

    switch (commandType) {
      case 0xB0: { // Control Change
        let value = this.encoderState.get(data1) || 0
        
        if (data2 === 65) {
          value -= 1
        } else if (data2 === 1) {
          value += 1
        }

        console.debug('encoder', data1, value)
        this.encoderState.set(data1, value)
        break
      }

      case 0xE0: { // Pitch Bend
        const value = ((data2 << 7) | data1) / 16256
        console.debug('slider', channel, value)
        this.sliderState.set(channel, value)
        break
      }

      default:
        console.debug('ignoring midi command:', message.timeStamp, commandType, data1, data2, channel)
    }
  }
}
