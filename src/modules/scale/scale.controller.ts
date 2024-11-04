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
import { Scale } from "src/common/entities/scale.entity";
import { CreateScaleDto } from "./dto/create-scale.dto";
import { ScaleService } from "./scale.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { UserRolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/entities/user.entity";
import { UpdateScaleDto } from "./dto/update-scale.dto";

@UseGuards(JwtAuthGuard, UserRolesGuard)
@Controller("scale")
export class ScaleController {
  constructor(private readonly scaleService: ScaleService) {}
  @Roles(Role.ADMIN)
  @Post(":adminId")
  async createScale(
    @Param("adminId", ParseIntPipe) adminId: number,
    @Body() createScaleDto: CreateScaleDto,
  ): Promise<Scale> {
    return this.scaleService.createScale(adminId, createScaleDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAll(): Promise<Scale[]> {
    return this.scaleService.findAll();
  }

  @Roles(Role.ADMIN)
  @Patch(":scaleId/update")
  async updateScale(
    @Param("scaleId", ParseIntPipe) scaleId: number,
    @Body() updateScaleDto: UpdateScaleDto,
  ): Promise<Scale> {
    return this.scaleService.updateScale(scaleId, updateScaleDto);
  }

  @Roles(Role.ADMIN)
  @Delete(":scaleId/delete")
  async deleteScale(
    @Param("scaleId", ParseIntPipe) scaleId: number,
  ): Promise<void> {
    return this.scaleService.deleteScale(scaleId);
  }
}
