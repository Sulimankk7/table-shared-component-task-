import { getAll, create, update, remove } from './api.js'

const RESOURCE = 'products'

export const getProducts = () => getAll(RESOURCE)

export const createProduct = (data) => create(RESOURCE, data)

export const updateProduct = (id, data) => update(RESOURCE, id, data)

export const deleteProduct = (id) => remove(RESOURCE, id)
