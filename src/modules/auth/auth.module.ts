import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "../../common/entities/user.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./stretegies/jwt.strategy";
import { HashService } from "src/common/middlewares/hash.service";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1h" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, HashService],
  exports: [JwtModule, JwtStrategy],
})
export class AuthModule {}
