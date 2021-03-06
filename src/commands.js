import joinVoiceChannel from './handlers/joinVoiceChannel'
import leaveVoiceChannel from './handlers/leaveVoiceChannel'
import playSong from './handlers/playSong'
import addAlias from './handlers/addAlias'
import help from './handlers/help'
import deleteMessages from './handlers/deleteMessages'

const commands = {
    joinVoiceChannel,
    leaveVoiceChannel,
    playSong,
    addAlias,
    help,
    deleteMessages
}

export default commands
