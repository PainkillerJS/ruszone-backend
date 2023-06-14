import { Injectable } from "@nestjs/common";

import type { User } from "@prisma/client";

import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class StatisticsService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  async getMain(userId: User["id"]) {
    const user = await this.userService.byId(userId, {
      orders: {
        select: {
          items: true,
        },
      },
      reviews: true,
    });

    return [
      {
        name: "Orders",
        value: user.orders.length,
      },
      {
        name: "Reviews",
        value: user.reviews.length,
      },
      {
        name: "Favorites",
        value: user.favorites.length,
      },
    ];
  }
}
