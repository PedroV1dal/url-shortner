import express from "express";
import { config } from "./config/config";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { apiRouter } from "./routes/index";
import logger from "./utils/logger";

const app = express();

app.use(express.json());
app.use(loggerMiddleware);
app.use("/api", apiRouter);
app.use(errorMiddleware);

app.listen(config.port, () => {
  logger.info(`API Gateway running on port ${config.port}`);
});

export default app;
