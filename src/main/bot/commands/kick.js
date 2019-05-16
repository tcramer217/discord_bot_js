module.exports = {
    name: 'kick',
    description: 'Kick the @Mentioned user!',
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.reply('You need to provide a user mention to kick a user.');
        }
        // grab the "first" mentioned user from the message
        // this will return a `User` object, just like `message.author`
        const taggedUser = message.mentions.users.first();

        message.channel.send(`You wanted to kick: ${taggedUser.username}?`);
    },
};