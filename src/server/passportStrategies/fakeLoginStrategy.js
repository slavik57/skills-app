"use strict";
var passport = require('passport');
var passport_local_1 = require('passport-local');
var FakeLoginStrategy = (function () {
    function FakeLoginStrategy() {
    }
    FakeLoginStrategy.initialize = function (app) {
        app.post('/login', passport.authenticate(FakeLoginStrategy.NAME, {
            successRedirect: '/'
        }));
        var options = {
            passReqToCallback: true
        };
        passport.use(FakeLoginStrategy.NAME, new passport_local_1.Strategy(options, this._loginUser));
    };
    FakeLoginStrategy._loginUser = function (req, username, password, done) {
        done(null, {
            username: "some username",
        });
    };
    FakeLoginStrategy.NAME = 'fakeLogin';
    return FakeLoginStrategy;
}());
exports.FakeLoginStrategy = FakeLoginStrategy;
//# sourceMappingURL=fakeLoginStrategy.js.map