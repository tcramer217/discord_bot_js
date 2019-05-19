const {defaultCooldown, prefix} = require('../resources/config');

const Discord = require("discord.js");
const fs = require("fs");

class Bot extends Discord.Client {
    constructor(token, options) {
        super(options);

        // objects
        this.activeCommand;

        // strings
        this.activeCommandName = '';
        this.args = [];
        this.message = {};
        this.token = token;

        // collections
        this.commands = new Discord.Collection();
        this.cooldowns = new Discord.Collection();

        this.engage = this.engage.bind(this);
    }

    /**
     * Set the bot's api token
     * @param token
     */
    // setToken(token) {
    //     this.token = token;
    // }

    setInitialValuesFromMessage(message) {
        this.message = message;
        let args = message.content.slice(prefix.length).split(/ +/);
        let commandName = args.shift().toLowerCase();

        console.log('args', args);

        this.activeCommandName = commandName;
        this.activeCommand = this.commands.get(commandName) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        this.args = args;

        this.updateCommands();
    }

    /**
     *
     * @returns {Array}
     */
    getArgs() {
        return this.args;
    }

    /**
     *
     * @returns {string}
     */
    getActiveCommandName() {
        return this.activeCommandName;
    }

    /**
     *
     * @returns {Command}
     */
    getActiveCommand() {
        return this.activeCommand;
    }

    /**
     * Update list of available commands
     */
    updateCommands() {
        const commandFiles = fs.readdirSync('./src/main/bot/commands').filter(file => file.endsWith('.js'));
        for( const file of commandFiles) {
            const command = require(`./commands/${file}`);
            this.commands.set(command.name, command);
        }
    }

    // get the current cooldowns
    updateCooldowns() {
        let activeCommand = this.getActiveCommand();
        // if the command does not exist in the cooldowns collection, add it
        if (!this.cooldowns.has(activeCommand.name)) {
            this.cooldowns.set(activeCommand.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = this.cooldowns.get(activeCommand.name);
        const cooldownAmt = (activeCommand.cooldown || defaultCooldown) * 1000;
        // if the author already has a timestamp created
        if (timestamps.has(this.message.author.id)) {
            const expiry = timestamps.get(this.message.author.id) + cooldownAmt;
            // if the cooldown has yet to end...
            // exit and send message with how much longer to wait
            if (now < expiry) {
                const timeLeft = (expiry - now) / 1000;
                return this.message.reply(`please wait ${timeLeft.toFixed(1)} more seconds to use the ${activeCommand.name} command.`)
            }
        }

        // add author id to timestamps collection
        timestamps.set(this.message.author.id, now);
        // set a timeout for the user's timeout
        setTimeout(() => timestamps.delete(this.message.author.id), cooldownAmt);
    }

    engage() {

        // Once the client is 'ready', run this code
        // This event will only trigger one time after logging in
        this.once('ready', () => {
            // console.log(`Logged in as ${client.user.tag}!`);
            console.log('Ready!');
        });

        this.on('message', message => {
            this.setInitialValuesFromMessage(message);

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