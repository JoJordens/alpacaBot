"use strict";

var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var DiscordClient = require('discord.io');

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var bot = new DiscordClient({
    autorun: true,
    email: config.email,
    password: config.password
    //OR
    // token: ""
});

bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")");
});

bot.on('message', function(user, userID, channelID, message, rawEvent) {
    message = message.toLowerCase().split(' ');

    if ( message[0] === "ping" ) {
        bot.sendMessage({
            to: channelID,
            message: "pong"
        });
    }
    if ( message[0] === '!itsasetup' ) {
        const serverID = bot.serverFromChannel(channelID);
        const server = _.get(bot.servers, serverID);
        const channelToJoin = _.find(server.channels, function(channel) {
            if ( channel.type === 'voice' && ( channel.name.toLowerCase() === message[1] || channel.position == message[1] ) ) {
                return true;
            }
            return false;
        });
        playSoundFile('./sounds/the_setup.mp3', channelToJoin.id);
    }
    if ( message[0] === '!sing' ) {
        singSetup(channelID);
    }

    if ( message[0] === '!setstatus' ) {
        if ( message.length === 2 && message[1] === 'idle' ) {
            return bot.setPresence({
                idle_since: Date.now()
            });
        }
        const status = _.rest(message).join(' ');
        bot.setPresence({
            game: status
        });
    }

    if ( message[0] === '!nay' ) {
        bot.sendMessage({
            to: channelID,
            message: "Nay!"
        });
    }

    if ( message[0] === '!joinvoicechannel' || message[0] === '!leavevoicechannel' ) {
        const serverID = bot.serverFromChannel(channelID);
        const server = _.get(bot.servers, serverID);
        const channelToJoin = _.find(server.channels, function(channel) {
            if ( channel.type === 'voice' && ( channel.name.toLowerCase() === message[1] || channel.position == message[1] ) ) {
                return true;
            }
            return false;
        });
        if ( channelToJoin ) {
            if ( message[0] === '!joinvoicechannel' ) {
                joinVChannel(channelToJoin.id);
            } else {
                leaveVChannel(channelToJoin.id);
            }
        }
    }

    if ( message[0] === '!deletemessages' ) {
        getMessageArray(channelID, parseInt(message[1])||100)
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
    return new Promise(function(resolve, reject) {
        bot.leaveVoiceChannel(channelID, function() {
            resolve();
        });
    });
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
    const lyrics = JSON.parse(fs.readFileSync('lyrics.json', 'utf8'));
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
