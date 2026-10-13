import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RestaurantsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createRestaurant(restaurant_name: string, email = "Pending") {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO restaurants (restaurant_name, email) VALUES (?, ?, ?)',
      [restaurant_name, email],
    );
    return { restaurant_id: result.insertId, restaurant_name, email };
  }

  async findById(restaurant_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT restaurant_id, restaurant_name, email FROM restaurants WHERE restaurant_id = ?',
      [restaurant_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT restaurant_id, restaurant_name, email, FROM restaurants',
    );
    return rows;
  }

  async updateRestaurant(restaurant_id: number, partial: { restaurant_name?: string; email?: number; }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.email) {
      fields.push('email = ?');
      values.push(partial.email);
    }

    if (fields.length === 0) return await this.findById(restaurant_id);

    values.push(restaurant_id);

    const sql = `UPDATE restaurants SET ${fields.join(', ')} WHERE restaurant_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(restaurant_id);
  }

  async delteRestaurant(restaurant_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM restaurants WHERE restaurant_id = ?',
      [restaurant_id],
    );
    return result.affectedRows > 0;
  }
}