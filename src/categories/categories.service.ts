import { Injectable, NotFoundException } from "@nestjs/common";

import type { Category, Prisma } from "@prisma/client";

import { generateSlug } from "src/common/utils/generateSlug";
import { RETURN_CATEGORY } from "src/config/returnObjects/return-category.object";
import { PrismaService } from "src/prisma/prisma.service";

import { CategoriesDto } from "./dto/categories.dto";

type GetCategoryByParamTypeParams = Pick<Category, "id" | "slug">;

type GetCategoryByParamTypeReturn = Prisma.CategoryGetPayload<{
  select: typeof RETURN_CATEGORY;
}>;

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
      select: RETURN_CATEGORY,
    });

    if (!category) {
      throw new NotFoundException("This category not found");
    }

    return category;
  }

  async getAll() {
    return this.prisma.category.findMany({ select: RETURN_CATEGORY });
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
