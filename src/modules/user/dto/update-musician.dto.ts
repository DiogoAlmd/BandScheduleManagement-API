import { IsString, IsEmail, IsArray, IsOptional } from "class-validator";

export class UpdateMusicianDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  instrumentIds?: number[];
}
