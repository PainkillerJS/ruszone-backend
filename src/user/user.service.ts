import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import type { Prisma, User } from "@prisma/client";
import { hash } from "argon2";

import { PrismaService } from "src/prisma/prisma.service";

import { RETURN_CONFIG_USER_SELECT } from "./config/return-type.object";
import { UserDto } from "./dto/user.dto";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async byId(id: User["id"], selectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: Object.assign(RETURN_CONFIG_USER_SELECT, selectObject),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async updateProfile(id: User["id"], dto: UserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user && id !== user.id) {
      throw new BadRequestException("Email is exist");
    }

    const currentUser = await this.byId(id);

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email: dto.email,
        name: dto.name,
        avatarPath: dto.avatarPath,
        phone: dto.phone,
        password: dto.password
          ? await hash(dto.password)
          : currentUser.password,
      },
      select: RETURN_CONFIG_USER_SELECT,
    });
  }

  async toggleFavorites(productId: number, userId: User["id"]) {
    const user = await this.byId(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isExists = user.favorites.some((product) => product.id === productId);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        favorites: {
          [isExists ? "disconnect" : "connect"]: {
            id: productId,
          },
        },
      },
    });

    return "Success";
  }
}
