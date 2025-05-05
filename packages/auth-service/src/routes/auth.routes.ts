import { Router } from "express";
import { RequestContext, EntityManager } from "@mikro-orm/core";
import { AuthController } from "../controllers/auth.controller";
import { validateDto } from "../middleware/validation.middleware";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";

export const authRouter = (emFork: EntityManager) => {
  const router = Router();

  router.use((req, res, next) => {
    RequestContext.create(emFork, next);
  });

  router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  const authController = new AuthController(emFork);

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Email already registered or invalid data
   */
  router.post("/register", validateDto(RegisterDto), authController.register);

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Authenticate a user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful, returns JWT token
   *       401:
   *         description: Invalid credentials
   */
  router.post("/login", validateDto(LoginDto), authController.login);

  return router;
};
