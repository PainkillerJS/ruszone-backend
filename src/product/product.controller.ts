import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { Category, Product } from "@prisma/client";

import { Auth } from "src/auth/decorators/auth.decorator";

import { GetAllProductsDto } from "./dto/getAllProducts.dto";
import { ProductDto } from "./dto/product.dto";
import { ProductService } from "./product.service";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() quaryDto: GetAllProductsDto) {
    return this.productService.getAll(quaryDto);
  }

  @Get(":id")
  async getById(@Param("id", ParseIntPipe) productId: Product["id"]) {
    return this.productService.byId(productId);
  }

  @Get("similar/:id")
  async getSimilar(@Param("id", ParseIntPipe) productId: Product["id"]) {
    return this.productService.getSimilar(productId);
  }

  @Get("by-slug/:slug")
  async getProductBySlug(@Param("slug") slugProduct: Product["slug"]) {
    return this.productService.bySlug(slugProduct);
  }

  @Get("by-category/:categorySlug")
  async getProductsByCategory(
    @Param("categorySlug") categorySlug: Category["slug"],
  ) {
    return this.productService.byCategory(categorySlug);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async createProduct(@Body() dto: ProductDto) {
    return this.productService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(":id")
  async updateProduct(
    @Param("id", ParseIntPipe) productId: Product["id"],
    @Body() dto: ProductDto,
  ) {
    return this.productService.update(productId, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) productId: Product["id"]) {
    return this.productService.delete(productId);
  }
}
