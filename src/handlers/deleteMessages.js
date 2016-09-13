const handler = function handler ({user, userID, channelID, message, event}) {
    const limit = parseInt(message[2]) || message[2]

    if ( limit !== 0 ) {
        const deleteHandler = new DeleteHandler({
            limit,
            channelID,
            bot: this
        })

        deleteHandler.start()
    }

}

class DeleteHandler {
    constructor ({ limit = 50, bot, channelID } = {} ) {
        this.all = limit === 'all'
        this.done = false
        this.limit = limit === 'all' ? null : limit + 1
        this.bot = bot
        this.channelID = channelID
    }

    start () {
        this.step()
    }

    step () {
        if ( !this.done )
            this.deleteNextBatch()
    }

    deleteNextBatch () {
        const limit = this.limit

        this.getMessages((error, messageArray) => {
            if ( !error ) {
                if ( this.all || limit > 99 ) {
                    this.limit = limit - 100
                    if ( messageArray.length < 100 )
                        this.done = true
                    this.deleteMessages(messageArray)
                } else {
                    this.limit = 0
                    this.done = true
                    this.deleteMessages(messageArray.slice(0, limit))
                }
            }
        })

    }

    getMessages (cb) {
        const limit = this.limit
        const amount = this.all ? 100 : (limit > 99) ? 100 : limit
        this.bot.getMessages({channelID: this.channelID, limit: amount}, (error, messageArray) => {
            return cb(error, messageArray)
        })
    }

    deleteMessages (messageArray) {
        this.bot.deleteMessages({channelID: this.channelID, messageIDs: messageArray.map(m=>m.id)}, (error, response) => {
            /*todo logs errors*/
            setTimeout(() => {
                this.step()
            }, 500)
        })
    }
}



export default handler

const help = {
    command: 'deleteMessages',
    arguments: '[amount]',
    description: 'Deletes [amount] amount of messages in the current channel. Defauls to 50 messages, use "all" to delete the entire channel history.'
}

export { help }
