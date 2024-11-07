import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HelloModule } from "./modules/hello/hello.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { InstrumentModule } from "./modules/instrument/instrument.module";
import { MusicianModule } from "./modules/musician/musician.module";
import { ScaleModule } from "./modules/scale/scale.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: "mysql",
        host: configService.getOrThrow<string>("DB_HOST"),
        port: configService.getOrThrow<number>("DB_PORT"),
        username: configService.getOrThrow<string>("DB_USERNAME"),
        password: configService.getOrThrow<string>("DB_PASSWORD"),
        database: configService.getOrThrow<string>("DB_DATABASE"),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    HelloModule,
    UserModule,
    AuthModule,
    InstrumentModule,
    MusicianModule,
    ScaleModule,
  ],
})
export class AppModule {}
