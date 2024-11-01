import {
  IsEmail,
  IsString,
  IsStrongPassword,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsArray,
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

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  instrumentIds?: number[];

  @IsNotEmpty()
  @IsEnum(["admin", "musician"], {
    message: "Role must be either admin or musician",
  })
  role: "admin" | "musician";
}
