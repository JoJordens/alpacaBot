import getServerFromChannel from '../toolbox/getServerFromChannel'

// const currentVoiceChannels = []

const handler = function handler ({user, userID, channelID, message, event}) {
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
    if ( channelToJoin ) {
        // currentVoiceChannels.push(channelToJoin.id)
        joinVChannel.bind(this)(channelToJoin.id)
    }
    return
}

export default handler

function joinVChannel (channelID) {
    return new Promise((resolve, reject) => {
        this.joinVoiceChannel(channelID, function() {
            resolve()
        })
    })
}
