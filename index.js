var _ = require('lodash');
var DiscordClient = require('discord.io');
var bot = new DiscordClient({
    autorun: true,
    email: config.email,
    password: config.password,
    //OR
    // token: ""
});

bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")");

    // curt talk channel "130931263295979521"
    // my test channel "129286002274598913"
    // bot.joinVoiceChannel("130931263295979521", function() {
    // });

    // bot.leaveVoiceChannel("129286002274598913");

});

bot.on('message', function(user, userID, channelID, message, rawEvent) {
    message = message.toLowerCase().split(' ');

    if (message[0] === "ping") {
        bot.sendMessage({
            to: channelID,
            message: "pong"
        });
    }
    if (message[0] === '!itsasetup' ) {
        playSoundFile('./sounds/the_setup.mp3', channelID);
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
});

function playSoundFile (file, channel) {
    return new Promise(function(resolve, reject) {
        bot.getAudioContext({ channel: '130931263295979521', stereo: true}, function(stream) {
            stream.playAudioFile(file);
            stream.once('fileEnd', function() {
                resolve();
            });
        });
    });
}
