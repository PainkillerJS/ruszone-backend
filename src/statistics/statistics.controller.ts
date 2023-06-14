import { Controller, Get, ParseIntPipe } from "@nestjs/common";

import { User } from "@prisma/client";

import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/auth/decorators/user.decorator";

import { StatisticsService } from "./statistics.service";

@Controller("statistics")
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @Auth()
  async getMainStatistics(@CurrentUser("id", ParseIntPipe) userId: User["id"]) {
    return this.statisticsService.getMain(userId);
  }
}
