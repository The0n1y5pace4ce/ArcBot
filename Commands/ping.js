const WOKCommands = require('wokcommands')
const GuildSettings = require("../models/settings");

module.exports = {
    description: 'Ping command',
    category: 'Testing',
    /**
     * @param {} WOKCommands
     */
    aliases: ['p'],
    slash: 'both',
    callback: ({interaction, message}) => {
        let storedSettings = await GuildSettings.findOne({
            guildID: message.guild.id || interaction.guild.id,
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

          return `Pong! ${client.ws.ping}`
    }
}