import { Controller, Post, Body, Get, Patch, ParseIntPipe, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "../../common/entities/user.entity";
import { CreateMusicianDto } from "./dto/create-musician.dto";
import { Musician } from "src/common/entities/musician.entity";
import { UpdateMusicianDto } from "./dto/update-musician.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post("create-musician")
  async createMusician(@Body() createMusicianDto: CreateMusicianDto): Promise<Musician> {
    return this.userService.createMusician(createMusicianDto);
  }

  @Patch("update-musician/:id")
  async updateMusician(@Body() updateMusicianDto: UpdateMusicianDto, @Param("id", ParseIntPipe) id: number,): Promise<Musician> {
    return this.userService.updateMusician(id, updateMusicianDto);
  }
}
