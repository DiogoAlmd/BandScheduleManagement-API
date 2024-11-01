import {
  IsEmail,
  IsString,
  IsStrongPassword,
  IsNotEmpty,
  IsArray,
} from "class-validator";

export class CreateMusicianDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsArray()
  instrumentIds?: number[];
}
