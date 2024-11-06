import {
  Controller,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Patch,
  Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Role, User } from "../../common/entities/user.entity";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { UserRolesGuard } from "src/common/guards/roles.guard";
import { UpdateUserDto } from "./dto/update-user.dto";
@UseGuards(JwtAuthGuard, UserRolesGuard)
@Roles(Role.ADMIN)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get("/:id")
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch("/:id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete("/:id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
