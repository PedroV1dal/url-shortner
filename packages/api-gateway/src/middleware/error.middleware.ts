import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error("Unexpected error", { error, url: req.url, method: req.method });
  res.status(500).json({ message: "Internal server error" });
}
