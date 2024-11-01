import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MusicianService } from "./musician.service";
import { MusicianController } from "./musician.controller";
import { User } from "../../common/entities/user.entity";
import { HashService } from "src/common/middlewares/hash.service";
import { Instrument } from "src/common/entities/instrument.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Instrument])],
  providers: [MusicianService, HashService],
  controllers: [MusicianController],
})
export class MusicianModule {}
