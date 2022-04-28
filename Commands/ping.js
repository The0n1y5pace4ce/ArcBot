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

          return `Pong! ${client.ws.ping}`
    }
}