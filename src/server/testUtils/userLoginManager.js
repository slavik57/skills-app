"use strict";
var UserLoginManager = (function () {
    function UserLoginManager() {
    }
    UserLoginManager.loginUser = function (server) {
        return new Promise(function (resolveCallback) {
            server.post('/login')
                .send({ username: 'some user', password: 'some password' })
                .end(function () { return resolveCallback(); });
        });
    };
    UserLoginManager.logoutUser = function (server) {
        return new Promise(function (resolveCallback) {
            server.get('/logout')
                .end(function () { return resolveCallback(); });
        });
    };
    return UserLoginManager;
}());
exports.UserLoginManager = UserLoginManager;
//# sourceMappingURL=userLoginManager.js.map