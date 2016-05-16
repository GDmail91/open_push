/**
 * Created by YS on 2016-05-11.
 */
var mosca = require('mosca');

module.exports = function broker_launch() {
    // set open port number
    var settings = {
        port: 1883
    };

    // start mosca
    var server = new mosca.Server(settings);

    // fired when the mqtt server is ready
    server.on('ready', function() {
        // setup authorizer
        server.authenticate = function(client, username, password, callback) {
            console.log('[Auth] : ', username, ", ", password.toString('utf8'));
            // TODO Authentication
            // TODO if don't need authorize username then set client.user by client id
            var authorized = ((username === 'alice' || username === 'bob' || username === 'client-1') && password.toString('utf8') === 'secret');
            if (authorized) {
                client.user = username;
                callback(null, true);
            } else {
                client.user = client.id;
                callback(null, true);
            }
        };

        server.authorizePublish = function(client, topic, payload, callback) {
            console.log('[Auth Pub] : ', client.user);
            // TODO Connecting Auth user DB
            var authorized = (client.user === 'alice');
            if (authorized) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        };
        console.log('Mosca server is up and running at port('+settings.port+')')
    });

    // fired when a client is connected
    server.on('clientConnected', function (client) {
        console.log('[Connected] Client id : ', client.id);
    });

    // fired when a message is received
    server.on('published', function (packet, client) {
        // Generate regular expression for switch topic
        var regexp = /[A-Za-z]+\/[A-Za-z]+$/;
        var topic = packet.topic.match(regexp);
        switch (topic[0]) {
            case 'new/clients':
                console.log('[Published] Info Client Add Subscribed : ', packet.payload);
                break;
            case 'new/subscribes':
                console.log('[Published] New Topic : ', JSON.parse(packet.payload).topic);
                break;
            case 'garage/connected':
                console.log('[Published] Info Connected : ', packet.payload.toString('utf8'));
                break;
            case 'garage/state':
                console.log('[Published] Info Garage State : ', packet.payload.toString('utf8'));
                break;
        }
    });

    // fired when a client subscribes to a topic
    server.on('subscribed', function (topic, client) {
        console.log('[Subscribed] Topic : ', topic);
    });

    // fired when a client subscribes to a topic
    server.on('unsubscribed', function (topic, client) {
        console.log('[Unsubscribed] Topic: ', topic);
    });

    // fired when a client is disconnecting
    server.on('clientDisconnecting', function (client) {
        console.log('[Disconnecting] Client id: ', client.id);
    });

    // fired when a client is disconnected
    server.on('clientDisconnected', function (client) {
        console.log('[Disconnected] Client id : ', client.id);
    });
}