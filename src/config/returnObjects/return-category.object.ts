import { Prisma } from "@prisma/client";

export const RETURN_CATEGORY = {
  id: true,
  name: true,
  slug: true,
} satisfies Prisma.CategorySelect;
