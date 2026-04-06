const store = new Map()

export function get(key) {
  return store.get(key)
}

export function set(key, val) {
  store.set(key, val)
}

export function clear() {
  store.clear()
}

export function getAll() {
  return Object.fromEntries(store)
}
