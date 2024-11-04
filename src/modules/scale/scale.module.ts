import { Module } from "@nestjs/common";
import { ScaleService } from "./scale.service";
import { ScaleController } from "./scale.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Instrument } from "src/common/entities/instrument.entity";
import { ScaleMusician } from "src/common/entities/scale-musician.entity";
import { Scale } from "src/common/entities/scale.entity";
import { User } from "src/common/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Scale, Instrument, ScaleMusician])],
  providers: [ScaleService],
  controllers: [ScaleController],
})
export class ScaleModule {}
