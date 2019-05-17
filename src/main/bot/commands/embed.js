const {prefix, defaultCooldown} = require('../../resources/config');
const Discord = require('discord.js');

module.exports = {
    name: 'embed',
    description: 'Show the embedded MOTD for the server.',
    aliases: ['motd'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args) {
        const embed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle('You Server\'s MOTD')
            .setURL('http://timcramer.dev')
            .setAuthor('Timothy Cramer')
            .setDescription('Your MOTD Description Here')
            .addField('Some Field Title Here', 'Here we can put a specific Message related to your title...')
            .addBlankField()
            .addField('Inline field title', 'Some value here', true)
            .addField('Inline field title', 'Some value here', true)
            .addField('Inline field title', 'Some value here', true)
            .setTimestamp()
            .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

        message.channel.send((embed));
    }
};
