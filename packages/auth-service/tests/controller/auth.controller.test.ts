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

  it("should register a new user", async () => {
    const req = {
      body: { email: "test@example.com", password: "Password123" },
    } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    (mockEm.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully",
    });
  });
});
