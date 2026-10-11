const API_URL = 'http://localhost:3000/api'

// One helper for all requests
const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}/${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  // DELETE returns 204 with no body
  if (response.status === 204) return null

  return response.json()
}

export const getAll = (resource) => request(resource)

export const create = (resource, data) =>
  request(resource, { method: 'POST', body: JSON.stringify(data) })

export const update = (resource, id, data) =>
  request(`${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const remove = (resource, id) =>
  request(`${resource}/${id}`, { method: 'DELETE' })
