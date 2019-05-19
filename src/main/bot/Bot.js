const responseBotInitiators = require("./utils/responseBotInitiators");

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

        this.updateCommands();

        let args = message.content.slice(prefix.length).split(/ +/);
        this.args = args;

        let commandName = args.shift().toLowerCase();

        this.activeCommandName = commandName;
        this.activeCommand = this.commands.get(commandName) || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
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
        // if the command does not exist in the cooldowns collection, add it
        if (!this.cooldowns.has(this.activeCommand.name)) {
            this.cooldowns.set(this.activeCommand.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = this.cooldowns.get(this.activeCommand.name);
        const cooldownAmt = (this.activeCommand.cooldown || defaultCooldown) * 1000;
        // if the author already has a timestamp created
        if (timestamps.has(this.message.author.id)) {
            const expiry = timestamps.get(this.message.author.id) + cooldownAmt;
            // if the cooldown has yet to end...
            // exit and send message with how much longer to wait
            if (now < expiry) {
                const timeLeft = (expiry - now) / 1000;
                return this.message.reply(`please wait ${timeLeft.toFixed(1)} more seconds to use the ${this.activeCommand.name} command.`)
            }
        }

        // add author id to timestamps collection
        timestamps.set(this.message.author.id, now);
        // set a timeout for the user's timeout
        setTimeout(() => timestamps.delete(this.message.author.id), cooldownAmt);
    }

    /**
     * Checks to see if the incoming message contains anything we want to respond to outside of a command
     * @returns {Message}
     */
    respondToResponseMessageAndEnd() {
        // we do not want to send multiple responses
        // if this is a command being executed by the user
        if (this.isCommandMessage() || this.isBotMessage()) return null;

        let messageAsArray = this.message.content.split(/ +/);
        if(messageAsArray.length > 0 && messageAsArray.length < 30) {
            messageAsArray.map(word => {
                if(responseBotInitiators[word] !== undefined) {
                    return this.message.reply(responseBotInitiators[word].responses[0].imgUrl ? responseBotInitiators[word].responses[0].imgUrl : responseBotInitiators[word].responses[0].message);
                }
            });
            // message was just a normal message
        }
        return null;
    }

    /**
     * Checks to see if the incoming message is a valid command for the bot
     * @param message
     */
    isCommandMessage() {
        return this.message.content.startsWith(prefix);
    }

    /**
     * Check to see if the incoming message is originating from a bot
     * @returns {boolean}
     */
    isBotMessage(message) {
        return message ? message.author.bot : this.message.author.bot;
    }

    engage() {

        // Once the client is 'ready', run this code
        // This event will only trigger one time after logging in
        this.once('ready', () => {
            console.log('Ready!');
        });

        this.on('message', message => {
            // I dont want to process any bot messages being added to the message queue at this time
            if(this.isBotMessage(message)) return;

            this.setInitialValuesFromMessage(message);

            this.respondToResponseMessageAndEnd();

            // At this point, if the message is not a command, we want to exit
            if (!this.isCommandMessage()) return;

            // if there is no command, exit... just double checking that the command is a valid one
            if (!this.getActiveCommand()) return;

            // if the command is guildOnly or the channel type is not text, exit
            if (this.getActiveCommand().guildOnly && message.channel.type !== 'text') {
                return message.reply('I can\'t execute that command here...');
            }
            // if the command has arguments, and the lenght of the args is not empty or 0
            if (this.getActiveCommand().args && !this.args.length) {
                let reply = 'Please provide the proper arguments for your command.';

                if(this.getActiveCommand().usage) {
                    reply += `\nThe proper usage is: \`${prefix}${this.getActiveCommand().name} ${this.getActiveCommand().usage}\``;
                }

                return message.reply(reply);
            }

            this.updateCooldowns();

            try {
                this.getActiveCommand().execute(message, this.args);
            } catch (error) {
                console.error(error);
                message.reply(`There was an error attempting to execute command: ${this.activeCommand}`);
            } finally {
                // todo: empty golbal vars
            }


        });

        this.login(this.token);
    }

}

module.exports = Bot;