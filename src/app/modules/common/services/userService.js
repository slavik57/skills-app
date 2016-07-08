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
        this._registerUrl = '/api/register';
        this._userControllerUrl = '/api/user/';
        this._userExistsUrlSuffix = '/exists';
    }
    UserService.prototype.signinUser = function (username, password) {
        var _this = this;
        var body = JSON.stringify({
            username: username,
            password: password
        });
        return this._post(this._loginUrl, body)
            .map(function (response) { return _this._getRedirectionLocation(response); })
            .catch(function (error) { return _this._failSignin(error); });
    };
    UserService.prototype.isUsernameExists = function (username) {
        var _this = this;
        var url = this._userControllerUrl + username + this._userExistsUrlSuffix;
        return this._get(url)
            .map(function (response) { return _this._extractIsUserExists(response); })
            .catch(function (error) { return _this._failUsernameExistanceCheck(error); });
    };
    UserService.prototype.registerUser = function (username, password, email, firstName, lastName) {
        var _this = this;
        var body = JSON.stringify({
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName
        });
        console.log(body);
        return this._post(this._registerUrl, body)
            .map(function (response) { return _this._getRedirectionLocation(response); })
            .catch(function (error) { return _this._failRegister(error); });
    };
    UserService.prototype.getUserDetails = function () {
        var _this = this;
        return this._get(this._userControllerUrl)
            .map(function (response) { return _this._extractUserDetails(response); })
            .catch(function (error) { return _this._failGettingUserDetails(error); });
    };
    UserService.prototype._get = function (url) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(url, options);
    };
    UserService.prototype._post = function (url, body) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(url, body, options);
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
    UserService.prototype._failRegister = function (error) {
        console.log(error);
        if (typeof error === 'string') {
            return Observable_1.Observable.throw('Oops. Something went wrong. Please try again.');
        }
        var result = error.json();
        if (!!result && !!result.error) {
            return Observable_1.Observable.throw(result.error);
        }
        return Observable_1.Observable.throw('Oops. Something went wrong. Please try again.');
    };
    UserService.prototype._failSignin = function (error) {
        console.log(error);
        if (error.status === statusCode_1.StatusCode.UNAUTHORIZED) {
            return Observable_1.Observable.throw('Invalid credentials');
        }
        else {
            return Observable_1.Observable.throw('Oops. Something went wrong. Please try again.');
        }
    };
    UserService.prototype._extractIsUserExists = function (response) {
        if (response.status === statusCode_1.StatusCode.OK) {
            var result = response.json();
            if (!result || !('userExists' in result)) {
                throw 'Unexpected result';
            }
            return result.userExists;
        }
        ;
        throw 'Invalid result';
    };
    UserService.prototype._extractUserDetails = function (response) {
        if (response.status === statusCode_1.StatusCode.OK) {
            var result = response.json();
            if (!result || !this._isResponseHasAllUserDetails(result)) {
                throw 'Unexpected result';
            }
            return result;
        }
        throw 'Invalid result';
    };
    UserService.prototype._failUsernameExistanceCheck = function (error) {
        console.log(error);
        return Observable_1.Observable.throw('Oops. Something went wrong. Please try again.');
    };
    UserService.prototype._failGettingUserDetails = function (error) {
        if (error.status === statusCode_1.StatusCode.UNAUTHORIZED) {
            return Observable_1.Observable.throw('Unauthorized getting user details.');
        }
        else {
            return Observable_1.Observable.throw('Oops. Something went wrong. Please try again.');
        }
    };
    UserService.prototype._isResponseHasAllUserDetails = function (response) {
        return ('id' in response) &&
            ('username' in response) &&
            ('email' in response) &&
            ('firstName' in response) &&
            ('lastName' in response);
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map