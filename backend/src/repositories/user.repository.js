
import { pool } from '../config/database.js';

export class UserRepository {
  async findAll() {
    const result = await pool.query(
      'SELECT id, name, email, age FROM users ORDER BY id'
    );

    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT id, name, email, age FROM users WHERE id = $1',
      [id]
    );

    return result.rows[0] ?? null;
  }

  async create(user) {
    const { name, email, age } = user;

    const result = await pool.query(
      `INSERT INTO users (name, email, age)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, age`,
      [name, email, age]
    );

    return result.rows[0];
  }

  async update(id, user) {
    const { name, email, age } = user;

    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2, age = $3
       WHERE id = $4
       RETURNING id, name, email, age`,
      [name, email, age, id]
    );

    return result.rows[0] ?? null;
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );

    return result.rowCount > 0;
  }
}
