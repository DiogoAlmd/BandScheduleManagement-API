import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/common/database/database.module";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { userProviders } from "./user.providers";

@Module({
  imports: [DatabaseModule],
  providers: [UserService, ...userProviders],
  controllers: [UserController],
})
export class UserModule {}
