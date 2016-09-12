import _ from 'lodash'
import getServerFromChannel from '../toolbox/getServerFromChannel'

const knownSongs = {
    'the setup': {
        file: './sounds/the_setup.mp3',
        title: 'The Setup - Favored Nations'
    },
    'bushes of love': {
        file: './sounds/bushes_of_love.mp3',
        title: 'Bushes of Love'
    },
    'not the future': {
        file: './sounds/not_the_future.mp3',
        title: 'Not The Future'
    },
    'carl poppa': {
        file: './sounds/carl_poppa.mp3',
        title: 'Carl Poppa (La Jiggy Jar Jar Doo)'
    },
    '5seconds': {
        file: './sounds/5seconds.mp3',
        title: '5secondstest'
    },
    'cold beer': {
        file: './sounds/cold_beer.mp3',
        title: 'Cold Beer - Jesse Stewart'
    }
}

const handler = function handler ({user, userID, channelID, message, event}) {
    const channelParameter = parseInt(message[2])
    if ( isNaN(channelParameter) )
        return this.sendMessage({
            to: channelID,
            message: "You messed up again..."
        })
    // const serverId = this.channels[channelID].guild_id
    const server = getServerFromChannel(channelID, this)
    const channels = server.channels
    const channelIds = Object.getOwnPropertyNames(channels)
    let channel,
        channelToJoin
    for ( let x = 0, l = channelIds.length; x < l; x++ ) {
        channel = channels[channelIds[x]]
        if ( channel.type === 'voice' && ( channel.name.toLowerCase() === message[2] || channel.position == message[2] ) ) {
            channelToJoin = channel
        }
    }

    const song = message.slice(3).join(' ')
    this.setPresence({game: {name: knownSongs[song].title}})
    playSoundFile.bind(this)(knownSongs[song].file, channelToJoin.id)
    .then(() => {
        this.setPresence({game: {name: null}})
    })
    return
}

export default handler

function playSoundFile (file, channelID) {
    return new Promise((resolve, reject) => {
        this.getAudioContext(channelID, function(error, stream) {
            stream.playAudioFile(file)
            stream.once('fileEnd', function() {
                resolve()
            })
        })
    })
}
