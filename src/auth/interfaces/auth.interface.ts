import type { User } from "@prisma/client";

export type IssueTokensParamsType = Pick<User, "id">;

export const enum ModeFindOldUser {
  EXIST = "EXIST",
  EMPTY = "EMPTY",
}

export interface FindExistOldUserParamsType {
  email: User["email"];
  mode: ModeFindOldUser.EXIST;
}

export interface FindEmptyOldUserParamsType {
  email: User["email"];
  mode: ModeFindOldUser.EMPTY;
}

export type FindOldUserParamsType =
  | FindEmptyOldUserParamsType
  | FindExistOldUserParamsType;
