import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { User } from "../entities/user.entity";
import "dotenv/config";

function required(name: string): string {
  const envVar = process.env[name];
  if (!envVar) throw new Error(`[config] env var ${name} is missing`);
  return envVar;
}

export default {
  entities: [User],
  driver: PostgreSqlDriver,
  dbName: required("DB_NAME"),
  host: required("DB_HOST"),
  port: Number(required("DB_PORT")),
  user: required("DB_USER"),
  password: required("DB_PASS"),
  debug: process.env.NODE_ENV !== "production",
  migrations: { path: "dist/migrations", pathTs: "src/migrations" },
  forceEntityConstructor: true,
} as Options;
