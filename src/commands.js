import joinVoiceChannel from './handlers/joinVoiceChannel'
import leaveVoiceChannel from './handlers/leaveVoiceChannel'
import playSong from './handlers/playSong'
import addAlias from './handlers/addAlias'

const commands = {
    joinVoiceChannel,
    leaveVoiceChannel,
    playSong,
    addAlias
}

export default commands
