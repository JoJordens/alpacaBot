import getServerFromChannel from '../toolbox/getServerFromChannel'

const handler = function handler ({user, userID, channelID, message, event}) {
    const server = getServerFromChannel(channelID, this)
    _.each(server.channels, function(channel) {
        if ( channel.type === 'voice' /*&& _.includes(currentVoiceChannels, channel.id)*/ ) {
            leaveVChannel.bind(this)(channel.id)
        }
    })
    return
}

export default handler

function leaveVChannel (channelID) {
    this.leaveVoiceChannel(channelID);
}
