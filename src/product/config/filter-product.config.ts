import { EnumProductsSort } from "../dto/getAllProducts.dto";
import { SortDataType } from "../interfaces";

export const SORT_DATA: SortDataType = {
  [EnumProductsSort.LOW_PRICE]: { price: "asc" },
  [EnumProductsSort.HIGN_PRICE]: { price: "desc" },
  [EnumProductsSort.OLDEST]: { createAt: "asc" },
  [EnumProductsSort.NEWEST]: { createAt: "desc" },
};
