import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import type { User } from "@prisma/client";

import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/auth/decorators/user.decorator";

import { UserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @Auth()
  async getProfile(@CurrentUser("id") id: User["id"]) {
    return this.userService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put("profile")
  async updateProfile(@CurrentUser("id") id: User["id"], @Body() dto: UserDto) {
    return this.userService.updateProfile(id, dto);
  }

  @Auth()
  @HttpCode(200)
  @Patch("profile/favorites/:productId")
  async toggleFavorites(
    @Param("productId", ParseIntPipe) productId: number,
    @CurrentUser("id") userId: User["id"],
  ) {
    return this.userService.toggleFavorites(productId, userId);
  }
}
