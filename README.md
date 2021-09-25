# mod_vosk_test


This is a simple nodejs app showing interaction between freeswitch mod_vosk with the websocket server (this app).

I followed instructions from https://github.com/alphacep/freeswitch/tree/d118d67e56afb31e96c013097de0c91d65cba929/src/mod/asr_tts/mod_vosk to install mod_vosk.

## Test

First I tried with nodejs module 'ws'. But got this when generating a call:
```
$ node ws_test.js
Sat Sep 25 2021 15:53:58 GMT+0900 (Japan Standard Time): received binary message with 3200 bytes
Sat Sep 25 2021 15:53:58 GMT+0900 (Japan Standard Time): received binary message with 3200 bytes
Sat Sep 25 2021 15:53:59 GMT+0900 (Japan Standard Time): received binary message with 3200 bytes
Sat Sep 25 2021 15:53:59 GMT+0900 (Japan Standard Time): sent {"result":[{"conf":1,"end":1.68,"start":1.32,"word":"hello"}],"text":"hello"}                                                   
Sat Sep 25 2021 15:53:59 GMT+0900 (Japan Standard Time): received binary message with 3200 bytes
events.js:292
      throw er; // Unhandled 'error' event
      ^

RangeError: Invalid WebSocket frame: MASK must be set
    at Receiver.getInfo (/usr/local/src/git/MayamaTakeshi/mod_vosk_test/node_modules/ws/lib/receiver.js:289:16)                                                                                           
    at Receiver.startLoop (/usr/local/src/git/MayamaTakeshi/mod_vosk_test/node_modules/ws/lib/receiver.js:136:22)                                                                                         
    at Receiver._write (/usr/local/src/git/MayamaTakeshi/mod_vosk_test/node_modules/ws/lib/receiver.js:83:10)                                                                                             
    at writeOrBuffer (internal/streams/writable.js:358:12)
    at Receiver.Writable.write (internal/streams/writable.js:303:10)
    at Socket.socketOnData (/usr/local/src/git/MayamaTakeshi/mod_vosk_test/node_modules/ws/lib/websocket.js:1116:35)                                                                                      
    at Socket.emit (events.js:315:20)
    at addChunk (internal/streams/readable.js:309:12)
    at readableAddChunk (internal/streams/readable.js:284:9)
    at Socket.Readable.push (internal/streams/readable.js:223:10)
Emitted 'error' event on WebSocket instance at:
    at Receiver.receiverOnError (/usr/local/src/git/MayamaTakeshi/mod_vosk_test/node_modules/ws/lib/websocket.js:1002:13)                                                                                 
    at Receiver.emit (events.js:315:20)
    at emitErrorNT (internal/streams/destroy.js:106:8)
    at emitErrorCloseNT (internal/streams/destroy.js:74:3)
    at processTicksAndRejections (internal/process/task_queues.js:80:21) {
  code: 'WS_ERR_EXPECTED_MASK',
  [Symbol(status-code)]: 1002
}
```

So it seems mod_vosk/libks is not doing the required masking (see https://github.com/websockets/ws/issues/1771)

Anyway as a workaound I tried with nodejs module 'websocket' and it worked:

```
$ node websocket.test.js
Sat Sep 25 2021 16:14:11 GMT+0900 (Japan Standard Time) Server is listening on port 2700
Sat Sep 25 2021 16:14:25 GMT+0900 (Japan Standard Time): connection accepted
Sat Sep 25 2021 16:14:25 GMT+0900 (Japan Standard Time): received Binary Message of 3200 bytes
Sat Sep 25 2021 16:14:26 GMT+0900 (Japan Standard Time): received Binary Message of 3200 bytes
Sat Sep 25 2021 16:14:26 GMT+0900 (Japan Standard Time): received Binary Message of 3200 bytes
Sat Sep 25 2021 16:14:26 GMT+0900 (Japan Standard Time): received Binary Message of 3200 bytes
Sat Sep 25 2021 16:14:26 GMT+0900 (Japan Standard Time): received Binary Message of 3200 bytes
Sat Sep 25 2021 16:14:26 GMT+0900 (Japan Standard Time): received Binary Message of 3200 bytes
Sat Sep 25 2021 16:14:27 GMT+0900 (Japan Standard Time): received Binary Message of 3200 bytes
Sat Sep 25 2021 16:14:27 GMT+0900 (Japan Standard Time): received Binary Message of 3200 bytes
Sat Sep 25 2021 16:14:27 GMT+0900 (Japan Standard Time): received Binary Message of 3200 bytes
Sat Sep 25 2021 16:14:27 GMT+0900 (Japan Standard Time): sent {"result":[{"conf":1,"end":1.68,"start":1.32,"word":"hello"}],"text":"hello"}                                                               
Sat Sep 25 2021 16:14:27 GMT+0900 (Japan Standard Time): peer ::ffff:127.0.0.1 disconnected.
```

However, although I set context in the call to play_and_detect_speech, it mod_vosk didn't send anything to the server:
```
29c687e6-78ff-46a9-b8b9-afcff4a6c00e 2021-09-25 16:14:25.402136 [DEBUG] switch_ivr.c:632 sofia/external_in/53535353224123@some_domain Command Execute [depth=1] play_and_detect_speech(shout://10.0.0.1:5000/text_to_speech?uuid=29c687e6-78ff-46a9-b8b9-afcff4a6c00e&voice=dtmf&text=0000 detect:vosk {start-input-timers=false,no-input-timeout=6000,recognition-timeout=5000,speech-complete-timeout=5000,speech-incomplete-timeout=5000,speech-language=en-US,profanity-filter=false,reference-uuid=29c687e6-78ff-46a9-b8b9-afcff4a6c00e}inline:<speech-context><phrase>hello</phrase><phrase>world</phrase></speech-context>)
29c687e6-78ff-46a9-b8b9-afcff4a6c00e EXECUTE [depth=1] sofia/external_in/53535353224123@some_domain play_and_detect_speech(shout://10.0.0.1:5000/text_to_speech?uuid=29c687e6-78ff-46a9-b8b9-afcff4a6c00e&voice=dtmf&text=0000 detect:vosk {start-input-timers=false,no-input-timeout=6000,recognition-timeout=5000,speech-complete-timeout=5000,speech-incomplete-timeout=5000,speech-language=en-US,profanity-filter=false,reference-uuid=29c687e6-78ff-46a9-b8b9-afcff4a6c00e}inline:<speech-context><phrase>hello</phrase><phrase>world</phrase></speech-context>)
2021-09-25 16:14:25.442133 [INFO] mod_vosk.c:94 ASR open
29c687e6-78ff-46a9-b8b9-afcff4a6c00e 2021-09-25 16:14:25.442133 [DEBUG] switch_core_media_bug.c:970 Attaching BUG to sofia/external_in/53535353224123@some_domain
2021-09-25 16:14:25.442133 [INFO] mod_shout.c:708 Opening stream: http://10.0.0.1:5000/text_to_speech?uuid=29c687e6-78ff-46a9-b8b9-afcff4a6c00e&voice=dtmf&text=0000
2021-09-25 16:14:25.642136 [DEBUG] mod_shout.c:525 Read Thread Done
29c687e6-78ff-46a9-b8b9-afcff4a6c00e 2021-09-25 16:14:25.642136 [DEBUG] switch_ivr_play_say.c:1486 Codec Activated L16@8000hz 1 channels 20ms
2021-09-25 16:14:25.842140 [DEBUG] mod_vosk.c:140 Sending data 3200
2021-09-25 16:14:26.022212 [DEBUG] mod_vosk.c:140 Sending data 3200
2021-09-25 16:14:26.242130 [DEBUG] mod_vosk.c:140 Sending data 3200
2021-09-25 16:14:26.442140 [DEBUG] mod_vosk.c:140 Sending data 3200
2021-09-25 16:14:26.642145 [DEBUG] mod_vosk.c:140 Sending data 3200
2021-09-25 16:14:26.842137 [DEBUG] mod_vosk.c:140 Sending data 3200
2021-09-25 16:14:27.042138 [DEBUG] mod_vosk.c:140 Sending data 3200
2021-09-25 16:14:27.242138 [DEBUG] mod_vosk.c:140 Sending data 3200
29c687e6-78ff-46a9-b8b9-afcff4a6c00e 2021-09-25 16:14:27.282140 [DEBUG] switch_ivr_play_say.c:1931 done playing file shout://10.0.0.1:5000/text_to_speech?uuid=29c687e6-78ff-46a9-b8b9-afcff4a6c00e&voice=dtmf&text=0000
2021-09-25 16:14:27.282140 [DEBUG] mod_shout.c:160 Waiting for stream to terminate: http://10.0.0.1:5000/text_to_speech?uuid=29c687e6-78ff-46a9-b8b9-afcff4a6c00e&voice=dtmf&text=0000
29c687e6-78ff-46a9-b8b9-afcff4a6c00e 2021-09-25 16:14:27.282140 [INFO] switch_ivr_async.c:4813 (sofia/external_in/53535353224123@some_domain) WAITING FOR RESULT
29c687e6-78ff-46a9-b8b9-afcff4a6c00e 2021-09-25 16:14:27.282140 [DEBUG] switch_ivr.c:195 Codec Activated L16@8000hz 1 channels 20ms
2021-09-25 16:14:27.442128 [DEBUG] mod_vosk.c:140 Sending data 3200
2021-09-25 16:14:27.462125 [DEBUG] mod_vosk.c:164 Recieved 77 bytes:
{"result":[{"conf":1,"end":1.68,"start":1.32,"word":"hello"}],"text":"hello"}
29c687e6-78ff-46a9-b8b9-afcff4a6c00e 2021-09-25 16:14:27.462125 [INFO] switch_ivr_async.c:4714 (sofia/external_in/53535353224123@some_domain) DETECTED SPEECH
2021-09-25 16:14:27.462125 [INFO] mod_vosk.c:105 ASR closed
```

So mod_vosk will need some adjustments to work with other servers aside from vosk_server.

