import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { MusicianService } from "./musician.service";
import { CreateMusicianDto } from "./dto/create-musician.dto";
import { User } from "src/common/entities/user.entity";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { UserRolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/entities/user.entity";

@UseGuards(JwtAuthGuard, UserRolesGuard)
@Controller("musician")
export class MusicianController {
  constructor(private readonly musicianService: MusicianService) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(@Body() createMusicianDto: CreateMusicianDto): Promise<User> {
    return this.musicianService.create(createMusicianDto);
  }
}
