const {prefix, token, pruneMax, pruneMin} = require('./src/main/resources/config');
// require the discord.js module
const Discord = require('discord.js');

// create a new Discord Client
const client = new Discord.Client();

// Once the client is 'ready', run this code
// This event will only trigger one time after logging in
client.once('ready', () => {
    // console.log(`Logged in as ${client.user.tag}!`);
    console.log('Ready!');
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(message.content === (`${prefix}server`)) {
        // reply to ping
        message.channel.send(`This server's name is: ${message.guild.name}`);
    } else if (command === 'args-info') {
        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }

        message.channel.send(`Command name: ${command}\nArguments: ${args}`);
    } else if (command === 'kick') {
        if (!message.mentions.users.size) {
            return message.reply('You need to provide a user mention to kick a user.');
        }
        // grab the "first" mentioned user from the message
        // this will return a `User` object, just like `message.author`
        const taggedUser = message.mentions.users.first();

        message.channel.send(`You wanted to kick: ${taggedUser.username}?`);
    } else if (command === 'avatar') {
        if (!message.mentions.users.size) {
            return message.channel.send(`Your Avatar: <${message.author.displayAvatarURL}>`);
        }
        // grab the "first" mentioned user from the message
        // this will return a `User` object, just like `message.author`
        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s Avatar is: <${user.displayAvatarURL}>`;
        });

        message.channel.send(avatarList);
    } else if (command === 'prune') {
        const pruneAmt = parseInt(args[0]);

        if(isNaN(pruneAmt)) {
            return message.reply(`Please provide a valid number of lines (between ${pruneMin} and ${pruneMax}) to prune.`)
        }
        if (pruneAmt < pruneMin || pruneAmt > pruneMax) {
            return message.reply(`You need to enter a number between ${pruneMin} and ${pruneMax}`);
        }

        return message.channel.bulkDelete(pruneAmt).catch(error => {
            console.error(error);
            message.reply(`We had an error trying to prune messages in this channel: ${error.message}`);
        });
    }
});

// log into Discord with your app's token
client.login(token);
