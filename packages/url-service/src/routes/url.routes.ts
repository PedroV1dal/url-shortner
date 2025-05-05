import { Router } from "express";
import { RequestContext, EntityManager } from "@mikro-orm/core";
import { UrlController } from "../controllers/url.controller";
import { validateDto } from "../middleware/validation.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { ShortenUrlDto, UpdateUrlDto } from "../dtos/url.dto";

export const urlRouter = (emFork: EntityManager) => {
  const router = Router();

  router.use((req, res, next) => {
    RequestContext.create(emFork, next);
  });

  router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  const urlController = new UrlController(emFork);

  /**
   * @swagger
   * /api/url/shorten:
   *   post:
   *     summary: Shorten a URL
   *     tags: [URL]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - originalUrl
   *             properties:
   *               originalUrl:
   *                 type: string
   *     responses:
   *       201:
   *         description: URL shortened successfully
   *       400:
   *         description: Invalid URL format
   *     security:
   *       - bearerAuth: []
   */
  router.post(
    "/shorten",
    authMiddleware(false),
    validateDto(ShortenUrlDto),
    urlController.shortenUrl
  );

  /**
   * @swagger
   * /api/url/list:
   *   get:
   *     summary: List URLs shortened by the user
   *     tags: [URL]
   *     responses:
   *       200:
   *         description: List of URLs
   *       401:
   *         description: Authentication required
   *     security:
   *       - bearerAuth: []
   */
  router.get("/list", authMiddleware(true), urlController.listUrls);

  /**
   * @swagger
   * /api/url/{shortCode}:
   *   put:
   *     summary: Update the destination of a shortened URL
   *     tags: [URL]
   *     parameters:
   *       - in: path
   *         name: shortCode
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - originalUrl
   *             properties:
   *               originalUrl:
   *                 type: string
   *     responses:
   *       200:
   *         description: URL updated successfully
   *       404:
   *         description: URL not found or not owned by user
   *     security:
   *       - bearerAuth: []
   */
  router.put(
    "/:shortCode",
    authMiddleware(true),
    validateDto(UpdateUrlDto),
    urlController.updateUrl
  );

  /**
   * @swagger
   * /api/url/{shortCode}:
   *   delete:
   *     summary: Delete a shortened URL logically
   *     tags: [URL]
   *     parameters:
   *       - in: path
   *         name: shortCode
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: URL deleted successfully
   *       404:
   *         description: URL not found or not owned by user
   *     security:
   *       - bearerAuth: []
   */
  router.delete("/:shortCode", authMiddleware(true), urlController.deleteUrl);

  /**
   * @swagger
   * /{shortCode}:
   *   get:
   *     summary: Redirect to original URL
   *     tags: [URL]
   *     parameters:
   *       - in: path
   *         name: shortCode
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       302:
   *         description: Redirects to original URL
   *       404:
   *         description: URL not found
   */
  router.get("/:shortCode", urlController.redirect);

  return router;
};
