const {prefix, token} = require('./src/main/resources/config');
const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');

// create a new Discord Client
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./src/main/bot/commands').filter(file => file.endsWith('.js'));
for( const file of commandFiles) {
    const command = require(`./src/main/bot/commands/${file}`);
    client.commands.set(command.name, command);
}

// Once the client is 'ready', run this code
// This event will only trigger one time after logging in
client.once('ready', () => {
    // console.log(`Logged in as ${client.user.tag}!`);
    console.log('Ready!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'ping') {
        client.commands.get('ping').execute(message, args);
    } else if(command === 'server') {
        client.commands.get('server').execute(message, args);
    } else if (command === 'args-info') {
        client.commands.get('args-info').execute(message, args);
    } else if (command === 'kick') {
        client.commands.get('kick').execute(message, args);
    } else if (command === 'avatar') {
        client.commands.get('avatar').execute(message, args);
    } else if (command === 'prune') {
        client.commands.get('prune').execute(message, args);
    }
});

// log into Discord with your app's token
client.login(token);
