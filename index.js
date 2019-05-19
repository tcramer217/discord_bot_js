// var Bot = require('./src/main/bot/Bot');
const MyBot = require('./src/main/bot/Bot');

const {token} = require('./src/main/resources/config');

let bot = new MyBot(token);
bot.engage();
