const connection = require('mongoose');
const { MessageEmbed, Client, Guild } = require('discord.js');

module.exports = {
    category: 'Utility',
    description: 'Get the status of the bot',
    aliases: ['botinfo'],
    slash: 'both',
    callback: async ({ interaction, client, text }) => {
        const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Anti-Stats Status")
        .setDescription(`**Client**: \`🟢 ONLINE\` - \`${client.ws.ping}ms\`\n **Uptime**: <t:${parseInt(client.readyTimestamp / 1000)}:R>\n
        **Database**: \`${switchTo(connection.readyState)}\` \n \n **__Tools__**: \n - **Discord Javascript**: \`${process.version}\`\n - **Node.js**: \`${process.version}\`\n - **Discord.js**: \`${require("discord.js").version}\`\n - **MongoDB**: \`${require("mongoose").version}\`\n - **Mongoose**: \`${require("mongoose").version}\`\n - **Discord.js-Commands**: \`${require("../../package.json").version}\``)
        .addField("**__Commands__**", `\`${client.commands.size}\` commands loaded.`, true)
        .addField("**__Guilds__**", `\`${client.guilds.cache.size}\` guilds connected.`, true)
        .addField("**__Users__**", `\`${client.users.cache.size}\` users connected.`, true)
        .setThumbnail(client.user.avatarURL({ format: "png", dynamic: true, size: 1024 }))
        .setTimestamp()
        .setFooter("Anti-Stats")

        return embed
    }
};

function switchTo(val) {
    var status = " ";
    switch (val) {
        case 0:
            status = "🔴 DISCONNECTED";
            break;
        case 1:
            status = `🟢 CONNECTED`
            break;
        case 2:
            status = `🟡 CONNECTING`
            break;
        case 3:
            status = `🔵 DISCONNECTING`
            break;
    }
    return status;
}