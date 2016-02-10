##SockJSIO

Wrapper from SockJS library, implements a simple protocol and
reconnect options if connection lost.

server implementation - https://github.com/seryh/sockjs-clojure


##Example

```HTML
<script src="build/SockJSIO.min.js"></script>
````

```JavaScript
var io = new SockJSIO({
    WS_URL: location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+"/ws"
});

var socket = io._sock;

io.on('connection', function(socket){
    console.log('::connection', socket);
    socket.emit('ping', {foo: "bar"});
});

socket.on('pong', function(msg){
    console.log('pong: ', msg);
});

io.on('close', function(e){
    console.log('::close', e);
});

io.on('error', function(e){
    console.log('::error', e);
});
````