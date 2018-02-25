spawn = require('child_process').spawn

module.exports = (function () {

    function runServer(subdomain, port) {
        var proc = spawn(`${__dirname}\\node_modules\\.bin\\lt.cmd`, ['--port', port, '--subdomain', subdomain])
        proc.stderr.on('data', function (err) {
            console.log(err.toString())
        })
        proc.stdout.on('data', function (data) {
            console.log(`${data.toString()} and it's forwarding localhost's port ${port}`)
        })
    }
    return {
        run: runServer
    }
})()