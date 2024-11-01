import { Body, Controller, Post } from "@nestjs/common";
import { MusicianService } from "./musician.service";
import { CreateMusicianDto } from "./dto/create-musician.dto";
import { User } from "src/common/entities/user.entity";

@Controller("musician")
export class MusicianController {
  constructor(private readonly musicianService: MusicianService) {}

  @Post()
  async create(@Body() createMusicianDto: CreateMusicianDto): Promise<User> {
    return this.musicianService.create(createMusicianDto);
  }
}
