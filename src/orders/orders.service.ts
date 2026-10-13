import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class OrdersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createOrder(orders_name: string, orders_code = "Pending") {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO orders (orders_name, orders_code) VALUES (?, ?, ?)',
      [orders_name, orders_code],
    );
    return { order_id: result.insertId, orders_name, orders_code };
  }

  async findById(order_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id, orders_name, orders_code FROM orders WHERE order_id = ?',
      [order_id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id, orders_name, orders_code, FROM orders',
    );
    return rows;
  }

  async updateOrder(order_id: number, partial: { orders_name?: string; orders_code?: number; }) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.orders_code) {
      fields.push('orders_code = ?');
      values.push(partial.orders_code);
    }

    if (fields.length === 0) return await this.findById(order_id);

    values.push(order_id);

    const sql = `UPDATE orders SET ${fields.join(', ')} WHERE order_id = ?`;
    await this.pool().execute(sql, values);

    return this.findById(order_id);
  }

  async deleteOrder(order_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM orders WHERE order_id = ?',
      [order_id],
    );
    return result.affectedRows > 0;
  }
}