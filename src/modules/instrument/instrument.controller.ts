import { Body, Controller, Post } from "@nestjs/common";
import { InstrumentService } from "./instrument.service";
import { Instrument } from "src/common/entities/instrument.entity";
import { CreateInstrument } from "./dto/create-instrument.dto";

@Controller("instrument")
export class InstrumentController {
  constructor(private readonly instrumentService: InstrumentService) {}

  @Post()
  async create(
    @Body() createInstrumentDto: CreateInstrument,
  ): Promise<Instrument> {
    return this.instrumentService.createInstrument(createInstrumentDto);
  }
}
