var fs = require('fs')
var readline = require('readline')
var google = require('googleapis')
const { GoogleAuth, OAuth2Client } = require('google-auth-library')

module.exports = (function () {
    var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly']
    var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
        process.env.USERPROFILE) + '/.credentials/'
    var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json'

    function getMyYoutubePlaylists() {
        return _runAuthorisedCallback(getMyPlaylists)
    }

    // playlist querry
    function getMyPlaylists(auth) {
        return new Promise(function (resolve, reject) {
            var service = new google.GoogleApis().youtube('v3')

            function playlistsHandler(err, responce) {
                if (err) {
                    console.log('The API returned an error: ' + err)
                    return reject(err)
                }
                resolve(responce.data.items)
            }

            service.playlists.list({
                auth: auth,
                mine: true,
                maxResults: 10,
                part: 'snippet'
            }, playlistsHandler)
        })
    }

    function _runAuthorisedCallback(callback) {
        return new Promise(function (resolve, reject) {
            _getCredentials().then(function (content) {
                _authorize(JSON.parse(content)).then(function (oauth2Client) {

                    callback(oauth2Client).then(function (data) {
                        return resolve(data)
                    }, function (err) {
                        reject(err)
                    })
                }, function (err) {
                    reject(err)
                })
            })
        })
    }

    function _getCredentials() {
        return new Promise(function (resolve, reject) {
            fs.readFile('./credentials/youtube.json', function processClientSecrets(err, content) {
                if (err) {
                    console.log('Error loading client secret file: ' + err)
                    return reject(err)
                }
                resolve(content)
            })
        })
    }

    // Create an OAuth2 client with the given credentials, and then execute the
    function _authorize(credentials) {
        return new Promise(function (resolve, reject) {
            var clientSecret = credentials.installed.client_secret
            var clientId = credentials.installed.client_id
            var redirectUrl = credentials.installed.redirect_uris[0]
            var auth = new GoogleAuth()
            var oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl)

            // Check if we have previously stored a token.
            fs.readFile(TOKEN_PATH, function (err, token) {
                if (err) {
                    _getNewToken(oauth2Client)
                    resolve(true)
                } else {
                    oauth2Client.credentials = JSON.parse(token)
                    resolve(oauth2Client)
                }
            })
        })
    }

    // deal with getting and saving the token the on initial call (ran only once)
    function _getNewToken(oauth2Client, callback) {
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        })
        console.log('Authorize this app by visiting this url: ', authUrl)
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        rl.question('Enter the code from that page here: ', function (code) {
            rl.close()
            oauth2Client.getToken(code, function (err, token) {
                if (err) {
                    console.log('Error while trying to retrieve access token', err)
                    return
                }
                oauth2Client.credentials = token
                _storeToken(token)
                callback(oauth2Client)
            })
        })
    }

    function _storeToken(token) {
        try {
            fs.mkdirSync(TOKEN_DIR)
        } catch (err) {
            if (err.code != 'EEXIST') {
                throw err
            }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token))
        console.log('Token stored to ' + TOKEN_PATH)
    }

    return {
        getMyYoutubePlaylists: getMyYoutubePlaylists
    }
})()