import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    body: req.body,
    query: req.query,
    params: req.params,
  });
  next();
}
