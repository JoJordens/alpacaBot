function getServerFromChannel (channelId, bot) {
    const servers = bot.servers
    const serverIds = Object.getOwnPropertyNames(servers)
    let server,
        channelIds
    for ( let x = 0, l = serverIds.length; x < l; x++ ) {
        server = servers[serverIds[x]]
        channelIds = Object.getOwnPropertyNames(server.channels)
        for ( let x = 0, l = channelIds.length; x < l; x++ ) {
            if ( channelIds[x] === channelId ) {
                return server
            }
        }
    }
}

export default getServerFromChannel
