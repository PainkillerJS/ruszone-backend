import { Injectable } from "@nestjs/common";

import { User } from "@prisma/client";

import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: User["id"]) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: {
        createAt: "desc",
      },
    });
  }
}
