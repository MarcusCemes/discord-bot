import Axios from "axios";
import {
  Client,
  DMChannel,
  Message,
  TextChannel,
  NewsChannel,
} from "discord.js";

import { logger } from "../logger";

const JOKE_API = "https://icanhazdadjoke.com/";
const INSULT_API =
  "https://evilinsult.com/generate_insult.php?lang=en&type=json";

const LETTERS = "ABCD";
const NUMBERS = "1234";

export enum Messages {
  GREET = "greet",
  JOKE = "joke",
  INSULT = "insult",
  CHAMELEON = "chameleon",
}

/** Message handlers for each stem */
export const HANDLERS: {
  [action in Messages]: (client: Client, message: Message) => Promise<any>;
} = {
  [Messages.GREET]: async (_client, message) => {
    await message.reply("nice to meet you!");
  },
  [Messages.JOKE]: (_client, message) =>
    whileTyping(message.channel, async () => {
      const { data } = await Axios.get<{ joke?: string }>(JOKE_API, {
        headers: { Accept: "application/json" },
      });
      if (typeof data.joke === "string") {
        return message.channel.send(data.joke);
      } else {
        logger.error("Bad Joke API response", { data });
      }
    }),
  [Messages.INSULT]: (client, message) =>
    whileTyping(message.channel, async () => {
      const mentions = message.mentions.users.filter(
        (user) => user.id !== client.user!.id
      );

      if (mentions.size === 0) {
        await message.reply("who do you want me to insult?");
      } else if (mentions.size > 1) {
        await message.reply("which one do you want me to insult?");
      } else {
        const { data } = await Axios.get<{ insult?: string }>(INSULT_API);
        if (typeof data.insult === "string") {
          await message.channel.send(
            `<@${mentions.first()!.id}>, ${lowerFirstLetter(data.insult)}`
          );
        }
      }
    }),
  [Messages.CHAMELEON]: async (_client, message) => {
    if (!(message.channel instanceof TextChannel)) {
      if (message.reply)
        await message.reply("That command must be sent in a server!");
      return;
    }

    if (!message.member?.voice?.channel) {
      if (message.reply) {
        await message.reply(
          "You must be in a voice channel to play Chameleon!"
        );
      }
      return;
    }

    const members = message.member.voice.channel.members;

    if (members.size < 2) {
      if (message.reply) {
        await message.reply(
          "At least two people are required to play Chameleon"
        );
      }
      return;
    }

    const chameleon = members.random();
    const letter = randomCharacter(LETTERS);
    const number = randomCharacter(NUMBERS);

    // Send DMs to each member in the voice channel
    await Promise.all(
      members.map(async (member) => {
        const dm = await member.createDM();
        return dm.send(
          member === chameleon
            ? "You are the 🦎 Chameleon!"
            : `The item is ${letter}${number}`
        );
      })
    );

    // Delete the message to avoid spam
    if (message.guild?.me?.hasPermission("MANAGE_MESSAGES")) {
      await message.delete!();
    } else {
      message.react("🦎");
    }
  },
};

/** Returns a random character from a string */
function randomCharacter(characters: string): string {
  return characters[Math.floor(Math.random() * characters.length)];
}

/** Execute an async callback while the typing indicator is active */
async function whileTyping<T>(
  channel: TextChannel | DMChannel | NewsChannel,
  fn: () => Promise<T>
): Promise<T> {
  if (channel instanceof TextChannel || channel instanceof DMChannel) {
    channel.startTyping().catch(() => {});
    const result = await fn();
    channel.stopTyping();
    return result;
  } else {
    return await fn();
  }
}

/** Returns the string transforming the first letter to lowercase, with an exception for "i" */
function lowerFirstLetter(text: string): string {
  if (typeof text !== "string") return text;
  if (text[0].toLowerCase() === "i") return text;
  return text[0].toLowerCase() + text.substring(1);
}
