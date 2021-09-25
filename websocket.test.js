var WebSocketServer = require('websocket').server
var http = require('http')

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url)
    response.writeHead(404)
    response.end()
})

const PORT = 2700

server.listen(PORT, function() {
    console.log((new Date()) + ' Server is listening on port ' + PORT)
})

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
})

function log(s) {
    console.log(`${new Date()}: ${s}`)
}

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin)
    log('connection accepted')

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            log('received Message: ' + message.utf8Data)
        }
        else if (message.type === 'binary') {
            log('received Binary Message of ' + message.binaryData.length + ' bytes')
        }
    })

    connection.on('close', function(reasonCode, description) {
        log('peer ' + connection.remoteAddress + ' disconnected.')
    })

	setTimeout(() => {
        const res = {
            "result" : [{
                "conf" : 1.000000,
                "end" : 1.680000,
                "start" : 1.320000,
                "word" : "hello"
                }],
             "text" : "hello"
        }
        const msg = JSON.stringify(res)
        connection.send(msg)
        log(`sent ${msg}`)
    }, 2000)
})

