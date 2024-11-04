import {
  IsDateString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class MusicianInstrument {
  @IsNotEmpty()
  musicianId: number;

  @IsArray()
  @ArrayNotEmpty()
  instrumentIds: number[];
}

export class CreateScaleDto {
  @IsNotEmpty()
  @IsDateString()
  eventDate: Date;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MusicianInstrument)
  musicians: MusicianInstrument[];
}
