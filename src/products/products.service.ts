import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ProductsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createProduct(product_name: string, descriptions = "Pending") {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO products (product_name, descriptions) VALUES (?, ?, ?)',
      [product_name, descriptions],
    );
    return { product_id: result.insertId, product_name, descriptions };
  }

  async findById(product_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT product_id, product_name, descriptions FROM products WHERE product_id = ?',
      [product_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT product_id, product_name, descriptions, FROM products',
    );
    return rows;
  }

  async updateProduct(product_id: number, partial: { product_name?: string; descriptions?: number; }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.descriptions) {
      fields.push('descriptions = ?');
      values.push(partial.descriptions);
    }

    if (fields.length === 0) return await this.findById(product_id);

    values.push(product_id);

    const sql = `UPDATE products SET ${fields.join(', ')} WHERE product_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(product_id);
  }

  async deleteProduct(product_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM products WHERE product_id = ?',
      [product_id],
    );
    return result.affectedRows > 0;
  }
}