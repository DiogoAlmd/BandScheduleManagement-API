import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "../../common/entities/user.entity";
import { HashService } from "src/common/middlewares/hash.service";
import { Musician } from "src/common/entities/musician.entity";
import { Instrument } from "src/common/entities/instrument.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Musician, Instrument])],
  providers: [UserService, HashService],
  controllers: [UserController],
})
export class UserModule {}
