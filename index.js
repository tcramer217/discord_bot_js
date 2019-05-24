require('dotenv').config();
const { User } = require('./src/main/bot/db/sequelize');

let userCreateJson = {
    name: 'name',
    username: 'username',
    birthday: new Date(1989, 12, 20)
};

User.create(userCreateJson)
    .then(user => console.log('something about users: {}', user));

// set up le bot
const MyBot = require('./src/main/bot/Bot');

let bot = new MyBot(process.env.DISCORD_TOKEN);
bot.engage();
