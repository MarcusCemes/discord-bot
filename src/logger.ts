import pino from "pino";

const PRODUCTION = process.env.NODE_ENV === "PRODUCTION";

export const logger = pino({
  prettyPrint: !PRODUCTION,
  level: PRODUCTION ? "info" : "trace"
});
