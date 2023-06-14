import { Injectable, NotFoundException } from "@nestjs/common";

import type { Category } from "@prisma/client";

import type { CommonKeys } from "src/common/ts-utils";
import { generateSlug } from "src/common/utils/generateSlug";
import { PrismaService } from "src/prisma/prisma.service";

import { returnCategoryObject } from "./config/return-category.object";
import { CategoriesDto } from "./dto/categories.dto";

type GetCategoryByParamTypeParams = Pick<Category, "id" | "slug">;

type GetCategoryByParamTypeReturn = Pick<
  Category,
  CommonKeys<typeof returnCategoryObject, Category>
>;

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private async getCategoryByParam<
    T extends keyof GetCategoryByParamTypeParams,
  >(
    param: T,
    value: GetCategoryByParamTypeParams[T],
  ): Promise<GetCategoryByParamTypeReturn> {
    const category = await this.prisma.category.findUnique({
      where: { [param]: value },
      select: returnCategoryObject,
    });

    if (!category) {
      throw new NotFoundException("This category not found");
    }

    return category;
  }

  async getAll() {
    return this.prisma.category.findMany({ select: returnCategoryObject });
  }

  async byId(id: Category["id"]) {
    return this.getCategoryByParam("id", id);
  }

  async bySlug(slug: Category["slug"]) {
    return this.getCategoryByParam("slug", slug);
  }

  async create(dto: CategoriesDto) {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: generateSlug(dto.name),
      },
    });
  }

  async update(id: Category["id"], dto: CategoriesDto) {
    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: generateSlug(dto.name),
      },
    });
  }

  async delete(id: Category["id"]) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
