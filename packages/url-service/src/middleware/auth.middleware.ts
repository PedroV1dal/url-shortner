import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export function authMiddleware(required: boolean = true) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      if (required) {
        res.status(401).json({ message: "Authentication token missing" });
        return;
      }
      next();
      return;
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "secret");
      req.user = decoded as { id: string };
      next();
    } catch (error) {
      if (required) {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
      }
      next();
    }
  };
}
