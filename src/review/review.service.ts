import { HttpException, Injectable } from "@nestjs/common";

import { Product, User } from "@prisma/client";

import { PrismaService } from "src/prisma/prisma.service";

import { RETURN_REVIEW } from "../config/returnObjects/return-review.object";

import { ReviewDto } from "./dto/review.dto";

interface CreateReviewParamsType {
  userId: User["id"];
  dto: ReviewDto;
  productId: Product["id"];
}

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.review.findMany({
      select: RETURN_REVIEW,
      orderBy: {
        createAt: "desc",
      },
    });
  }

  async create({ dto, productId, userId }: CreateReviewParamsType) {
    return this.prisma.review
      .create({
        data: {
          ...dto,
          product: {
            connect: {
              id: productId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      })
      .catch(() => {
        throw new HttpException(
          "Ошибка, возможно, такого продукта не существует",
          404,
        );
      });
  }

  async getAverageValueByProductd(productId: Product["id"]) {
    return this.prisma.review
      .aggregate({
        where: { productId },
        _avg: { rating: true },
      })
      .then((data) => ({
        averageRating: data._avg.rating.toFixed(2),
      }));
  }
}
