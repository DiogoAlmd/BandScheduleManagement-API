import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";

export const databaseProviders = [
  {
    provide: "DATA_SOURCE",
    useFactory: async () => {
      const configService = new ConfigService();
      const dataSource = new DataSource({
        type: "mysql",
        host: configService.getOrThrow<string>("DB_HOST"),
        port: configService.getOrThrow<number>("DB_PORT"),
        username: configService.getOrThrow<string>("DB_USERNAME"),
        password: configService.getOrThrow<string>("DB_PASSWORD"),
        database: configService.getOrThrow<string>("DB_DATABASE"),
        entities: [__dirname + "../../../modules/**/*.entity{.ts,.js}"],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
