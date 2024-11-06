import {
  IsEmail,
  IsString,
  IsStrongPassword,
  IsNotEmpty,
} from "class-validator";
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
