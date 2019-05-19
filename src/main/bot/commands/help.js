const {prefix, defaultCooldown} = require('../../resources/config');

module.exports = {
    name: 'help',
    description: 'List all commands or help for a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    isEnabled: true,
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all our commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
            return message.author.send(data, {split: true})
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send Help DM to ${message.author.tag}. \n${error}`);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                })
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply(`you entered ${name}. That is not a valid command. Please try again.`);
        }

        data.push(`** NAME: ** ${command.name}`);
        if (command.aliases) data.push(`** ALIASES: ** ${command.aliases}`);
        if (command.description) data.push(`** DESCRIPTION: ** ${command.description}`);
        if (command.usage) data.push(`** USAGE: ** ${command.usage}`);
        data.push(`** COOLDOWN ** ${command.cooldown || defaultCooldown} second(s)`);

        message.channel.send(data, {split: true});
    }
};
