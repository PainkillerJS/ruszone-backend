import type { Prisma } from "@prisma/client";

export const RETURN_CONFIG_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  avatarPath: true,
  phone: true,
  favorites: {
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
      slug: true,
    },
  },
} satisfies Prisma.UserSelect;
