/**
 * Created by YS on 2016-05-20.
 */
var express = require('express');
var passport = require('passport');
var auth = require('./auth');

// Setting passport
require('./passport').setup();

var router = express.Router();

/* POST login routing */
router.post('/', function(req, res, next) {

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
});

/* GET user info listing. */
router.get('/', function(req, res) {
    auth.isAuthenticated(req.headers.authorization, function(user) {
        // response user id, expire time
        res.json(user);
    });
});


module.exports = router;