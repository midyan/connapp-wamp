var Wampy = require('wampy').Wampy;
var w3cws = require('websocket').w3cwebsocket
var ws = new Wampy('ws://localhost:9000/ws', {ws: w3cws, realm: 'realm1'})
var count = 0

setInterval(function() {
  count++
  ws.publish('com.example.counter', [count])
}, 1000)
