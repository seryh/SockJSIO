/**
 * SockJSIO v1.0
 * wrapper from SockJS lib,
 * implements a simple protocol
 * protocol: ["EventName", data]
 *
 * dependencies:
 *      EventEmitter v4.2.11 - git.io/ee
 *      SockJS v0.3.4- https://github.com/sockjs/sockjs-client
 *
 * (c) Seryh Oleg
 * https://github.com/seryh
 */

(function (EventEmitter, SockJS) {

    var _extend = function(obj1, obj2) {
        for(var i in obj2) obj1[i] = obj2[i];
        return obj1;
    };

    var SockJSIO = function (opt) {
        var eeIO = new EventEmitter(),
            eeSock = new EventEmitter(),
            _self = this;

        _self.requestQueue = [];
        _self.UUIDhistory = [];
        _self.options = _extend({
            WS_URL: location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+"/ws"
        }, opt);

        SockJS.prototype.on = function(event, fn) {
            return eeSock.addListener(event, fn);
        };

        SockJS.prototype.emit = function(event, data) {
            return _self._sock.send(JSON.stringify([event, data]));
        };

        _self._sock = new SockJS(_self.options.WS_URL);

        _self.on = function(event, fn) {
            return eeIO.addListener(event, fn);
        };

        _self._sock.onmessage = function(e) {
            var data;
            try {
                data = JSON.parse(e.data);
                if( data
                    && Object.prototype.toString.call( data ) === '[object Array]'
                    && data.length === 2 ) {

                    eeSock.emitEvent(data[0], [data[1]]);
                } else {
                    throw new _self.SockError('e.data is invalid');
                }

            } catch (er) {
                eeIO.emitEvent('error', [er]);
            }

        };

        _self._sock.onopen = function() {
            eeIO.emitEvent('connection', [_self._sock]);
        };

        _self._sock.onclose = function(e) {
            eeIO.emitEvent('close', [e, _self._sock]);
        };
    };

    var previous_SockJSIO;

    var root = typeof self === 'object' && self.self === self && self ||
        typeof global === 'object' && global.global === global && global ||
        this;

    if (root != null) {
        previous_SockJSIO = root.SockJSIO;
    }

    SockJSIO.noConflict = function () {
        root.SockJSIO = previous_SockJSIO;
        return SockJSIO;
    };

    SockJSIO.prototype.SockError = function(message, code, name) {
        this.name = name || 'SockJSIO error';
        this.message = message || 'unknown error';
        this.code = code || null;
        this.stack = (new Error()).stack;
    };

    SockJSIO.prototype.SockError.prototype = new Error;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SockJSIO;
    } else
    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return SockJSIO;
        });
    }
    // included directly via <script> tag
    else {
        root.SockJSIO = SockJSIO;
    }

}(EventEmitter, SockJS));