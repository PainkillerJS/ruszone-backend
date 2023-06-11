import { IsString } from "class-validator";

export class RefreshTokenDto {
  @IsString({ message: "Refresh tokenдолжен быть строкой" })
  refreshToken: string;
}
