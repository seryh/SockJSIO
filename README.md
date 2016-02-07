##SockJSIO

wrapper from SockJS lib, implements a simple protocol


##Example

```HTML
<script src="vendor/sockjs-0.3.4.js"></script>
<script src="vendor/EventEmitter.js"></script>
<script src="sockjs-io.js"></script>
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