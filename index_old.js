"use strict";

var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var DiscordClient = require('discord.io');

var config = require('./config.json');
// var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var bot = new DiscordClient({
    autorun: true,
    email: config.email,
    password: config.password
    //OR
    // token: ""
});
var aliases = require('./aliases.json');


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
            }
};



bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")");
});

bot.on('disconnected', function () {
    console.log('bot disconnected');
});

const logWriteStream = fs.createWriteStream(__dirname + '/debug.log', {flags: 'w'});
bot.on('debug', function (rawEvent) {
    logWriteStream.write(JSON.stringify(rawEvent) + '\n');
});

var rememberStatus;
var currentVoiceChannels = [];
/*
var wasOffline = false;
bot.on('presence', function(user, userID, status, gameName, rawEvent) {
    if ( userID === "120900271843966978" ) {
        if ( status === 'offline' ) {
            wasOffline = true;
        }
        if ( status === 'online' && wasOffline ) {
            wasOffline = false;
            bot.sendMessage({
                to: "130931263295979520",
                message: "<@"+userID+"> fuck you"
            });
        }
    }
});
*/
bot.on('message', function(user, userID, channelID, message, rawEvent) {
    const botIsMentioned = _.any(rawEvent.d.mentions, function(mention) {
        return mention.id === bot.id;
    });

    if ( message.match('rekt') ) {
        postFile(channelID, 'rekt.png');
    }

    if (message.match('Kappa') ) {
        postFile(channelID, 'kappa.png');
    }

    if ( message.match('worry all day') ) {
        postFile(channelID, 'chickenduck.jpg');
        return;
    }

    if ( !botIsMentioned ) {
        return;
    }

    const messageSplit = message.toLowerCase().split(' ');

    // check for alias
    var alias = aliases[messageSplit[1]];
    if ( alias ) {
        messageSplit[1] = alias;
    }

    if ( messageSplit[1] === "ping" ) {
        bot.sendMessage({
            to: channelID,
            message: "pong"
        });
        return;
    }

    if ( messageSplit[1] === 'createalias' ) {
        aliases[messageSplit[3]] = messageSplit[2];
        var writeStream = fs.createWriteStream('./aliases.json');
        writeStream.write(JSON.stringify(aliases));
        return;
    }

    if ( messageSplit[1] === 'deletealias' ) {
        delete aliases[messageSplit[2]];
        var writeStream = fs.createWriteStream('./aliases.json');
        writeStream.write(JSON.stringify(aliases));
        return;
    }

if (messageSplit[1] === 'listsongs' ) {

var formatted = 'Songlist:\n';
_.each(knownSongs, function(songObject, key) {
    formatted = formatted + '* ' + key + '  -  ' + songObject.title + '\n';
});

	bot.sendMessage({
		to: channelID,
		message: formatted
	});
	return;
}

    if ( messageSplit[1] === 'playsong' ) {
        const song = messageSplit.slice(3).join(' ');
        const serverID = bot.serverFromChannel(channelID);
        const server = _.get(bot.servers, serverID);
        const channelToJoin = _.find(server.channels, function(channel) {
            if ( channel.type === 'voice' && ( channel.name.toLowerCase() === messageSplit[2] || channel.position == messageSplit[2] ) ) {
                return true;
            }
            return false;
        });
//        rememberStatus =
        // bot.setPresence({game: 'The Setup - Favored Nations'});
        bot.setPresence({game: knownSongs[song].title});
        playSoundFile(knownSongs[song].file, channelToJoin.id)
        .then(function() {
            bot.setPresence({game:null});
        });
        return;
    }

    if ( messageSplit[1] === 'sing' ) {
        return singSetup(channelID);
    }

    if ( messageSplit[1] === 'setstatus' ) {
        if ( messageSplit.length === 2 && messageSplit[2] === 'idle' ) {
            return bot.setPresence({
                idle_since: Date.now()
            });
        }
        const status = message.slice(32);
        bot.setPresence({
            game: status
        });
        return;
    }

    if ( messageSplit.join('').match('ismybreastsnice') ) {
        bot.sendMessage({
            to: channelID,
            message: "Nay!"
        });
        postFile(channelID, 'nay1.png');
        return;
    }

    // if ( messageSplit[1] === 'joinvoicechannel' || messageSplit[1] === 'leavevoicechannel' ) {
    if ( messageSplit[1] === 'joinvoicechannel' ) {
        const serverID = bot.serverFromChannel(channelID);
        const server = _.get(bot.servers, serverID);
        const channelToJoin = _.find(server.channels, function(channel) {
            if ( channel.type === 'voice' && ( channel.name.toLowerCase() === messageSplit[2] || channel.position == messageSplit[2] ) ) {
                return true;
            }
            return false;
        });
        if ( channelToJoin ) {
            // if ( messageSplit[1] === 'joinvoicechannel' ) {
                currentVoiceChannels.push(channelToJoin.id);
                joinVChannel(channelToJoin.id);
            // } else {
                // leaveVChannel(channelToJoin.id);
            // }
        }
        return;
    }

    if ( messageSplit[1] === 'leavevoicechannel' ) {
        const serverID = bot.serverFromChannel(channelID);
        const server = _.get(bot.servers, serverID);
        _.each(server.channels, function(channel) {
            if ( channel.type === 'voice' && _.includes(currentVoiceChannels, channel.id) ) {
                leaveVChannel(channel.id);
            }
        });
        return;
    }

    if ( messageSplit[1] === 'deletemessages' ) {
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
});

function playSoundFile (file, channelID) {
    return new Promise(function(resolve, reject) {
        bot.getAudioContext({ channel: channelID, stereo: true}, function(stream) {
            stream.playAudioFile(file);
            stream.once('fileEnd', function() {
                resolve();
            });
        });
    });
}

function joinVChannel (channelID) {
    return new Promise(function(resolve, reject) {
        bot.joinVoiceChannel(channelID, function() {
            resolve();
        });
    });
}

function leaveVChannel (channelID) {
    bot.leaveVoiceChannel(channelID);
}

function getMessageArray (channelID, limit) {
    return new Promise(function(resolve, reject) {
        bot.getMessages({
            channel: channelID,
            // before: "messageID", //Optional
            // after: "messageID" //Optional
            limit: limit //If 'limit' isn't added, it defaults to 50, the Discord default, 100 is the max.
        }, function(messageArr) {
            resolve(messageArr);
        });
    });
}

function singSetup (channelID) {
    const lyrics = require('./lyrics.json');
    // const lyrics = JSON.parse(fs.readFileSync('lyrics.json', 'utf8'));
    // const lyrics = [{time: ms, msg: string}];

    const tasks = [];
    lyrics.forEach(function(line) {
        tasks.push(function(callback) {
            setTimeout(function() {
                bot.sendMessage({
                    to: channelID,
                    message: line.msg
                });
                callback();
            }, line.timeSinceLast);
        });
    });
    async.series(tasks, function() {
        console.log('done singing');
    });
}

function postFile (channelID, fileName) {
    return new Promise(function(resolve, reject) {
        bot.uploadFile({
            to: channelID,
            file: fs.createReadStream(`./images/${fileName}`)
        }, function(response) {
            resolve();
        });
    });
}

