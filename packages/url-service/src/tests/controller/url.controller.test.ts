import { UrlController } from "../../controllers/url.controller";
import { EntityManager } from "@mikro-orm/core";

jest.mock("@mikro-orm/core");
jest.mock("../../utils/url-shortener");

describe("UrlController", () => {
  let urlController: UrlController;
  let mockEm: jest.Mocked<EntityManager>;

  beforeEach(() => {
    mockEm = {
      findOne: jest.fn(),
      find: jest.fn(),
      persistAndFlush: jest.fn(),
    } as any;
    urlController = new UrlController(mockEm);
  });

  describe("shortenUrl", () => {
    it("should shorten a URL successfully without authentication", async () => {
      const req = { body: { originalUrl: "https://example.com" } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      (mockEm.findOne as jest.Mock).mockResolvedValue(null);
      (
        require("../../utils/url-shortener").generateShortCode as jest.Mock
      ).mockReturnValue("aZbKq7");

      await urlController.shortenUrl(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        shortUrl: "http://localhost/aZbKq7",
      });
      expect(mockEm.persistAndFlush).toHaveBeenCalled();
    });

    it("should associate URL with user if authenticated", async () => {
      const req = {
        body: { originalUrl: "https://example.com" },
        user: { id: "1" },
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      (mockEm.findOne as jest.Mock).mockResolvedValue(null);
      (
        require("../../utils/url-shortener").generateShortCode as jest.Mock
      ).mockReturnValue("aZbKq7");

      await urlController.shortenUrl(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        shortUrl: "http://localhost/aZbKq7",
      });
      expect(mockEm.persistAndFlush).toHaveBeenCalled();
    });
  });

  describe("listUrls", () => {
    it("should list URLs for authenticated user", async () => {
      const req = { user: { id: "1" } } as any;
      const res = { json: jest.fn() } as any;
      const next = jest.fn();

      (mockEm.find as jest.Mock).mockResolvedValue([
        {
          shortCode: "aZbKq7",
          originalUrl: "https://example.com",
          clickCount: 5,
        },
      ]);

      await urlController.listUrls(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        urls: [
          {
            shortCode: "aZbKq7",
            originalUrl: "https://example.com",
            clickCount: 5,
          },
        ],
      });
    });
  });

  describe("updateUrl", () => {
    it("should update URL destination for authenticated user", async () => {
      const req = {
        params: { shortCode: "aZbKq7" },
        body: { originalUrl: "https://newexample.com" },
        user: { id: "1" },
      } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      (mockEm.findOne as jest.Mock).mockResolvedValue({
        shortCode: "aZbKq7",
        user: { id: "1" },
      });

      await urlController.updateUrl(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "URL updated successfully",
      });
      expect(mockEm.persistAndFlush).toHaveBeenCalled();
    });
  });

  describe("deleteUrl", () => {
    it("should delete URL logically for authenticated user", async () => {
      const req = { params: { shortCode: "aZbKq7" }, user: { id: "1" } } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      (mockEm.findOne as jest.Mock).mockResolvedValue({
        shortCode: "aZbKq7",
        user: { id: "1" },
        deletedAt: null,
      });

      await urlController.deleteUrl(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "URL deleted successfully",
      });
      expect(mockEm.persistAndFlush).toHaveBeenCalled();
    });
  });

  describe("redirect", () => {
    it("should redirect to original URL and increment click count", async () => {
      const req = { params: { shortCode: "aZbKq7" } } as any;
      const res = {
        redirect: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const next = jest.fn();

      (mockEm.findOne as jest.Mock).mockResolvedValue({
        shortCode: "aZbKq7",
        originalUrl: "https://example.com",
        clickCount: 0,
      });

      await urlController.redirect(req, res, next);

      expect(res.redirect).toHaveBeenCalledWith("https://example.com");
      expect(mockEm.persistAndFlush).toHaveBeenCalled();
    });
  });
});
