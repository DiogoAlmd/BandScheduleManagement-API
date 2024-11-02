import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { Scale } from "src/common/entities/scale.entity";
import { CreateScaleDto } from "../user/dto/create-scale.dto";
import { ScaleService } from "./scale.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { UserRolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/entities/user.entity";

@UseGuards(JwtAuthGuard, UserRolesGuard)
@Controller("scale")
export class ScaleController {
  constructor(private readonly scaleService: ScaleService) {}
  @Roles(Role.ADMIN)
  @Post(":adminId/scale")
  async createScale(
    @Param("adminId", ParseIntPipe) adminId: number,
    @Body() createScaleDto: CreateScaleDto,
  ): Promise<Scale> {
    return this.scaleService.createScale(adminId, createScaleDto);
  }
}
