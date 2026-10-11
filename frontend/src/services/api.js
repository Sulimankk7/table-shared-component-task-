const API_URL = 'http://localhost:3000/api'

const get = async (resource) => {
  const response = await fetch(`${API_URL}/${resource}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch ${resource}`)
  }

  return response.json()
}

const post = async (resource, data) => {
  const response = await fetch(`${API_URL}/${resource}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`Failed to create ${resource}`)
  }

  return response.json()
}

const put = async (resource, id, data) => {
  const response = await fetch(`${API_URL}/${resource}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error(`Failed to update ${resource}`)
  }

  return response.json()
}

const remove = async (resource, id) => {
  const response = await fetch(`${API_URL}/${resource}/${id}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    throw new Error(`Failed to delete ${resource}`)
  }
}

export const getAll = (resource) => {
  return get(resource)
}

export const create = (resource, data) => {
  return post(resource, data)
}

export const update = (resource, id, data) => {
  return put(resource, id, data)
}

export const removeItem = (resource, id) => {
  return remove(resource, id)
}