<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://discordapp.com/">
    <img src="assets/Discord-Wordmark-Black.svg" alt="Logo" width="150">
  </a>

  <h3 align="center">Time to Bot</h3>

  <p align="center">
    A fun little Discord bot experiment
    <br />
    <a href="https://discordapp.com/oauth2/authorize?client_id=688839891366576141&scope=bot&permissions=267910224"><strong>Add to your server »</strong></a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [License](#license)
- [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project

This is the source code for my little Discord bot experiment. It tells jokes, insults people and plays Chameleon. Dig around!

### Built With

* [Node.js](https://nodejs.org/) - Incredible Javascript runtime
* [Discord.js](https://discord.js.org/) - Best Discord framework there is
* [Typescript](https://www.typescriptlang.org/) - Strict language typings



<!-- GETTING STARTED -->
## Getting Started

You may either try to add the [official bot](https://discordapp.com/oauth2/authorize?client_id=688839891366576141&scope=bot&permissions=267910224) directly to your server, or you may make your own copy. Please note that there is absolutely no uptime guarantee.

If you don't trust adding a random bot, or would like to host it yourself, you may clone this repository and build the code yourself! Running the code is like running the Discord client, the bot can only respond if the code is running!

The following instructions will try and help you build and run your own copy.

### Prerequisites

You will need a Node.js runtime that you can get from [this website](https://nodejs.org/).

You will also need to set up an app and associated bot on Discord's development portal, in order to acquire a Discord Token. This token is used to identify and authorise the connection to Discord as the bot you just created.

You may provide this token either through an environmental variable `DISCORD_TOKEN`, or by placing it in an `.env` file in the root of this project directory using the format `DISCORD_TOKEN=...` . Note that by using the `.env` approach, you must run the code using one of the npm scripts that automatically load and inject the `.env` variables into Node.js (or setup [dotenv](https://github.com/motdotla/dotenv) yourself).

### Installation
1. Clone the repo
```sh
$ git clone https://github.com/MarcusCemes/discord-bot.git
```
2. Install NPM packages
```sh
$ npm ci
```
3. Build the source
```sh
$ npm run build
```
4. Set an environmental variable with your obtained discord token
```sh
$ export DISCORD_TOKEN=...    # Linux/OSX
$ SET DISCORD_TOKEN=...       # Windows

or populate the .env file     # Cross-platform, also persistent
```
5. Start the bot!
```sh
$ npm start
```
Your bot is now online! You will need to add it to a server (I recommend [this website](https://discordapi.com/permissions.html#267910224) to help setup the join link) and give it some permissions.

To get live-reloading, you may use `npm run develop`. If you use VSCode, this project also has a debug profile set up, just press `F5`.


<!-- USAGE EXAMPLES -->
## Usage

The bot will respond to messages that either start with the command delimiter (currently "$"), or that mention the bot directly (with @name_of_bot) somewhere in the message.

The bot analyses messages by trying to loosely match keywords to the message content to try and guess the user's intent. Here is a (possibly incomplete) list of supported actions, and some example keywords. For a full list, see the [source code](src/time_to_bot/message.ts).

| Action    | Example triggers | Description                                               |   |   |
|-----------|------------------|-----------------------------------------------------------|---|---|
| GREET     | hey, hi          | Replies with a friendly greeting                          |   |   |
| JOKE      | joke, funny      | Fetches a joke from a Joke API                            |   |   |
| INSULT    | insult, mean     | Fetches an insult from an Insult API (requires a mention) |   |   |
| CHAMELEON | chameleon        | A custom game, requires a 4x4 table of words.             |   |   |


Here are some example messages you can try!

```
@bot_name, tell me a joke!

$ Hey! How are you?

@bot_name, say something mean to @user_name
```

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/github_username/repo/issues) for a list of proposed features (and known issues).


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

Your Name - [@MarcusCemes](https://twitter.com/MarcusCemes) - email

Project Link: [https://github.com/MarcusCemes/discord-bot](https://github.com/MarcusCemes/discord-bot)


<br />
<div align="center">

This is a fun and educational experiment! Use at your own risk!

</div>