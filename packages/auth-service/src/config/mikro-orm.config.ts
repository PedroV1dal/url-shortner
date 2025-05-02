import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { User } from "../entities/user.entity";

const config: Options = {
  entities: [User],
  driver: PostgreSqlDriver,
  dbName: process.env.DB_NAME ?? "url_shortner",
  host: process.env.DB_HOST ?? "localhost",
  port: parseInt(process.env.DB_PORT ?? "5432", 10),
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASS ?? "password",
  debug: process.env.NODE_ENV !== "production",
  entitiesTs: ["src/entities/**/*.entity.ts"],
  migrations: {
    path: "dist/migrations",
    pathTs: "src/migrations",
  },
  forceEntityConstructor: true,
};
