import { IsDateString, IsArray, IsOptional } from "class-validator";

export class UpdateScaleDto {
  @IsDateString()
  @IsOptional()
  eventDate: string;

  @IsArray()
  @IsOptional()
  musicians: {
    musicianId: number;
    instrumentIds: number[];
  }[];
}
