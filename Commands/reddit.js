const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
    category: 'Fun',
    description: 'Get a random post from a subreddit',
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<subReddit>',
    expectedArgsTypes: ['STRING'],
    options: [{
        name: 'name',
        description: 'Name of the subreddit',
        type: 'STRING',
        required: true,
    }],
    slash: 'both',
    callback: async ({ text, interaction, message }) => {
        const url = "https://meme-api.herokuapp.com/gimme/";

        const name = args.join(' ')

        const meme = url+name;

        let data, response;

        try {
            response = await axios.get(meme);
            data = response.data;
        } catch (e) {
            if(e){
                if (e.message.startsWith("Request failed with status code")){
                    const Response = new MessageEmbed()

                        .setTitle("ERROR")
                        .setColor("RED")
                        .addField(`Subreddit does not exist:`, `\`\`\`${name}\`\`\``)

                    return Response
                }else if (e){
                    const errorEmbed = new MessageEmbed()
                        .setTitle("Oh no...")
                        .setColor("RED")
                        .addField("Error",`\`\`\`Please try again\`\`\``)
                    console.log(e.message)
                    if(message) {
                        message.reply({embeds: [errorEmbed], fetchReply : true}).then(msg => {setTimeout(() => msg.delete(), 5000)})
                    }

                    return interaction.reply({embeds: [errorEmbed], fetchReply : true}).then(msg => {setTimeout(() => msg.delete(), 5000)})
                }
            }
        }

        if(data == null){
            return;
        }else{
            if (data.nsfw === false) {
                const Response = new MessageEmbed()

                    .setTitle(data.title)
                    .setImage(data.url)

                if(message) {
                    const message = await message.reply({ embeds: [Response], fetchReply: true });
                    message.react("🟢");
                    message.react("🔴");
                }
                const message = await interaction.reply({ embeds: [Response], fetchReply: true });
                message.react("🟢");
                message.react("🔴");
            } else if (data.nsfw === true) {
                interaction.reply("No.");
            }
        }
    }
}