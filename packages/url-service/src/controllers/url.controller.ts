import { RequestHandler, Request, Response } from "express";
import { EntityManager } from "@mikro-orm/core";
import { Url } from "../entities/url.entity";
import { generateShortCode } from "../utils/url-shortener";
import logger from "../utils/logger";
import { ShortenUrlDto, UpdateUrlDto } from "../dtos/url.dto";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export class UrlController {
  constructor(private readonly em: EntityManager) {}

  shortenUrl: RequestHandler<{}, any, ShortenUrlDto> = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const { originalUrl } = req.body;
      let shortCode = generateShortCode();

      while (await this.em.findOne(Url, { shortCode })) {
        shortCode = generateShortCode();
      }

      const url = new Url();
      url.originalUrl = originalUrl;
      url.shortCode = shortCode;
      if (req.user) {
        url.userId = req.user.id;
      }

      await this.em.persistAndFlush(url);

      logger.info(`URL shortened: ${shortCode} for ${originalUrl}`);
      res.status(201).json({ shortUrl: `http://localhost/${shortCode}` });
    } catch (error) {
      logger.error("Error shortening URL", { error });
      res.status(500).json({ message: "Internal server error" });
    }
  };

  listUrls: RequestHandler = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const urls = await this.em.find(Url, { userId: req.user.id });
      res.json({
        urls: urls.map((url) => ({
          shortCode: url.shortCode,
          originalUrl: url.originalUrl,
          clickCount: url.clickCount,
        })),
      });
    } catch (error) {
      logger.error("Error listing URLs", { error });
      res.status(500).json({ message: "Internal server error" });
    }
  };

  updateUrl: RequestHandler<{ shortCode: string }, any, UpdateUrlDto> = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const { shortCode } = req.params;
      const { originalUrl } = req.body;

      const url = await this.em.findOne(Url, {
        shortCode,
        userId: req.user.id,
      });
      if (!url) {
        res.status(404).json({ message: "URL not found or not owned by user" });
        return;
      }

      url.originalUrl = originalUrl;
      await this.em.persistAndFlush(url);

      logger.info(`URL updated: ${shortCode}`);
      res.status(200).json({ message: "URL updated successfully" });
    } catch (error) {
      logger.error("Error updating URL", { error });
      res.status(500).json({ message: "Internal server error" });
    }
  };

  deleteUrl: RequestHandler<{ shortCode: string }> = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const { shortCode } = req.params;
      const url = await this.em.findOne(Url, {
        shortCode,
        userId: req.user.id,
      });
      if (!url) {
        res.status(404).json({ message: "URL not found or not owned by user" });
        return;
      }

      url.deletedAt = new Date();
      await this.em.persistAndFlush(url);

      logger.info(`URL deleted: ${shortCode}`);
      res.status(200).json({ message: "URL deleted successfully" });
    } catch (error) {
      logger.error("Error deleting URL", { error });
      res.status(500).json({ message: "Internal server error" });
    }
  };

  redirect: RequestHandler<{ shortCode: string }> = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const { shortCode } = req.params;
      const url = await this.em.findOne(Url, { shortCode });
      if (!url) {
        res.status(404).json({ message: "URL not found" });
        return;
      }

      url.clickCount += 1;
      await this.em.persistAndFlush(url);

      logger.info(`Redirecting for shortCode: ${shortCode}`);
      res.redirect(url.originalUrl);
    } catch (error) {
      logger.error("Error redirecting URL", { error });
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
