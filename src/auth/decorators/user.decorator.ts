import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import type { User } from "@prisma/client";

import type { IssueTokensParamsType } from "../interfaces/auth.interface";

export const CurrentUser = createParamDecorator(
  (data: keyof IssueTokensParamsType, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    const user = req.user as User;

    return data ? user[data] : user;
  },
);
