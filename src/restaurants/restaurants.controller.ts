import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  // Get all orders (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.restaurantsService.getAll();
  }

  // Get single order by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':restaurant_id')
  async getOne(@Param('restaurant_id') restaurant_id: string) {
    return this.restaurantsService.findById(+restaurant_id);
  }

  // Create order (open - for demo)
  @Post()
  async create(@Body() body: { restaurant_name: string; email?: string }) {
    return this.restaurantsService.createRestaurant(body.restaurant_name, body.email);
  }

  // Update order (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':restaurant_id')
  async update(@Param('restaurant_id') restaurant_id: string, @Body() body: any) {
    return this.restaurantsService.updateRestaurant(+restaurant_id, body);
  }

  // Delete order (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':restaurant_id')
  async remove(@Param('restaurant_id') restaurant_id: string) {
    return this.restaurantsService.delteRestaurant(+restaurant_id);
  }
}