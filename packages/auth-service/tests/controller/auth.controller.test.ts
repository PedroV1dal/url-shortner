import { AuthController } from "../../src/controllers/auth.controller";
import { EntityManager } from "@mikro-orm/core";
import bcrypt from "bcrypt";

jest.mock("@mikro-orm/core");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthController", () => {
  let authController: AuthController;
  let mockEm: jest.Mocked<EntityManager>;

  beforeEach(() => {
    mockEm = {
      findOne: jest.fn(),
      persistAndFlush: jest.fn(),
    } as any;
    authController = new AuthController(mockEm);
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const req = {
        body: { email: "test@example.com", password: "Password123" },
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      (mockEm.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
      });
      expect(mockEm.persistAndFlush).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 400 if email is already registered", async () => {
      const req = {
        body: { email: "test@example.com", password: "Password123" },
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      (mockEm.findOne as jest.Mock).mockResolvedValue({
        id: "1",
        email: "test@example.com",
      });

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email already registered",
      });
      expect(mockEm.persistAndFlush).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 500 on internal server error, calling next if needed", async () => {
      const req = {
        body: { email: "test@example.com", password: "Password123" },
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      (mockEm.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await authController.register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      const req = {
        body: { email: "test@example.com", password: "Password123" },
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      (mockEm.findOne as jest.Mock).mockResolvedValue({
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
        deletedAt: null,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (require("jsonwebtoken").sign as jest.Mock).mockReturnValue("mockToken");

      await authController.login(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ token: "mockToken" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if user not found", async () => {
      const req = {
        body: { email: "test@example.com", password: "Password123" },
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      (mockEm.findOne as jest.Mock).mockResolvedValue(null);

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if password is invalid", async () => {
      const req = {
        body: { email: "test@example.com", password: "WrongPassword" },
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      (mockEm.findOne as jest.Mock).mockResolvedValue({
        id: "1",
        email: "test@example.com",
        password: "hashedPassword",
        deletedAt: null,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 500 on internal server error", async () => {
      const req = {
        body: { email: "test@example.com", password: "Password123" },
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      (mockEm.findOne as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await authController.login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
