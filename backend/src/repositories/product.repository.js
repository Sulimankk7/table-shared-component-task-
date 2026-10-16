
import { pool } from '../config/database.js';

export class ProductRepository {
  async findAll() {
    const result = await pool.query(
      'SELECT id, name, price, category, stock FROM products ORDER BY id'
    );

    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT id, name, price, category, stock FROM products WHERE id = $1',
      [id]
    );

    return result.rows[0] ?? null;
  }

  async create(product) {
    const { name, price, category, stock } = product;

    const result = await pool.query(
      `INSERT INTO products (name, price, category, stock)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, price, category, stock`,
      [name, price, category, stock]
    );

    return result.rows[0];
  }

  async update(id, product) {
    const { name, price, category, stock } = product;

    const result = await pool.query(
      `UPDATE products
       SET name = $1, price = $2, category = $3, stock = $4
       WHERE id = $5
       RETURNING id, name, price, category, stock`,
      [name, price, category, stock, id]
    );

    return result.rows[0] ?? null;
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    return result.rowCount > 0;
  }
}
