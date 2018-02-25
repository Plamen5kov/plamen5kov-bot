'use strict'

let watsonCredentials = require("./credentials/watson.json"),
    watsonLib = require("./watson-library"),
    facebookCredentials = require("./credentials/facebook.json"),
    facebookLib = require("./facebook-library"),
    youtubeLib = require("./youtube-library"),
    localServer = require("./local-server")

const facebookConnection = facebookLib.setUpFacebookConnection(facebookCredentials)
const watsonConversation = watsonLib.setUpWatsonBot(watsonCredentials)

facebookConnection.on('message', (payload, chat) => {
    commandController(payload.message.text, chat)
})

function commandController(message, chat) {
    switch (message) {
        case "ytpl":
            youtubeLib.getMyYoutubePlaylists().then(function (data) {
                let playlists = [];
                let MAX_BUTTON_SHOW_COUNT = 3;
                data.forEach(element => {
                    playlists.push({
                        type: 'web_url',
                        title: element.snippet.title,
                        url: `https://www.youtube.com/playlist?list=${element.id}`
                    })
                });

                if (playlists.length > MAX_BUTTON_SHOW_COUNT) {

                    let index = 0
                    while (index < playlists.length) {
                        let chunk = playlists.slice(index, index + MAX_BUTTON_SHOW_COUNT)
                        index += MAX_BUTTON_SHOW_COUNT

                        chat.say({
                            template_type: "button",
                            text: 'Here are plamen\'s playlists. Choose one:',
                            buttons: chunk
                        });
                    }
                }
            })
            break;
        default:
            watsonConversation.message(watsonLib.generateWatsonMessage(message), watsonMessageResponceHandler)
    }

    function watsonMessageResponceHandler(err, response) {
        if (err) {
            console.log('error:', err)
        }
        chat.say(response.output.text)
    }
}

localServer.run("plamen5kov", 3000)