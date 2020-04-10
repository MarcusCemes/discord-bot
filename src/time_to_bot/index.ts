import { Client, Message, PartialMessage } from "discord.js";

import { logger } from "../logger";
import { HANDLERS, Messages } from "./message";

const COMMAND_DELIMITER = "$";

export async function TimeToBot(token: string): Promise<void> {
  logger.info("Starting up");

  // Setup the discord client
  const client = new Client();
  try {
    await client.login(token);
  } catch (err) {
    logger.fatal("Failed to login", { err });
    return;
  }

  // Setup the event handlers
  client.on("message", async (message) => {
    // Ignore empty messages
    if (message.content === null) {
      logger.warn("Null message content");
      return;
    }

    // Ignore messages from this bot
    if (message.author?.id === client.user?.id) {
      return;
    }

    const action = processMessage(message);
    if (action !== false) {
      if (
        action !== null &&
        typeof HANDLERS[action as Messages] === "function"
      ) {
        try {
          await HANDLERS[action as Messages](client, message as Message);
        } catch (err) {
          console.error("Message handler", { err });
        }
      } else if (message.reply) {
        await message.reply("I didn't understand what you meant.");
      }
    }
  });
}

/**
 * Process the message and choose an action. Returns null if the action does not exist,
 * or null if the message was not meant for the bot.
 */
function processMessage(
  message: Message | PartialMessage
): Messages | false | null {
  if (!(message instanceof Message)) return null;

  const cmd = getCommand(message);
  if (cmd === null) return false;

  if (has(cmd, ["joke", "funny"])) {
    return Messages.JOKE;
  } else if (has(cmd, ["insult", "mean"])) {
    return Messages.INSULT;
  } else if (has(cmd, ["chameleon"])) {
    return Messages.CHAMELEON;
  } else if (has(cmd, ["hello", "hey", "hi", "how are you"])) {
    return Messages.GREET;
  }

  return null;
}

/**
 * Checks if a message is a command for this bot, and extracts
 * the command text.
 */
function getCommand(msg: Message): string | null {
  if (!msg.content) return null;
  const { content, guild } = msg;

  if (getFirstCharacter(content) === COMMAND_DELIMITER) {
    return content.substr(content.indexOf(COMMAND_DELIMITER) + 1);
  } else if (guild?.me && msg.mentions.has(guild.me)) {
    return content;
  }

  return null;
}

/** Returns the first non-whitespace character in a string, or null */
function getFirstCharacter(text: string): string | null {
  for (const char of text) {
    if (char !== " ") return char;
  }

  return null;
}

/** Test if one of the keywords appears in the text */
function has(text: string, keywords: string[]): boolean {
  for (const keyword of keywords) {
    if (text.indexOf(keyword) !== -1) return true;
  }

  return false;
}
