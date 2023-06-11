import { IsEmail, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class AuthRegisterDto {
  @IsEmail({}, { message: "Почта введена не верно" })
  email: string;

  @MinLength(6, {
    message: "Слишком короткий пароль, минимальная длина должна быть 6",
  })
  @IsString({ message: "Пароль должен быть строкой" })
  password: string;

  @IsString({ message: "Имя должно быть строкой" })
  name: string;

  @IsPhoneNumber("RU", {
    message: "Не валидный номер, пожалуйста, попробуйте снова",
  })
  phone: string;
}
