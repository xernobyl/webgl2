export class ResourceManager {
  constructor() {
    this.resources = new Map()  // Stores all resources
    this.loadPromises = []      // Tracks all loading promises
    this.initialized = false    // Flag for initialization status
    this.initCallbacks = []     // Callbacks to run after initialization
  }

  /**
   * Register a resource with a loading promise
   * @param {string} key - Unique identifier for the resource
   * @param {Promise} loadPromise - Promise that resolves when resource is loaded
   * @param {function} [initFn] - Optional initialization function for this resource
   */
  register(key, loadPromise, initFn = null) {
    if (this.initialized) {
      throw new Error('Cannot register resources after initialization');
    }

    const resourceEntry = {
      promise: loadPromise,
      initFn,
      loaded: false,
      value: null,
      error: null
    }

    this.resources.set(key, resourceEntry)

    const wrappedPromise = loadPromise
      .then(value => {
        resourceEntry.value = value
        resourceEntry.loaded = true
        return value
      })
      .catch(error => {
        resourceEntry.error = error
        throw error
      });

    this.loadPromises.push(wrappedPromise)
  }

  /**
   * Initialize all resources and run their init functions
   * @returns {Promise} Resolves when all resources are loaded and initialized
   */
  async initialize() {
    if (this.initialized) {
      return Promise.resolve()
    }

    try {
      // Wait for all resources to load
      await Promise.all(this.loadPromises)

      // Run individual initialization functions
      for (const [key, entry] of this.resources) {
        if (entry.initFn && entry.loaded && !entry.error) {
          entry.value = await entry.initFn(entry.value)
        }
      }

      this.initialized = true

      // Run global initialization callbacks
      for (const callback of this.initCallbacks) {
        await callback(this)
      }

      return this;
    } catch (error) {
      console.error('Resource initialization failed:', error)
      throw error
    }
  }

  /**
   * Add a callback to run after initialization
   * @param {function} callback - Function to call after initialization
   */
  onInit(callback) {
    if (this.initialized) {
      callback(this)
    } else {
      this.initCallbacks.push(callback)
    }
  }

  /**
   * Get a loaded resource
   * @param {string} key - Resource identifier
   * @returns The loaded resource value or null if not loaded
   */
  get(key) {
    const entry = this.resources.get(key)
    if (!entry) return null;
    return entry.value
  }

  /**
   * Check if all resources are loaded and initialized
   * @returns {boolean}
   */
  isReady() {
    return this.initialized
  }
}

/*
// Create a resource manager instance
const resourceManager = new ResourceManager();

// Register shaders (using the ShaderLoader from previous example)
resourceManager.register('basic-shader', 
  ShaderLoader.loadShaderProgram(
    gl,
    'shaders/basic.vert.glsl',
    'shaders/basic.frag.glsl'
  ),
  (shaderProgram) => {
    // Additional shader initialization if needed
    gl.useProgram(shaderProgram);
    shaderProgram.uResolution = gl.getUniformLocation(shaderProgram, 'uResolution');
    return shaderProgram;
  }
);

// Register textures
resourceManager.register('player-texture',
  loadTexture('images/player.png'),
  (texture) => {
    texture.filter = gl.LINEAR;
    return texture;
  }
);

// Register JSON data
resourceManager.register('level-data',
  fetch('data/level1.json').then(r => r.json())
);

// Add initialization callback
resourceManager.onInit((manager) => {
  console.log('All resources loaded!');
  startGame();
});

// Start loading process
resourceManager.initialize()
  .catch(error => {
    console.error('Failed to load resources:', error);
    showErrorScreen();
  });

// Example usage after initialization
function startGame() {
  const shader = resourceManager.get('basic-shader');
  const texture = resourceManager.get('player-texture');
  const levelData = resourceManager.get('level-data');
  
  // Now you can safely use all resources
}
*/
