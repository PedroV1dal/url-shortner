import { Router } from "express";
import { authRouter } from "./auth.routes";
import { urlRouter } from "./url.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/url", urlRouter);

apiRouter.get("/health", (req, res) => {
  res.status(200).json({ status: "API Gateway is up" });
});
