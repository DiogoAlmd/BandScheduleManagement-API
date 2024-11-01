import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { User } from "../../common/entities/user.entity";
import { HashService } from "src/common/middlewares/hash.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, HashService],
  controllers: [UserController],
})
export class UserModule {}
