const {prefix, token, defaultCooldown} = require('./src/main/resources/config');
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

const cooldowns = new Discord.Collection();

// Once the client is 'ready', run this code
// This event will only trigger one time after logging in
client.once('ready', () => {
    // console.log(`Logged in as ${client.user.tag}!`);
    console.log('Ready!');
});

client.on('message', message => {
    console.log('the message is: {}', message);
    // Message does not start with prefix or the message author is a bot
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // get the CommandName from the incoming message
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // get the command from the list of stored commands in client
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // if there is no command, exit
    if (!command) return;

    // if the command is guildOnly or the channel type is not text, exit
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command here...');
    }

    // if the command has arguments, and the lenght of the args is not empty or 0
    if (command.args && !args.length) {
        let reply = 'Please provide the proper arguments for your command.';
        if(command.usage) {
            reply += `\nThe proper usage is: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.reply(reply);
    }

    // if the command does not exist in the cooldowns collection, add it
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmt = (command.cooldown || defaultCooldown) * 1000;
    // if the author already has a timestamp created
    if (timestamps.has(message.author.id)) {
        const expiry = timestamps.get(message.author.id) + cooldownAmt;
        // if the cooldown has yet to end...
        // exit and send message with how much longer to wait
        if (now < expiry) {
            const timeLeft = (expiry - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more seconds to use the ${command.name} command.`)
        }
    }

    // add author id to timestamps collection
    timestamps.set(message.author.id, now);
    // set a timeout for the user's timeout
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmt);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(`There was an error attempting to execute command: ${command}`);
    }
});

// log into Discord with your app's token
client.login(token);
