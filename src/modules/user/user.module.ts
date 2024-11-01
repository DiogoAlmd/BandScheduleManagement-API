import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "../../common/entities/user.entity";
import { Scale } from "../../common/entities/scale.entity";
import { Instrument } from "../../common/entities/instrument.entity";
import { HashService } from "src/common/middlewares/hash.service";
import { ScaleMusicianInstrument } from "src/common/entities/scale-musician-instrument.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Scale,
      Instrument,
      ScaleMusicianInstrument,
    ]),
  ],
  providers: [UserService, HashService],
  controllers: [UserController],
})
export class UserModule {}
