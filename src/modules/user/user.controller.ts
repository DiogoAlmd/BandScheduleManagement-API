import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateScaleDto } from "./dto/create-scale.dto";
import { User } from "../../common/entities/user.entity";
import { Scale } from "../../common/entities/scale.entity";

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

  @Post(":adminId/scale")
  async createScale(
    @Param("adminId", ParseIntPipe) adminId: number,
    @Body() createScaleDto: CreateScaleDto,
  ): Promise<Scale> {
    return this.userService.createScale(adminId, createScaleDto);
  }
}
