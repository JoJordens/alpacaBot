import _ from 'lodash'

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
    },
    'kiss the sky': {
        file: './sounds/kiss_the_sky.mp3',
        title: 'Kiss The Sky (artist name too long)'
    },
    'pet sematary': {
        file: './sounds/pet_sematary.mp3',
        title: 'Ramones - Pet Sematary'
    },
    'wicked': {
        file:'./sounds/wicked.mp3',
        title: 'Cage the Elephant - Ain\'t no Rest for the Wicked'
    }
}

const handler = function handler ({user, userID, channelID, message, event}) {
    const channelId = this.connectedVoiceChannels[this.channels[channelID].guild_id]

    let songName
    if ( message[2].toLowerCase() === 'something' ) {
        const songNames = Object.getOwnPropertyNames(knownSongs)
        songName = songNames[Math.round( Math.random() * (songNames.length-1) )]
    } else
        songName = message.slice(2).join(' ')
    const song = knownSongs[songName]
    if ( !song )
        return
    this.setPresence({game: {name: song.title}})
    playSoundFile.bind(this)(song.file, channelId)
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

const help = {
    command: 'playSong',
    arguments: '<songname>',
    description: 'Tells the bot to play the specified song in the voice channel it\'s joined. Titles with multiple words are seperated by single whitespaces.'
}

export { help }
