
const REQUIRED_METHODS = [
  'findAll',
  'findById',
  'create',
  'update',
  'delete',
];

export class DataManager {
  constructor(repositoryFactory) {
    this.repositoryFactory = repositoryFactory;
  }

  getRepository(resource) {
    const repository = this.repositoryFactory.getRepository(resource);

    if (!repository) {
      throw new Error(`Unsupported resource: ${resource}`);
    }

    for (const method of REQUIRED_METHODS) {
      if (typeof repository[method] !== 'function') {
        throw new Error(
          `Repository for "${resource}" must implement "${method}"`
        );
      }
    }

    return repository;
  }

  async getAll(resource) {
    const repository = this.getRepository(resource);
    return repository.findAll();
  }

  async getById(resource, id) {
    const repository = this.getRepository(resource);
    return repository.findById(id);
  }

  async create(resource, itemData) {
    const repository = this.getRepository(resource);
    return repository.create(itemData);
  }

  async update(resource, id, itemData) {
    const repository = this.getRepository(resource);
    return repository.update(id, itemData);
  }

  async remove(resource, id) {
    const repository = this.getRepository(resource);
    return repository.delete(id);
  }
}
