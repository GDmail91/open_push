/**
 * Created by YS on 2016-05-11.
 */
var mqtt = require('mqtt')
    , host = 'localhost'
    , port = 1883;

var settings = {
    keepalive: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clientId: 'alice',
    username: 'alice',
    password: "secret"
};

// client connection
var client;

// Publishing server
// mqtt server activating
var mqtt_server = {
    mqtt_create : function (access_token, username) {
        var settings = {
            keepalive: 1000,
            protocolId: 'MQIsdp',
            protocolVersion: 3,
            access_token: access_token,
            username: username,
            password: access_token
        };
        client = mqtt.createClient(port, host, settings);
    },

    mqtt_publishing : function(topic, message) {
        var result;
        if (typeof message == 'object') {
            console.log("publish");
            client.publish(topic, JSON.stringify(message));
            result = { result: true, msg: "푸시 전송 완료" }
        } else {
            result = { result: false, msg: "메세지 타입이 객체가 아닙니다." }
        }

        return result;
    }
};


module.exports = mqtt_server;
//module.exports = mqtt_server.mqtt_publishing;