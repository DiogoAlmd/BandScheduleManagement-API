import { IsString, IsNotEmpty } from "class-validator";

export class CreateInstrument {
  @IsNotEmpty()
  @IsString()
  name: string;
}
