import { Router } from "express";
import axios from "axios";
import { config } from "../config/config";
import logger from "../utils/logger";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const response = await axios.post(
      `${config.authServiceUrl}/auth/register`,
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (error: any) {
    logger.error("Error forwarding request to auth-service", { error });
    res
      .status(error.response?.status ?? 500)
      .json(error.response?.data ?? { message: "Error in auth service" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const response = await axios.post(
      `${config.authServiceUrl}/auth/login`,
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (error: any) {
    logger.error("Error forwarding request to auth-service", { error });
    res
      .status(error.response?.status ?? 500)
      .json(error.response?.data ?? { message: "Error in auth service" });
  }
});
