BootBot = require('bootbot')

module.exports = (function () {
    function setUpFacebookConnection(facebookCredentials) {
        const facebookConnection = new BootBot({
            accessToken: facebookCredentials.accessToken,
            verifyToken: facebookCredentials.verifyToken,
            appSecret: facebookCredentials.appSecret
        })

        facebookConnection.start()
        return facebookConnection
    }

    return {
        setUpFacebookConnection: setUpFacebookConnection
    }
})()