import { help as addAlias } from './addAlias'
import { help as joinVoiceChannel } from './joinVoiceChannel'
import { help as leaveVoiceChannel } from './leaveVoiceChannel'
import { help as playSong } from './playSong'

const helpObjects = {
    addAlias,
    joinVoiceChannel,
    leaveVoiceChannel,
    playSong
}

const help = {
    command: 'help',
    arguments: '[command]'
    description: 'Get the list of available commands or detailed help on a single command.'
}

const handler = function handler ({user, userID, channelID, message, event}) {
    let message = ''
    if ( message[2] )
        message = JSON.stringify(helpObjects[message[2], null, 4)
    else {
        const commandNames = Object.getOwnPropertyNames(helpObjects)
        commandNames.forEach(a=>message+=`\n${a}`)
        // message += `\n${addAlias.command}`
        // message += `\n${joinVoiceChannel.command}`
        // message += `\n${leaveVoiceChannel.command}`
        // message += `\n${playSong.command}`
    }
    return bot.sendMessage({
        to: channelID,
        message: `\`\`\`\n${message}\n\`\`\``
    })
}

export default handler
