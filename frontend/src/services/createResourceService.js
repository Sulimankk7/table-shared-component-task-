
import { getAll, create, update, remove } from './api.js'

export function createResourceService(resource) {
  return {
    getAll: () => getAll(resource),
    create: (data) => create(resource, data),
    update: (id, data) => update(resource, id, data),
    remove: (id) => remove(resource, id),
  }
}
