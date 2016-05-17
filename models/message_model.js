/**
 * Created by YS on 2016-05-17.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var autoIncrement = require('mongoose-auto-increment');
var schema = require('./schema');

autoIncrement.initialize(mongoose.connection);

var messageSchema = mongoose.Schema(schema.message_schema);

// set _id as number
messageSchema.plugin(autoIncrement.plugin, 'Message');

// get message by id
messageSchema.statics.getById = function(data, callback) {
    Message.findById(data.user_id, function(err, result) {
        var User = require('./user_model');
        User.getById({user_id: result.user_id}, function(user_result, data) {
            if (user_result) {
                result.user_id = data.user_id;
                callback(true, result);
            } else {
                // TODO duplicated
                // ID로 검색이안됬을 경우 이름으로 검색( 추후 삭제)
                User.getByName({user_email: result.user_email}, function(user_result, data) {
                    if(user_result) {
                        result.user_email = data.user_email;
                        callback(true, result);
                    } else return callback(false, data);
                });
            }
        });
    });
};

// posting message
messageSchema.statics.postMessage = function(data, callback) {
    new Message({
        topic: data.topic,
        message: data.message,
        user_id: data.user_id,
        type: data.type,
        qos: data.qos
    }).save(function(err, message) {
        if (err) callback(false, err);
        else callback(true, message.id);
    });
};

var Message = mongoose.model('Message', messageSchema);
module.exports = Message;
