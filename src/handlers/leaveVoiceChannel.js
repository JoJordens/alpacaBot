const handler = function handler ({user, userID, channelID, message, event}) {
    const serverId = this.channels[channelID].guild_id
    this.leaveVoiceChannel(this.connectedVoiceChannels[serverId])
    this.connectedVoiceChannels[serverId] = null
    return
}

export default handler
