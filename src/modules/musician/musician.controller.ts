import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { MusicianService } from "./musician.service";
import { CreateMusicianDto } from "./dto/create-musician.dto";
import { User } from "src/common/entities/user.entity";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { UserRolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/entities/user.entity";
import { UpdateMusicianDto } from "./dto/update-musician.dto";
import { Instrument } from "src/common/entities/instrument.entity";

@UseGuards(JwtAuthGuard, UserRolesGuard)
@Controller("musician")
export class MusicianController {
  constructor(private readonly musicianService: MusicianService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createMusicianDto: CreateMusicianDto): Promise<User> {
    return this.musicianService.create(createMusicianDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<User[]> {
    return this.musicianService.findAll();
  }

  @Roles(Role.ADMIN)
  @Delete("/:id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.musicianService.remove(id);
  }

  @Roles(Role.ADMIN)
  @Patch("/:id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMusicianDto: UpdateMusicianDto,
  ): Promise<User> {
    return this.musicianService.update(id, updateMusicianDto);
  }

  @Roles(Role.MUSICIAN)
  @Get("/myInstruments/:id")
  async getMyInstruments(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Instrument[]> {
    return this.musicianService.getMyInstruments(id);
  }
}
