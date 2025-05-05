import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

// TODO: Add transport for ELK or other service if configured
if (process.env.ENABLE_ELK === "true") {
  // Config for ELK
}

export default logger;
