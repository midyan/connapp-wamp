var Wampy = require('wampy').Wampy;
var w3cws = require('websocket').w3cwebsocket
var ws = new Wampy('ws://localhost:8080/ws', {ws: w3cws, realm: 'realm1'})
var count = 0

ws.subscribe('com.example.counter', (test) => console.log(test))
