/**
 * Created by YS on 2016-05-26.
 */
var express = require('express');
var async = require('async');

var router = express.Router();

/* GET message list */
router.get('/', function(req, res, next) {
    var data = {
        access_token: req.headers.access_token,
        //message_id: req.params.message_id
    };

    async.waterfall([
        function(callback) {
            if (data.access_token != 'test') callback({status: 400, msg: 'access_token 인증 실패'});
            else {
                data.sender = 'test';
                callback(null);
            }
        },
        function(callback) {
            var message_model = require('../models/message_model.js');
            message_model.getList(data, function(result, msg) {
                if(result) {
                    callback(null, msg)
                } else {
                    callback({ status: 400, msg: msg });
                }
            });
        }], function(err, result) {
        if (err) {
            res.statusCode = err.status;
            return res.json({ result: false, msg: err.msg })
        }
        res.json({ result: true, msg: result });
    });
});

/* POST push message into broker */
router.post('/', function(req, res, next) {
    var data = {
        access_token: req.headers.access_token,
        topic: req.body.topic,
        message: JSON.stringify(req.body.message)
    };

    async.waterfall([
        function(callback) {
            var user_model = require('../models/user_model');
            user_model.isAuth(data.access_token, function(result, msg) {
                if (result) {
                    data.sender = msg.alias;
                    callback(null);
                } else callback({status: 400, msg: 'access_token 인증 실패'});
            });
        },
        function(callback) {
            var message_model = require('../models/message_model.js');
            message_model.postMessage(data, function(result, msg) {
                if(result) {
                    callback(null);
                } else {
                    callback({ status: 400, msg: msg });
                }
            });
        },
        function(callback) {
            var mqttServer = require('../mqtt/mqtt_server');
            mqttServer.mqtt_create(data.access_token, data.sender);
            var result = mqttServer.mqtt_publishing(data.topic, JSON.parse(data.message));
            if (result.result) {
                callback(null, result.msg);
            } else {
                callback({ status: 400, msg: result.msg });
            }
        }], function(err, result) {
            if (err) {
                res.statusCode = err.status;
                return res.json({ result: false, msg: err.msg })
            }
            res.json({ result: true, msg: result });
        });
});

module.exports = router;