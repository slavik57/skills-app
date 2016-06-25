"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var statusCode_1 = require("../../../../common/statusCode");
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var UserService = (function () {
    function UserService(http) {
        this.http = http;
        this._loginUrl = '/api/login';
    }
    UserService.prototype.signinUser = function (username, password) {
        var _this = this;
        var body = JSON.stringify({
            username: username,
            password: password
        });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(this._loginUrl, body, options)
            .map(function (response) { return _this._getRedirectionLocation(response); })
            .catch(function (error) { return _this._fail(error); });
        ;
    };
    UserService.prototype._getRedirectionLocation = function (response) {
        if (response.status === statusCode_1.StatusCode.OK) {
            var redirectPath = response.headers.get('redirect-path');
            if (!redirectPath) {
                throw 'Unexpected result';
            }
            return redirectPath;
        }
        ;
        throw 'Invalid result';
    };
    UserService.prototype._fail = function (error) {
        console.log(error);
        if (error.status === statusCode_1.StatusCode.UNAUTHORIZED) {
            return Observable_1.Observable.throw('Invalid credentials');
        }
        else {
            return Observable_1.Observable.throw('Oops. Something went wrong. Please try again.');
        }
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map