import { Prisma } from "@prisma/client";
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class ProductDto implements Prisma.ProductUpdateInput {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  images: string[];

  @IsNumber()
  categoryId: number;
}
