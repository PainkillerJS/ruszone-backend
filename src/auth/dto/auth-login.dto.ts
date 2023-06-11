import { IsEmail, IsString, MinLength } from "class-validator";

export class AuthLoginDto {
  @IsEmail({}, { message: "Почта введена не верно" })
  email: string;

  @MinLength(6, {
    message: "Слишком короткий пароль, минимальная длина должна быть 6",
  })
  @IsString({ message: "Пароль должен быть строкой" })
  password: string;
}
