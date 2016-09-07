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
            }
}

const handler = function handler ({user, userID, channelID, message, event}) {
    const song = message.slice(3).join(' ')
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

    this.setPresence({game: {name: knownSongs[song].title}})
    playSoundFile.bind(this)(knownSongs[song].file, channelToJoin.id)
    .then(function() {
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
