import { help as addAlias } from './addAlias'
import { help as joinVoiceChannel } from './joinVoiceChannel'
import { help as leaveVoiceChannel } from './leaveVoiceChannel'
import { help as playSong } from './playSong'

const help = {
    command: 'help',
    arguments: '[command]',
    description: 'Get the list of available commands or detailed help on a single command.'
}

const helpObjects = {
    addAlias,
    joinVoiceChannel,
    leaveVoiceChannel,
    playSong,
    help
}

const handler = function handler ({user, userID, channelID, message, event}) {
    let helpMessage = ''
    if ( message[2] )
        helpMessage = JSON.stringify(helpObjects[message[2]], null, 4)
    else {
        const commandNames = Object.getOwnPropertyNames(helpObjects)
        commandNames.forEach(a=>helpMessage+=`\n${a}`)
        // message += `\n${addAlias.command}`
        // message += `\n${joinVoiceChannel.command}`
        // message += `\n${leaveVoiceChannel.command}`
        // message += `\n${playSong.command}`
    }
    return bot.sendMessage({
        to: channelID,
        message: `\`\`\`\n${helpMessage}\n\`\`\``
    })
}

export default handler
