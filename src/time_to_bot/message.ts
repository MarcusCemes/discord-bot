import Axios from "axios";
import { Client, DMChannel, Message, TextChannel } from "discord.js";
import { logger } from "../logger";

const JOKE_API = "https://icanhazdadjoke.com/";
const INSULT_API =
  "https://evilinsult.com/generate_insult.php?lang=en&type=json";

export enum Messages {
  GREET = "greet",
  TELL_JOKE = "tell.joke",
  INSULT = "insult"
}

/** A list of words associated with each stem */
export const DOCUMENTS: { [stem in Messages]: string[] } = {
  [Messages.GREET]: [
    "hello",
    "there",
    "hi",
    "hey",
    "how are you",
    "greetings",
    "howdy",
    "how are you doing",
    "are you ok",
    "doing well"
  ],
  [Messages.TELL_JOKE]: [
    "tell me a joke",
    "tell us a joke",
    "something funny",
    "make laugh",
    "I want to laugh"
  ],
  [Messages.INSULT]: [
    "insult",
    "horrible",
    "mean",
    "make fun of",
    "take the micky",
    "say something nasty"
  ]
};

/** Message handlers for each stem */
export const HANDLERS: {
  [stem in Messages]: (client: Client, message: Message) => Promise<any>;
} = {
  [Messages.GREET]: async (_client, message) => {
    await message.reply("nice to meet you!");
  },
  [Messages.TELL_JOKE]: (_client, message) =>
    whileTyping(message.channel, async () => {
      const { data } = await Axios.get<{ joke?: string }>(JOKE_API, {
        headers: { Accept: "application/json" }
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
        user => user.id !== client.user!.id
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
    })
};

/** Execute an async callback while the typing indicator is active */
async function whileTyping<T>(
  channel: TextChannel | DMChannel,
  fn: () => Promise<T>
): Promise<T> {
  channel.startTyping();
  const result = await fn();
  channel.stopTyping();
  return result;
}

function lowerFirstLetter(text: string): string {
  if (typeof text !== "string") return text;
  return text[0].toLowerCase() + text.substring(1);
}
