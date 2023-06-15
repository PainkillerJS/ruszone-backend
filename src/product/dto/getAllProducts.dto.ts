import { IsEnum, IsOptional, IsString } from "class-validator";

import { PaginationDto } from "src/pagination/dto/pagination.dto";

export enum EnumProductsSort {
  HIGN_PRICE = "HIGN_PRICE",
  LOW_PRICE = "LOW_PRICE",
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
}

export class GetAllProductsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(EnumProductsSort)
  sort?: EnumProductsSort;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}
