module.exports = {
    name: 'args-info',
    description: 'Get the arguments from the command.',
    args: true,
    usage: '<someValue> <someOtherValue>',
    execute(message, args) {
        if (args[0] === 'foo') {
            return message.channel.send('bar');
        }

        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    },
};