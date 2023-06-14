import { Controller, Get, ParseIntPipe } from "@nestjs/common";

import { User } from "@prisma/client";

import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/auth/decorators/user.decorator";

import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Auth()
  async getAll(@CurrentUser("id", ParseIntPipe) userId: User["id"]) {
    return this.ordersService.getAll(userId);
  }
}
