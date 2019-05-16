const {pruneMin, pruneMax} = require('../../resources/config');

module.exports = {
    name: 'prune',
    description: 'Prune n messages...',
    execute(message, args) {
        const pruneAmt = parseInt(args[0]) + 1;

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
    },
};