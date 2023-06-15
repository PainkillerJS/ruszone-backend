import { Prisma } from "@prisma/client";

import { RETURN_CATEGORY } from "./return-category.object";
import { RETURN_REVIEW } from "./return-review.object";

export const RETURN_PRODUCT = {
  images: true,
  description: true,
  id: true,
  name: true,
  price: true,
  createAt: true,
  updateAt: true,
  slug: true,
} satisfies Prisma.ProductSelect;

export const RETURN_PRODUCT_FULLEST = {
  ...RETURN_PRODUCT,
  reviews: {
    select: RETURN_REVIEW,
  },
  category: {
    select: RETURN_CATEGORY,
  },
} satisfies Prisma.ProductSelect;
