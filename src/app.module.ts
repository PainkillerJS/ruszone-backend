import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { OrdersModule } from "./orders/orders.module";
import { PaginationModule } from "./pagination/pagination.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductModule } from "./product/product.module";
import { ReviewModule } from "./review/review.module";
import { StatisticsModule } from "./statistics/statistics.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaModule,
    UserModule,
    ProductModule,
    ReviewModule,
    CategoriesModule,
    OrdersModule,
    StatisticsModule,
    PaginationModule,
  ],
  controllers: [],
})
export class AppModule {}
