import fs from 'fs'
import aliases from '../../aliases.json'

const handler = function handler ({user, userID, channelID, message, event}) {
    aliases[message[2]] = message[3]
    return fs.writeFile('./aliases.json', JSON.stringify(aliases, null, 4))
}

export default handler

const help = {
    command: 'addAlias',
    arguments: '<alias> <command>',
    description: 'Creates <alias> for <command>.'
}

export { help }
