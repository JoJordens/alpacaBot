
const config = require('./config.json')

const Discord = require('discord.io')
const bot = new Discord.Client({
    token: config.token,
    autorun: true
})

bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")")
    const myProps = {
        id: JSON.stringify(bot.id),
        username: JSON.stringify(bot.username),
        email: JSON.stringify(bot.email),
        discriminator: JSON.stringify(bot.discriminator),
        avatar: JSON.stringify(bot.avatar),
        bot: JSON.stringify(bot.bot),
        verifed: JSON.stringify(bot.verifed),
        connected: JSON.stringify(bot.connected),
        presenceStatus: JSON.stringify(bot.presenceStatus),
        inviteURL: JSON.stringify(bot.inviteURL),
        servers: JSON.stringify(bot.servers),
        channels: JSON.stringify(bot.channels),
        users: JSON.stringify(bot.users),
        directMessages: JSON.stringify(bot.directMessages),
        internals: JSON.stringify(bot.internals)
    }
    fs.writeFile('myProps.json', myProps)
})

bot.on('message', function(user, userID, channelID, message, event) {
    if (message === "ping") {
        bot.sendMessage({
            to: channelID,
            message: "pong"
        })
    }
})

// // https://discordapp.com/oauth2/authorize?client_id=223032766441324545&scope=bot&permissions=346200

// const permissions = {
//     READ_MESSAGES: 400,
//     SEND_MESSAGES: 800,
//     SEND_TTS_MESSAGES: 1000,
//     MANAGE_MESSAGES: 2000,
//     EMBED_LINKS: 4000,
//     ATTACH_FILES: 8000,
//     READ_MESSAGE_HISTORY: 10000,
//     MENTION_EVERYONE: 20000,
//     CONNECT: 100000,
//     SPEAK: 200000
// }

// const a = Object.getOwnPropertyNames(permissions)
// let total = 0
// for ( let x = 0, l = a.length; x < l; x++ ) {
//     total += parseInt(permissions[a[x]], 16)
// }

// const url = `https://discordapp.com/oauth2/authorize?client_id=223032766441324545&scope=bot&permissions=${total}`
// console.log('invitation url = %s', url)
