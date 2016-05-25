/**
 * Created by YS on 2016-05-17.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var schema = require('./schema');

var messageSchema = mongoose.Schema(schema.message_schema);
// get message by id
messageSchema.statics.getList = function(data, done) {
    if (data.term == undefined) data.term = 5;
    if (data.message_id) {
        Message.findById(data.message_id, function(err, result) {
            // ID 기준으로 내림차순 정렬, 상위 5개
            if(err || result.length == 0) {
                done(false, err);
            } else {
                Message.find({'_id': {$lt: result._id}}).sort({_id: -1}).limit(data.term).find(function (err, result) {
                    if (err) done(false, err);
                    else done(true, result);
                });
            }
        });
    } else { // if no have 'startId' searching at the recent database
        // ID 기준으로 내림차순 정렬, 상위 5개
        Message.find().sort({_id: -1}).limit(data.term).find(function(err,result){
            if(err) {
                done(false, err);
            }
            else if (result.length == 0) done(true, '데이터가 없습니다.');
            else done(true, result);
        });
    }
};

// posting message
messageSchema.statics.postMessage = function(data, callback) {
    new Message({
        topic: data.topic,
        message: data.message,
        sender: data.sender
    }).save(function(err, message) {
        if (err) callback(false, err);
        else callback(true, message.id);
    });
};

var Message = mongoose.model('Message', messageSchema);
module.exports = Message;
