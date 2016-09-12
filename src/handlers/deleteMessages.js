const handler = function handler ({user, userID, channelID, message, event}) {
    this.getMessages({channelID: channelID, limit: })
    return getMessageArray(channelID, parseInt(messageSplit[2])||100)
        .then(function(messages) {
            messages.forEach(function(message) {
                bot.deleteMessage({
                    channel: channelID,
                    messageID: message.id
                });
            });
        })
        .catch(function(error) {
            console.log(error);
            // todo log errors
            bot.sendMessage({
                to: channelID,
                message: "something went wrong, check the log file"
            });
        });
}

export default handler

const help = {
    command: 'deleteMessages',
    arguments: '[number]',
    description: 'Deletes [number] amount of messages in the current channel.\nDefauls to 50 messages.'
}

export { help }
