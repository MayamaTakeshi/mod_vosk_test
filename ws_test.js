const { WebSocketServer } = require('ws')

const PORT = 2700

const wss = new WebSocketServer({ port: PORT })

function log(s) {
    console.log(`${new Date()}: ${s}`)
}

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message, isBinary) {
        if(isBinary) {
            log('received binary message with ' + message.length + ' bytes')
        } else {
            log(`received: ${message}`)
        }
    })

    ws.on('close', () => {
        log('connection closed')
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

        ws.send(msg)

        log(`sent ${msg}`)
    }, 2000)
})

