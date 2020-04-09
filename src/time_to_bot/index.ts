import { Client, Message } from "discord.js";
import { BayesClassifier } from "natural";

import { logger } from "../logger";
import { DOCUMENTS, HANDLERS, Messages } from "./message";

export async function TimeToBot(token: string): Promise<void> {
  logger.info("Starting up");
  logger.info("Training natural language processor");

  // Create the natural language classifier
  const classifier = new BayesClassifier();
  for (const [stem, texts] of Object.entries(DOCUMENTS)) {
    logger.debug("[NLP] Adding stem " + stem);
    for (const text of texts) {
      classifier.addDocument(text, stem);
    }
  }

  // Train the classifier
  logger.debug("[NLP] Starting training");
  const trainingHandler = (progress: any) => {
    if (progress.index === progress.total - 1) {
      logger.info("[NLP] Completed training");
      classifier.events.off("trainedWithDocument", trainingHandler);
      classifier.save("classifier.json", () => {});
    }
  };
  classifier.events.on("trainedWithDocument", trainingHandler);
  classifier.train();

  // Setup the discord client
  const client = new Client();
  try {
    await client.login(token);
  } catch (err) {
    logger.fatal("Failed to login", { err });
    return;
  }

  // Setup the event handlers
  client.on("message", async message => {
    if (!message.mentions?.users?.has(client.user!.id)) return;

    if (message.content === null) {
      logger.warn("Null message content");
      return;
    }

    const classification = classifier.getClassifications(
      removeMentions(message.content!)
    );
    logger.debug({
      content: message.content,
      action: classification[0].label,
      probability: classification[0].value
    });
    if (typeof HANDLERS[classification[0].label as Messages] === "function") {
      try {
        await HANDLERS[classification[0].label as Messages](
          client,
          message as Message
        );
      } catch (err) {
        console.error("Message handler", { err });
      }
    }
  });
}

/** A naive implementation to remove complex mentions from messages
 * in order to assist the Natural Language algorithm.
 */
function removeMentions(text: string): string {
  if (typeof text !== "string") return text;

  let cleanText: string = text;
  let index: number;
  while ((index = cleanText.indexOf("<@")) !== -1) {
    const end = cleanText.indexOf(">", index);
    cleanText = cleanText.slice(0, index) + cleanText.slice(end + 1);
  }

  return cleanText;
}
