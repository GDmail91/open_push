/**
 * Created by YS on 2016-05-17.
 */
var mongoose = require('mongoose');
var async = require('async');
var crypto = require('crypto');
var schema = require('./schema');

var userSchema = mongoose.Schema(schema.user_schema);
userSchema.index({ _id: 1 }, { unique: true });

// User setting
userSchema.statics.setUser = function(data, done) {
    new User({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        level: data.level || "3rd_party",
        exp_date: data.exp_date,
        alias: data.alias
    }).save(function(err, user) {
        if (err) {
            done({ result: false, msg: "Something went wrong while saving the thing" });
            console.log(err);
        }
        else done({ result: true, msg: "User data was successfully saved: user id is ["+user._id+"]", data: { user_id: user._id }});
    });
};

// User list getter
userSchema.statics.getList = function(data, done) {
    if (data.term == undefined) data.term = 5;
    if (data.startId) {
        User.findById(data.startId, function(err, result) {
            // ID 기준으로 내림차순 정렬, 상위 5개
            if(err || result.length == 0) {
                done(false, err);
            } else {
                User.find({'_id': {$lt: result._id}}).sort({_id: -1}).limit(data.term).find(function (err, result) {
                    if (err) done(false, err);
                    else done(true, result);
                });
            }
        });
    } else { // if no have 'startId' searching at the recent database
        // ID 기준으로 내림차순 정렬, 상위 5개
        User.find().sort({_id: -1}).limit(data.term).find(function(err,result){
            if(err) {
                done(false, err);
            }
            else if (result.length == 0) done(false, '데이터가 없습니다.');
            else done(true, result);
        });
    }
};

// User info getter
userSchema.statics.getByAlias = function(data, done) {
    User.findOne({'alias':data.alias}, function(err, result) {
        if (err) {
            done(false, '사용자 검색 에러');
        } else {
            if(result) done(true, result);
            else done(false, '사용자 없음');
        }
    });
};

// User info getter
userSchema.statics.getById = function(data, done) {
    User.findOne({'_id':data.user_id}, function(err, result) {
        if (err) {
            done(false, '사용자 검색 에러');
        } else {
            if(result) done(true, result);
            else done(false, '사용자 없음');
        }
    });
};

// Check auth
userSchema.statics.isAuth = function(access_token, done) {
    User.findOne({access_token: access_token}, function(err, result) {
        if (err) {
            done(false, '사용자 검색 에러');
        } else {
            if(result == null) done(false, '사용자 없음');
            else done(true, result);
        }
    });
};

var User = mongoose.model('User', userSchema);


module.exports = User;
