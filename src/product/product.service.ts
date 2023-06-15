import { Injectable, NotFoundException } from "@nestjs/common";

import { Category, Prisma, Product } from "@prisma/client";

import { generateSlug } from "src/common/utils/generateSlug";
import { RETURN_PRODUCT, RETURN_PRODUCT_FULLEST } from "src/config";
import { PaginationService } from "src/pagination/pagination.service";
import { PrismaService } from "src/prisma/prisma.service";

import { SORT_DATA } from "./config/filter-product.config";
import { GetAllProductsDto } from "./dto/getAllProducts.dto";
import { ProductDto } from "./dto/product.dto";
import type {
  GetCategoryByParamTypeReturn,
  GetProductByParamTypeParams,
} from "./interfaces";

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  private async getProductByParam<T extends keyof GetProductByParamTypeParams>(
    param: T,
    value: GetProductByParamTypeParams[T],
  ): Promise<GetCategoryByParamTypeReturn> {
    const product = await this.prisma.product.findUnique({
      where: { [param]: value },
      select: RETURN_PRODUCT_FULLEST,
    });

    if (!product) {
      throw new NotFoundException("This product not found");
    }

    return product;
  }

  async getAll(dto: GetAllProductsDto = {}) {
    const { sort, searchTerm } = dto;

    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            },
            {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    const { perPage, skip } = this.paginationService.getPagination(dto);

    const products = this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: [SORT_DATA[sort]],
      skip,
      take: perPage,
    });

    const lengthProducts = this.prisma.product.count({
      where: prismaSearchTermFilter,
    });

    const resultPromiseAllSettled = await Promise.allSettled([
      products,
      lengthProducts,
    ]);

    const result = resultPromiseAllSettled.reduce((obj, resultRequest) => {
      if (resultRequest.status === "fulfilled") {
        const nameField =
          typeof resultRequest.value === "number" ? "length" : "products";

        return { ...obj, [nameField]: resultRequest.value };
      }

      return obj;
    }, {});

    return result;
  }

  async byId(productId: Product["id"]) {
    return this.getProductByParam("id", productId);
  }

  async bySlug(productSlug: Product["slug"]) {
    return this.getProductByParam("slug", productSlug);
  }

  async byCategory(categorySlug: Category["slug"]) {
    const products = await this.prisma.product.findMany({
      where: {
        category: { slug: categorySlug },
      },
      select: RETURN_PRODUCT_FULLEST,
    });

    if (!products?.length) {
      throw new NotFoundException("The products not found");
    }

    return products;
  }

  async getSimilar(productId: Product["id"]) {
    const currentProduct = await this.byId(productId);

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          name: currentProduct.category.name,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createAt: "desc",
      },
      select: RETURN_PRODUCT,
    });

    return products;
  }

  async create(dto: ProductDto) {
    return this.prisma.product.create({
      data: { ...dto, slug: generateSlug(dto.name) },
    });
  }

  async update(
    productId: Product["id"],
    { description, images, price, name, categoryId }: ProductDto,
  ) {
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        description,
        images,
        price,
        name,
        slug: generateSlug(name),
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  async delete(productId: Product["id"]) {
    return this.prisma.product.delete({ where: { id: productId } });
  }
}
