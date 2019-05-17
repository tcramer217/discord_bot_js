const {defaultCooldown, prefix} = require('../resources/config');

const Discord = require("discord.js");
const fs = require("fs");

class Bot extends Discord.Client {
    constructor(options) {
        super(options);

        this.token = 'use-set-token-to-update';
        this.commands = new Discord.Collection();
        this.cooldowns = new Discord.Collection();

        this.engage = this.engage.bind(this);
    }

    getArgs() {
        return message.content.slice(prefix.length).split(/ +/);
    }

    getActiveCommandName() {
        return this.getArgs().shift().toLowerCase();
    }

    // get the command from the list of stored commands in client
    getActiveCommand() {
        let commandName = this.getActiveCommandName();
        return this.commands.get(commandName) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    }

    // get all commands
    updateCommands() {
        const commandFiles = fs.readdirSync('./src/main/bot/commands').filter(file => file.endsWith('.js'));
        console.log('commandFiles: {}', commandFiles);
        for( const file of commandFiles) {
            const command = require(`./commands/${file}`);
            this.commands.set(command.name, command);
        }
    }

    // get the current cooldowns
    updateCooldowns() {
        let {activeCommand, commands, cooldowns} = this;
        // if the command does not exist in the cooldowns collection, add it
        if (!cooldowns.has(activeCommand.name)) {
            cooldowns.set(activeCommand.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(activeCommand.name);
        const cooldownAmt = (activeCommand.cooldown || defaultCooldown) * 1000;
        // if the author already has a timestamp created
        if (timestamps.has(message.author.id)) {
            const expiry = timestamps.get(message.author.id) + cooldownAmt;
            // if the cooldown has yet to end...
            // exit and send message with how much longer to wait
            if (now < expiry) {
                const timeLeft = (expiry - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more seconds to use the ${activeCommand.name} command.`)
            }
        }

        // add author id to timestamps collection
        timestamps.set(message.author.id, now);
        // set a timeout for the user's timeout
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmt);
    }

    setToken(token) {
        this.token = token;
    }

    engage() {

        this.updateCommands()
        // Once the client is 'ready', run this code
        // This event will only trigger one time after logging in
        this.once('ready', () => {
            // console.log(`Logged in as ${client.user.tag}!`);
            console.log('Ready!');
        });

        this.on('message', message => {
            const {activeCommand} = this;
            // Message does not start with prefix or the message author is a bot
            if (!message.content.startsWith(prefix) || message.author.bot) return;

            // if there is no command, exit
            if (!this.getActiveCommand()) return;

            // if the command is guildOnly or the channel type is not text, exit
            if (this.getActiveCommand().guildOnly && message.channel.type !== 'text') {
                return message.reply('I can\'t execute that command here...');
            }

            // if the command has arguments, and the lenght of the args is not empty or 0
            if (this.getActiveCommand().args && !args.length) {
                let reply = 'Please provide the proper arguments for your command.';
                if(this.getActiveCommand().usage) {
                    reply += `\nThe proper usage is: \`${prefix}${this.getActiveCommand().name} ${this.getActiveCommand().usage}\``;
                }

                return message.reply(reply);
            }

            this.updateCooldowns()

            try {
                this.getActiveCommand().execute(message, this.getArgs());
            } catch (error) {
                console.error(error);
                message.reply(`There was an error attempting to execute command: ${activeCommand}`);
            }


        });

        this.login(this.token);
    }
}

module.exports = Bot;