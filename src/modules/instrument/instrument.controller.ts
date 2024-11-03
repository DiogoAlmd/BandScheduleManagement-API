import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { InstrumentService } from "./instrument.service";
import { Instrument } from "src/common/entities/instrument.entity";
import { CreateInstrument } from "./dto/create-instrument.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/entities/user.entity";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { UserRolesGuard } from "src/common/guards/roles.guard";

@UseGuards(JwtAuthGuard, UserRolesGuard)
@Roles(Role.ADMIN)
@Controller("instrument")
export class InstrumentController {
  constructor(private readonly instrumentService: InstrumentService) {}

  @Get()
  async findAll(): Promise<Instrument[]> {
    return this.instrumentService.findAll();
  }
  @Post()
  async create(
    @Body() createInstrumentDto: CreateInstrument,
  ): Promise<Instrument> {
    return this.instrumentService.createInstrument(createInstrumentDto);
  }
}
