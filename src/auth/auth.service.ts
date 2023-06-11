import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { faker } from "@faker-js/faker";
import type { User } from "@prisma/client";
import { hash, verify } from "argon2";

import { PrismaService } from "./../prisma/prisma.service";
import { AuthLoginDto } from "./dto/auth-login.dto";
import { AuthRegisterDto } from "./dto/auth-register.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import {
  FindEmptyOldUserParamsType,
  FindExistOldUserParamsType,
  FindOldUserParamsType,
  IssueTokensParamsType,
  ModeFindOldUser,
} from "./interfaces/auth.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async issueTokens(
    data: IssueTokensParamsType,
  ): Promise<Record<"accessToken" | "refreshToken", string>> {
    const accessToken = this.jwtService.sign(data, {
      expiresIn: "1h",
    });

    const refreshToken = this.jwtService.sign(data, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }

  private userFields(
    user: User,
  ): Pick<User, "name" | "id" | "email" | "phone"> {
    return {
      email: user.email,
      id: user.id,
      name: user.name,
      phone: user.phone,
    };
  }

  private async findOldUser(payload: FindExistOldUserParamsType): Promise<User>;
  private async findOldUser(payload: FindEmptyOldUserParamsType): Promise<void>;
  private async findOldUser({
    mode,
    email,
  }: FindOldUserParamsType): Promise<void | User> {
    const oldUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (mode === ModeFindOldUser.EMPTY) {
      if (oldUser) {
        throw new UnauthorizedException("User already exist");
      }

      return;
    } else if (mode === ModeFindOldUser.EXIST) {
      if (!oldUser) {
        throw new NotFoundException("User not found");
      }

      return oldUser;
    }
  }

  private async validateUser(dto: AuthLoginDto) {
    const user = await this.findOldUser({
      email: dto.email,
      mode: ModeFindOldUser.EXIST,
    });

    const isValid = await verify(user.password, dto.password);

    if (!isValid) {
      throw new UnauthorizedException("Invalid password");
    }

    return user;
  }

  async register(dto: AuthRegisterDto) {
    await this.findOldUser({ email: dto.email, mode: ModeFindOldUser.EMPTY });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        avatarPath: faker.image.avatar(),
        phone: dto.phone,
        password: await hash(dto.password),
      },
    });

    const tokens = await this.issueTokens({ id: user.id });

    return { user: this.userFields(user), ...tokens };
  }

  async login(dto: AuthLoginDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokens({ id: user.id });

    return { user: this.userFields(user), ...tokens };
  }

  async accessToken(dto: RefreshTokenDto) {
    const result = await this.jwtService.verifyAsync<IssueTokensParamsType>(
      dto.refreshToken,
    );

    if (!result) {
      throw new UnauthorizedException("Ошибка авторизации");
    }

    const user = await this.prisma.user.findUnique({
      where: { id: result.id },
    });

    const tokens = await this.issueTokens({ id: user.id });

    return { user: this.userFields(user), ...tokens };
  }
}
