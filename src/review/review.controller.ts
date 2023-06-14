import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { Product, User } from "@prisma/client";

import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/auth/decorators/user.decorator";

import { ReviewDto } from "./dto/review.dto";
import { ReviewService } from "./review.service";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  async getAll() {
    return this.reviewService.getAll();
  }

  @Get(":productId")
  async getAverageValueByProductd(
    @Param("productId", ParseIntPipe) productId: Product["id"],
  ) {
    return this.reviewService.getAverageValueByProductd(productId);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Post(":productId")
  async create(
    @CurrentUser("id", ParseIntPipe) userId: User["id"],
    @Param("productId", ParseIntPipe) productId: Product["id"],
    @Body() dto: ReviewDto,
  ) {
    return this.reviewService.create({ dto, userId, productId });
  }
}
