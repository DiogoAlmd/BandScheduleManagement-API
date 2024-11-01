import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsArray,
} from "class-validator";

export class CreateMusicianDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsArray()
  instrumentIds: number[];
}
