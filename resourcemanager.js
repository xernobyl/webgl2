export class ResourceManager {
  static #resources = {}
  static #loadedCount = 0
  static #allLoadedCallback = null

  // Add a resource and start loading immediately
  static add(name, url, callback = null) {
    const resource = { url, callback, data: null }
    ResourceManager.#resources[name] = resource

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load ${url}`)
        }

        return response.text()
      })
      .then(data => {
        resource.data = data
        if (callback) {
          callback(data)
        }
        ResourceManager.#loadedCount++
        if (ResourceManager.#loadedCount === Object.keys(ResourceManager.#resources).length && ResourceManager.#allLoadedCallback) {
          ResourceManager.#allLoadedCallback()
        }
      })
      .catch(error => {
        console.error(`Error loading resource ${name}:`, error)
        ResourceManager.#loadedCount++
        if (ResourceManager.#loadedCount === Object.keys(ResourceManager.#resources).length && ResourceManager.#allLoadedCallback) {
          ResourceManager.#allLoadedCallback()
        }
      })
  }

  // Set the callback to be called when all resources are loaded
  static onAllLoaded(callback) {
    ResourceManager.#allLoadedCallback = callback
    // Check immediately in case all were already loaded
    if (ResourceManager.#loadedCount === Object.keys(ResourceManager.#resources).length) {
      ResourceManager.#allLoadedCallback()
    }
  }

  // Get the loaded data by resource name
  static get(name) {
    return ResourceManager.#resources[name].data
  }
}
