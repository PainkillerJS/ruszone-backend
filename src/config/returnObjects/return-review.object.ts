import { Prisma } from "@prisma/client";

export const RETURN_REVIEW = {
  createAt: true,
  updateAt: true,
  text: true,
  rating: true,
  id: true,
  user: {
    select: {
      id: true,
      name: true,
      avatarPath: true,
    },
  },
} satisfies Prisma.ReviewSelect;
