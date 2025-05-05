import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { MikroORM } from "@mikro-orm/core";
import mikroConfig from "./config/mikro-orm.config";
import { urlRouter } from "./routes/url.routes";
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

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/api/url", urlRouter(orm.em.fork()));
  app.use("/", urlRouter(orm.em.fork()));

  const port = Number(process.env.PORT ?? 3002);
  app.listen(port, () => logger.info({ msg: "url_service_started", port }));
})();
