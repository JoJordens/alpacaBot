import _ from 'lodash'
import fs from 'fs'
import { spawn } from 'child_process'
import ytdl from 'ytdl-core'

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
    'girl': {
        file: './sounds/bignic_girl.mp3',
        title: 'Bignic - Girl'
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
    },
    'line': {
        file:'./sounds/toto_line.mp3',
        title: 'Toto - Hold the Line'
    },
    'halloween': {
        file:'./sounds/misfits_halloween.mp3',
        title: 'The Misfits - Halloween'
    }
}

const handler = function handler ({user, userID, channelID, message, event}) {
    const channelId = this.connectedVoiceChannels[this.channels[channelID].guild_id]
    if ( !channelId )
        return this.sendMessage({
            to: channelID,
            message: 'I\'m not actually in a voice channel right now, make me join one first.'
        })

    let songName
    if ( message[2].toLowerCase() === 'something' ) {
        const songNames = Object.getOwnPropertyNames(knownSongs)
        songName = songNames[Math.round( Math.random() * (songNames.length-1) )]
    } else
        songName = message.slice(2).join(' ')
    const song = knownSongs[songName]

    if ( song ) {
        this.setPresence({game: {name: song.title}})
        playSoundFile.bind(this)(song.file, channelId)
            .then(() => {
                this.setPresence({game: {name: null}})
            })
    } else {
        const url = message[2]
        let formattedUrl
        if ( url.length === 11 )
            formattedUrl = `http://www.youtube.com/watch?v=${url}`
        else {
            if ( url.length === 42 && url.match(/http:\/\/www.youtube.com\/watch\?v=[\w-]{11}/) )
                formattedUrl = url
            else {
                const indexOfV = url.indexOf('v=')
                if ( indexOfV === -1 )
                    return this.sendMessage({
                        to: channelID,
                        message: 'This doesn\'t appear to be a valid youtube video, or I failed to process it. If it\'s the latter, tell ACrazyAlpaca about it.'
                    })
                formattedUrl = `http://www.youtube.com/watch?${url.slice(indexOfV, indexOfV + 13)}`
            }
        }

        playMusicFromYT.bind(this)(formattedUrl, channelId)
            .then(() => {
                this.setPresence({game: {name: null}})
            })
    }
}

export default handler

function playSoundFile (file, channelID) {
    return new Promise((resolve, reject) => {
        this.getAudioContext(channelID, function(error, stream) {
            stream.once('fileEnd', function() {
                resolve()
            })
            stream.playAudioFile(file)
        })
    })
}

function playMusicFromYT (url, channelID) {
    return new Promise((resolve, reject) => {
        const dl = ytdl(url, {filter: 'audioonly'})
        const fileName = `ytdl_${new Date().getTime()}`
        dl.once('info', (info, format) => {
            if ( info.length_seconds > 600 ) {
                // TODO log too long
            } else {
                const fileWriteStream = fs.createWriteStream(fileName)
                dl.pipe(fileWriteStream)
                // TODO fileWriteStream.on('error') log
                fileWriteStream.once('close', () => {
                    this.getAudioContext(channelID, function(error, stream) {
                        // TODO log error
                        stream.once('done', function() {
                            deleteFile(fileName)
                            resolve()
                        })
                        stream.playAudioFile(fileName)
                    })
                })
            }
        })
    })
}

function deleteFile (file) {
    fs.unlink(file, error => {
        // TODO log error
    })
}

const help = {
    command: 'playSong',
    arguments: '<songname>',
    description: 'Tells the bot to play the specified song in the voice channel it\'s joined. Titles with multiple words are seperated by single whitespaces.'
}

export { help }
