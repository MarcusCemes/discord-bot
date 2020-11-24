import { Client, TextChannel } from "discord.js";
import { env } from "process";

async function main(token: string): Promise<void> {
  // Setup the discord client
  const client = new Client();
  try {
    await client.login(token);
  } catch (err) {
    console.error("Failed to login", err);
    return;
  }

  await new Promise(res => setTimeout(res, 1000));
  const guild = await client.guilds.fetch("353211873036075018"); // TTG
  // console.log(guild.members.cache.filter(member => member.displayName.indexOf("FLYING") !== -1));

  const channel = await client.channels.fetch("353211873036075019"); // chat
  console.log(channel.fetch())

  await (channel as TextChannel).send(`<@268753785193627648> t'es moche`) // Rythm

  process.exit();
}

main(env.DISCORD_TOKEN as string);

/* IDS
Rythm: 235088799074484224
xsphoros: 268753785193627648

*/
