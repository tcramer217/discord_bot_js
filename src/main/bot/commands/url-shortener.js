const BitlyClient = require('bitly');
var validator = require('validator');
const bitly = BitlyClient(process.env.BITLY_ACCESS_TOKEN);

module.exports = {
    name: 'url-shorten',
    description: 'Shorten a url using bit.ly',
    aliases: ['shorten'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args) {
        // get url from args
        const longUrl = args[0];
        // make sure url is valid url
        // TODO : there is currently a bug with the validator accepting non-secure uris or simple links (like google.com instead of https://www.google.com)
        // This is a breaking bug, but for now going to leave it. Need to find a better url validator, maybe one that creates a full uri if missing protocol or www domain prefix
        const isUrl = validator.isURL(longUrl) ? true : false;
        // if it's not a url, exit, please
        if(!isUrl) return;

        // since it is a url, lets shorten it to bit.ly/hash
        getLink(longUrl).then((bitlyResponse) => {
            return message.reply('Your bit.ly URL is: ' + bitlyResponse.data.url);
        }).catch((error) => {
            return message.reply('There was an error with creating your shortened link: StatusCode: ', error.statusCode);
        });

    }
};

async function getLink(longURL) {
    let shortUrl;
    try {
        shortUrl = await bitly.shorten(longURL);
    } catch (e) {
        throw e;
    }
    return shortUrl;
}