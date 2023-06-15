import { Prisma, Product } from "@prisma/client";

import { RETURN_PRODUCT_FULLEST } from "src/config";

import { EnumProductsSort } from "../dto/getAllProducts.dto";

export type GetProductByParamTypeParams = Pick<Product, "id" | "slug">;

export type GetCategoryByParamTypeReturn = Prisma.ProductGetPayload<{
  select: typeof RETURN_PRODUCT_FULLEST;
}>;

export type SortDataType = Record<
  EnumProductsSort,
  Prisma.ProductOrderByWithRelationInput
>;
