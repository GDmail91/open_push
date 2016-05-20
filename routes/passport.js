/**
 * Created by YS on 2016-05-20.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function () {
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            // TODO Check auth info (ex. email & password
            if (email === 'test@test.com' && password === 'test') {
                // if login success then throw user id
                var user = {id: 'user_1'};
                return done(null, user);
            } else {
                // if not show fail message
                return done(null, false, { message: 'Fail to login.' });
            }
        }
    ));
};