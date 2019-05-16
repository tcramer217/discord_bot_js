module.exports = {
    name: 'avatar',
    description: 'Get Avatar url link.',
    aliases: ['icon', 'pfp'],
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send(`Your Avatar: <${message.author.displayAvatarURL}>`);
        }
        // grab the "first" mentioned user from the message
        // this will return a `User` object, just like `message.author`
        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s Avatar is: <${user.displayAvatarURL}>`;
        });

        message.channel.send(avatarList);
    },
};