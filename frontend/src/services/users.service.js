import { getAll, create, update, remove } from './api.js'

const RESOURCE = 'users'

export const getUsers = () => getAll(RESOURCE)

export const createUser = (data) => create(RESOURCE, data)

export const updateUser = (id, data) => update(RESOURCE, id, data)

export const deleteUser = (id) => remove(RESOURCE, id)
