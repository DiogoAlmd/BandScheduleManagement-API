import { PartialType } from "@nestjs/mapped-types";
import { CreateMusicianDto } from "./create-musician.dto";
import { IsArray, IsOptional } from "class-validator";

export class UpdateMusicianDto extends PartialType(CreateMusicianDto) {
  @IsOptional()
  @IsArray()
  instrumentIds?: number[];
}
