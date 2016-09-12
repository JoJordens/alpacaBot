import fs from 'fs'

import config from './config.json'
import commands from './commands'

import Discord from 'discord.io'
const bot = new Discord.Client({
    token: config.token,
    autorun: true
})

bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")")
    const myProps = {
        id: bot.id,
        username: bot.username,
        email: bot.email,
        discriminator: bot.discriminator,
        avatar: bot.avatar,
        bot: bot.bot,
        verifed: bot.verifed,
        connected: bot.connected,
        presenceStatus: bot.presenceStatus,
        inviteURL: bot.inviteURL,
        servers: bot.servers,
        channels: bot.channels,
        users: bot.users,
        directMessages: bot.directMessages,
        internals: bot.internals
    }
    fs.writeFile('myProps.json', JSON.stringify(myProps, null, 4))
})

bot.on('message', function(user, userID, channelID, message, event) {
    const mentions = event.d.mentions
    let iGotMentioned = false
    for ( let x = 0, l = mentions.length; x < l; x++ ) {
        if ( mentions[x].id === this.id ) {
            iGotMentioned = true
            break
        }
    }


    if ( !iGotMentioned )
        return true


    const splitMessage = message.split(' ')
    if ( splitMessage[0] !== `<@${this.id}>` )
        return true

    if (splitMessage[1] === "ping") {
        return bot.sendMessage({
            to: channelID,
            message: "pong"
        })
    }

    const handler = commands[splitMessage[1]]
    handler.bind(this)({user, userID, channelID, message: splitMessage, event})
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
