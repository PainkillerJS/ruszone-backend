import { Prisma } from "@prisma/client";

export const returnCategoryObject = {
  id: true,
  name: true,
  slug: true,
} satisfies Prisma.CategorySelect;

export const returnsCategoryObject: Prisma.CategorySelect = {
  id: true,
  name: true,
  slug: true,
};
