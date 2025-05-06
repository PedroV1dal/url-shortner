import { Router } from "express";
import axios from "axios";
import { config } from "../config/config";
import logger from "../utils/logger";

export const urlRouter = Router();

urlRouter.post("/shorten", async (req, res) => {
  try {
    const response = await axios.post(
      `${config.urlServiceUrl}/url/shorten`,
      req.body,
      { headers: { Authorization: req.headers.authorization ?? "" } }
    );
    res.status(response.status).json(response.data);
  } catch (error: any) {
    logger.error("Error forwarding request to url-service", { error });
    res
      .status(error.response?.status ?? 500)
      .json(error.response?.data ?? { message: "Error in URL service" });
  }
});

urlRouter.get("/list", async (req, res) => {
  try {
    const response = await axios.get(`${config.urlServiceUrl}/url/list`, {
      headers: { Authorization: req.headers.authorization ?? "" },
    });
    res.status(response.status).json(response.data);
  } catch (error: any) {
    logger.error("Error forwarding request to url-service", { error });
    res
      .status(error.response?.status ?? 500)
      .json(error.response?.data ?? { message: "Error in URL service" });
  }
});

urlRouter.put("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const response = await axios.put(
      `${config.urlServiceUrl}/url/${shortCode}`,
      req.body,
      { headers: { Authorization: req.headers.authorization ?? "" } }
    );
    res.status(response.status).json(response.data);
  } catch (error: any) {
    logger.error("Error forwarding request to url-service", { error });
    res
      .status(error.response?.status ?? 500)
      .json(error.response?.data ?? { message: "Error in URL service" });
  }
});

urlRouter.delete("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const response = await axios.delete(
      `${config.urlServiceUrl}/url/${shortCode}`,
      { headers: { Authorization: req.headers.authorization ?? "" } }
    );
    res.status(response.status).json(response.data);
  } catch (error: any) {
    logger.error("Error forwarding request to url-service", { error });
    res
      .status(error.response?.status ?? 500)
      .json(error.response?.data ?? { message: "Error in URL service" });
  }
});

urlRouter.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const response = await axios.get(
      `${config.urlServiceUrl}/url/${shortCode}`,
      { maxRedirects: 0 }
    );
    res.redirect(response.headers.location ?? "/not-found");
  } catch (error: any) {
    logger.error("Error forwarding request to url-service", { error });
    res
      .status(error.response?.status ?? 500)
      .json(error.response?.data ?? { message: "Error in URL service" });
  }
});
