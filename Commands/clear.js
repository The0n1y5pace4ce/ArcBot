const { MessageEmbed } = require('discord.js');

module.exports = {
    category: 'Moderation',
    description: 'Clear a certain amount of messages',
    minArgs: 1,
    maxArgs: 2,
    expectedArgs: '<amount>',
    expectedArgsTypes: ['NUMBER'],
    slash: 'both',
    options: [
        {
            name: 'amount',
            description: 'Specify the amount of messages you want to delete',
            type: 'NUMBER',
            required: true,
        },
        {
            name: 'target',
            description: 'Select a target you want to delete messages ONLY from',
            type: 'USER',
            required: false,
        }
    ],
    callback: async ({ text, interaction, message, channel }) => {
        const Target = interaction.options.getString('target') || message.mentions.users.first() || null

        args.shift();

        const Amount = interaction.options.getString('amount') || text

        const Messages = await channel.messages.fetch();

        const Response = new MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK');

        if(Target) {
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if(m.author.id === Target.id && Amount > i) {
                    filtered.push(m);
                    i++;
                }
            })

            await channel.bulkDelete(filtered, true).then(messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} from ${Target}.`);
                return Response
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} from this channel.`);
                return Response
            })
        }
    }
}