import { logger } from "./logger";
import { TimeToBot } from "./time_to_bot";

(async () => {
  try {
    await TimeToBot(process.env.DISORD_TOKEN as string);
    logger.info("Ready");
  } catch (err) {
    logger.fatal("Failed to initialise bot", { err });
  }
})();
