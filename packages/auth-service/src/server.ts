import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./config/mikro-orm.config";
import { authRouter } from "./routes/auth.routes";
import logger from "./utils/logger";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

(async () => {
  const orm = await MikroORM.init(mikroConfig);

  const app = express();
  app.use(helmet());
  app.use(express.json());

  app.use(
    rateLimit({
      windowMs: 60_000,
      max: 100,
    })
  );

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api/auth", authRouter(orm.em.fork()));

  const port = Number(process.env.PORT ?? 3001);
  app.listen(port, () => logger.info({ msg: "auth_service_started", port }));
})();
