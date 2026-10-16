import { UserRepository } from '../repositories/user.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';

export class RepositoryFactory {
  constructor() {
    this.repositories = {
      users: new UserRepository(),
      products: new ProductRepository(),
    };
  }

  getRepository(resource) {
    const repository = this.repositories[resource];

    if (!repository) {
      throw new Error(`Unsupported resource: ${resource}`);
    }

    return repository;
  }
}