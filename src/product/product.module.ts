import { Module } from "@nestjs/common";

import { PaginationModule } from "src/pagination/pagination.module";

import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
  imports: [PaginationModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
