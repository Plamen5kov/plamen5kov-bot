watson = require('watson-developer-cloud')

module.exports = (function () {
    let dialogWorkspaceId = null

    function setUpWatsonBot(watsonCredentials) {
        dialogWorkspaceId = watsonCredentials.workspace.workspace_id
        const watsonConversation = new watson.conversation({
            username: watsonCredentials.credentials.username,
            password: watsonCredentials.credentials.password,
            version: 'v1',
            version_date: "2018-02-16"
        })

        return watsonConversation
    }

    function generateWatsonMessage(inputText) {
        return {
            workspace_id: dialogWorkspaceId,
            input: { 'text': inputText }
        }
    }
    return {
        setUpWatsonBot: setUpWatsonBot,
        generateWatsonMessage: generateWatsonMessage
    }
})()