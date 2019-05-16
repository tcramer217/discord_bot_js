// require the discord.js module
const Discord = require('discord.js');

// create a new Discord Client
const client = new Discord.Client();

const config_all = require('./src/main/resources/config.json');

// just hard-code dev env for now
// TODO : Make this dynamic based on actual env
const env = "development";

let config = config_all[env];
// Once the client is 'ready', run this code
// This event will only trigger one time after logging in
client.once('ready', () => {
    // console.log(`Logged in as ${client.user.tag}!`);
    console.log('Ready!');
});

// log into Discord with your app's token
client.login(config.apiKey);
