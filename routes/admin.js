/**
 * Created by YS on 2016-05-16.
 */
var express = require('express');
var mqtt_server = require('../mqtt/mqtt_server');
var router = express.Router();

/* GET users listing. */
router.post('/mqPush', function(req, res, next) {
    var data = {
        topic: req.body.topic,
        message: {mes:req.body.message}
    };
    console.log(data);

    var mqtt_result = mqtt_server.mqtt_publishing(data.topic, data.message);

    res.send(mqtt_result.msg);
});

module.exports = router;
