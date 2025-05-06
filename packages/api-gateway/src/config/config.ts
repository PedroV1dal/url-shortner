import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT ?? 3000,
  authServiceUrl: process.env.AUTH_SERVICE_URL ?? "http://localhost:3001",
  urlServiceUrl: process.env.URL_SERVICE_URL ?? "http://localhost:3002",
  env: process.env.NODE_ENV ?? "development",
};
