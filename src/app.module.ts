import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HelloModule } from "./modules/hello/hello.module";
import { UserModule } from "./modules/user/user.module";
import { DataSource } from "typeorm";
import { DatabaseModule } from "./common/database/database.module";
import { HashService } from "./common/middlewares/hash.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HelloModule,
    UserModule,
    DatabaseModule,
  ],
  providers: [
    {
      provide: "DATA_SOURCE",
      useFactory: (DataSource: DataSource) => DataSource,
    },
    HashService,
  ],
})
export class AppModule {}
