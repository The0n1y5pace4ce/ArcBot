const config = require("./config");
const mongoose = require("mongoose");
const GuildSettings = require("./models/settings");
const Dashboard = require("./dashboard/dashboard");
const { Client, Intents, Permissions } = require("discord.js");
const WOKCommands = require('wokcommands')
const path = require('path')

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES],
});

mongoose.connect(config.mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.config = config;

client.on("ready", async () => {
  console.log("Fetching members...");
  for (const [id, guild] of client.guilds.cache) {
    await guild.members.fetch();
  }
  console.log("Fetched members.");

  console.log(
    `Bot is ready. (${client.guilds.cache.size} Guilds - ${client.channels.cache.size} Channels - ${client.users.cache.size} Users)`,
  );

  client.user.setActivity(
    "?help",
    { type: "WATCHING" },
  );

  Dashboard(client);

  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'Commands'),
    featuresDir: path.join(__dirname, 'Events'),
  })
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)) {
    return;
  }

  let storedSettings = await GuildSettings.findOne({
    guildID: message.guild.id,
  });
  if (!storedSettings) {
    const newSettings = new GuildSettings({
      guildID: message.guild.id,
    });
    await newSettings.save().catch((e) => {
      console.log(e);
    });
    storedSettings = await GuildSettings.findOne({ guildID: message.guild.id });
  }
  if (message.content.indexOf(storedSettings.prefix) !== 0) return;

  const args = message.content
    .slice(storedSettings.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    const roundtripMessage = await message.channel.send({ content: "Pong!" });
    return roundtripMessage.edit(
      `*${roundtripMessage.createdTimestamp - message.createdTimestamp}ms*`,
    );
  }
});

client.on("error", console.error);
client.on("warn", console.warn);

client.login(config.token);