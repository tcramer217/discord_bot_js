require('dotenv').config();
const MyBot = require('./src/main/bot/Bot');

let bot = new MyBot(process.env.DISCORD_TOKEN);
bot.engage();
