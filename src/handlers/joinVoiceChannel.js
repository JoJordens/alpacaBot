const handler = function handler ({user, userID, channelID, message, event}) {
    const server = this.servers[this.channels[channelID].guild_id]
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
        this.connectedVoiceChannels = Object.assign({}, this.connectedVoiceChannels||{}, {[server.id]: channelToJoin.id})
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

const help = {
    command: 'joinVoiceChannel',
    arguments: '<channelNameOrId>',
    description: 'Tells the bot to join the specified voice channel.\nSpecify channel by the exact name or position id starting from 0.'
}

export { help }