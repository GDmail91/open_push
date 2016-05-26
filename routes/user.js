/**
 * Created by YS on 2016-05-20.
 */
var express = require('express');
var async = require('async');
//var passport = require('passport');

// Setting passport
//require('./passport').setup();

var router = express.Router();

/* POST login routing */
router.post('/login', function(req, res, next) {
    var data = {
        'email': req.body.email,
        'password': req.body.password
    };

    if (data.email == 'test@test.com' && data.password == '1234') {
        res.json({
            access_token: 'test',
            refresh_token: 'test_ref',
            exp_date: '20160701'
        });
    } else {
        res.statusCode = 401;
        res.send("Not matched");
    }
});

// TODO remove
/* POST temp auth */
router.post('/auth', function(req, res, next) {
    if (req.body.level != '3rd_party' && req.body.level != 'admin') {
        res.statusCode = 401;
        return res.send("validation error");
    }
    var data = {
        'access_token': req.body.access_token,
        'refresh_token': req.body.refresh_token,
        'exp_date': req.body.exp_date,
        'level': req.body.level,
        'alias': req.body.alias
    };

    async.waterfall([
        function(callback) {
            var user_model = require('../models/user_model');
            user_model.setUser(data, function(result, data) {
                if (result) callback({status: 400, msg: '사용자 정보저장 실패'});
                else {
                    data.sender = data.alias;
                    callback(null);
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

/* POST when redirected by oauth server */
router.get('/auth', function(req, res, next) {
    var data = {
        access_token: 'test',
        refresh_token: 'test_ref',
        exp_date: '20160701',
        alias: 'tester001'
    };

    var user_model = require('../models/user_model');
    user_model.setUser(data, function(done) {
        if(done.result) {
            res.json(done);
        } else {
            res.json(done);
        }
    });
});

/* GET user info */
router.get('/:user_id/id', function(req, res, next) {
    var data = {
        access_token: req.headers.access_token,
        user_id: req.params.user_id
    };

    if (data.access_token != 'test') {
        res.statusCode = 400;
        return res.json({ result: false, msg: 'access_token 인증 실패' })
    }
    var user_model = require('../models/user_model.js');
    user_model.getById(data, function(result, data) {
        if(result) {
            res.json(data);
        } else {
            res.json(data);
        }
    });
});

/* GET user info */
router.get('/:alias/alias', function(req, res, next) {
    var data = {
        access_token: req.headers.access_token,
        alias: req.params.alias
    };

    if (data.access_token != 'test') {
        res.statusCode = 400;
        return res.json({ result: false, msg: 'access_token 인증 실패' })
    }
    var user_model = require('../models/user_model.js');
    user_model.getByAlias(data, function(result, data) {
        if(result) {
            res.json(data);
        } else {
            res.json(data);
        }
    });
});

/* GET List of users */
router.get('/list', function(req, res, next) {
    var data = {
        access_token: req.headers.access_token
    };

    if (data.access_token != 'test') {
        res.statusCode = 400;
        return res.json({ result: false, msg: 'access_token 인증 실패' })
    }
    var user_model = require('../models/user_model.js');
    user_model.getList(data, function(result, data) {
        if(result) {
            res.json(data);
        } else {
            res.json(data);
        }
    });
});

/*router.post('/login', function(req, res, next) {

    // Try authenticate by passport module
    passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        if (error) return res.json(401, error);
        if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});

        // get user token (make access token)
        var token = auth.signToken(user.id);

        // response access_token
        res.json({access_token: token});
    })(req, res, next);
});*/


module.exports = router;