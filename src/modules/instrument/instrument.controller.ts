import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { InstrumentService } from "./instrument.service";
import { Instrument } from "src/common/entities/instrument.entity";
import { CreateInstrument } from "./dto/create-instrument.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/entities/user.entity";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { UserRolesGuard } from "src/common/guards/roles.guard";

@UseGuards(JwtAuthGuard, UserRolesGuard)
@Controller("instrument")
export class InstrumentController {
  constructor(private readonly instrumentService: InstrumentService) {}

  @Get()
  async findAll(): Promise<Instrument[]> {
    return this.instrumentService.findAll();
  }
  @Roles(Role.ADMIN)
  @Post()
  async create(
    @Body() createInstrumentDto: CreateInstrument,
  ): Promise<Instrument> {
    return this.instrumentService.createInstrument(createInstrumentDto);
  }
  @Roles(Role.ADMIN)
  @Delete("/:id")
  async delete(@Param("id", ParseIntPipe) id: number): Promise<Instrument> {
    return this.instrumentService.deleteInstrument(id);
  }
}
