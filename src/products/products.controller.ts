import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('Products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // Get all Products (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.productsService.getAll();
  }

  // Get single order by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':product_id')
  async getOne(@Param('product_id') product_id: string) {
    return this.productsService.findById(+product_id);
  }

  // Create order (open - for demo)
  @Post()
  async create(@Body() body: { product_name: string; descriptions?: string }) {
    return this.productsService.createProduct(body.product_name, body.descriptions);
  }

  // Update order (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':product_id')
  async update(@Param('product_id') product_id: string, @Body() body: any) {
    return this.productsService.updateProduct(+product_id, body);
  }

  // Delete order (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':product_id')
  async remove(@Param('order_id') product_id: string) {
    return this.productsService.deleteProduct(+product_id);
  }
}