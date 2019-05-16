module.exports = {
    name: 'args-info',
    description: 'Get the arguments from the command.',
    execute(message, args) {
        console.log('message: {}', message);
        console.log('args: {}', args);
        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }

        message.channel.send(`Arguments: ${args}`);
    },
};