const KeyMute0 = 0x10
const KeySolo0 = 0x08
const KeyRecord0 = 0x00
const KeySelect0 = 0x18
const KeyPlay = 0x5e
const KeyPause = 0x5d
const KeyRecord = 0x5f
const KeyFastBackwards = 0x5b
const KeyFastForward = 0x5c
const KeyLeftLeft = 0x2e
const KeyRightRight = 0x2f
const KeyUp = 0x60
const KeyDown = 0x61
const KeyLeft = 0x62
const KeyRight = 0x63

export class MIDIManager {
  static #midiAccess = null
  static #inputs = new Map()
  static #outputs = new Map()

  static #sliderState = new Map()
  static #encoderState = new Map()

  static #sequencerTimer = null
  static #sequencerStep = 0

  static async initialize() {
    if (!navigator.requestMIDIAccess) {
      console.error('WebMIDI is not supported in your browser')
      return false
    }

    try {
      MIDIManager.#midiAccess = await navigator.requestMIDIAccess({ sysex: false })
      MIDIManager.#setupEventListeners()
      MIDIManager.#updateDeviceLists()
      console.info('MIDI initialized successfully')

      return true
    } catch (error) {
      console.error('MIDI initialization failed:', error)
      return false
    }
  }

  static getSliderValue(slider) {
    return MIDIManager.#sliderState.get(slider) || 0
  }

  static setSliderValue(slider, value) {
    MIDIManager.#sliderState.set(slider, value)
  }

  static getEncoderValue(encoder) {
    return MIDIManager.#encoderState.get(encoder) || 0
  }

  static setEncoderValue(encoder, value) {
    return MIDIManager.#encoderState.set(encoder, value)
  }

  static #sendMIDIMessage(message) {
    for (const output of MIDIManager.#outputs.values()) {
      output.send(message)
    }
  }

  static setLED(note, state) {
    const channel = 1
    const status = 0x90 | ((channel - 1) & 0x0F) // Note On, channel masked
    const velocity = state ? 127 : 0
    MIDIManager.#sendMIDIMessage(new Uint8Array([status, note, velocity]))
  }

  // =====================
  // Private Methods
  // =====================

  static #setupEventListeners() {
    if (!MIDIManager.#midiAccess) {
      return
    }

    MIDIManager.#midiAccess.onstatechange = event => {
      console.info(`Device ${event.port.name} ${event.port.state}`)
      MIDIManager.#updateDeviceLists()

      if (event.port.state === 'connected' && event.port.type === 'input') {
        event.port.onmidimessage = msg => MIDIManager.#handleMessage(msg)
      }
    }
  }

  static #updateDeviceLists() {
    MIDIManager.#inputs.clear()
    MIDIManager.#outputs.clear()

    if (MIDIManager.#midiAccess) {
      MIDIManager.#midiAccess.inputs.forEach(input => {
        MIDIManager.#inputs.set(input.id, input)
        input.onmidimessage = msg => MIDIManager.#handleMessage(msg)
      })

      MIDIManager.#midiAccess.outputs.forEach(output => {
        MIDIManager.#outputs.set(output.id, output)
      })
    }
  }

  static #handleMessage(message) {
    const [command, data1, data2] = message.data
    const commandType = command & 0xf0
    const channel = (command & 0x0f) + 1

    switch (commandType) {
      case 0xB0: { // Control Change (Encoders)
        const encoderId = data1 - 16
        let value = MIDIManager.#encoderState.get(encoderId) || 0
        value += data2 > 64 ? -data2 + 64 : data2
        MIDIManager.#encoderState.set(encoderId, value)
        break
      }

      case 0xE0: { // Pitch Bend (Sliders)
        const value = ((data2 << 7) | data1) / 16256
        MIDIManager.#sliderState.set(channel - 1, value)
        break
      }

      case 0x90: {  // Note (Buttons)
        if (data2 === 0) {
          console.debug('MIDI key up', data1)
        } else if (data2 === 127) {
          console.debug('MIDI key down', data1)
        }
        break
      }

      default:
        console.debug('ignoring midi command:', message.timeStamp, commandType, data1, data2, channel)
    }
  }

  static startSequencer(bpm = 120) {
    MIDIManager.stopSequencer()

    const interval = (60 / bpm) * 1000 // ms per beat

    MIDIManager.#sequencerTimer = setInterval(() => {
      MIDIManager.setLED(0x18 + (MIDIManager.#sequencerStep + 7) % 8, false)
      MIDIManager.setLED(0x18 + MIDIManager.#sequencerStep, true)
      MIDIManager.#sequencerStep = (MIDIManager.#sequencerStep + 1) % 8
    }, interval)
  }

  static stopSequencer() {
    if (MIDIManager.#sequencerTimer) {
      clearInterval(MIDIManager.#sequencerTimer)
      MIDIManager.#sequencerTimer = null
    }

    // Optionally turn off all Select LEDs
    for (let i = 0; i < 8; i++) {
      MIDIManager.setLED(0x18 + i, false)
    }
  }
}
