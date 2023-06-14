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
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import type { Category } from "@prisma/client";

import { Auth } from "src/auth/decorators/auth.decorator";

import { CategoriesDto } from "./dto/categories.dto";
import { CategoriesService } from "./categories.service";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Get()
  async getAllCategories() {
    return this.categoryService.getAll();
  }

  @Get("by-slug/:slug")
  @Auth()
  async getBySlug(@Param("slug") slug: Category["slug"]) {
    return this.categoryService.bySlug(slug);
  }

  @Get(":categoryId")
  @Auth()
  async getById(@Param("categoryId", ParseIntPipe) categoryId: Category["id"]) {
    return this.categoryService.byId(categoryId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Post()
  async create(@Body() dto: CategoriesDto) {
    return this.categoryService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(":categoryId")
  async update(
    @Param("categoryId", ParseIntPipe) categoryId: Category["id"],
    @Body() dto: CategoriesDto,
  ) {
    return this.categoryService.update(categoryId, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(":categoryId")
  async delete(@Param("categoryId", ParseIntPipe) categoryId: Category["id"]) {
    return this.categoryService.delete(categoryId);
  }
}
