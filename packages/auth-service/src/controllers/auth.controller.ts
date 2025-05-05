import { RequestHandler } from "express";
import { EntityManager } from "@mikro-orm/core";
import { User } from "../entities/user.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";

export class AuthController {
  constructor(private readonly em: EntityManager) {}

  register: RequestHandler<{}, any, RegisterDto> = async (req, res) => {
    try {
      const email = req.body.email.toLowerCase().trim();
      const { password } = req.body;

      const existingUser = await this.em.findOne(User, { email });

      if (existingUser) {
        res.status(400).json({ message: "Email already registered" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User();
      user.email = email;
      user.password = hashedPassword;

      await this.em.persistAndFlush(user);

      logger.info(`New user registered: ${email}`);
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      logger.error("Error registering user", { error });
      res.status(500).json({ message: "Internal server error" });
    }
  };

  login: RequestHandler<{}, any, LoginDto> = async (req, res) => {
    try {
      const email = req.body.email.toLowerCase().trim();
      const { password } = req.body;

      const user = await this.em.findOne(User, { email, deletedAt: null });

      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "24h",
      });

      logger.info(`User logged in: ${email}`);
      res.json({ token });
    } catch (error) {
      logger.error("Error logging in:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
