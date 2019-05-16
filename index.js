const {prefix, token} = require('./src/main/resources/config');
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
    if(message.content === (`${prefix}server`)) {
        // reply to ping
        message.channel.send(`This server's name is: ${message.guild.name}`);
    }
});

// log into Discord with your app's token
client.login(token);
